class ProductCard {
  constructor(card) {
    this.card = card;
    this.quickAddToCartButton = card.querySelector("button:nth-child(1)");
    this.loveButton = card.querySelector("button:nth-child(2)");
    this.quickViewButton = card.querySelector("button:nth-child(3)");

    this.initLoveButton();
  }

  initLoveButton() {
    this.loveButton.addEventListener("click", () => {
      this.toggleLoveButton();
    });
  }

  toggleLoveButton() {
    if (this.loveButton.classList.contains("btn-outline-light")) {
      this.loveButton.classList.remove("btn-outline-light");
      this.loveButton.classList.add("btn-light");
    } else if (this.loveButton.classList.contains("btn-light")) {
      this.loveButton.classList.remove("btn-light");
      this.loveButton.classList.add("btn-outline-light");
    }
  }
}

class ProductImageSlider {
  constructor() {
    this.splide = new Splide("#main-carousel", {
      pagination: false,
    });
    this.thumbnails = document.getElementsByClassName("thumbnail");
    this.current = null;
    this.initSlider();
  }
  initSlider() {
    for (let i = 0; i < this.thumbnails.length; i++) {
      this.initThumbnail(this.thumbnails[i], i);
    }
    this.splide.on("mounted move", () => {
      const thumbnail = this.thumbnails[this.splide.index];
      if (thumbnail) {
        if (this.current) {
          this.current.classList.remove("is-active");
        }
        thumbnail.classList.add("is-active");
        this.current = thumbnail;
      }
    });
    this.splide.mount();
  }
  initThumbnail(thumbnail, index) {
    thumbnail.addEventListener("click", () => {
      this.splide.go(index);
    });
  }
}

class VariantSelector {
  constructor() {
    this.initEventListeners();
  }

  initEventListeners() {
    document.querySelectorAll(".variant-item").forEach((item) => {
      item.addEventListener("click", () => {
        this.handleVariantSelection(item);
      });
    });
  }

  handleVariantSelection(selectedItem) {
    const dataSet = selectedItem.getAttribute("data-set");

    document
      .querySelectorAll(`.variant-item[data-set="${dataSet}"]`)
      .forEach((item) => {
        item.classList.remove("active");
      });

    selectedItem.classList.add("active");
  }
}

class ProductTabs {
  constructor() {
    document.addEventListener("DOMContentLoaded", () => {
      this.initTabs();
    });
  }

  initTabs() {
    const hash = window.location.hash;
    const tabName = hash ? hash.substring(1) : "description";
    this.showTab(tabName);

    const navTabs = document.querySelectorAll(".nav-link");
    navTabs.forEach((navTab) => {
      navTab.addEventListener("click", (event) => {
        event.preventDefault(); // Prevent the default behavior of the anchor tag
        const tabName = event.target.getAttribute("href").substring(1);
        this.showTab(tabName);
        window.location.hash = tabName;
      });
    });
  }

  showTab(tabId) {
    const tabs = document.querySelectorAll(".tab-pane");
    tabs.forEach((tab) => {
      tab.classList.remove("show", "active");
    });

    const selectedTab = document.getElementById(tabId);
    selectedTab.classList.add("show", "active");

    const navTabs = document.querySelectorAll(".nav-link");
    navTabs.forEach((navTab) => {
      navTab.classList.remove("active");
    });

    const selectedNavTab = document.getElementById(tabId + "-tab");
    selectedNavTab.classList.add("active");
  }
}

class VariantSwitch {
  constructor(ProductImageSlider) {
    this.ProductImageSlider = ProductImageSlider;
    // Call the method to initialize the event listener
    this.initEventListener();
  }

  initEventListener() {
    const yourSelectorElement = document.querySelector(
      ".variant-selector-input"
    );

    if (yourSelectorElement) {
      yourSelectorElement.addEventListener("click", () => {
        const variant_id = yourSelectorElement.value;
        const matchedVariant = this.getVariantById(variant_id);
        this.handleVariantSelection(matchedVariant);
      });
    }
  }

  handleVariantSelection(matchedVariant) {
    if (matchedVariant) {
      this.updatePrice(matchedVariant);
      this.updateButtonState(matchedVariant);
      this.updateQuantitySettings(matchedVariant);
      this.updateImage(matchedVariant);
    }
  }

  updateImage(matchedVariant) {
    const imagePosition = matchedVariant.featured_image.position;
    this.ProductImageSlider.splide.go(imagePosition - 1);
  }

  updateQuantitySettings(matchedVariant) {
    const quantityInput = document.querySelector(".product-quantity-input");

    if (!quantityInput || !matchedVariant.quantity_rule) {
      return;
    }

    const { min, max, increment } = matchedVariant.quantity_rule;

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

  updateButtonState(matchedVariant) {
    const addToCartButton = document.querySelector(
      ".product-add-to-cart-button"
    );
    if (matchedVariant.available) {
      // Product is available, enable the button and set text to "Add To Cart"
      addToCartButton.removeAttribute("disabled");
      addToCartButton.innerHTML = "Add To Cart";
    } else {
      // Product is unavailable, disable the button and set text to "Unavailable"
      addToCartButton.setAttribute("disabled", true);
      addToCartButton.textContent = "Unavailable";
    }
  }

  getVariantById(variantId) {
    const variants = product.variants;
    return variants.find((variant) => variant.id === parseInt(variantId));
  }

  updatePrice(matchedVariant) {
    const price = matchedVariant.price;
    const comparePrice = matchedVariant.compare_at_price;

    // Get the existing price elements
    const priceElement = document.querySelector(".prduct-main-price");
    const comparePriceElement = document.querySelector(
      ".compare-at-product-price"
    );

    // Update the regular price
    priceElement.textContent = price;

    // Update or add the compare price
    if (comparePrice > price) {
      if (comparePriceElement) {
        comparePriceElement.textContent = comparePrice;
      } else {
        const newComparePriceElement = document.createElement("span");
        newComparePriceElement.className =
          "text-decoration-line-through compare-at-product-price";
        newComparePriceElement.textContent = comparePrice;
        const priceContainer = priceElement.parentNode;
        priceContainer.insertBefore(newComparePriceElement, priceElement);
      }
    } else {
      // Remove the compare price if it's not greater than the original price
      if (comparePriceElement) {
        comparePriceElement.parentNode.removeChild(comparePriceElement);
      }
    }
  }
}

// Initialize classes
document
  .querySelectorAll(".product-card")
  .forEach((card) => new ProductCard(card));
new VariantSelector();
new ProductTabs();
new ProductImageSlider();
new VariantSwitch(new ProductImageSlider());
