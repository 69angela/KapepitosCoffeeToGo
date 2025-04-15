document.addEventListener('DOMContentLoaded', () => {

    // UI Elements
    const navbar = document.querySelector('.navbar');
    const searchForm = document.querySelector('.search-form');
    const cartModal = document.getElementById('cart-modal');
    const cartBtn = document.getElementById('cart-btn');
    const closeCartBtn = document.getElementById('close-cart');
    const checkoutBtn = document.getElementById('checkout-btn');
    const cartItemsContainer = document.getElementById('cart-items');
    const cartTotal = document.getElementById('cart-total');
    const cartCount = document.getElementById('cart-count');
    const toastMessage = document.getElementById('toast-message'); // Add toast element for confirmation

    // Cart Data
    let cartItems = JSON.parse(localStorage.getItem('cartItems')) || []; // Retrieve cart from localStorage

    // Menu toggle
    document.querySelector('#menu-btn').onclick = () => {
        navbar.classList.toggle('active');
        searchForm.classList.remove('active');
        cartModal.classList.remove('active');
    };

    // Search toggle
    document.querySelector('#search-btn').onclick = () => {
        searchForm.classList.toggle('active');
        navbar.classList.remove('active');
        cartModal.classList.remove('active');
    };


    document.getElementById("search-box").addEventListener("keypress", function (e) {
        if (e.key === "Enter") {
            const searchValue = this.value.toLowerCase();
            const products = document.querySelectorAll(".box");
            let found = false;
    
            products.forEach(function (product) {
                const productName = product.querySelector("h3").textContent.toLowerCase();
    
                if (productName.includes(searchValue)) {
                    product.style.display = "block";
                    if (!found) {
                        product.scrollIntoView({ behavior: "smooth" });
                        found = true;
                    }
                } else {
                    product.style.display = "none";
                }
            });
        }
    });
    





    // Cart toggle
    cartBtn.addEventListener('click', () => {
        cartModal.classList.add('active'); // Add animation on opening
        navbar.classList.remove('active');
        searchForm.classList.remove('active');
    });

    // Close cart modal
    closeCartBtn.addEventListener('click', () => {
        cartModal.classList.remove('active'); // Add animation on closing
    });

    

    // Add item to cart
    function addToCart(name, price) {
        const existingItem = cartItems.find(item => item.name === name);
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            cartItems.push({ name, price, quantity: 1 });
        }
        updateCart();
        localStorage.setItem('cartItems', JSON.stringify(cartItems)); // Save to localStorage
    }

    // Update cart UI
    function updateCart() {
        cartItemsContainer.innerHTML = '';
        let total = 0;

        cartItems.forEach((item, index) => {
            const itemTotal = item.price * item.quantity;
            total += itemTotal;

            const div = document.createElement('div');
            div.className = 'cart-item';
            div.innerHTML = `
         <div class="item-row">
        <span class="item-name">${item.name}</span>
        <span class="item-price">₱${itemTotal.toFixed(2)}</span>
    </div>
    <div class="item-controls">
        <button class="decrease-item" data-index="${index}">−</button>
        <span class="item-qty">${item.quantity}</span>
        <button class="increase-item" data-index="${index}">+</button>
        <button class="remove-item" data-index="${index}">Remove</button>
    </div>
`;

            cartItemsContainer.appendChild(div);
        });

        cartTotal.textContent = total.toFixed(2);
        cartCount.textContent = cartItems.reduce((sum, item) => sum + item.quantity, 0);
    }

    // Remove item from cart
    cartItemsContainer.addEventListener('click', (e) => {
        const index = e.target.getAttribute('data-index');
        if (e.target.classList.contains('remove-item')) {
            const itemName = cartItems[index].name;
            cartItems = cartItems.filter(item => item.name !== itemName); // Remove based on name
        }
        if (e.target.classList.contains('decrease-item')) {
            if (cartItems[index].quantity > 1) {
                cartItems[index].quantity -= 1; // Decrease quantity
            } else {
                cartItems.splice(index, 1); // Remove item if quantity is 1
            }
        }
        if (e.target.classList.contains('increase-item')) {
            cartItems[index].quantity += 1; // Increase quantity
        }

        updateCart();
        localStorage.setItem('cartItems', JSON.stringify(cartItems)); // Save updated cart to localStorage
    });

    // Checkout functionality
    checkoutBtn.addEventListener('click', () => {
        if (cartItems.length === 0) {
            showToast("Your cart is empty!"); // Show toast if cart is empty
        } else {
            showToast("Thank you for your order!"); // Show toast after order
            cartItems = [];
            updateCart();
            localStorage.removeItem('cartItems'); // Clear cart from localStorage
            cartModal.classList.remove('active');
        }
    });

    // Show toast message
    function showToast(message) {
        toastMessage.textContent = message;
        toastMessage.classList.add('show-toast');
        setTimeout(() => {
            toastMessage.classList.remove('show-toast');
        }, 3000);
    }

    // Activate all "Add to Cart" buttons
    document.querySelectorAll('.add-to-cart').forEach(button => {
        button.addEventListener('click', function (e) {
            e.preventDefault(); // ✅ Stop the href="#" from scrolling
    
            const name = this.getAttribute('data-name');
            const price = parseFloat(this.getAttribute('data-price'));
            addToCart(name, price); // ✅ Call the working addToCart function
        });
    });
    

    // Initialize cart on page load
    updateCart();

    
    









});
