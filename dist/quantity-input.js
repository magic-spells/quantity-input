(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.QuantityInput = factory());
})(this, (function () { 'use strict';

  class QuantityInput extends HTMLElement {
    static #stylesInjected = false;
    static observedAttributes = ['min', 'max', 'value'];
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

    get min() { return parseInt(this.getAttribute('min')) || 1; }
    get max() { const v = this.getAttribute('max'); return v !== null ? parseInt(v) : null; }
    get value() { return parseInt(this.getAttribute('value')) || 1; }
    set value(v) { this.setAttribute('value', v); }

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

    #handleStep(delta) { this.#updateValue(this.#clamp(this.value + delta)); }

    // Enter would implicitly submit an enclosing form (navigating the page, or closing
    // a <dialog>), so swallow it and commit the value instead. A change event that
    // follows is a no-op: #updateValue bails when the value is already current.
    #handleKeydown(e) {
      if (e.key !== 'Enter' || e.isComposing) return;
      e.preventDefault();
      this.#handleInputChange(e);
    }

    #handleInputChange(e) {
      const v = parseInt(e.target.value);
      if (isNaN(v)) return;
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

    #syncInput() {
      const { input } = this.#elements;
      if (!input) return;
      const { value, min, max } = this;
      Object.assign(input, { type: 'number', inputMode: 'numeric', pattern: '[0-9]*', value, min });
      max !== null ? (input.max = max) : input.removeAttribute('max');
    }
  }

  customElements.define('quantity-input', QuantityInput);

  return QuantityInput;

}));
//# sourceMappingURL=quantity-input.js.map
