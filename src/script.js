let cart = [];
let isLoggedIn = false;
let username = "";
let balance = 0; 
let userId = ""; 

window.addEventListener('DOMContentLoaded', function() {
    checkLoginStatus();
});

function checkLoginStatus() {
    fetch('/check_login.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(response => response.json())
    .then(data => {
        if (data.loggedin) {
            isLoggedIn = true;
            username = data.username;
            balance = data.balance;
            userId = data.user_id;
        } else {
            isLoggedIn = false;
        }
    })
    .catch(error => {
        console.error('Error checking login status:', error);
    });
}

function openCart() {
    document.getElementById('cart-modal').style.display = 'block';
    updateCartDisplay();
}

function closeCart() {
    document.getElementById('cart-modal').style.display = 'none';
}

document.addEventListener('DOMContentLoaded', function() {
    fetch('/clear_cart.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            console.log('Cart cleared');
        } else {
            console.error('Failed to clear cart:', data.message);
        }
    })
    .catch(error => {
        console.error('Error clearing cart:', error);
    });
});


document.querySelectorAll('.add-to-cart').forEach(button => {
    button.addEventListener('click', function () {
        checkLoginStatus();
        if (!isLoggedIn) {
            alert('Please login before adding items to cart');
            return;
        }

        const productCard = this.closest('.product-card');
        const productId = productCard.getAttribute('data-id');
        const productName = productCard.getAttribute('data-name');
        const productPrice = parseFloat(productCard.getAttribute('data-price'));
        const productImg = productCard.getAttribute('data-img');

        const existingItem = cart.find(item => item.id === productId);
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            cart.push({
                id: productId,
                name: productName,
                price: productPrice,
                img: productImg,
                quantity: 1
            });
        }

        updateCartDisplay();
        updateGridProductDisplay(productCard, productName);

        fetch('/add_to_cart.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                user_id: userId,
                product_id: productId,
                quantity: 1
            })
        })
        .then(response => response.json())
        .then(data => {
            if (!data.success) {
                alert('fail');
            }
        })
        .catch(error => {
            console.error('error:', error);
        });
    });
});

function updateGridProductDisplay(productCard, productName) {
    const productQuantity = cart.find(item => item.name === productName)?.quantity || 0;
    const quantitySpan = productCard.querySelector('.item-quantity-in-grid');

    if (productQuantity > 0) {
        quantitySpan.style.display = 'inline-block';
        quantitySpan.textContent = productQuantity;
    } else {
        quantitySpan.textContent = productQuantity;
        quantitySpan.style.display = 'none';
    }
}

function updateCartDisplay() {
    console.log('Current Cart:', cart);
    const cartItemsContainer = document.querySelector('.cart-items');
    cartItemsContainer.innerHTML = '';

    let totalAmount = 0;

    cart.forEach(item => {
        totalAmount += item.price * item.quantity;

        const cartItemDiv = document.createElement('div');
        cartItemDiv.classList.add('cart-item');

        cartItemDiv.innerHTML = `
            <img src="${item.img}" alt="${item.name}">
            <div class="item-details">
                <p>${item.name}   Price: ${item.price}</p>
            </div>
            <div class="quantity-controls">
                <button class="decrease-quantity">-</button>
                <span class="item-quantity">${item.quantity}</span>
                <button class="increase-quantity">+</button>
            </div>
        `;
            cartItemDiv.querySelector('.increase-quantity').addEventListener('click', function () {
            item.quantity += 1;
            updateCartDisplay();
            const productCard = document.querySelector(`.product-card[data-name="${item.name}"]`);
            updateGridProductDisplay(productCard, item.name);
            updateCartItemInDatabase(item.id, item.quantity);
        });

            cartItemDiv.querySelector('.decrease-quantity').addEventListener('click', function () {
             item.quantity -= 1;
            updateCartItemInDatabase(item.id, item.quantity);
            if (item.quantity < 1) {
               cart = cart.filter(cartItem => cartItem.id !== item.id); 
            }
            updateCartDisplay();
            const productCard = document.querySelector(`.product-card[data-name="${item.name}"]`);
            updateGridProductDisplay(productCard, item.name);
        });

        cartItemsContainer.appendChild(cartItemDiv);
    });
    document.getElementById('total-amount').textContent = totalAmount.toFixed(2);
}


function updateCartItemInDatabase(productId, quantity) {
    fetch('/update_cart.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            user_id: userId,
            product_id: productId,
            quantity: quantity
        })
    })
    .then(response => response.json())
    .then(data => {
        if (!data.success) {
            console.error('fail');
        }
    })
    .catch(error => {
        console.error('error:', error);
    });
}

document.addEventListener('DOMContentLoaded', function () {
    fetch('/get_balance.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            username: username
        })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            balance = data.balance;
            document.getElementById('account-balance').textContent = balance.toFixed(2);
        } else {
            alert('Failed to fetch balance: ' + data.message);
        }
    })
    .catch(error => {
        console.error('Error fetching balance:', error);
    });
});

document.getElementById('checkout-btn').addEventListener('click', function () {
    const totalAmount = parseFloat(document.getElementById('total-amount').textContent);

    if (balance >= totalAmount) {
        balance -= totalAmount;
        alert('Purchase successful! Remaining balance: $' + balance.toFixed(2));
        cart = [];
        updateCartDisplay();

        fetch('/checkout.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                username: username, 
                newBalance: balance, 
                cartItems: []  
            })
        })
        .then(response => response.json())
        .then(data => {
            if (!data.success) {
                alert('Failed to update balance and clear cart.');
            }
        })
        .catch(error => {
            console.error('Error during checkout:', error);
        });

    } else {
        alert('Insufficient balance! Please recharge.');
    }
});
