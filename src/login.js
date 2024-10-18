let isLoggedIn = false;
let username = "";
let balance = 0; 

window.addEventListener('DOMContentLoaded', function() {
    fetch('/check_login.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(response => response.json())
    .then(data => {
        if (data.loggedin) {
            document.getElementById('login-form-container').style.display = 'none';
            document.getElementById('account-info').style.display = 'block';
            document.getElementById('account-username').innerText = data.username;
            document.getElementById('account-balance').innerText = parseFloat(data.balance).toFixed(2);
        } else {
            document.getElementById('login-form-container').style.display = 'block';
            document.getElementById('account-info').style.display = 'none';
        }
    })
    .catch(error => {
        console.error('Error checking login status:', error);
    });
});

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
            alert('Login successful');
            isLoggedIn = true;
            username = data.username;

            document.getElementById('login-form-container').style.display = 'none';
            document.getElementById('account-info').style.display = 'block';
            document.getElementById('account-username').innerText = username;

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
                    balance = parseFloat(balanceData.balance);
                    document.getElementById('account-balance').innerText = balance.toFixed(2);
                } else {
                    alert('Failed to retrieve balance.');
                }
            })
            .catch(error => {
                console.error('Error fetching balance:', error);
            });
        } else {
            alert('The user is not registered and is being automatically registered...');
            autoRegister(usernameInput, passwordInput);
        }
    })
    .catch(error => {
        console.error('error:', error);
    });
});

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
    console.log('Recharge button clicked'); 
    fetch('/update_balance.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            username: username, 
            rechargeAmount: 100
        })
    })
    .then(response => response.json())
    .then(data => {
        console.log('Update Balance Response:', data);
        if (data.success) {
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
                    balance = parseFloat(balanceData.balance);
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



document.getElementById('logout-btn').addEventListener('click', function() {
    window.location.href = '/logout.php'; 
    isLoggedIn = false;
    username = "";
    balance = 100;

    document.getElementById('login-form-container').style.display = 'block';
    document.getElementById('account-info').style.display = 'none';
    alert('You have logged out.');
});
