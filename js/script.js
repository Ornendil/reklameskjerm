const src = "./",
    now = new Date(Date.now())
    ettSekund = 1000;

let slides = {},
    sortedSlides = [],
    standardLength = 20, // Standard tid per slide i sekunder
    changeSpeed = 3000, // Standard tid mellom slides i millisekunder
    activeSlide = 0,
    nextSlide,
    timeoutLoop,
    firstLoop = true,
    paused = false;

lastData();

setInterval(lastData, ettSekund * 60);


document.body.addEventListener('click', toggleFullScreen);
document.body.addEventListener('touchend', toggleFullScreen);
document.body.addEventListener('dblclick', pause);

function toggleFullScreen() {
    if (!document.fullscreenElement) {
        document.body.requestFullscreen();
    }
}

function pause(event) {
    if (paused == false) {
        clearTimeout(timeoutLoop);
        document.getElementById('pause').style.display = 'block';
        paused = true;
    } else {
        changeSlide(activeSlide);
        document.getElementById('pause').style.display = 'none';
        paused = false;
    }
}


// Last dataene fra fil-lista
function lastData() {
    var xhr = new XMLHttpRequest();
    xhr.open("GET", src + "list");
    xhr.onload = function () {
        if (xhr.status === 200) {
            var data = JSON.parse(xhr.responseText);
            updateSlides(data);
            sortSlides();
            if (firstLoop){
                // Begynn å loope gjennom slidene
                changeSlide(0);
                firstLoop = false;
            }
        }
    };
    xhr.onerror = function () {
        // handle error
    };
    xhr.send();
}

function updateSlides(data){
    addSlides(data);
    removeSlides(data);
    // console.log(slides);
}

// Gå gjennom en array over filnavn og se om de skal legges til i slides-objektet
function addSlides(data){
    for (var i = 0; i < data.length; i++) {
        const filename = data[i];
        if (!slides[filename]) { // Hvis det ikke finnes en slide med dette filnavnet fra før
            let newSlide = berikSlide(filename); // Lag en midlertidig versjon av sliden
            if (newSlide.end > now && newSlide.start < now){ // Hvis sliden skal slutte senere enn nå og starte tidligere enn nå
                slides[filename] = newSlide; // Legg til sliden i slides
            }
        }
    }
}

function removeSlides(data){
    for (i in slides){ // Gå gjennom alle slidene
        if (!data.includes(i) || slides[i].end < now || slides[i].start > now){ // Hvis filnavnet til sliden ikke finnes i arrayen vi tester, eller sliden allerede skulle ha sluttet, eller sliden ikke skal starte enda
            delete slides[i]; // Slett sliden
        }
    }
}


// Berik sliden med nødvendige data
function berikSlide(filename){
    let newSlide = {
        'filename': filename,
        'url': src + filename,
        'end': testAndFormatEndDate(filename),
        'start': testAndFormatStartDate(filename),
        'length': setLengthOfSlide(filename),
        'MIME': testMIME(filename)
    }
    
    newSlide.DOM = genererDOM(newSlide);

    return newSlide;
}

// Sjekk om det finnes en slutt-dato og om den er i et brukbart format. Hvis ikke, sett slutt-datoen 100 år inn i fremtiden (dvs. aldri la sliden slutte å vises)
function testAndFormatEndDate(filename){
    let date = Date.parse(filename.slice(0,10));
    if(isNaN(date)){
        // Om hundrede aar er alting glemt
        date = Date.now() + 1000 * 60 * 60 * 24 * 365 * 100;
    } else {
        date = date;
    }
    date = new Date(date);

    return date;
}

// Sjekk om det finnes en start-dato og om den er i et brukbart format. Hvis ikke, sett start-datoen 100 år tilbake i fortiden (dvs la sliden kunne vises med en gang)
function testAndFormatStartDate(filename){
    let startRegex = /[ \-]start(\d{4}-\d{2}-\d{2})[ \-]/;
    let date = filename.match(startRegex);
    if(date){
        date = date[1];
    } else {
        date = '2010-01-01';
    }
    date = Date.parse(date);
    if(isNaN(date)){
        // For hundrede aar siden var alting glemt
        date = Date.now() - 1000 * 60 * 60 * 24 * 365 * 100;
    } else {
        date = date;
    }
    date = new Date(date);

    return date;
}

