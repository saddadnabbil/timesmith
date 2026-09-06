# Timesmith Redesign — Playful Learning System

> Product design specification inspired by Duolingo's playful, low-friction learning experience. This is an adaptation for Timesmith, not a pixel-for-pixel clone. Do not copy Duo, Duolingo characters, logos, proprietary fonts, lesson-path artwork, or branded sound assets.

## 1. Design intent

Timesmith should make arithmetic practice feel like a short, satisfying game rather than a worksheet. Every screen must answer one of three questions immediately:

1. What should I do next?
2. How am I doing?
3. What did my last action change?

The experience should feel:

- **Playful, not childish** — rounded forms, expressive illustration, crisp copy.
- **Fast, not frantic** — one clear action, immediate feedback, short transitions.
- **Encouraging, not punitive** — errors are recoverable and explained.
- **Progressive, not dense** — reveal choices as needed; preserve focus during drills.
- **Ownable** — Timesmith uses a time-forging metaphor and original characters instead of copying Duolingo's owl or visual assets.

### Product principles to borrow

- Bite-sized sessions with a visible finish line.
- One dominant action per screen.
- Strong progress visibility: streak, score, mastery, and daily completion.
- Immediate multimodal feedback: color, motion, copy, and optional sound.
- Character reactions that reflect the learner's state.
- Chunky controls that look and feel pressable.

### Product principles to avoid

- Do not use streak anxiety or guilt-heavy copy.
- Do not hide core learning behind decorative animation.
- Do not make red the only error signal.
- Do not animate every object simultaneously.
- Do not copy Duolingo's exact navigation, path geometry, mascot, character silhouettes, or branded microcopy.

---

## 2. Creative direction: “The Friendly Forge”

Timesmith turns arithmetic fluency into a forging ritual. Correct answers heat and shape a small timepiece; a completed run produces a finished object such as a gear, clock hand, spring, or pocket watch component.

### Visual keywords

`round` · `springy` · `bright` · `tactile` · `focused` · `crafted` · `optimistic`

### Signature motif

Use a **rounded gear tooth** as the repeatable brand shape. It can appear in progress rings, section dividers, loading indicators, achievement frames, and illustration silhouettes. Keep it sparse: one signature motif per major screen is enough.

### UI shape language

- Cards: rounded rectangles with generous corners, never glassmorphism.
- Buttons: slightly squashed rounded rectangles with a visible bottom edge.
- Chips: pill-shaped only for small filters and counters.
- Progress nodes: circles or compact rounded gears.
- Illustration anatomy: 1–2 large shapes per body part, rounded geometry, clear silhouette.
- Lines: use only for dividers, progress tracks, and icon strokes; illustrations rely on color blocks rather than outlines.

---

## 3. Color system

Duolingo's official system is built around a dominant green, neutral white/gray foundations, and bright secondary colors. Timesmith should preserve that hierarchy while using its own teal-forward palette.

### Core tokens

| Token                  | Hex       | Role                                  |
| ---------------------- | --------- | ------------------------------------- |
| `--color-canvas`       | `#FFFCF5` | Warm page background                  |
| `--color-surface`      | `#FFFFFF` | Cards, dialogs, drill surface         |
| `--color-ink`          | `#263238` | Primary text and dark icons           |
| `--color-ink-muted`    | `#68767C` | Secondary copy                        |
| `--color-border`       | `#DDE5E4` | Dividers and neutral outlines         |
| `--color-disabled`     | `#B7C3C1` | Disabled foreground                   |
| `--color-disabled-bg`  | `#E9EFEE` | Disabled surfaces                     |
| `--color-primary`      | `#18B89B` | Main CTA, active lesson, focus        |
| `--color-primary-dark` | `#0C8F78` | Button bottom edge, selected depth    |
| `--color-primary-soft` | `#DDF7F0` | Selected backgrounds, hint panels     |
| `--color-sky`          | `#2FA8F8` | Information, XP, secondary progress   |
| `--color-sky-dark`     | `#177CC0` | Sky depth edge                        |
| `--color-success`      | `#58C936` | Correct-answer feedback only          |
| `--color-success-dark` | `#359A20` | Correct state depth                   |
| `--color-warning`      | `#FFB020` | Streak, timer warning, combo          |
| `--color-danger`       | `#F25555` | Incorrect, depleted life, destructive |
| `--color-violet`       | `#9869E8` | Rare achievement/legendary state      |

