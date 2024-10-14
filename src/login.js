// 初始化登录状态
let isLoggedIn = false;
let username = "";
let balance = 0; 

// 处理用户登录与自动注册
document.getElementById('login-form').addEventListener('submit', function(event) {
    event.preventDefault();

    const usernameInput = document.getElementById('username').value;
    const passwordInput = document.getElementById('password').value;

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
            // 登录成功
            alert('Login successful');
            isLoggedIn = true;
            username = data.username;

            // 显示账户信息，隐藏登录表单
            document.getElementById('login-form-container').style.display = 'none';
            document.getElementById('account-info').style.display = 'block';
            document.getElementById('account-username').innerText = username;

            // 从数据库获取余额并更新显示
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
            .then(balanceData => {
                if (balanceData.success) {
                    balance = balanceData.balance;  // 更新 balance 变量
                    document.getElementById('account-balance').innerText = balance.toFixed(2);
                } else {
                    alert('Failed to retrieve balance.');
                }
            })
            .catch(error => {
                console.error('Error fetching balance:', error);
            });
        } else {
            // 登录失败，自动注册
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
    console.log('Recharge button clicked');  // 调试输出，检查是否触发点击事件
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
        console.log('Update Balance Response:', data);  // 检查返回的响应
        if (data.success) {
            // 充值成功后从数据库获取更新后的余额
            fetch('/get_balance.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    username: username  // 当前用户名
                })
            })
            .then(response => response.json())
            .then(balanceData => {
                if (balanceData.success) {
                    balance = balanceData.balance;
                    document.getElementById('account-balance').innerText = balance.toFixed(2);
                    alert('Account recharged by $100. New balance: $' + balance.toFixed(2));
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
