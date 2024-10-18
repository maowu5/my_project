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
        if (!data.loggedin) {
           console.error('Please Login');
        }
    })
    .catch(error => {
        console.error('Error checking login status:', error);
    });
});

document.addEventListener("DOMContentLoaded", function() {
    const xhr = new XMLHttpRequest();
    xhr.open('GET', 'search.php', true);

    xhr.onload = function() {
        if (xhr.status === 200) {
            document.getElementById('characters-grid').innerHTML = xhr.responseText;
        } else {
            console.error('Error: ' + xhr.status);
        }
    };

    xhr.onerror = function() {
        console.error('Request failed.');
    };

    xhr.send();
});

document.getElementById('query').addEventListener('input', function() {
    const query = document.getElementById('query').value;

    const xhr = new XMLHttpRequest();
    xhr.open('GET', 'search.php?query=' + encodeURIComponent(query), true);

    xhr.onload = function() {
        if (xhr.status === 200) {
            document.getElementById('characters-grid').innerHTML = xhr.responseText;
        } else {
            console.error('Error: ' + xhr.status);
        }
    };

    xhr.onerror = function() {
        console.error('Request failed.');
    };

    xhr.send();
});
