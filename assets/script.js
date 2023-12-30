// Copy link function
class CopyButton extends HTMLElement {
  constructor() {
    super();
    this.addEventListener("click", this.onButtonClick);
  }
  toggleButtonVisibility(showBtn, hideBtn) {
    showBtn.classList.remove("d-none", "pointer-events-none");
    showBtn.classList.add("d-block");
    hideBtn.classList.remove("d-block");
    hideBtn.classList.add("d-none", "pointer-events-none");
  }
  copyToClipboard(text) {
    const textarea = document.createElement('textarea');
    textarea.value = text;
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand('copy');
    document.body.removeChild(textarea);
  }
  onButtonClick() {
    const copyBtn = this.querySelector("#copyBtn");
    const checkBtn = this.querySelector("#checkBtn");
    const URL = this.dataset.url;
    this.copyToClipboard(URL);
    this.toggleButtonVisibility(checkBtn, copyBtn);
    setTimeout(() => {
      this.toggleButtonVisibility(copyBtn, checkBtn);
    }, 2000);
  }
}
customElements.define('copy-button', CopyButton);