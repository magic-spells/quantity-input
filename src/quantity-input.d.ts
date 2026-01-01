declare class QuantityInput extends HTMLElement {
  /** Minimum allowed value (default: 1) */
  min: number;
  /** Maximum allowed value (default: null/unlimited) */
  max: number | null;
  /** Current quantity value (default: 1) */
  value: number;
  /** Bound event handlers */
  handlers: {
    decrement: () => void;
    increment: () => void;
    inputChange: (e: Event) => void;
  };
}

export default QuantityInput;

declare global {
  interface HTMLElementTagNameMap {
    'quantity-input': QuantityInput;
  }
}
