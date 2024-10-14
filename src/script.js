let cart = [];
let isLoggedIn = false;
let username = ""; // 当前登录的用户名

// 检查登录状态
function checkLoginStatus() {
    fetch('/check_login.php')
    .then(response => response.json())
    .then(data => {
        if (data.isLoggedIn) {
            isLoggedIn = true;
            username = data.username;
            document.getElementById('login-message').innerText = `Welcome, ${username}`;
            loadCartFromDatabase(); // 登录后加载购物车内容
        } else {
            isLoggedIn = false;
            username = "";
            document.getElementById('login-message').innerText = 'Please Login';
        }
    })
    .catch(error => {
        console.error('error:', error);
    });
}

// 页面加载时检查登录状态
window.onload = function () {
    checkLoginStatus();
};

// 从数据库加载购物车内容
function loadCartFromDatabase() {
    fetch('/get_cart.php')
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            cart = data.cartItems; // 将数据库中的购物车内容加载到cart数组中
            updateCartDisplay();   // 更新前端的购物车显示
        } else {
            console.error('Fail');
        }
    })
    .catch(error => {
        console.error('error:', error);
    });
}

// 添加商品到购物车，并保存到数据库
document.querySelectorAll('.add-to-cart').forEach(button => {
    button.addEventListener('click', function () {
        if (!isLoggedIn) {
            alert('Please login before adding items to cart');
            return;
        }

        const productCard = this.closest('.product-card');
        const productId = productCard.getAttribute('data-id');
        const productName = productCard.getAttribute('data-name');
        const productPrice = parseFloat(productCard.getAttribute('data-price'));
        const productImg = productCard.getAttribute('data-img');

        // 查找是否购物车中已有该商品
        const existingItem = cart.find(item => item.id === productId);
        if (existingItem) {
            existingItem.quantity += 1; // 如果存在，增加数量
        } else {
            // 如果不存在，添加新的商品到购物车
            cart.push({
                id: productId,
                name: productName,
                price: productPrice,
                img: productImg,
                quantity: 1
            });
        }

        // 更新购物车显示
        updateCartDisplay();
        updateGridProductDisplay(productCard, productName);

        // 将购物车数据保存到数据库
        fetch('/add_to_cart.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                product_id: productId,
                quantity: 1 // 添加一个商品
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

// 更新购物车显示
function updateCartDisplay() {
    const cartItemsContainer = document.querySelector('.cart-items');
    cartItemsContainer.innerHTML = ''; // 清空购物车显示

    let totalAmount = 0;

    // 遍历购物车中的商品，创建商品条目
    cart.forEach(item => {
        totalAmount += item.price * item.quantity; // 计算总金额

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

            // 更新数据库中的商品数量
            updateCartItemInDatabase(item.id, item.quantity);
        });

        cartItemDiv.querySelector('.decrease-quantity').addEventListener('click', function () {
            if (item.quantity > 1) {
                item.quantity -= 1;
            } else {
                cart = cart.filter(cartItem => cartItem.id !== item.id); // 从购物车中移除商品
            }
            updateCartDisplay();
            const productCard = document.querySelector(`.product-card[data-name="${item.name}"]`);
            updateGridProductDisplay(productCard, item.name);

            // 更新数据库中的商品数量
            updateCartItemInDatabase(item.id, item.quantity);
        });

        cartItemsContainer.appendChild(cartItemDiv);
    });

    // 更新总金额
    document.getElementById('total-amount').textContent = totalAmount.toFixed(2);
}

// 更新购物车中的商品数量到数据库
function updateCartItemInDatabase(productId, quantity) {
    fetch('/update_cart.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
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
