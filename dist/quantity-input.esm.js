class QuantityInput extends HTMLElement {
  static #stylesInjected = false;
  static observedAttributes = ['min', 'max', 'value', 'step', 'disabled'];
  #elements = {};

  constructor() {
    super();
    const _ = this;
    _.handlers = {
      decrement: () => _.#handleStep(-1),
      increment: () => _.#handleStep(1),
      inputChange: (e) => _.#handleInputChange(e),
      inputKeydown: (e) => _.#handleKeydown(e),
    };
    QuantityInput.#injectStyles();
  }

  static #injectStyles() {
    if (QuantityInput.#stylesInjected) return;
    const style = document.createElement('style');
    style.textContent = `
      quantity-input input::-webkit-outer-spin-button,
      quantity-input input::-webkit-inner-spin-button { -webkit-appearance: none; margin: 0; }
      quantity-input input[type="number"] { -moz-appearance: textfield; }
    `;
    document.head.appendChild(style);
    QuantityInput.#stylesInjected = true;
  }

  connectedCallback() {
    const _ = this;
    _.#elements = {
      dec: _.querySelector('[data-action-decrement]'),
      inc: _.querySelector('[data-action-increment]'),
      input: _.querySelector('input'),
    };
    _.#syncInput();
    _.#toggleListeners(true);
  }

  disconnectedCallback() { this.#toggleListeners(false); }
  attributeChangedCallback(_, o, n) { if (o !== n) this.#syncInput(); }

  // Integer parse that treats 0 as a real value. `parseInt(x) || fallback` would
  // silently turn min="0" / value="0" into the fallback — a cart stepper has to
  // be able to reach zero.
  static #int(raw, fallback) {
    const n = parseInt(raw, 10);
    return Number.isFinite(n) ? n : fallback;
  }

  // Every setter treats null/undefined as "remove the attribute" so the getter
  // falls back to its default instead of parsing the string "undefined".
  get min() { return QuantityInput.#int(this.getAttribute('min'), 1); }
  set min(v) { v == null ? this.removeAttribute('min') : this.setAttribute('min', v); }
  get max() { return QuantityInput.#int(this.getAttribute('max'), null); }
  set max(v) { v == null ? this.removeAttribute('max') : this.setAttribute('max', v); }
  // No value attribute (or a non-numeric one) means "start at the minimum".
  get value() { return QuantityInput.#int(this.getAttribute('value'), this.min); }
  set value(v) { v == null ? this.removeAttribute('value') : this.setAttribute('value', v); }
  // Positive integer only; decimals truncate (parseInt, like min/max/value) and
  // 0, negatives and junk all fall back to 1.
  get step() { const n = QuantityInput.#int(this.getAttribute('step'), 1); return n > 0 ? n : 1; }
  set step(v) { v == null ? this.removeAttribute('step') : this.setAttribute('step', v); }
  get disabled() { return this.hasAttribute('disabled'); }
  set disabled(v) { v ? this.setAttribute('disabled', '') : this.removeAttribute('disabled'); }

  #toggleListeners(add) {
    const _ = this, method = add ? 'addEventListener' : 'removeEventListener';
    _.#elements.dec?.[method]('click', _.handlers.decrement);
    _.#elements.inc?.[method]('click', _.handlers.increment);
    _.#elements.input?.[method]('change', _.handlers.inputChange);
    _.#elements.input?.[method]('keydown', _.handlers.inputKeydown);
  }

  #clamp(v) {
    const { min, max } = this;
    return max !== null ? Math.max(min, Math.min(v, max)) : Math.max(min, v);
  }

  #handleStep(direction) {
    if (this.disabled) return;
    this.#updateValue(this.#clamp(this.value + direction * this.step));
  }

  // Enter would implicitly submit an enclosing form (navigating the page, or closing
  // a <dialog>), so swallow it and commit the value instead. A change event that
  // follows is a no-op: #updateValue bails when the value is already current.
  #handleKeydown(e) {
    if (this.disabled || e.key !== 'Enter' || e.isComposing) return;
    e.preventDefault();
    this.#handleInputChange(e);
  }

  #handleInputChange(e) {
    if (this.disabled) return;
    const v = parseInt(e.target.value, 10);
    // Empty or junk: snap the field back to the committed value rather than
    // leaving a dirty input that disagrees with this.value.
    if (!Number.isFinite(v)) {
      e.target.value = this.value;
      return;
    }
    const clamped = this.#clamp(v);
    if (clamped !== v) e.target.value = clamped;
    this.#updateValue(clamped);
  }

  #updateValue(v) {
    if (v === this.value) return;
    this.value = v;
    this.#syncInput();
    this.dispatchEvent(new CustomEvent('quantity-input:change', { detail: { value: v }, bubbles: true }));
  }

  // The component OWNS the disabled state of the three controls — an author's own
  // `disabled` on a button is not preserved. Host `disabled` disables all three;
  // beyond that each button is disabled at its bound, recomputed from the clamped
  // value on every sync (connect, any observed attribute change, and #updateValue).
  #syncInput() {
    const { dec, inc, input } = this.#elements;
    const { disabled, min, max } = this;
    const value = this.#clamp(this.value);
    if (dec) dec.disabled = disabled || value <= min;
    if (inc) inc.disabled = disabled || (max !== null && value >= max);
    if (!input) return;
    input.disabled = disabled;
    Object.assign(input, { type: 'number', inputMode: 'numeric', pattern: '[0-9]*', value, min });
    max !== null ? (input.max = max) : input.removeAttribute('max');
  }
}

customElements.define('quantity-input', QuantityInput);

export { QuantityInput as default };
//# sourceMappingURL=quantity-input.esm.js.map
