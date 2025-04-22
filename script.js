document.addEventListener('DOMContentLoaded', () => {

    // === Menu & Search Toggle ===
    const menuBtn = document.querySelector('#menu-btn');
    const navbar = document.querySelector('.navbar');
    const searchBtn = document.querySelector('#search-btn');
    const searchForm = document.querySelector('.search-form');

    menuBtn.addEventListener('click', () => {
        navbar.classList.toggle('active');
        searchForm.classList.remove('active');
    });

    searchBtn.addEventListener('click', () => {
        searchForm.classList.toggle('active');
        navbar.classList.remove('active');
    });

    window.addEventListener('scroll', () => {
        navbar.classList.remove('active');
        searchForm.classList.remove('active');
    });

    // === Cart Logic ===
    const cartModal = document.getElementById('cart-modal');
    const cartBtn = document.getElementById('cart-btn');
    const closeCartBtn = document.getElementById('close-cart');
    const checkoutBtn = document.getElementById('checkout-btn');
    const cartItemsContainer = document.getElementById('cart-items');
    const cartTotal = document.getElementById('cart-total');
    const cartCount = document.getElementById('cart-count');
    const toastMessage = document.getElementById('toast-message');

    let cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];

    cartBtn.addEventListener('click', () => {
        cartModal.classList.add('active');
    });

    closeCartBtn.addEventListener('click', () => {
        cartModal.classList.remove('active');
    });

    function addToCart(name, price, size, addons) {
        const existingItem = cartItems.find(item =>
            item.name === name &&
            item.size === size &&
            JSON.stringify(item.addons) === JSON.stringify(addons)
        );

        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            cartItems.push({ name, price, size, addons, quantity: 1 });
        }

        updateCart();
        localStorage.setItem('cartItems', JSON.stringify(cartItems));
    }

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
                    <span class="item-name">${item.name} (${item.size})</span>
                    <span class="item-price">₱${itemTotal.toFixed(2)}</span>
                </div>
                <div class="item-controls">
                    <button class="decrease-item" data-index="${index}">−</button>
                    <span class="item-qty">${item.quantity}</span>
                    <button class="increase-item" data-index="${index}">+</button>
                    <button class="remove-item" data-index="${index}">Remove</button>
                </div>
                <div class="addons">
                    Add-ons: ${item.addons.length > 0 ? item.addons.join(', ') : 'None'}
                </div>
            `;

            cartItemsContainer.appendChild(div);
        });

        cartTotal.textContent = total.toFixed(2);
        cartCount.textContent = cartItems.reduce((sum, item) => sum + item.quantity, 0);

        // ✅ Save total price in localStorage
        localStorage.setItem('totalPrice', total.toFixed(2));

        const summaryBox = document.getElementById('payment-summary');
        if (summaryBox) {
            const downpayment = total * 0.5;
            summaryBox.innerHTML = `
                <div>Total Amount: ₱${total.toFixed(2)}</div>
                <div>50% Downpayment Required: ₱${downpayment.toFixed(2)}</div>
            `;
        }
    }

    cartItemsContainer.addEventListener('click', (e) => {
        const index = e.target.getAttribute('data-index');
        if (e.target.classList.contains('remove-item')) {
            cartItems.splice(index, 1);
        }
        if (e.target.classList.contains('decrease-item')) {
            if (cartItems[index].quantity > 1) {
                cartItems[index].quantity -= 1;
            } else {
                cartItems.splice(index, 1);
            }
        }
        if (e.target.classList.contains('increase-item')) {
            cartItems[index].quantity += 1;
        }

        updateCart();
        localStorage.setItem('cartItems', JSON.stringify(cartItems));
    });

    checkoutBtn.addEventListener('click', () => {
        if (cartItems.length === 0) {
            showToast("Your cart is empty!");
        } else {
            window.location.href = 'checkout.html';
        }
    });

    function showToast(message) {
        toastMessage.textContent = message;
        toastMessage.classList.add('show-toast');
        setTimeout(() => {
            toastMessage.classList.remove('show-toast');
        }, 3000);
    }

    document.querySelectorAll('.add-to-cart').forEach(button => {
        button.addEventListener('click', () => {
            const box = button.closest('.box');
            const productName = button.dataset.name;

            const sizeSelect = box.querySelector('.product-size');
            const selectedSize = sizeSelect.options[sizeSelect.selectedIndex];
            const size = selectedSize.value;
            const sizePrice = parseFloat(selectedSize.dataset.price);

            const selectedAddons = [];
            const addonsSelect = box.querySelector('.product-addon');
            const selectedAddon = addonsSelect.options[addonsSelect.selectedIndex];
            if (selectedAddon.value) {
                selectedAddons.push(selectedAddon.value.split('|')[0]);
            }
            const addonsPrice = selectedAddons.length > 0 ? parseFloat(selectedAddon.dataset.price) : 0;

            const total = sizePrice + addonsPrice;

            addToCart(productName, total, size, selectedAddons);

            alert(`🛒 "${productName}" added to cart!\nSize: ${size}\nAdd-ons: ${selectedAddons.join(', ') || 'None'}\nTotal: ₱${total}`);
        });
    });

    updateCart();

    // === Product Search ===
    const searchInput = document.querySelector('#search-input');
    const productBoxes = document.querySelectorAll('.box');

    if (searchInput) {
        searchInput.addEventListener('input', () => {
            const query = searchInput.value.toLowerCase();

            productBoxes.forEach(box => {
                const name = box.dataset.name.toLowerCase();
                if (name.includes(query)) {
                    box.style.display = 'block';
                } else {
                    box.style.display = 'none';
                }
            });
        });
    }
});
