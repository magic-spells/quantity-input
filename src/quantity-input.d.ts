declare class QuantityInput extends HTMLElement {
  /** Minimum allowed value (default: 1). `0` is a valid minimum. */
  min: number;
  /** Maximum allowed value (default: null/unlimited) */
  max: number | null;
  /** Current quantity value (defaults to the current `min`) */
  value: number;
  /** Amount each button press adds or subtracts (default: 1, positive integer) */
  step: number;
  /**
   * When true, both buttons and the input are disabled and every handler no-ops.
   *
   * The component owns the `disabled` state of the decrement button, the
   * increment button and the input: host `disabled` disables all three, and the
   * buttons are additionally disabled at `min` / `max`. A `disabled` the author
   * puts on those elements is not preserved.
   */
  disabled: boolean;
  /** Bound event handlers */
  handlers: {
    decrement: () => void;
    increment: () => void;
    inputChange: (e: Event) => void;
    inputKeydown: (e: KeyboardEvent) => void;
  };
}

export default QuantityInput;

declare global {
  interface HTMLElementTagNameMap {
    'quantity-input': QuantityInput;
  }
  interface HTMLElementEventMap {
    'quantity-input:change': CustomEvent<{ value: number }>;
  }
}
