const productCards = document.querySelectorAll(".product-card");

// Create arrays for the first, second, and third buttons
const quickAddToCartButtons = Array.from(productCards).map(card => card.querySelector('button:nth-child(1)'));
const loveButtons = Array.from(productCards).map(card => card.querySelector('button:nth-child(2)'));
const quickViewButtons = Array.from(productCards).map(card => card.querySelector('button:nth-child(3)'));

// love products
loveButtons.forEach(btn=>{
    btn.addEventListener("click", ()=>{
        // Check if the button has a specific class and toggle between classes
        if (btn.classList.contains("btn-outline-light")) {
            // liked
            btn.classList.remove("btn-outline-light");
            btn.classList.add("btn-light");
        } else if(btn.classList.contains("btn-light")) {
            //disliked
            btn.classList.remove("btn-light");
            btn.classList.add("btn-outline-light");
        }
    })
})