// Sjekk om det finnes en lengde. Sett den til standard hvis ikke
function setLengthOfSlide(filename){
    // Lengde
    let lengthRegex = /-len(\d+)-/;
    let length = standardLength;
    if(filename.match(lengthRegex) != null){
        length = parseInt(filename.match(lengthRegex)[1], 10);
    }
    return length;
}

// Finn hvilken MIME type sliden er
function testMIME(filename){
    var fileExt = filename.split('.').slice(-1)[0];
    switch ( fileExt ) {
        case 'png':
            mime = 'image/png';
            break;
        case 'PNG':
            mime = 'image/png';
            break;
        case 'jpg':
            mime = 'image/jpeg';
            break;
        case 'webp':
            mime = 'image/webp';
            break;
        case 'mp4':
            mime = 'video/mp4';
            break;
        case 'html':
            mime = 'text/html';
            break;
        default:
            mime = '';
            console.log(fileExt);
    }
    return mime;
}

// Lag en DOM til sliden
function genererDOM(slide){
    "use strict";

    let DOM = document.createElement('div');
    DOM.className = 'slide';
    switch(slide.MIME) {
        case "text/html":
            DOM.innerHTML = '<iframe src="'+src+'img/'+slide.filename+'"></iframe><div class="transparentCover"></div>';
            break;
        case "video/mp4":
            DOM.innerHTML = '<video width="1920" height="1080" muted preload><source src="img/'+slide.filename+'" type="video/mp4"></video>';
            break;
        default:
            DOM.innerHTML = '<div style="background-image: url(\''+src+'img/'+slide.filename+'\')"></div>';
    }
    return DOM;
}

function sortSlides(){
    let tempSortArray = [];
    for(let slide in slides){
        if (slide != 'hvaskjer.html'){
            tempSortArray.push(slides[slide]);
        }
    }
    tempSortArray.sort((a,b) => a.end - b.end)
    for (let i = tempSortArray.length - 1; i >= 0; i--) {
        tempSortArray.splice(i + 1, 0, slides['hvaskjer.html']);
    }
    sortedSlides = tempSortArray;
}

// Gå til en ny slide
function changeSlide(i){
    "use strict";

    activeSlide = i;

    // Finn ut hva som er den neste sliden (altså ned neste etter den vi bytter til nå)
    if (sortedSlides[i+1]) {
        nextSlide = i+1;
    } else {
        nextSlide = 0;
    }

    let slidesDiv = document.querySelector('#slides'),
        prevSlideDiv,
        currentSlideDiv,
        nextSlideDiv;

    if(firstLoop){

        prevSlideDiv = document.createElement('div');
        slidesDiv.appendChild(prevSlideDiv);
        prevSlideDiv.className = 'slide';
        prevSlideDiv.id = 'prevSlide';

    } else {

        prevSlideDiv = slidesDiv.querySelector('#prevSlide');
        currentSlideDiv = slidesDiv.querySelector('#currentSlide');
        nextSlideDiv = slidesDiv.querySelector('#nextSlide');
        
        slidesDiv.removeChild(prevSlideDiv);

        prevSlideDiv = currentSlideDiv;
        prevSlideDiv.id = 'prevSlide';
    }

    // Legg til nåværende slide, eller gjør neste slide til nåværende 
    if(firstLoop){
        currentSlideDiv = sortedSlides[i].DOM.cloneNode(true);
        slidesDiv.appendChild(currentSlideDiv);
    } else {
        currentSlideDiv = nextSlideDiv;
    }

    currentSlideDiv.id = 'currentSlide';
    playVideo(currentSlideDiv);

    // Legg til neste slide
    nextSlideDiv = sortedSlides[nextSlide].DOM.cloneNode(true);
    slidesDiv.appendChild(nextSlideDiv);
    nextSlideDiv.id = 'nextSlide';

    // Gjør klar for neste slide
    timeoutLoop = setTimeout(function(){
        changeSlide(nextSlide);
    },standardLength * ettSekund);
}

function playVideo(slide){
    // Start filmen fra starten hvis det er en video
    if (slide.mime == 'video/mp4') {
        let vid = slide.querySelector('video');
        vid.currentTime = 0;
        vid.play();
    }

}