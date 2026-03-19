   # Critical UI Audit — Visual Bugs, Performance, and Consistency

## Project Context

Working directory: `F:\Code\Dussahra (NEW)` — React 18 + Vite + TypeScript + GSAP + Lenis.

The recent code audit sweep made sweeping changes (43 files, -1685/+1134 lines). Several visual regressions have appeared:

1. **Page headers are not centered** — "Our Sponsors", "Event Schedule", etc. are left-aligned instead of centered. They briefly flash centered on load then shift left.
2. **The site loads slower than before** — likely related to lazy loading, Lenis init, GSAP SplitText, or the audit changes.
3. **"Two versions" flicker** — headers appear centered for ~1 second on first load, then snap to left-aligned on re-render. This suggests CSS is loading in wrong order, or a component re-mount is stripping styles, or there's a FOUC (Flash of Unstyled Content).

## Known Visual Issues (from screenshots)

- Sponsors page: "Our Sponsors" header is nearly invisible (dark text on dark banner background, barely readable)
- Sponsors page: header is left-aligned, not centered
- Schedule page: "Event Schedule" is left-aligned, no banner/hero section — just bare text
- Nav: "Dushahra" logo is clipped on the left edge (likely container overflow or negative margin)
- Nav: "Book a Booth" button is clipped on the right edge
- Nav: "Contact Us" wraps to two lines ("Contact" / "Us") — needs `white-space: nowrap`

---

## Sweep 1: Header Centering & Visibility — THE CRITICAL FIX

**This is the most important sweep. Do this first.**

### What to investigate:

Every page except Home has a header/banner section. Check EVERY page component for:

1. Read each page file: `About.tsx`, `Events.tsx`, `Sponsors.tsx`, `Photos.tsx`, `Videos.tsx`, `Press.tsx`, `ContactUs.tsx`, `Volunteer.tsx`, `BoothBooking.tsx`, `Family.tsx`
2. For each page, identify the header/banner markup — is it using a shared pattern or is each page custom?
3. Check if there WAS a shared `.page-header` or `.temple-arch` class that the audit may have modified or removed
4. Check `index.css` and every page CSS for header centering rules — look for `text-align: center` on page headers
5. Compare the CURRENT page header styles against what's in the git history: `git diff HEAD -- src/pages/*.css src/index.css` — look for removed centering rules

### What to fix:

- All page headers must be **centered** with `text-align: center`
- All page header titles must be **visible** — check contrast against their background
- If the audit removed a shared `.page-header` class or similar, restore it
- The "Our Sponsors" title needs to be readable on its dark banner — ensure it uses `color: var(--color-gold)` or `var(--color-text-inverse)` on dark backgrounds

### Files to read:
- ALL `src/pages/*.tsx` and `src/pages/*.css`
- `src/index.css` (search for page-header, temple-arch, section-header, banner patterns)
- `src/styles/animations.css` (the reveal system may affect initial positioning)
- Run `git diff HEAD -- src/pages/*.css src/index.css | grep -A5 -B5 "text-align\|center\|page-header\|temple-arch\|banner"` to find what was removed

---

## Sweep 2: The "Two Versions" Flicker / FOUC

**Investigate why headers flash centered then snap left-aligned.**

### Possible causes to check:

1. **CSS load order with lazy loading** — `App.tsx` now uses `React.lazy()` for all pages. The page CSS may load AFTER the component renders, causing a flash.
   - Check: does each page import its CSS at the top? (`import './PageName.css'`)
   - Check: is the Suspense fallback (`<div className="app-suspense-fallback" />`) causing a layout shift?

2. **GSAP SplitText re-render** — The Hero component uses SplitText which modifies DOM. If this causes a re-render cascade, child styles may flash.
   - Check: is the SplitText `useEffect` running twice in StrictMode? (React 18 dev mode double-invokes effects)

3. **Lenis smooth scroll initialization** — Lenis modifies scroll behavior on mount. If it triggers a reflow, styles may recalculate.
   - Check: is Lenis still in `App.tsx`? The audit may have removed it. If so, restore it.
   - Check: `package.json` — is `lenis` still a dependency?

4. **CSS specificity conflict** — The audit moved styles around. A more-specific selector may be overriding the centered styles after CSS fully loads.
   - Check: use browser DevTools logic — which CSS rule is winning on the header elements? Look for competing `text-align` rules.

5. **`index.css` changes** — The audit made major changes to `index.css` (+280/-280). The `:root` variables or global styles may have been reordered in a way that breaks cascade.
   - Read the full current `index.css` and check for any removed global centering rules

### Files to read:
- `src/App.tsx` — check Suspense, Lenis, lazy imports
- `src/index.css` — full read, look for removed global styles
- `src/main.tsx` — check if anything was removed (the audit deleted 1 line)
- `package.json` — verify lenis is still listed

---

## Sweep 3: Performance Regression

**The site loads slower than before. Find out why.**

### Check these:

1. **Lazy loading overhead** — Every page is now `React.lazy()`. This means each page navigation triggers a network request for the chunk. Check if the code splitting is actually beneficial or if the chunks are too small to be worth it.
   - Run `npx vite build` and check the chunk sizes in output
   - If most chunks are <5KB, the overhead of separate requests outweighs the savings — consider removing lazy loading for small pages

2. **Lenis initialization** — Is Lenis blocking first paint? Check if it's imported synchronously.
   - If Lenis is a 20KB+ library loading synchronously, it delays interactive time

