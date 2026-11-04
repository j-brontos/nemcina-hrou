# Kam to patří? — implementace a ověření

Změny navazují na main `33e73161e5739b44859ad7698530131fb021ffc1`.
Žádný deployment ani merge nebyl spuštěn.

## Změny

- Kvíz po chybě označí pouze vybraný obrázek červeně, přehraje jeho německý název, po 300 ms opravnou hlášku a umožní opakování. Správný obrázek zůstává beze změny. Panel zachovává aktuální zadání.
- Sdílená hlasová odezva blokuje vstupy i opakování zadání během vyhodnocování. Ukončení hry ruší zvuk a čekající zvukový časovač. Pexeso navíc kontroluje identitu rozehrané hry před skrytím dvojice.
- Šestý režim „Kam to patří?“ používá stávající vzhled, skóre, obrázkový renderer, nastavení a MP3 přehrávač. Pět předmětů poskytuje čtyři náhodně rozmístěné možnosti v každém kole; deset úloh se vybírá z 25 kombinací bez opakování identické kombinace.
- Pět polí je stále ve stejném prostorovém kříži. Poloha správné odpovědi není zvýrazněna. Správně zůstane až skutečně umístěný obrázek.
- Pointer Events s pointer capture podporují myš i dotyk jedním prstem. Náhled nepřekáží hit testu. Puštění mimo pole nepřičítá body a zruší výběr. Klepnutí na obrázek a pak na pole je dostupné současně.
- Obě obtížnosti mají gramatické rozkazovací věty; druhá používá akuzativ s přídavnými jmény. Vlastní SVG zobrazuje červené jablko, černý klobouk, barevného motýla, hnědou houbu a žlutý míč nezávisle na systémových emoji.
- Po správné odezvě následuje stávající tlačítko Dál; na konci gratulace, 10 hvězd, znovu nebo návrat k hrám. Chyby body neodečítají.
- Generátor MP3 je vyčleněn z původního deployment workflow do `scripts/build_audio.py`. Zachovává hlasy de-DE-KatjaNeural / cs-CZ-VlastaNeural. Nepoužívá speechSynthesis ani robotický lokální fallback.
- PR workflow testuje UI a zvlášť generuje a ověřuje MP3, přehrává tři ukázky v prohlížeči a ukládá sadu jako artifact. Nic nepublikuje.

## Spuštění lokálně

```sh
npm ci
npx playwright install --with-deps chromium
npm test
npm run test:browser
python3 -m pip install edge-tts==7.3.1
python3 scripts/build_audio.py
python3 scripts/build_audio.py --check
node tests/audio-browser.cjs
```

Systémový Chromium lze vybrat přes `CHROMIUM_PATH=/usr/bin/chromium`.
MP3 jsou stejně jako dříve generované buildem a nejsou verzované; lokální náhled bez generování nemá zvuk.
`--list` vypíše celý manifest a `--check` vypíše chybějící/neplatné MP3 a skončí nenulovým kódem.
Síťová služba pro generování je externí závislost. Neúspěšná generace zastaví publikaci.
Za běhu 404/odmítnuté přehrání nebo časový limit zobrazí oznámení a odblokuje odpovědi. Návrat domů je možný i během přehrávání.

## Skutečně provedené kontroly

- `npm test`: syntaxe a původní statické UX kontroly; navíc všech 50 německých kombinací pro obě obtížnosti, pět názvů předmětů a česká instrukce v manifestu.
- **72 prohlížečových kontrol**: Playwright 1.56.1 se systémovým Chromiem, šířky 320, 375 a 768 px, dotykový mobilní kontext. Zvuk v interakčních testech je simulovaný; samostatný test MP3 používá skutečné přehrávání.
- `python3 scripts/build_audio.py`: vygenerováno 214 MP3; `--check`: **0 chybějících/neplatných**. Všech 214 souborů dekódováno pomocí `ffprobe`, kladná délka.
- `tests/audio-browser.cjs`: tři skutečné MP3 přehrány do konce (jednoduchý pokyn, rozšířený pokyn, česká instrukce). Nejde o lidské hodnocení výslovnosti.
- `python3 -m py_compile scripts/build_audio.py`, `git diff --check`.

## Akceptační testy

| # | Výsledek a rozsah |
|---|---|
| 1–2 | Ověřeno v Chromiu: chyba v kvízu neobarví správný obrázek, odblokuje se a otázku lze dokončit. |
| 3–4 | Ověřeno přes UI: šestá hra, právě čtyři obrázky a pět polí. |
| 5 | Ověřeno dotykovým vstupem přes CDP v Chromiu; náhled, zvýraznění pole a umístění. Skutečný prst na iOS neověřen. |
| 6 | Ověřeno přes Playwright `tap()` na obrázek a pole. |
| 7–10 | Ověřeny obě chybné kombinace, opakování i správná kombinace. Při chybě žádné zelené pole. |
| 11 | Ověřeno rychlé opakované vyhodnocení během odezvy, skóre se nezdvojí. |
| 12 | Ověřena identita opakovaného MP3, dvojí přehrání a rychlost 0,78. Tři reálné soubory navíc přehrány samostatně. |
| 13 | Ověřeny pokyny obou obtížností a úplný manifest jejich kombinací. Druhá obtížnost ověřena i se ztlumeným zvukem a opakováním chyby. |
| 14 | Dokončeno 10 úloh, výsledek 10/10. |
| 15 | Základní regrese všech pěti režimů: kvíz po chybě, prohlížení, dvojice v pexesu, správná odpověď ve scéně a v původních pozicích. Nejde o vyčerpávající průchod všemi slovíčky. |
| 16 | Ověřeny rozměry a šířka polí v mobilních kontextech Chromia. **Skutečné iPhone/iPad a Safari neověřeny**, stejně tak kompletní vizuální audit všech obrazovek na těchto zařízeních. |

Dále ověřeno puštění mimo plochu, odchod během chybné odezvy a opakování po chybějící MP3.
Pořadí možností ani pole se po chybném pokusu nemění. Textový panel zachovává německé zadání podle požadavku.

## Omezení před schválením

- Nutné ruční ověření na skutečném iPhonu a iPadu v Safari a lidský poslech výslovnosti.
- Lokálně chybějící MP3 po generování: **žádné**. Build je musí na každém čistém checkoutu vygenerovat nebo obnovit z cache.
- Výsledky GitHub Actions patří k PR; lokální úspěch není potvrzením vzdáleného CI.