### Usage ratio

- 70% canvas and surface neutrals.
- 20% ink, border, and muted states.
- 8% primary teal.
- 2% semantic accents.

Bright colors communicate meaning; they are not background decoration. On a normal screen, use teal plus at most one semantic accent. Illustrations may use the complete palette.

### Contrast rules

- Body copy must meet WCAG AA.
- White text is allowed on `primary-dark`, `sky-dark`, and `danger`; use dark ink on `primary`, `warning`, and `success` where contrast is stronger.
- Never rely on green/red alone. Pair states with icon, label, and shape change.
- Focus ring: `0 0 0 3px color-mix(in srgb, var(--color-sky) 35%, transparent)`.

### Dark mode

Dark mode is secondary for this redesign. If implemented, preserve color meaning rather than simply inverting the page:

- Canvas `#17201F`, surface `#202B2A`, ink `#F4FAF8`, muted `#A9B8B5`.
- Raise primary teal to `#24D2B0` and soften semantic fills.
- Use a light 1px ring instead of heavy shadows.

---

## 4. Typography

Duolingo uses proprietary Feather Bold for short display text and DIN Next Rounded for longer copy; its official fallback is Nunito. Timesmith must not use proprietary Duolingo fonts.

### Recommended pairing

- **Display:** `Nunito`, weight 800–900.
- **Body/UI:** `Nunito Sans`, weight 500–800.
- **Numbers:** `Nunito Sans`, weight 800, `font-variant-numeric: tabular-nums`.
- Fallback: `ui-rounded, system-ui, sans-serif`.

### Scale

| Role             | Mobile | Desktop | Weight | Line height |
| ---------------- | -----: | ------: | -----: | ----------: |
| Hero             |   40px |    56px |    900 |         1.0 |
| Page title       |   30px |    36px |    900 |         1.1 |
| Exercise numeral |   56px |    72px |    900 |         1.0 |
| Section title    |   20px |    24px |    800 |         1.2 |
| Body             |   16px |    17px |    600 |         1.5 |
| Button           |   15px |    16px |    800 |         1.0 |
| Label/meta       |   13px |    14px |    700 |         1.3 |

### Typesetting rules

- Sentence case for UI labels; avoid long all-caps labels.
- Headings: `text-wrap: balance`; body: `text-wrap: pretty`.
- Limit a screen to three visibly different text sizes, excluding the main exercise number.
- Use short, active copy: “Start sprint”, “Try again”, “Keep going”.
- Dynamic score, timer, accuracy, and streak values use tabular numerals to prevent layout shift.

---

## 5. Spacing, radii, and depth

### Spacing tokens

`4, 8, 12, 16, 24, 32, 48, 64px`

- Mobile page gutter: 20px.
- Desktop content max width: 1120px.
- Drill column max width: 640px.
- Major section gap: 32–48px.
- Card padding: 16px mobile, 24px desktop.
- Minimum touch target: 44×44px; primary answer controls target 56px or taller.

### Radius tokens

| Token          | Value | Use                               |
| -------------- | ----: | --------------------------------- |
| `--radius-sm`  |   8px | Small status marks                |
| `--radius-md`  |  12px | Chips, compact inputs             |
| `--radius-lg`  |  18px | Buttons, answer choices           |
| `--radius-xl`  |  24px | Cards                             |
| `--radius-2xl` |  32px | Dialogs, hero illustration frames |

Nested radii are concentric: `outer radius = inner radius + padding` when the layers are visually adjacent.

### Tactile elevation

Controls should feel like game pieces, using a hard lower edge plus a quiet ambient shadow.

```css
--shadow-card: 0 0 0 2px rgb(38 50 56 / 0.07), 0 4px 12px rgb(38 50 56 / 0.06);

--shadow-button-primary: 0 4px 0 var(--color-primary-dark);

--shadow-button-neutral: 0 3px 0 #c8d2d0;
```

On press, translate the button down by the depth amount and remove the lower-edge shadow. Do not combine a large translate with a large scale-down.

---

## 6. Information architecture

### Desktop shell