3. **GSAP + SplitText bundle** — These are loaded on the Hero (above-fold). Are they tree-shaken properly?
   - Check: is `gsap/SplitText` imported only in Hero, or globally?

4. **External image** — Hero background still loads from `https://www.dushahra.com/wp-content/uploads/...` — this is an external request that blocks hero rendering.
   - Should be downloaded to `public/images/` for local serving

5. **CSS file sizes** — The audit may have bloated CSS. Check:
   - `cultural-patterns.css` (was 45.5K) — is it still loaded? Is it used?
   - `animations.css` (was 23.5K) — was it trimmed by the audit?
   - What's the total CSS bundle size now vs before?

6. **Removed optimizations** — Did the audit accidentally remove any performance optimizations?
   - Check if `will-change` properties were removed from animated elements
   - Check if image lazy loading (`loading="lazy"`) was removed

### Commands to run:
```bash
npx vite build 2>&1  # check chunk sizes
grep -r "lenis" src/  # verify Lenis is still integrated
grep -r "cultural-patterns" src/  # check if patterns CSS is imported
```

### Files to read:
- `src/App.tsx`
- `src/main.tsx`
- `package.json`
- `src/index.css`
- `src/styles/cultural-patterns.css` — check if used
- `src/styles/animations.css` — check if trimmed

---

## Sweep 4: Navigation Overflow & Clipping

**The nav has visual issues at certain viewport widths.**

### Issues to fix:

1. **Logo "Dushahra" clipped on left** — likely the `.navbar-container` has `overflow: hidden` or the logo has negative margin
   - Read `Navigation.css` — check `.navbar-container`, `.navbar-logo`, `.logo-text` for overflow/margin issues
   - Ensure `.container` class has proper padding on both sides

2. **"Book a Booth" button clipped on right** — same overflow issue, or the button pushes past the container
   - Check if `.nav-item-btn` has enough room
   - The nav may need `flex-wrap: nowrap` with `overflow-x: visible`

3. **"Contact Us" wrapping to two lines** — needs `white-space: nowrap` on nav links
   - Add to `.nav-links` or specifically to items that shouldn't wrap

4. **Dropdown "About IAF v" and "Contact Us v" chevrons** — verify they don't cause layout shift

### Files to read:
- `src/components/Navigation.css` — full read
- `src/index.css` — check `.container` class definition (max-width, padding)

---

## Sweep 5: Full Page-by-Page Visual Check

**Read every page component and its CSS. For each, verify:**

### For EVERY page (About, Events, Sponsors, Photos, Videos, Press, ContactUs, Volunteer, BoothBooking, Family):

- [ ] Has a page header/banner section with centered title
- [ ] Title is visible (sufficient contrast against background)
- [ ] Content is within `.container` (not edge-to-edge)
- [ ] No hardcoded widths that could cause horizontal scroll
- [ ] Sections have consistent vertical spacing
- [ ] Cards/grids have consistent styling
- [ ] No orphaned CSS classes (class in CSS but not used in TSX)
- [ ] No orphaned TSX classes (class in TSX but not defined in CSS)
- [ ] `reveal` classes are present for scroll animations
- [ ] Images have `alt` text and `loading="lazy"`

### Specific pages to scrutinize:

**Sponsors.tsx** — screenshot shows:
- Header "Our Sponsors" is barely visible
- Page appears mostly empty below the banner
- Was content removed by the audit? Check `git diff HEAD -- src/pages/Sponsors.tsx`

**Events.tsx** — screenshot shows:
- No banner/hero section — just bare "Event Schedule" text
- Was the banner removed? Check `git diff HEAD -- src/pages/Events.tsx`

### Files to read:
- ALL `src/pages/*.tsx` and `src/pages/*.css`
- Run `git diff HEAD -- src/pages/` to see all page changes

---

## Sweep 6: Dead File Cleanup

**Check for files that should have been deleted but weren't, or files deleted that shouldn't have been.**

- [ ] `src/components/ThemeSelector.tsx` — should be DELETED (was it?)
- [ ] `src/components/ThemeSelector.css` — should be DELETED
- [ ] `src/styles/themes.css` — should be DELETED or empty
- [ ] `src/components/PixelVineCanvas.tsx` — was deleted by audit. Is it still imported anywhere? Check for broken imports.
- [ ] `src/hooks/useTextReveal.ts` — was deleted by audit. Is it still imported anywhere?
- [ ] `src/styles/cultural-patterns.css` — 45.5K file. Is it imported? Is it used? If not, delete.
- [ ] Any `.css` files with 0 used selectors — identify and delete

### Commands to run:
```bash
# Check for broken imports
npx tsc --noEmit 2>&1

# Check for unused CSS files
for f in src/**/*.css; do
  basename=$(basename "$f" .css)
  grep -r "$basename" src/ --include="*.tsx" --include="*.ts" -l
done
```

---

## Execution Instructions

1. **Start with Sweep 1** (header centering) — this is the user-facing regression
2. Run Sweeps 2-4 in parallel (FOUC, performance, nav)
3. Run Sweep 5 after Sweeps 1-4 are done (full visual check benefits from fixes)
4. Run Sweep 6 last (cleanup)
5. After ALL sweeps, run `npx tsc --noEmit && npx vite build` to verify
6. Report every change made with file:line references

**IMPORTANT:** Do NOT remove functionality or change the design. Only fix regressions and visual bugs. If something looks intentional (even if ugly), leave it and flag it for the user.
