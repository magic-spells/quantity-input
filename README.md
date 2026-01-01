# Quantity Input Web Component

A professional, highly-customizable Web Component for creating intuitive quantity input controls in e-commerce applications. Features increment/decrement buttons with an input field, perfect for shopping carts, product quantities, and any numeric input scenarios.

[**Live Demo**](https://magic-spells.github.io/quantity-input/demo/)

## Features

- **Full markup control** - You provide the HTML structure and icons
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
```

Or include directly in your HTML:

```html
<script src="https://unpkg.com/@magic-spells/quantity-input"></script>
```

## Usage

You provide your own markup inside the component. The component looks for:
- A button with `data-action-decrement` for the minus button
- A button with `data-action-increment` for the plus button
- An `input` element for the quantity value

```html
<!-- Basic usage -->
<quantity-input>
  <button data-action-decrement type="button">−</button>
  <input type="number" value="1" />
  <button data-action-increment type="button">+</button>
</quantity-input>

<!-- With custom min/max/value -->
<quantity-input min="1" max="10" value="5">
  <button data-action-decrement type="button">−</button>
  <input type="number" value="5" />
  <button data-action-increment type="button">+</button>
</quantity-input>

<!-- With custom icons -->
<quantity-input min="0" max="100" value="50">
  <button data-action-decrement type="button">
    <svg><!-- your minus icon --></svg>
  </button>
  <input type="number" value="50" />
  <button data-action-increment type="button">
    <svg><!-- your plus icon --></svg>
  </button>
</quantity-input>
```

## How It Works

The quantity input component provides three ways to modify quantities:

- **Decrement button**: Reduces quantity by 1 (respects min value)
- **Increment button**: Increases quantity by 1 (respects max value)
- **Direct input**: Users can type quantities directly (automatically clamped to min/max)

The component emits `quantity-input:change` events when the value changes, allowing parent components to react to quantity updates.

## Configuration

### Attributes

| Attribute | Description                    | Default | Required |
| --------- | ------------------------------ | ------- | -------- |
| `min`     | Minimum allowed quantity       | 1       | No       |
| `max`     | Maximum allowed quantity       | none    | No       |
| `value`   | Initial/current quantity value | 1       | No       |

### Events

| Event Name            | Description                     | Detail Properties |
| --------------------- | ------------------------------- | ----------------- |
| `quantity-input:change` | Triggered when quantity changes | `{ value }`       |

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
/* Basic styling */
quantity-input {
  display: inline-flex;
  align-items: center;
  border: 1px solid #ccc;
  border-radius: 4px;
  overflow: hidden;
}

quantity-input button {
  background: #f8f9fa;
  border: none;
  padding: 8px 12px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
}

quantity-input button:hover {
  background: #e9ecef;
}

quantity-input input {
  border: none;
  padding: 8px 12px;
  text-align: center;
  width: 60px;
  font-size: 14px;
}
```

### JavaScript API

#### Properties

- `min`: Get/set the minimum allowed value
- `max`: Get/set the maximum allowed value
- `value`: Get/set the current quantity value

#### Events

The component emits custom events that bubble up for parent components to handle:

**`quantity-input:change`**

- Triggered when quantity value changes via buttons or direct input
- `event.detail`: `{ value }`

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
    <input type="number" value="2" />
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
      <input type="number" defaultValue={value} />
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
    <input type="number" :value="quantity" />
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