- Left rail: Home, Practice, Progress, Achievements, Settings.
- Center: active learning path or drill experience.
- Right rail: daily goal, streak, weak-fact suggestion, compact leaderboard/personal best.
- Hide the right rail below 1100px; move key cards into the center feed.

### Mobile shell

- Top status bar: subject, daily progress, streak.
- Main content: one vertical focus column.
- Bottom navigation: Home, Practice, Progress, Profile/Settings.
- During a drill, hide bottom navigation to remove distractions.

### Core screen map

1. **Home / Path** — resume card, daily goal, skill journey, short practice options.
2. **Session setup** — operation, level, and mode; progressive disclosure.
3. **Drill** — question, answer input, progress, pause.
4. **Feedback** — inline correct/incorrect bottom sheet; learner remains in context.
5. **Results** — XP/score, accuracy, speed, mastery changes, next action.
6. **Progress** — mastery grid, weak facts, trend, personal bests.
7. **Achievements** — milestones with original Timesmith collectibles.

---

## 7. Component specifications

### Primary button

- Height 52px mobile / 48px desktop; radius 18px.
- Fill primary teal; 4px darker bottom edge.
- Label centered, weight 800.
- Hover: brightness +3%, translateY(-1px).
- Press: translateY(4px), bottom edge collapses, duration 80ms.
- Disabled: gray fill, no bottom edge, no press motion.
- Loading: label remains in layout but becomes transparent; 20px spinner overlays it.

### Secondary button

- White surface, 2px neutral outline, 3px neutral bottom edge.
- Hover uses primary-soft background only when the action is constructive.
- Destructive secondary actions use danger-colored text, not a full red fill by default.

### Option card

- Min height 72px; icon, title, and short descriptor.
- Idle: surface + 2px border.
- Hover: border moves to primary at 45% opacity.
- Selected: primary-soft fill, 2px primary border, check indicator.
- Pressed: translateY(2px).
- Keyboard focus is always visible and distinct from selected state.

### Progress bar

- Track height 12px; fully rounded.
- Fill grows from left to right; in RTL layouts reverse direction.
- Use teal for lesson completion, sky for XP, warning for time under 20%, danger under 8%.
- Width transition is linear for a timer and eased for discrete lesson progress.
- Milestones may use small gear notches; no dense tick labels.

### Path node

- 64×64px default, 72×72px current node.
- Locked: neutral fill and lock icon.
- Available: primary fill with 5px tactile bottom edge.
- Current: primary fill plus slow breathing ring; never animate the node position.
- Complete: success-colored ring and check icon.
- Legendary/fully mastered: violet rim used sparingly.
- A click opens a small anchored card with skill name, progress, and one CTA.

### Answer input / number pad

- Numeral display is the visual center, not a standard text field.
- Number pad buttons are at least 56px high and support keyboard input.
- Enter/submit is the only filled primary key.
- Backspace uses icon + accessible label.
- Correct state locks input briefly; wrong state preserves the learner's answer so the error remains understandable.

### Feedback sheet

- Anchored to the bottom on mobile; inline under the exercise on desktop.
- Correct: pale green surface, check icon, “Nice!” plus optional one-line insight.
- Incorrect: pale red surface, error icon, correct answer and short explanation.
- Primary action is always “Continue” or “Try again”.
- Never cover the original problem entirely.

### Stats and counters

- Icon + tabular numeral + concise label.
- Icons use semantic color; text remains ink/muted.
- Animate only the numeral that changed, not the entire card.

### Dialog / pause menu

- Max width 420px; radius 32px; no close animation longer than 150ms.
- Backdrop uses `rgba(20, 34, 32, .48)` without heavy blur.
- First action resumes; destructive exit is visually secondary.
- Trap focus, close on Escape, restore focus to trigger.

---

## 8. Interaction model

### Input parity

Every core action must work with touch, mouse, and keyboard.

- `1–9`, `0`: enter answer.
- `Enter`: submit / continue when valid.
- `Backspace`: remove one digit.
- `Escape`: pause / close overlay.
- Arrow keys: move across option groups where appropriate.
- Space/Enter: activate focused controls.

Do not make hover reveal information required to finish a task.

### Exercise state machine

```text
ready
  └─ input → answering
       ├─ submit correct → correct-feedback → next-question
       ├─ submit wrong   → wrong-feedback   → retry or next-question
       └─ pause          → paused           → answering

next-question
  ├─ more questions → ready
  └─ goal reached   → results
```

