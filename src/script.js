let cart = [];
let isLoggedIn = false;
let username = ""; // 当前登录的用户名
let balance = 0; 
let userId = ""; 

window.addEventListener('DOMContentLoaded', function() {
    checkLoginStatus();  // 检查登录状态
});

// 检查登录状态
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
            loadCartFromDatabase(); // 如果登录了，加载购物车数据
        } else {
            isLoggedIn = false;
        }
    })
    .catch(error => {
        console.error('Error checking login status:', error);
    });
}
// 打开购物车浮窗
function openCart() {
    document.getElementById('cart-modal').style.display = 'block';
    updateCartDisplay();
}

// 关闭购物车浮窗
function closeCart() {
    document.getElementById('cart-modal').style.display = 'none';
}

function loadCartFromDatabase() {
    fetch('/get_cart.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            user_id: userId  // 根据登录的用户 ID 获取购物车内容
        })
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('HTTP error, status = ' + response.status);
        }
        return response.json();
    })
    .then(data => {
        console.log('Cart Data from Server:', data); // 调试输出
        if (data.success) {
            cart = data.cartItems; // 将购物车内容加载到 cart 数组中
            updateCartDisplay();   // 更新购物车显示
            updateProductDisplay(); // 更新商品显示
        } else {
            console.error('Failed to load cart:', data.message);
        }
    })
    .catch(error => {
        console.error('Error loading cart:', error);
    });
}

function updateProductDisplay() {
    document.querySelectorAll('.product-card').forEach(productCard => {
       const productId = productCard.getAttribute('data-id');
        const cartItem = cart.find(item => item.product_id === parseInt(productId));

        if (cartItem) {
            // 在商品卡片中显示已购买数量
            const quantitySpan = productCard.querySelector('.item-quantity-in-grid');
            const decreaseButton = productCard.querySelector('.decrease-in-grid');

            quantitySpan.textContent = cartItem.quantity;
            decreaseButton.style.display = 'inline-block';
            quantitySpan.style.display = 'inline-block';

            // 增加减少数量的事件绑定
            decreaseButton.addEventListener('click', function () {
                cartItem.quantity -= 1;
                updateCartDisplay(); // 更新购物车显示
                updateProductDisplay(); // 更新商品卡片显示
                updateCartItemInDatabase(productId, cartItem.quantity); // 更新数据库
                if (cartItem.quantity < 1) {
                    cart = cart.filter(item => item.product_id !== parseInt(productId)); // 从购物车中移除该商品
                }
            });

            const addButton = productCard.querySelector('.add-to-cart');
            addButton.addEventListener('click', function () {
                cartItem.quantity += 1; // 增加数量
                updateCartDisplay(); // 更新购物车显示
                updateProductDisplay(); // 更新商品卡片显示
                updateCartItemInDatabase(productId, cartItem.quantity); // 更新数据库
            });
        } else {
            // 如果购物车中没有此商品，隐藏数量显示
            const quantitySpan = productCard.querySelector('.item-quantity-in-grid');
            const decreaseButton = productCard.querySelector('.decrease-in-grid');

            decreaseButton.style.display = 'none';
            quantitySpan.style.display = 'none';
        }
    });
}

// 添加商品到购物车，并保存到数据库
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
                user_id: userId,
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

function updateGridProductDisplay(productCard, productName) {
    const productQuantity = cart.find(item => item.name === productName)?.quantity || 0;
    const decreaseButton = productCard.querySelector('.decrease-in-grid');
    const quantitySpan = productCard.querySelector('.item-quantity-in-grid');

    if (productQuantity > 0) {
        decreaseButton.style.display = 'inline-block';
        quantitySpan.style.display = 'inline-block';
        quantitySpan.textContent = productQuantity;

        // 如果还没有绑定事件监听器，则绑定一次
        if (!decreaseButton.classList.contains('bound')) {
            decreaseButton.classList.add('bound'); // 标记为已绑定事件
            decreaseButton.addEventListener('click', function () {
                const cartItem = cart.find(item => item.name === productName);

                if (cartItem && cartItem.quantity > 0) {
                    cartItem.quantity -= 1;
                    if (cartItem.quantity === 0) {
                        cart = cart.filter(item => item.name !== productName); // 移除商品
                    }
                }

                updateCartDisplay(); // 更新购物车
                updateGridProductDisplay(productCard, productName); // 更新商品格子中的数量显示
            });
        }
    } else {
        decreaseButton.style.display = 'none';
        quantitySpan.style.display = 'none';
    }
}

// 更新购物车显示
function updateCartDisplay() {
    console.log('Current Cart:', cart);  // 调试输出购物车内容
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
             item.quantity -= 1;
            updateCartItemInDatabase(item.id, item.quantity);
            if (item.quantity < 1) {
               cart = cart.filter(cartItem => cartItem.id !== item.id); // 从购物车中移除商品
            }
            updateCartDisplay();
            const productCard = document.querySelector(`.product-card[data-name="${item.name}"]`);
            updateGridProductDisplay(productCard, item.name);
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

// 页面加载时获取用户的余额
document.addEventListener('DOMContentLoaded', function () {
    fetch('/get_balance.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            username: username  // 用户名，可能在登录时已经设置
        })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            balance = data.balance;
            document.getElementById('account-balance').textContent = balance.toFixed(2);  // 更新页面余额显示
        } else {
            alert('Failed to fetch balance: ' + data.message);
        }
    })
    .catch(error => {
        console.error('Error fetching balance:', error);
    });
});

// 结算逻辑
document.getElementById('checkout-btn').addEventListener('click', function () {
    const totalAmount = parseFloat(document.getElementById('total-amount').textContent);

    if (balance >= totalAmount) {
        // 扣除余额
        balance -= totalAmount;
        alert('Purchase successful! Remaining balance: $' + balance.toFixed(2));

        // 清空购物车
        cart = [];
        updateCartDisplay();

        // 将余额和清空购物车信息保存到数据库
        fetch('/checkout.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                username: username,  // 用户名
                newBalance: balance, // 更新后的余额
                cartItems: []        // 清空购物车
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
