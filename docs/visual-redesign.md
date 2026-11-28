# Visual redesign – NĚMČINA HROU

## Scope
Preserve all existing six game modes, twelve lesson titles, two difficulty levels, numbers 0–12, audio engine and feedback timing. No production merge until review.
## Visual direction
Children's picture-book illustrations, bold outlines, friendly Dino mascot, landscape header, pastel rounded game cards, uppercase Czech labels. Mobile-first, three columns where legible, two on narrow screens. Scrolling is allowed; do not shrink touch targets to fit all content.
## Shared assets
Keep assets/images as canonical static WebP library. Add dedicated menu illustrations for quiz (speaker and apple), explore (open picture book), memory (matching cards), scene (magnifier and teddy), position (object with directional arrows), placement (object and target), rhymes (music), reward (trophy), header landscape and mascot. No runtime image generation. Reuse existing vocabulary images for lesson previews. Keep dynamic numbers/colors and necessary fallback graphics.
## Implementation stages
1. Verify existing image coverage and all current menu labels; establish baseline tests.
2. Import dedicated static menu assets, validate filenames and image dimensions.
3. Implement responsive header, game cards, lesson cards, difficulty and rhyme controls; preserve DOM IDs and event handlers.
4. Apply shared tokens and consistent sizing to game screens, feedback, navigation and reward; retain correct/incorrect semantics.
5. Audit all vocabulary and scene/placement paths before deleting redundant SVG branches. Keep required fallbacks.
6. Run OOP, UX, browser checks and image validation; review iPhone portrait/landscape and desktop. Verify no missing images, clipped text, overflow, or audio regressions. Obtain visual approval before production merge.
## Rollback
backup/pre-visual-redesign-2026-11-28 (main baseline); backup/pre-menu-redesign-draft-2026-11-28 (initial draft). Revert redesign merge if required.
