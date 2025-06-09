var cart = [];

function loadCart() {
    const savedCart = localStorage.getItem('shopping_cart');
    if (savedCart) {
        cart = JSON.parse(savedCart);
    }
}

function saveCart() {
    localStorage.setItem('shopping_cart', JSON.stringify(cart));
}

function addToCart(productName, price) {
    const existingProduct = cart.find(item => item.name === productName);
    
    if (existingProduct) {
        existingProduct.quantity += 1;
    } else {
        cart.push({
            name: productName,
            price: price,
            quantity: 1
        });
    }
    
    saveCart();
    updateCartCount();
    alert(productName + ' added to cart!');
}

function updateCartCount() {
    const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
    const cartCountElement = document.getElementById('cart-item-count');
    if (cartCountElement) {
        cartCountElement.textContent = totalItems;
    }
}

function removeFromCart(index) {
    cart.splice(index, 1);
    saveCart();
    updateCartCount();
    showCart();
}

function updateQuantity(index, newQuantity) {
    if (newQuantity <= 0) {
        removeFromCart(index);
        return;
    }
    cart[index].quantity = newQuantity;
    saveCart();
    updateCartCount();
    showCart();
}

function clearCart() {
    if (confirm('Are you sure you want to clear your cart?')) {
        cart = [];
        saveCart();
        updateCartCount();
        showCart();
    }
}

function showCart() {
    const container = document.querySelector('.cart-items-container');
    if (!container) return;

    if (cart.length === 0) {
        container.innerHTML = `
            <div class="text-center py-5">
                <i class="fas fa-shopping-cart" style="font-size: 4rem; color: #e0e0e0; margin-bottom: 20px;"></i>
                <h3>Your cart is empty</h3>
                <p>Looks like you haven't added any items to your cart yet.</p>
                <a href="#products" class="btn btn-primary mt-3">Browse Products</a>
            </div>
        `;
    } else {
        let cartHTML = `
            <div class="cart-header">
                <div class="row">
                    <div class="col-md-6"><h3>Product</h3></div>
                    <div class="col-md-2 text-center"><h3>Price</h3></div>
                    <div class="col-md-2 text-center"><h3>Quantity</h3></div>
                    <div class="col-md-2 text-center"><h3>Total</h3></div>
                </div>
            </div>
        `;

        cart.forEach((item, index) => {
            const itemTotal = (item.price * item.quantity).toFixed(2);
            cartHTML += `
                <div class="cart-item">
                    <div class="row align-items-center">
                        <div class="col-md-6">
                            <div class="d-flex align-items-center">
                                <div style="width: 80px; height: 80px; background: #f0f0f0; margin-right: 15px; border-radius: 5px;"></div>
                                <div>
                                    <h4>${item.name}</h4>
                                    <p>Gaming PC</p>
                                    <button class="btn btn-link p-0" onclick="removeFromCart(${index})">Remove</button>
                                </div>
                            </div>
                        </div>
                        <div class="col-md-2 text-center">$${item.price.toFixed(2)}</div>
                        <div class="col-md-2 text-center">
                            <div class="d-flex justify-content-center align-items-center">
                                <button class="btn btn-sm btn-outline-secondary" onclick="updateQuantity(${index}, ${item.quantity - 1})">-</button>
                                <span class="mx-2">${item.quantity}</span>
                                <button class="btn btn-sm btn-outline-secondary" onclick="updateQuantity(${index}, ${item.quantity + 1})">+</button>
                            </div>
                        </div>
                        <div class="col-md-2 text-center">$${itemTotal}</div>
                    </div>
                </div>
            `;
        });

        cartHTML += `
            <div class="cart-actions mt-4">
                <div class="row">
                    <div class="col-md-6">
                        <a href="#products" class="btn btn-outline-primary">Continue Shopping</a>
                    </div>
                    <div class="col-md-6 text-end">
                        <button onclick="clearCart()" class="btn btn-outline-danger">Clear Cart</button>
                    </div>
                </div>
            </div>
        `;

        container.innerHTML = cartHTML;
    }

    updateSummary();
}

function updateSummary() {
    const subtotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
    const shipping = subtotal > 100 ? 0 : 25;
    const tax = subtotal * 0.08;
    const total = subtotal + shipping + tax;

    const elements = {
        'cart-subtotal': `$${subtotal.toFixed(2)}`,
        'cart-shipping': shipping === 0 ? 'FREE' : `$${shipping.toFixed(2)}`,
        'cart-tax': `$${tax.toFixed(2)}`,
        'cart-total': `$${total.toFixed(2)}`
    };

    Object.keys(elements).forEach(id => {
        const element = document.getElementById(id);
        if (element) element.textContent = elements[id];
    });
}

$(document).ready(function() {
    loadCart();
    updateCartCount();
});

$(window).on('hashchange', function() {
    if (window.location.hash === '#cart') {
        setTimeout(showCart, 100);
    }
});

if (window.location.hash === '#cart') {
    setTimeout(showCart, 100);
}