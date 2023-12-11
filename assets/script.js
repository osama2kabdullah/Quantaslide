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

// Initialize classes
document
  .querySelectorAll(".product-card")
  .forEach((card) => new ProductCard(card));
new ProductImageSlider();
new VariantSelector();
new ProductTabs();
