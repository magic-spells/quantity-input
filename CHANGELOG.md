# Changelog

All notable changes to `@magic-spells/quantity-input` are documented here.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.1.0]

### Added

- **`step` attribute** (observed). Each button press adds or subtracts `step`
  instead of a hardcoded `1`. Positive integers only — decimals truncate
  (`parseInt`, as `min`/`max`/`value` already did) and `0`, negatives and junk
  all fall back to `1`. Clamping to `min`/`max` is unchanged, so a step that
  would overshoot lands exactly on the bound.
- **`disabled` attribute** (observed, reflected via the `disabled` property).
  Both handlers and the keydown/change commit early-return.
- **The component now owns `disabled` on the decrement/increment buttons and the
  input.** Host `disabled` disables all three, and the buttons are additionally
  disabled at `min`/`max` (decrement at the minimum, increment at the maximum),
  recomputed on every sync: connect, any observed attribute change, and every
  committed value. A `disabled` the author puts on one of those elements is not
  preserved — set it on the host.
- `quantity-input:change` is now typed in `quantity-input.d.ts` via
  `HTMLElementEventMap`, and `min` / `max` / `step` / `disabled` have property
  setters. Every setter treats `null`/`undefined` as "remove the attribute", so
  `el.max = undefined` clears the ceiling instead of writing the string
  `"undefined"`.

### Fixed

- **Zero is a value.** `min` and `value` parsed with `parseInt(x) || 1`, so
  `min="0"` and `value="0"` both silently became `1`. They now parse with a
  `Number.isFinite` check: `min` defaults to `1` and `value` defaults to the
  current `min` only when the attribute is absent or non-numeric. A cart stepper
  can reach `0`.
- **Empty or non-numeric input snaps back.** Typing `abc` (or clearing the
  field) and committing used to leave the input dirty and disagreeing with
  `value`. The field is now rewritten with the committed value.
- The input is written with the value **clamped** to `min`/`max`, so an authored
  or parent-pushed out-of-range `value` renders in range rather than showing a
  number the buttons will not honor.

### Unchanged

- `quantity-input:change` still bubbles, still carries `detail: { value }`, and
  still fires only on real user changes — never in response to an attribute
  write. Programmatic `el.value = n` / `setAttribute('value', n)` produces no
  event.

## [1.0.3]

### Fixed

- Pressing Enter in the input no longer implicitly submits an enclosing
  `<form>`; the keypress is swallowed and the value is committed instead.
