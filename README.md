# Quantity Input Web Component

A professional, highly-customizable Web Component for creating intuitive quantity input controls in e-commerce applications. Features increment/decrement buttons with an input field, perfect for shopping carts, product quantities, and any numeric input scenarios.

[**Live Demo**](https://magic-spells.github.io/quantity-input/demo/)

## Features

- **Full markup control** - You provide the HTML structure and icons
- **Optional default styles** - Import ready-made CSS or write your own
- **Configurable constraints** - Set min/max values and default quantities
- **Event-driven architecture** - Clean separation between UI and logic
- **Zero dependencies** - Pure Web Components
- **Lightweight and performant** - Minimal footprint, maximum performance
- **Framework agnostic** - Pure Web Components work with any framework
- **Shopify-ready** - Designed for real-world e-commerce applications
- **Accessible** - Proper ARIA labels and keyboard navigation

## Installation

```bash
npm install @magic-spells/quantity-input
```

```javascript
// Import the component
import '@magic-spells/quantity-input';

// Optional: import default styles
import '@magic-spells/quantity-input/styles';
```

Or include directly in your HTML:

```html
<script src="https://unpkg.com/@magic-spells/quantity-input"></script>

<!-- Optional: default styles -->
<link rel="stylesheet" href="https://unpkg.com/@magic-spells/quantity-input/dist/quantity-input.css">
```

## Usage

You provide your own markup inside the component. The component looks for:
- A button with `data-action-decrement` for the minus button
- A button with `data-action-increment` for the plus button
- An `input` element for the quantity value

```html
<!-- Basic usage (defaults to min=1, value=min) -->
<quantity-input>
  <button data-action-decrement type="button">−</button>
  <input type="number" />
  <button data-action-increment type="button">+</button>
</quantity-input>

<!-- With custom min/max/value -->
<quantity-input min="1" max="10" value="5">
  <button data-action-decrement type="button">−</button>
  <input type="number" />
  <button data-action-increment type="button">+</button>
</quantity-input>

<!-- With custom icons -->
<quantity-input min="0" max="100" value="50">
  <button data-action-decrement type="button">
    <svg><!-- your minus icon --></svg>
  </button>
  <input type="number" />
  <button data-action-increment type="button">
    <svg><!-- your plus icon --></svg>
  </button>
</quantity-input>

<!-- Stepping by 5, clamped at 50 -->
<quantity-input min="0" max="50" value="10" step="5">
  <button data-action-decrement type="button">−</button>
  <input type="number" />
  <button data-action-increment type="button">+</button>
</quantity-input>

<!-- Disabled: buttons and input are inert -->
<quantity-input min="1" max="10" value="3" disabled>
  <button data-action-decrement type="button">−</button>
  <input type="number" />
  <button data-action-increment type="button">+</button>
</quantity-input>
```

Note: The `value` attribute on the inner `<input>` is optional and will be overwritten by the component. Set the value on the `<quantity-input>` element instead.

## How It Works

The quantity input component provides three ways to modify quantities:

- **Decrement button**: Reduces quantity by `step` (respects min value)
- **Increment button**: Increases quantity by `step` (respects max value)
- **Direct input**: Users can type quantities directly (automatically clamped to min/max)

The component emits `quantity-input:change` events when the value changes, allowing parent components to react to quantity updates.

## Configuration

### Attributes

| Attribute  | Description                                             | Default | Required |
| ---------- | ------------------------------------------------------- | ------- | -------- |
| `min`      | Minimum allowed quantity (`0` is allowed)               | 1       | No       |
| `max`      | Maximum allowed quantity                                | none    | No       |
| `value`    | Initial/current quantity value                          | `min`   | No       |
| `step`     | Amount each button press adds or subtracts              | 1       | No       |
| `disabled` | Disables both buttons and the input; blocks all changes | absent  | No       |

**Zero is a real value.** `min="0"` and `value="0"` round-trip exactly — a cart
stepper can be decremented all the way to `0`. When the `value` attribute is
absent (or non-numeric), the component starts at the current `min`.

**`step`** must be a positive integer. Decimals are truncated (`step="2.7"` →
`2`, the same `parseInt` semantics `min`/`max`/`value` use) and `0`, negatives
and non-numeric junk all fall back to `1`. Values stay integers — there is no
decimal mode. Clamping is applied after stepping, so a step that would overshoot
`min`/`max` lands exactly on the bound.

**`disabled`** is observed and reflected (`el.disabled = true` sets the
attribute, and removing the attribute clears the property). While it is set, the
increment/decrement handlers and the typed-value commit all no-op.

**The component owns `disabled` on the decrement/increment buttons and the
input:** host `disabled` disables all three, and the buttons are additionally
disabled at `min`/`max` — the decrement button at the minimum, the increment
button at the maximum. That state is recomputed on every sync (connect, any
observed attribute change, and every committed value), so a `disabled` you put
on one of those elements yourself is not preserved — set it on the
`<quantity-input>` host instead.

### Events

| Event Name              | Description                     | Detail Properties |
| ----------------------- | ------------------------------- | ----------------- |
| `quantity-input:change` | Triggered when quantity changes | `{ value }`       |

The event bubbles and fires **only on real user changes** (a button press, or a
typed value committed on `change`/Enter). Writing the value programmatically —
`el.value = 5`, or `setAttribute('value', '5')` — updates the input but
dispatches nothing, so a framework wrapper can push state down without an echo
loop.

### Input behavior

- Typed values are clamped to `min`/`max` on commit.
- An empty or non-numeric entry (e.g. `abc`) snaps the field back to the current
  value on commit rather than staying dirty.
- Pressing Enter commits the value and does **not** submit an enclosing `<form>`.

### Required Markup

Your markup inside the component must include:

| Element | Selector | Description |
| ------- | -------- | ----------- |
| Decrement button | `[data-action-decrement]` | Button to decrease value |
| Increment button | `[data-action-increment]` | Button to increase value |
| Input field | `input` | Number input for the quantity |

## Customization

### Styling

The component provides complete styling control. Style the content elements however you like:

```css
/* Basic styling (uses rems for scalability) */
quantity-input {
  display: inline-flex;
  border: 1px solid #ccc;
  border-radius: 0.25rem;
  overflow: hidden;
  width: 7rem;
  height: 2.5rem;
}

quantity-input button {
  flex-shrink: 0;
  width: 2rem;
  height: 100%;
  background: #f8f9fa;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1rem;
}

quantity-input button:hover {
  background: #e9ecef;
}

quantity-input input {
  flex: 1;
  min-width: 0;
  height: 100%;
  border: none;
  text-align: center;
  font-size: 1rem;
  padding: 0 0.25rem;
}
```

### JavaScript API

#### Properties

- `min`: Get/set the minimum allowed value (`0` is valid)
- `max`: Get/set the maximum allowed value (`null` removes the ceiling)
- `value`: Get/set the current quantity value
- `step`: Get/set the button step (positive integer, default 1)
- `disabled`: Get/set the disabled state (reflected to the `disabled` attribute)

#### Events

The component emits custom events that bubble up for parent components to handle:

**`quantity-input:change`**

- Triggered when quantity value changes via buttons or direct input
- `event.detail`: `{ value }`
- Never dispatched for programmatic writes (`el.value = n`, `setAttribute`)

#### Programmatic Control

```javascript
const quantityInput = document.querySelector('quantity-input');

// Set values programmatically
quantityInput.value = 5;
quantityInput.min = 1;
quantityInput.max = 20;

// Get current values
console.log(quantityInput.value); // 5
console.log(quantityInput.min); // 1
console.log(quantityInput.max); // 20

// Listen for changes
document.addEventListener('quantity-input:change', (e) => {
  console.log('Quantity changed to:', e.detail.value);
});
```

## Integration Examples

### Shopify Cart Integration

```javascript
// Example cart quantity management
class CartManager {
  constructor() {
    document.addEventListener('quantity-input:change', this.handleQuantityChange.bind(this));
  }

  async handleQuantityChange(e) {
    const newQuantity = e.detail.value;
    const cartItem = e.target.closest('[data-line-item-key]');
    const lineItemKey = cartItem.dataset.lineItemKey;

    try {
      // Update Shopify cart
      const response = await fetch('/cart/change.js', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: lineItemKey,
          quantity: newQuantity,
        }),
      });

      const cart = await response.json();
      this.updateCartDisplay(cart);
    } catch (error) {
      console.error('Failed to update cart:', error);
    }
  }

  updateCartDisplay(cart) {
    // Update cart totals, item counts, etc.
  }
}

new CartManager();
```

### HTML Structure for Shopify

```html
<div data-line-item-key="40123456789:abc123">
  <div class="product-info">
    <h4>Awesome T-Shirt</h4>
    <div class="price">$29.99</div>
  </div>

  <quantity-input min="1" max="10" value="2">
    <button data-action-decrement type="button">−</button>
    <input type="number" />
    <button data-action-increment type="button">+</button>
  </quantity-input>

  <div class="line-total">$59.98</div>
</div>
```

### React Integration

```jsx
import '@magic-spells/quantity-input';

function ProductQuantity({ min = 1, max = 99, value = 1, onChange }) {
  const handleQuantityChange = (e) => {
    onChange(e.detail.value);
  };

  return (
    <quantity-input
      min={min}
      max={max}
      value={value}
      onQuantity-inputChange={handleQuantityChange}
    >
      <button data-action-decrement type="button">−</button>
      <input type="number" />
      <button data-action-increment type="button">+</button>
    </quantity-input>
  );
}
```

### Vue Integration

```vue
<template>
  <quantity-input
    :min="min"
    :max="max"
    :value="quantity"
    @quantity-input:change="handleQuantityChange"
  >
    <button data-action-decrement type="button">−</button>
    <input type="number" />
    <button data-action-increment type="button">+</button>
  </quantity-input>
</template>

<script>
import '@magic-spells/quantity-input';

export default {
  props: {
    min: { type: Number, default: 1 },
    max: { type: Number, default: 99 },
    quantity: { type: Number, default: 1 },
  },
  methods: {
    handleQuantityChange(e) {
      this.$emit('update:quantity', e.detail.value);
    },
  },
};
</script>
```

## Browser Support

- Chrome 54+
- Firefox 63+
- Safari 10.1+
- Edge 79+

All modern browsers with Web Components support.

## License

MIT