Rules:

- Ignore duplicate submits while feedback is active.
- Keep feedback duration user-controlled: auto-advance may be offered in sprint mode, but “Continue” remains available.
- Stop timers when the tab is hidden or the session is paused.
- Restore unfinished local sessions after an accidental refresh, with a clear “Resume / Start over” choice.

### Optimistic feedback

- Selection feedback appears within 80ms.
- Correct/wrong evaluation appears within 150ms after submit.
- The next problem should be ready within 250ms after continue.
- Sound is supplementary and muted state persists locally.

### Empty, loading, and error states

- Empty progress: show one original illustration and “Finish your first drill to reveal your strengths.”
- Loading: use stable skeleton geometry; never shift the exercise layout.
- Recoverable error: preserve entered data and offer retry.
- Offline/local mode: practice remains available; show a quiet status banner only if sync features exist later.

---

## 9. Motion system

Motion exists to explain cause and effect, reinforce correctness, and add character. CSS transitions should handle interactive changes because they are interruptible; keyframes are reserved for one-shot celebrations and error feedback.

### Motion tokens

```css
:root {
  --motion-instant: 80ms;
  --motion-quick: 150ms;
  --motion-standard: 240ms;
  --motion-enter: 320ms;
  --motion-celebrate: 560ms;

  --ease-out: cubic-bezier(0.22, 1, 0.36, 1);
  --ease-in-out: cubic-bezier(0.65, 0, 0.35, 1);
  --ease-pop: cubic-bezier(0.34, 1.36, 0.64, 1);
}
```

### Motion recipes

| Event           | Properties                                             | Timing          | Behavior                                 |
| --------------- | ------------------------------------------------------ | --------------- | ---------------------------------------- |
| Button hover    | `transform`, `filter`                                  | 150ms, ease-out | Lift 1px; brightness +3%                 |
| Button press    | `transform`, `box-shadow`                              | 80ms, ease-out  | Move down 3–4px; collapse depth          |
| Option selected | `background-color`, `border-color`, icon opacity/scale | 150–240ms       | Check scales `.75 → 1`; no bounce loop   |
| Page enter      | `opacity`, `translateY`                                | 320ms, ease-out | 8px rise; groups stagger by 40ms         |
| Page exit       | `opacity`, `translateY`                                | 150ms, ease-in  | Fade and rise 4px                        |
| Modal open      | backdrop opacity; panel opacity + scale                | 240ms, ease-out | Scale `.96 → 1`                          |
| Modal close     | same properties                                        | 150ms, ease-in  | Faster and quieter than enter            |
| Correct answer  | card color, check pop, numeral lift                    | 240–560ms       | One decisive pulse; no whole-page bounce |
| Wrong answer    | card color + `translateX`                              | 320ms total     | 3 short decreasing shakes, then still    |
| Score update    | digit opacity, `translateY`, blur                      | 150ms           | Changed digits only; tabular widths      |
| Progress update | width/scaleX                                           | 240ms, ease-out | Starts after answer resolves             |
| Combo milestone | badge scale + short spark particles                    | 560ms max       | Only at meaningful thresholds            |
| Path unlock     | ring draw + node lift                                  | 560ms           | One-shot, followed by stable state       |

### Correct-answer sequence

1. At `0ms`, lock input and recolor the answer surface.
2. At `40ms`, check icon enters from scale `.75` with `--ease-pop`.
3. At `100ms`, score digits rise by 4px and crossfade.
4. At `160ms`, progress fill advances.
5. At `240ms`, character reacts if visible.
6. The learner controls continuation; sprint mode may auto-advance after approximately 450ms.

### Incorrect-answer sequence

1. At `0ms`, lock input and tint the answer surface pale red.
2. At `40ms`, shake the answer group `-6, +5, -3, +2, 0px`.
3. At `120ms`, show the correct answer/explanation.
4. Do not reduce opacity or remove the learner's answer.
5. Character reaction is empathetic, never mocking.

### Celebration budget

- Small win: check pop + progress update.
- Medium win: character reaction + 6–10 particles.
- Major win: 600–900ms scene using 12–18 particles and one collectible reveal.
- Never run confetti after every question.
- Never block the next action behind an animation longer than 900ms.

### Reduced motion

