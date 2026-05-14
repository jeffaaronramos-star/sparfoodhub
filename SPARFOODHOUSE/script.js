document.addEventListener('DOMContentLoaded', () => {
    
    // --- 1. LIVE SEARCH FUNCTIONALITY ---
    const searchInput = document.getElementById('search-input');
    const foodCards = document.querySelectorAll('.food-card');

    searchInput.addEventListener('input', (e) => {
        const searchTerm = e.target.value.toLowerCase();
        
        foodCards.forEach(card => {
            const title = card.querySelector('h3').innerText.toLowerCase();
            if (title.includes(searchTerm)) {
                card.style.display = 'flex';
            } else {
                card.style.display = 'none';
            }
        });
    });

    // --- 2. MODAL & NAVIGATION LOGIC ---
    const overlay = document.getElementById('overlay');
    const modals = document.querySelectorAll('.modal');
    const closeBtns = document.querySelectorAll('.close-modal');

    // Nav Links
    const navHome = document.getElementById('nav-home');
    const navAbout = document.getElementById('nav-about');
    const navContact = document.getElementById('nav-contact');
    const cartBtnNav = document.getElementById('cart-btn');

    function openModal(modalId) {
        modals.forEach(m => m.classList.remove('active'));
        document.getElementById(modalId).classList.add('active');
        overlay.classList.add('active');
    }

    function closeAllModals() {
        modals.forEach(m => m.classList.remove('active'));
        overlay.classList.remove('active');
        document.querySelectorAll('.nav-links a').forEach(a => a.classList.remove('active'));
        navHome.classList.add('active');
    }

    // Event Listeners for Nav
    navAbout.addEventListener('click', (e) => { e.preventDefault(); openModal('modal-about'); navAbout.classList.add('active'); });
    navContact.addEventListener('click', (e) => { e.preventDefault(); openModal('modal-contact'); navContact.classList.add('active'); });
    cartBtnNav.addEventListener('click', (e) => { e.preventDefault(); openModal('modal-cart'); });
    navHome.addEventListener('click', (e) => { e.preventDefault(); closeAllModals(); });
    
    closeBtns.forEach(btn => btn.addEventListener('click', closeAllModals));
    overlay.addEventListener('click', closeAllModals);

    // --- 3. FOOD DETAIL MODAL (Image Click) ---
    const foodImages = document.querySelectorAll('.food-img');
    foodImages.forEach(img => {
        img.addEventListener('click', (e) => {
            const card = e.target.closest('.food-card');
            const title = card.querySelector('h3').innerText;
            const desc = card.querySelector('p').innerText;
            const price = card.querySelector('.price').innerText;
            const imgSrc = e.target.src;

            // Populate the Detail Modal
            document.getElementById('detail-img').src = imgSrc;
            document.getElementById('detail-title').innerText = title;
            document.getElementById('detail-desc').innerText = desc;
            document.getElementById('detail-price').innerText = price;

            openModal('modal-detail');
        });
    });


    // --- 4. UPGRADED ORDER SYSTEM (SHOPPING CART & RECEIPT) ---
    let cart = [];
    const cartCountElement = document.getElementById('cart-count');
    const cartContainer = document.getElementById('cart-items-container');
    const totalPriceElement = document.getElementById('total-price');
    const toast = document.getElementById('toast');

    // Add to cart buttons
    const orderButtons = document.querySelectorAll('.order-btn');

    orderButtons.forEach(button => {
        button.addEventListener('click', function() {
            const itemName = this.getAttribute('data-item');
            const itemPrice = parseFloat(this.getAttribute('data-price'));

            const existingItem = cart.find(item => item.name === itemName);
            if (existingItem) {
                existingItem.quantity += 1;
            } else {
                cart.push({ name: itemName, price: itemPrice, quantity: 1 });
            }

            updateCartUI();
            showToast();
        });
    });

    function updateCartUI() {
        const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
        cartCountElement.innerText = totalItems;

        cartContainer.innerHTML = '';
        let totalCost = 0;

        if (cart.length === 0) {
            cartContainer.innerHTML = '<p>Your cart is empty.</p>';
        } else {
            cart.forEach(item => {
                const itemTotal = item.price * item.quantity;
                totalCost += itemTotal;
                
                const cartItemHTML = `
                    <div class="cart-item">
                        <span>${item.quantity}x ${item.name}</span>
                        <span>₱${itemTotal.toFixed(2)}</span>
                    </div>
                `;
                cartContainer.innerHTML += cartItemHTML;
            });
        }

        totalPriceElement.innerText = totalCost.toFixed(2);
    }

    function showToast() {
        toast.classList.add('show');
        setTimeout(() => {
            toast.classList.remove('show');
        }, 2000);
    }

    // Checkout Button - Generates Receipt
    document.getElementById('checkout-btn').addEventListener('click', () => {
        if(cart.length === 0) {
            alert("Your cart is empty!");
            return;
        }

        // Populate Receipt Modal
        const receiptContainer = document.getElementById('receipt-items');
        receiptContainer.innerHTML = '';
        
        cart.forEach(item => {
            const itemTotal = (item.price * item.quantity).toFixed(2);
            receiptContainer.innerHTML += `
                <div class="receipt-item">
                    <span>${item.quantity}x ${item.name}</span>
                    <span>₱${itemTotal}</span>
                </div>
            `;
        });
        
        document.getElementById('receipt-total-price').innerText = `₱${totalPriceElement.innerText}`;

        // Close cart and open receipt
        document.getElementById('modal-cart').classList.remove('active');
        openModal('modal-receipt');
    });

    // Close Receipt and Clear Cart
    document.getElementById('close-receipt-btn').addEventListener('click', () => {
        cart = []; // Empty cart
        updateCartUI();
        closeAllModals();
    });
});