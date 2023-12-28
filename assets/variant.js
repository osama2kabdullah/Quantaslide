class VariantSelects extends HTMLElement {
  constructor() {
    super();
    this.addEventListener("change", this.onVariantChange);
  }

  onVariantChange() {
    this.updateOptions();
    this.updateMasterId();
    this.toggleAddButton(true, "", false);
    if (!this.currentVariant) {
      this.toggleAddButton(true, "", true);
      this.setUnavailable();
    } else {
      this.updateURL();
      this.updateQuantityInput();
      this.upadateVariantId();
      this.renderProductInfo();
    }
  }

  upadateVariantId() {
    const variantInput = document
      .getElementById(`product-form-${this.dataset.section}`)
      ?.querySelector('[name="id"]');
    if (!variantInput) return;
    variantInput.value = this.currentVariant.id;
  }

  setUnavailable() {
    const addButton = document
      .getElementById(`product-form-${this.dataset.section}`)
      ?.querySelector('[name="add"]');
    if (!addButton) return;
    addButton.innerHTML = window.variantStrings.unavailable;
    document
      .getElementById(`price-${this.dataset.section}`)
      ?.classList.add("d-none");
  }

  renderProductInfo() {
    fetch(
      `${this.dataset.url}?variant=${this.currentVariant.id}&section_id=${this.dataset.section}`
    )
      .then((response) => response.text())
      .then((responseText) => {
        const id = `price-${this.dataset.section}`;
        const mediaId = `media-section-${this.dataset.section}`;
        const html = new DOMParser().parseFromString(responseText, "text/html");
        const destination = document.getElementById(id);
        const source = html.getElementById(id);

        if (source && destination) destination.innerHTML = source.innerHTML;
        document
          .getElementById(`price-${this.dataset.section}`)
          ?.classList.remove("d-none");

        // update media
        const mediaDestination = document.getElementById(mediaId);
        const mediaSorce = html.getElementById(mediaId);
        if (mediaSorce && mediaDestination) {
          mediaDestination.innerHTML = mediaSorce.innerHTML;
        }

        this.toggleAddButton(
          !this.currentVariant.available,
          window.variantStrings.soldOut
        );
      });
  }

  updateQuantityInput() {
    const quantityInput = document.getElementById(
      `quantity-input-${this.dataset.section}`
    );
    if (!quantityInput || !this.currentVariant.quantity_rule) {
      return;
    }
    const { min, max, increment } = this.currentVariant.quantity_rule;
    if (min) {
      quantityInput.setAttribute("min", min);
      quantityInput.value = Math.max(quantityInput.value, min);
    }
    if (max) {
      quantityInput.setAttribute("max", max);
      quantityInput.value = Math.min(quantityInput.value, max);
    }
    if (increment) {
      quantityInput.setAttribute("step", increment);
    }
  }

  updateURL() {
    const url = window.location.href;
    const urlObject = new URL(url);
    const variantId = this.currentVariant.id;
    urlObject.searchParams.set("variant", variantId);
    const newUrl = `${urlObject.origin}${urlObject.pathname}${urlObject.search}${urlObject.hash}`;
    window.history.replaceState({}, "", newUrl);
  }

  toggleAddButton(disable = true, text, modifyClass = true) {
    const addButton = document
      .getElementById(`product-form-${this.dataset.section}`)
      ?.querySelector('[name="add"]');

    const buyNowButton = document
      .getElementById(`product-form-${this.dataset.section}`)
      ?.querySelector(".buy-it-now-btn");

    if (!addButton) return;

    if (disable) {
      addButton.setAttribute("disabled", true);
      if (text) addButton.innerHTML = text;
      buyNowButton.classList.add("disabled");
    } else {
      addButton.removeAttribute("disabled");
      addButton.innerHTML = window.variantStrings.addToCart;
      buyNowButton.classList.remove("disabled");
    }

    if (!modifyClass) return;
  }

  updateMasterId() {
    this.currentVariant = this.getVariantData().find((variant) => {
      return !variant.options
        .map((option, index) => {
          return this.options[index] === option;
        })
        .includes(false);
    });
  }

  updateOptions() {
    this.options = Array.from(
      this.querySelectorAll('input[type="radio"]'),
      (radio) => radio.value
    );
  }

  getVariantData() {
    this.variantData =
      this.variantData ||
      JSON.parse(this.querySelector('[type="application/json"]').textContent);
    return this.variantData;
  }
}
class VarinatPicker extends VariantSelects {
  constructor() {
    super();
  }

  updateOptions() {
    // gettings the selecte options
    const fieldsets = Array.from(this.querySelectorAll("fieldset"));
    this.options = fieldsets.map((fieldset) => {
      return Array.from(fieldset.querySelectorAll("input")).find(
        (radio) => radio.checked
      ).value;
    });
  }
}
customElements.define("varinat-picker", VarinatPicker);
// ------ynamic check out btn-----
class ProductForm extends HTMLElement {
  constructor() {
    super();
  }
  connectedCallback() {
    this.buyNowButton = this.querySelector(".buy-it-now-btn");
    this.shopifyBuyNowBtn = this.querySelector(
      ".shopify-payment-button__button"
    );
    if (this.buyNowButton) {
      this.buyNowButton.addEventListener("click", () => {
        this.buyNow();
      });
    }
  }
  buyNow() {
    this.shopifyBuyNowBtn.click();
  }
}
customElements.define("product-form", ProductForm);
