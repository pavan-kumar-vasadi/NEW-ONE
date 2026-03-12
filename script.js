// --- DOM Elements ---
const navbar = document.getElementById('navbar');
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('navLinks');
const cartBtn = document.getElementById('cartBtn');
const cartSidebar = document.getElementById('cartSidebar');
const overlay = document.getElementById('overlay');
const closeCart = document.getElementById('closeCart');
const cartItemsContainer = document.getElementById('cartItems');
const cartCount = document.querySelector('.cart-count');
const totalPriceEl = document.querySelector('.total-price');
const checkoutBtn = document.querySelector('.checkout-btn');
const contactForm = document.querySelector('.contact-form');

// --- State ---
let cart = JSON.parse(localStorage.getItem("cart")) || [];
updateCartUI();

// --- Navbar Scroll Effect ---
window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

// --- Mobile Menu Toggle ---
hamburger.addEventListener('click', () => {
    navLinks.classList.toggle('active');
    hamburger.classList.toggle('toggle');
});

// Close mobile menu when a link is clicked
document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', () => {
        navLinks.classList.remove('active');
        hamburger.classList.remove('toggle');
    });
});

// --- Cart Functionality ---

// Add Item to Cart
function addToCart(name, price) {
    const existingItem = cart.find(item => item.name === name);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            id: Date.now(),
            name: name,
            price: price,
            quantity: 1
        });
    }
    
    updateCartUI();
    openCart();
}

// Update Cart UI
function updateCartUI() {
    cartItemsContainer.innerHTML = '';
    let total = 0;
    let totalCount = 0;

    if (cart.length === 0) {
        cartItemsContainer.innerHTML = '<p class="empty-msg">Your cart is empty.</p>';
    } else {
        cart.forEach((item, index) => {
            total += item.price * item.quantity;
            totalCount += item.quantity;

            const itemEl = document.createElement('div');
            itemEl.classList.add('cart-item');
            itemEl.innerHTML = `
                <div class="cart-item-info">
                    <h4>${item.name}</h4>
                    <p>₹${item.price} x ${item.quantity}</p>
                </div>
                <div class="cart-item-controls">
                    <button class="qty-btn" onclick="updateQuantity(${index}, -1)">-</button>
                    <span>${item.quantity}</span>
                    <button class="qty-btn" onclick="updateQuantity(${index}, 1)">+</button>
                    <button class="remove-btn" onclick="removeItem(${index})"><i class="fas fa-trash"></i></button>
                </div>
            `;
            cartItemsContainer.appendChild(itemEl);
        });
    }

    // Update Badge and Total
    cartCount.textContent = totalCount;
    totalPriceEl.textContent = `₹${total}`;
    localStorage.setItem("cart", JSON.stringify(cart));
}

// Update Quantity
window.updateQuantity = function(index, change) {
    cart[index].quantity += change;
    if (cart[index].quantity <= 0) {
        cart.splice(index, 1);
    }
    updateCartUI();
};

// Remove Item
window.removeItem = function(index) {
    cart.splice(index, 1);
    updateCartUI();
};

// Toggle Cart Sidebar
function openCart() {
    cartSidebar.classList.add('active');
    overlay.classList.add('active');
}

function closeCartFunc() {
    cartSidebar.classList.remove('active');
    overlay.classList.remove('active');
}

cartBtn.addEventListener('click', openCart);
closeCart.addEventListener('click', closeCartFunc);
overlay.addEventListener('click', closeCartFunc);


// --- Scroll Animations (Fade In) ---
const observerOptions = {
    threshold: 0.1
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('fade-in');
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

document.querySelectorAll('.menu-card, .highlight-card, .review-card, .gallery-item').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(20px)';
    el.style.transition = 'all 0.6s ease-out';
    observer.observe(el);
});

// Add class for animation
const style = document.createElement('style');
style.innerHTML = `
    .fade-in {
        opacity: 1 !important;
        transform: translateY(0) !important;
    }
`;
document.head.appendChild(style);

// --- Contact Form Handling ---
if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        alert('Thank you for your message! We will contact you soon.');
        contactForm.reset();
    });
}

// --- Smooth Scroll for Anchor Links (Enhancement) ---
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth'
            });
        }
    });
});

function bookTable(){

let name = document.getElementById("name").value;
let phone = document.getElementById("phone").value;
let date = document.getElementById("date").value;
let time = document.getElementById("time").value;
let guests = document.getElementById("guests").value;

let message =
"Table Booking Request %0A%0A" +
"Name: " + name + "%0A" +
"Phone: " + phone + "%0A" +
"Date: " + date + "%0A" +
"Time: " + time + "%0A" +
"Guests: " + guests;

let whatsappNumber = "9491497742"; // replace with your number

window.open("https://wa.me/" + whatsappNumber + "?text=" + message, "_blank");

}


const checkoutForm = document.getElementById("checkoutForm");
const checkoutSubmit = document.getElementById("checkoutSubmit");

checkoutBtn.addEventListener("click", function(){
    if(cart.length === 0){
        alert("Your cart is empty!");
        return;
    }
    checkoutForm.style.display = "block";
});

// Form submit logic
checkoutSubmit.addEventListener("click", function(){
let orderID = "HV" + Math.floor(1000 + Math.random() * 9000);
document.getElementById("orderNumber").innerText = orderID;
let name = document.getElementById("customerName").value.trim();
let phone = document.getElementById("customerPhone").value.trim();
let address = document.getElementById("customerAddress").value.trim();

if(!name || !phone || !address){
alert("Please fill all details!");
return;
}

let paymentMethod = document.querySelector('input[name="payment"]:checked').value;

let total = 0;
let orderList = "";

cart.forEach(item=>{
orderList += item.name + " x" + item.quantity + "%0A";
total += item.price * item.quantity;
});


// PHONEPE / GOOGLE PAY
if(paymentMethod === "phonepe" || paymentMethod === "gpay"){

let upiLink = "upi://pay?pa=7382286942@ibl&pn=Haveli&am="+total+"&cu=INR";

window.location.href = upiLink;

}
// CASH ON DELIVERY
else{

let message =
"Order Confirmed ✅ %0A%0A" +
"Order ID: " + orderID + "%0A%0A" +
orderList +
"%0AName: " + name +
"%0APhone: " + phone +
"%0AAddress: " + address +
"%0ATotal: ₹" + total +
"%0APayment: Cash on Delivery";

let whatsappNumber = "919491497742";

window.open("https://wa.me/" + whatsappNumber + "?text=" + message, "_blank");

}



cart = [];
updateCartUI();

});


function showSuccessPopup(){
    // Popup open avvadam
    document.getElementById("orderSuccessPopup").classList.add("active");

    // Sound play avvadam
    let sound = document.getElementById("orderSound");
    sound.play();
}

function closeSuccessPopup(){
document.getElementById("orderSuccessPopup").classList.remove("active");
}

document.getElementById("confirmPaymentBtn").addEventListener("click", function(){

showSuccessPopup();

cart = [];
updateCartUI();

});
