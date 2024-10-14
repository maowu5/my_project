// 初始化登录状态
let isLoggedIn = false;
let username = "";

// 处理用户登录与自动注册
document.getElementById('login-form').addEventListener('submit', function(event) {
    event.preventDefault();

    const usernameInput = document.getElementById('username').value;
    const passwordInput = document.getElementById('password').value;

    // 发送登录请求到后端
    fetch('/login.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            username: usernameInput,
            password: passwordInput
        })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            // 如果登录成功
            alert('Login successful');
            isLoggedIn = true;
            username = data.username; // 保存用户名
            // 显示账户信息，隐藏登录表单
            document.getElementById('login-form-container').style.display = 'none';
            document.getElementById('account-info').style.display = 'block';
            document.getElementById('account-username').innerText = username;
            document.getElementById('account-balance').innerText = balance;
        } else {
            // 如果登录失败，自动注册
            alert('The user is not registered and is being automatically registered...');
            autoRegister(usernameInput, passwordInput);
        }
    })
    .catch(error => {
        console.error('error:', error);
    });
});

// 自动注册函数
function autoRegister(username, password) {
    fetch('/register.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            username: username,
            password: password
        })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            alert('Automatic registration was successful');
        } else {
            alert('Automatic registration failed：' + data.message);
        }
    })
    .catch(error => {
        console.error('error:', error);
    });
}

document.getElementById('recharge-btn').addEventListener('click', function() {
    // 向服务器发送请求，增加余额
    fetch('/update_balance.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            username: username,  // 当前用户名
            rechargeAmount: 100  // 充值金额为100
        })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            // 充值成功后从数据库获取更新后的余额
            fetch('/get_balance.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    username: username  // 当前用户名，用于获取余额
                })
            })
            .then(response => response.json())
            .then(balanceData => {
                if (balanceData.success) {
                    // 更新界面上显示的余额
                    document.getElementById('account-balance').innerText = balanceData.balance.toFixed(2);
                    alert('Account recharged by $100. New balance: $' + balanceData.balance);
                } else {
                    alert('Failed to retrieve updated balance.');
                }
            })
            .catch(error => {
                console.error('Error fetching balance:', error);
            });
        } else {
            alert('Failed to recharge: ' + data.message);
        }
    })
    .catch(error => {
        console.error('Error updating balance:', error);
    });
});


// 退出登录功能
document.getElementById('logout-btn').addEventListener('click', function() {
    isLoggedIn = false;
    username = "";
    balance = 100;  // 退出后重置余额

    // 重新显示登录表单，隐藏账户信息
    document.getElementById('login-form-container').style.display = 'block';
    document.getElementById('account-info').style.display = 'none';
    alert('You have logged out.');
});
