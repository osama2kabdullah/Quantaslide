var Shopify = Shopify || {};
// ---------------------------------------------------------------------------
// Money format handler
// ---------------------------------------------------------------------------
Shopify.money_format = moneyFormat; // "moneyFormat" assined in `theme.liquid` file
Shopify.formatMoney = function (cents, format) {
  if (typeof cents == "string") {
    cents = cents.replace(".", "");
  }
  var value = "";
  var placeholderRegex = /\{\{\s*(\w+)\s*\}\}/;
  var formatString = format || this.money_format;

  function defaultOption(opt, def) {
    return typeof opt == "undefined" ? def : opt;
  }

  function formatWithDelimiters(number, precision, thousands, decimal) {
    precision = defaultOption(precision, 2);
    thousands = defaultOption(thousands, ",");
    decimal = defaultOption(decimal, ".");

    if (isNaN(number) || number == null) {
      return 0;
    }

    number = (number / 100.0).toFixed(precision);

    var parts = number.split("."),
      dollars = parts[0].replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1" + thousands),
      cents = parts[1] ? decimal + parts[1] : "";

    return dollars + cents;
  }

  switch (formatString.match(placeholderRegex)[1]) {
    case "amount":
      value = formatWithDelimiters(cents, 2);
      break;
    case "amount_no_decimals":
      value = formatWithDelimiters(cents, 0);
      break;
    case "amount_with_comma_separator":
      value = formatWithDelimiters(cents, 2, ".", ",");
      break;
    case "amount_no_decimals_with_comma_separator":
      value = formatWithDelimiters(cents, 0, ".", ",");
      break;
  }

  return formatString.replace(placeholderRegex, value);
};

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
      this.updateURL(matchedVariant);
    }
  }
  updateURL(matchedVariant) {
    // Get the current URL
    const url = window.location.href;
    // Parse the URL
    const urlObject = new URL(url);
    // Your new variant ID
    const variantId = matchedVariant.id;
    // Update or add the 'variant' parameter
    urlObject.searchParams.set("variant", variantId);
    // Construct the new URL with the updated query parameters and existing hash
    const newUrl = `${urlObject.origin}${urlObject.pathname}${urlObject.search}${urlObject.hash}`;
    // Replace the current URL in the browser history
    window.history.replaceState({}, "", newUrl);
  }
  updateImage(matchedVariant) {
    const imagePosition = matchedVariant.featured_image?.position;
    if (imagePosition) {
      this.ProductImageSlider.splide.go(imagePosition - 1);
    }
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
    const price = Shopify.formatMoney(matchedVariant.price);
    const comparePrice = Shopify.formatMoney(matchedVariant.compare_at_price);

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
