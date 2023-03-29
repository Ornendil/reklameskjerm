# Reklameskjerm

Skjerm som ruller og går med plakater for kommende arrangementer. Annenhver slide er en oversikt.

## Hvorfor?

Alle løsningene jeg fant hadde som regel en knotete backend å forholde seg til. Mye raskere å bare gi filene et visst navn og legge dem i en mappe.

## Hvordan?

Legg plakatene i img-mappa.

* Hvis filnavnet starter med en dato (i formatet ÅÅÅÅ-MM-DD) så vil plakaten avpubliseres på den datoen.
* Hvis du også legger til "-start" fulgt av en tilsvarende dato (f.eks. "start2023-01-23"), så vil plakaten publiseres på den datoen.
* Du kan også legge til "-len" fulgt av en integer for å endre hvor mange sekunder den plakaten skal være på skjermen (f.eks. "-len50"). Standard er 20. F.eks. ved videoer bør denne som regel settes til samme lengde som videoen.

Plakater kan være bilder, videoer (uten lyd) eller websider.