```css
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    scroll-behavior: auto !important;
    animation-duration: 1ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 1ms !important;
  }
}
```

In reduced-motion mode, preserve color and icon state changes, remove shake, particles, parallax, breathing rings, and large translations. Do not remove feedback itself.

---

## 10. Illustration system

### Original character direction

Create **Pip**, a compact clockwork apprentice who helps the learner forge fluency. Pip is not an owl and should not share Duo's silhouette.

- Body: rounded vertical capsule.
- Head/face: circular clock face with two dot eyes; no beak or wing shapes.
- Hands: mitten-like circles; maximum three visible finger divisions if required.
- Feet: broad rounded shoes for a stable silhouette.
- Signature detail: one winding key or small side gear.
- Primary body color: Timesmith teal; brass accents use warning amber sparingly.
- Facial features stay geometric; pupils sit slightly above visual center to feel alert.

### Supporting world

- Forge bench, gears, springs, clock hands, number tiles, sparks, and finished timepieces.
- Each arithmetic operation maps to one tool:
  - Addition → joining clamp.
  - Subtraction → trimming chisel.
  - Multiplication → gear duplicator.
  - Division → precision divider/caliper.
- Use these as metaphors in onboarding and results, not as decorative clutter during the drill.

### Construction rules

- Build characters from simple rounded geometry and repeat shapes across head, body, and props.
- Use 3–5 colors per character illustration.
- Prefer large color blocks; outlines only where two similar values meet.
- Hands stay abstract and poses read clearly at 96px.
- Expressions are driven by eyes, brows, and asymmetric mouth shapes.
- Crop close for emotional feedback; use full body for onboarding and results.
- Every illustration needs a defined narrative verb: forging, measuring, cheering, thinking, recovering.

### Required illustration set

| Asset            | Pose/story                       | Use                  | Format                           |
| ---------------- | -------------------------------- | -------------------- | -------------------------------- |
| `pip-welcome`    | Presents a blank gear            | Home empty/new state | SVG or transparent WebP          |
| `pip-ready`      | Holds hammer at the ready        | Session setup        | SVG/WebP                         |
| `pip-correct`    | Raises a glowing finished gear   | Correct feedback     | 6–10 frame Rive/Lottie or sprite |
| `pip-wrong`      | Gear slips; Pip catches it       | Wrong feedback       | Short non-looping animation      |
| `pip-thinking`   | Inspects caliper                 | Loading/hint         | Subtle loop                      |
| `pip-streak`     | Winds a glowing pocket watch     | Daily goal/streak    | Static + optional spark layer    |
| `pip-results`    | Displays the completed mechanism | Results              | Responsive hero illustration     |
| `empty-progress` | Parts neatly arranged on bench   | Empty progress       | Static illustration              |

### Illustration animation rules

- Idle loops: 2.4–3.6s, low amplitude, with a 0.6–1.2s pause between cycles.
- Reactions: 450–800ms, play once.
- Animate 2–4 parts, not the whole illustration uniformly.
- Offset secondary motion by 40–80ms to avoid robotic simultaneity.
- Use anticipation for major actions: 80–120ms backward motion before the main move.
- Keep the face readable throughout; do not rotate it away during feedback.
- Export vector animation when possible; use WebP sprites only when texture is essential.

### Asset safety and ownership

- Do not trace or redraw Duo or existing Duolingo characters.
- Do not use Duolingo screenshots or brand illustrations in the shipped product.
- Do not call the mascot “Duo” or reuse Duolingo catchphrases.
- Reference the design principles, then create original silhouettes, props, names, and stories.

---

## 11. Screen-by-screen redesign

### Home / learning path

- Header: Timesmith wordmark, compact streak, settings.
- Resume card: “Continue multiplication” plus progress and estimated 2-minute duration.
- Main path: vertically staggered forge stations connected by a subtle track.
- Current station is visually dominant; locked stations recede.
- Daily goal card sits after the next actionable node, not above it.
- Desktop right rail contains personal best and weak-fact practice.
- Primary action: current path node or resume card, never both at equal weight.

### Setup

- Start with mode selection; reveal operation/range only after the learner picks “Custom practice”.
- Recommended session is preselected.
- Explain choices in one short line; no configuration wall.
- Sticky bottom CTA on mobile: “Start 2-minute drill”.

