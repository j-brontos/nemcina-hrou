# Pokrytí ilustrací

Čtyři tematické hry vybírají ze stejné slovní zásoby pro danou lekci a obtížnost. Čísla v tabulce uvádějí velikost výběru, ze kterého hra sestaví kolo. Nabídka obsahuje 12 lekcí, dvě samostatné směrové hry a sedm říkanek.

| Lekce | 1 – Slovíčka | 2 – Spojení a věty |
| --- | --- | --- |
| Barvy | 10 vzorků barev | 7 WebP |
| Počasí | 6 WebP | 6 WebP |
| Podzim | 6 WebP | 6 WebP |
| Ovoce | 6 WebP | 6 WebP |
| Jídlo | 7 WebP | 6 WebP |
| Zvířátka | 6 WebP | 6 WebP |
| Lidé | 6 WebP | 6 WebP |
| Věty a pozdravy | 8 WebP | 6 WebP |
| Věci kolem nás | 6 WebP | 6 WebP |
| Čísla a barvy | 13 číslic (0–12) | 6 barevných číslic. Prohlížení má navíc 6 vět používajících stejné číslice. |
| Oblíbené činnosti | 7 WebP | 7 WebP |
| Lidé a povolání | 6 WebP | 6 WebP |

| Obrazovky | Co se kontroluje |
| --- | --- |
| Poslouchej a ukaž, Prohlížej a poslouchej, Pexeso, Najdi v obrázku | Všech 96 kombinací hry, lekce a obtížnosti dává 650 kontrol jednotlivých kartiček. Z nich 528 používá WebP a 122 číslici nebo vzorek barvy. |
| Kde je co? | Všech 10 otázek má v obou obtížnostech stejný obrázek jako základní předmět. Pět pozic používá tento jediný zdroj. |
| Kam to patří? | Všech 8 předmětů má shodnou ilustraci pro název i skloňované spojení. Zdroj obrázku v nabídce a v cíli je stejný. |
| Výběr lekcí a říkanky | Validátor vykreslí všech 12 náhledů lekcí i 7 náhledů říkanek ze stejných zdrojů jako hry. |
| Číselná grafika | 13 číslic × 10 barev × dvě formulace. Všechny používají stejné souřadnice a velikost písma. |

## Knihovna a odstraněná grafika

Původní sada obsahuje 116 průhledných ilustrací o velikosti 512 × 512 a čtyři obdélníkové scény. Porovnání obsahu i dekódovaných pixelů nenašlo žádné totožné dvojice. Například samostatný zelený list, červený list a různobarevné listí učí různé výrazy. Dvojice původních obrázků dětského pokoje také zachycují rozdílné scény.

Předchozí validátor procházel 98 souborů z původních 120. Registr nyní zahrnuje i zbývajících 22 schválených souborů. K dispozici jsou také rezervní ilustrace pro další lekce. Všechny nové obrázky rozhraní definuje `js/data/interfaceArt.js`.

Z vykreslování slovní zásoby zmizely generátory SVG pro fotbalový míč, listy, stromy, ovoce, zvířata, oblečení, počasí a další jednotlivé předměty. Sedm ručně kreslených SVG činností nahradily příslušné statické obrázky. Obrázky v odpovědích, pexesu, scénách a směrových hrách se už neskládají ze systémových emoji. Starší datové dvojice mohou stále obsahovat historický symbol. Jejich vzhled určuje centrální záznam, číslo nebo název barvy.

Původní CSS obsahovalo samostatné výjimky pro `.singleEmoji`, `.footballArt`, `.sceneDecor`, `.spokenIcon` a `.medal`. Jejich vykreslování přebírají sdílené styly učebních obrázků, statická scéna, reproduktor a pohár. Výběr obrázku a pravidla barevné zpětné vazby zůstávají společné pro všechny lekce.

Bílé a černé barvy i dvojciferné hodnoty používají původní geometrické vykreslení. Ilustrace, jejich adresa a skutečný soubor se kontrolují samostatně. Chybějící herní ilustrace ukončí validaci chybou. Pokud by se do neověřeného obsahu dostal neznámý výraz, karta umí bezpečně zobrazit jeho text.

## Výrazy bez vlastní kartičky

V rozšířeném katalogu pro audio a říkanky je současně 56 výrazů bez samostatné ilustrace. Žádný z nich se v aktuálních lekcích nepoužívá jako obrázková odpověď. Přesný seznam i strojově čitelnou matici všech 96 kombinací vypíše následující příkaz na Node 22 nebo novějším.

```sh
node scripts/validate-images.mjs --coverage
```

Patří sem mimo jiné pokyny ke tleskání, otázky na počet a výrazy o hřišti či čarodějnici. Ilustrace říkanky doprovází celou sloku. Přehrávané řádky mají zachované německé znění.
