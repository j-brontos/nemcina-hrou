# Visual redesign – NĚMČINA HROU

## Scope
Preserve all existing six game modes, twelve lesson titles, two difficulty levels, numbers 0–12, audio engine and feedback timing. No production merge until review.
## Visual direction
Children's picture-book illustrations, bold outlines, friendly Dino mascot, landscape header, pastel rounded game cards, uppercase Czech labels. Mobile-first, three columns where legible, two on narrow screens. Scrolling is allowed; do not shrink touch targets to fit all content.
## Shared assets
Keep assets/images as canonical static WebP library. Add dedicated menu illustrations for quiz (speaker and apple), explore (open picture book), memory (matching cards), scene (magnifier and teddy), position (object with directional arrows), placement (object and target), rhymes (music), reward (trophy), header landscape and mascot. No runtime image generation. Reuse existing vocabulary images for lesson previews. Keep dynamic numbers/colors and necessary fallback graphics.
## Implementace v PR #11

Hlavní menu, šest herních obrazovek, nastavení, sedm říkanek a závěrečný pohár používají jeden styl. Karty mají dvou- nebo třísloupcové rozložení podle šířky telefonu. Obsah se posouvá svisle. Návrat z lekce obnoví předchozí polohu menu.

Dvanáct nových WebP má dohromady 396 048 bajtů. Maskot, krajina a ikony se načítají lokálně. Reproduktor a jablko v první hře jsou dvě sdílené ilustrace. Směrové šipky, motýlí karty, lupa a přesun používají stejné schválené předměty jako hry. Lokální písmo Nunito má vlastní licenci v adresáři s fontem.

| Oblast | Implementace |
| --- | --- |
| Rozvržení a stavy | `index.html`, `css/main.css`, `js/classes/Application.js` |
| Obrazová knihovna | `js/data/interfaceArt.js`, `imageManifest.js`, `learningArt.js`, `js/classes/ImageRepository.js`, `PictureRenderer.js` |
| Pokrytí obrázků | [Přehled pro všechny lekce a obtížnosti](art-coverage.md) |
| Mobilní regrese a snímky | `tests/visual.spec.cjs`, `tests/playwright.config.cjs`, workflow Browser regression checks |
| Soubory této změny | [Kompletní diff PR #11](https://github.com/j-brontos/nemcina-hrou/pull/11/files) |

### Zvuk a zpětná vazba

Ve výchozím PR znělo „Falsch!“ před vybraným slovem. Pořadí požadované pro nové vydání je vybrané slovo, chybová hláška, „Falsch!“ a původní zadání. Automatický posun po třech sekundách, prodleva pexesa, přehrávač, jména souborů a generování hlasů zůstávají zachované. Pexeso má vlastní pravidlo pro dvojici karet a nemá slovní zadání konkrétního předmětu.

Výstup původního a upraveného audio manifestu je identický pro všech 382 záznamů, včetně jazyků a cest. SHA-256 obou JSON výstupů je `5df3971d433a2a7f813a96451ff4e1c3893f5554334f5a76642bed266f813247`.

### Předání a návrat verze

1. V posledním běhu **Browser regression checks** je archiv **iphone15-visual-review** se skutečnými snímky mobilního WebKitu při 393 × 852 CSS pixelech. Test projde skutečné ovládací prvky až k odměně. Počkat na zelené kontroly a vizuální schválení vlastníka.
2. Po schválení sloučit PR #11 do `main`. Ověřit úspěch kroku **Deploy** ve workflow **Publish German learning app** a otevřít produkční URL. Na produkci ověřit nové menu, načtení ilustrace a oba jazykové MP3 výstupy.
3. V případě chyby vytvořit z aktuálního `main` opravnou větev. Při standardním merge použít `git revert -m 1 <merge-sha>`, při squashi `git revert <squash-sha>`. Tím zůstanou zachované případné pozdější změny v historii. Projít kontroly a sloučit rollback přes PR.
4. Ověřit úspěšný Pages workflow pro rollback commit a na produkci otevřít menu, jednu lekci a poslech. Při potížích porovnat webové soubory s produkční zálohou `backup/pre-visual-redesign-2026-11-28` (`82cb4cd`). Rozpracovaná záloha `backup/pre-menu-redesign-draft-2026-11-28` ukazuje na `b0ea104`.
