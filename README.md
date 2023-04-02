# Reklameskjerm

Skjerm som ruller og går med plakater for kommende arrangementer. Annenhver slide er en oversikt.

## Hvorfor lage enda en reklameskjerm-løsning?

Alle løsningene jeg fant hadde som regel en knotete backend å forholde seg til. Mye raskere å bare gi filene et visst navn og legge dem i en mappe.

## Installere

Kopier filene til serveren din. Hvis du har gh installert på serveren din kan du gjøre det ved å kjøre denne kommandoen:

    gh repo clone Ornendil/reklameskjerm

## Hvordan?

1. Lag plakater. Disse kan være bilder (png, jpg, web), videoer (mp4, uten lyd) eller websider (html).

2. Gi plakatene et filnavn:

    * Hvis filnavnet starter med en dato (i formatet ÅÅÅÅ-MM-DD) så vil plakaten avpubliseres på den datoen.
    * Hvis du også legger til "-start" fulgt av en tilsvarende dato (f.eks. "start2023-01-23"), så vil plakaten publiseres på den datoen.
    * Du kan også legge til "-len" fulgt av en integer for å endre hvor mange sekunder den plakaten skal være på skjermen (f.eks. "-len50"). Standard er 20. F.eks. ved videoer bør denne som regel settes til samme lengde som videoen.

    F.eks.:

        2023-10-23-start2023-10-01-len30 - Et eller annet.webp

3. Legg plakatene i img-mappa.