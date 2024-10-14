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
