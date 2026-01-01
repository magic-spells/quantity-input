# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

```bash
# Build all distribution formats
npm run build

# Development server with hot reload at http://localhost:3000
npm run dev
npm run serve  # alias for dev

# Code quality
npm run lint
npm run format

# Publishing
npm run prepublishOnly  # automatically runs build before publish
```

## Architecture Overview

This is a Web Component library for e-commerce quantity controls, built as a Custom Element that extends HTMLElement.

### Core Structure
- **Single source file**: `src/quantity-input.js` - The entire component implementation
- **Multiple build targets**: ESM, CommonJS, UMD, and minified UMD via Rollup
- **Framework agnostic**: Works with React, Vue, vanilla JS, etc.

### Web Component Implementation
- Uses Custom Elements API with `customElements.define('quantity-input', QuantityInput)`
- Observed attributes: `min`, `max`, `value` trigger `attributeChangedCallback`
- Global style injection (once per page) to hide number input spinners using private static field `#stylesInjected`
- Event-driven architecture: dispatches `quantity-input:change` events with `{ value }` detail
- **Developer provides markup**: The component expects buttons with `data-action-decrement`/`data-action-increment` and an `input` element

### Key Behaviors
- **DOM caching**: `queryDOM()` caches button and input references in private fields for performance
- **Input clamping**: Automatically constrains values between min/max bounds
- **Memory management**: Properly removes event listeners in `disconnectedCallback`
- **Accessibility**: Uses proper ARIA labels and semantic HTML

### Build System
Rollup configuration generates:
- `dist/quantity-input.esm.js` - ES modules
- `dist/quantity-input.cjs.js` - CommonJS
- `dist/quantity-input.js` - UMD
- `dist/quantity-input.min.js` - Minified UMD
- Development mode copies built files to `demo/` directory

### Demo & Testing
- Live demo at `demo/index.html` showcases various configurations
- Event logging demonstrates the custom event system
- Multiple instances test component isolation

## Publishing Notes
- Package exports both named (`QuantityInput`) and default exports
- Uses `sideEffects: true` due to custom element registration
- Files array includes both `src/` and `dist/` directories
- NPM registry: `@magic-spells/quantity-input`