### Drill

- Top row: close, progress, pause; sound lives in pause/settings to reduce chrome.
- Score and combo are secondary and compact.
- Problem card sits above the optical center so the number pad remains reachable.
- Reserve stable space for feedback to prevent layout jumping.
- On desktop, keyboard hint appears once and can be dismissed.

### Results

- Lead with the learning outcome: “7s are getting faster”.
- Show score second, then accuracy and average response time.
- Animate only changed mastery cells.
- Main CTA: “Continue path”; secondary: “Practice mistakes”.
- Major personal best earns the full Pip celebration.

### Progress

- Keep the mastery matrix, but add row/column selection and a textual detail panel.
- Never communicate mastery only through color; add patterns/icons in focused detail.
- Sort weak facts into a 2-minute practice queue.
- Show change over time only after enough data exists; otherwise use the empty-state illustration.

---

## 12. Responsive behavior

### Mobile, 360–599px

- One column, 20px gutter.
- Sticky CTA and bottom navigation respect safe-area insets.
- Number pad uses full available width.
- Feedback becomes a bottom sheet with at least 16px clearance above system UI.
- Illustration hero height maxes at 220px.

### Tablet, 600–1023px

- Center column up to 640px.
- Home may use two-column cards, but path stays centered.
- Dialogs remain modal rather than becoming side panels.

### Desktop, 1024px+

- Three-zone shell with fixed-width rails and flexible center.
- Maximum line length for body copy: 65ch.
- Hover affordances are additive; all interactions remain available without hover.

---

## 13. Accessibility and content

- Visible focus on every interactive control.
- 44px minimum hit area and no overlapping targets.
- Announce answer results with a polite `aria-live` region; do not move keyboard focus after every question.
- Decorative illustration uses empty alt text; narrative illustration gets concise alt text.
- Timed modes provide pause and a non-timed alternative.
- Sound defaults to the user's persisted preference and never carries essential information alone.
- Copy is specific and supportive:
  - Correct: “Nice — 7 × 8 is 56.”
  - Incorrect: “Almost. 7 × 8 is 56.”
  - Avoid: “Wrong!”, “You failed”, or guilt-based streak threats.

---

## 14. Implementation sequence

1. Replace the current dark editorial tokens with the Friendly Forge token system.
2. Rebuild buttons, option cards, progress bars, and feedback states first.
3. Restructure mobile drill flow and reserve stable feedback space.
4. Redesign Home into a resume-first learning path.
5. Redesign Results and Progress around mastery changes.
6. Add static original Pip illustrations.
7. Add motion recipes and optional illustration animation.
8. Add sound polish only after visual and keyboard feedback are complete.

### Definition of done

- One obvious primary action on each screen.
- All core flows work at 390×844 and desktop widths without overflow.
- Keyboard and touch can complete a full session.
- Correct, wrong, loading, empty, disabled, and paused states are designed.
- Motion is interruptible and reduced-motion-safe.
- Text contrast meets WCAG AA.
- No Duolingo-owned character, font, screenshot, logo, or sound is shipped.
- The visual system still reads as Timesmith when all product names are hidden.

---

## 15. Reference notes

The following official Duolingo materials informed the analysis:

- [Duolingo color guidelines](https://design.duolingo.com/identity/color/1000) — core green hierarchy, secondary accents, and neutral roles.
- [Duolingo typography guidelines](https://design.duolingo.com/identity/typography) — short expressive display type, rounded body type, and Nunito as an approved substitute.
- [Duolingo imagery guidelines](https://design.duolingo.com/identity/imagery) — illustration as the primary brand medium and expressive character posing.
- [Duolingo character guidelines](https://design.duolingo.com/illustration/characters) — simple geometric construction, repeated shapes, expressive eyes, abstract hands, and active poses.
- [Duolingo product overview](https://blog.duolingo.com/duolingo-101-how-to-learn-a-language-on-duolingo/) — bite-sized lessons, XP, streaks, hearts, gems, quests, and immediate practice loops.
- [Duolingo core tabs redesign](https://blog.duolingo.com/core-tabs-redesign/) — consistency, clearer hierarchy, spacing, and cross-screen craft.

Exact interaction timings and the Timesmith palette in this document are design recommendations inferred from those principles; they are not claimed to be Duolingo's internal implementation tokens.
