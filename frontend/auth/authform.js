const API_BASE = "http://localhost:4000/api";

document.getElementById('login-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const formData = {
        email: e.target.email.value,
        password: e.target.password.value
    };

    try {
        const response = await fetch(`${API_BASE}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify(formData)
        });

        if (response.ok) {
            window.location.href = '../dashboard.html';
        } else {
            alert('Login failed. Please check your details.');
        }
    } catch (err) {
        console.log('Backend not connected yet:', err);
        alert('Could not connect to server. Please try again later.');
    }
});

document.getElementById('signup-form').addEventListener('submit', async (e) => {
    e.preventDefault();

    if (e.target.password.value !== e.target.confirmPassword.value){
        alert('Passwords do not match.');
        return;
    }

    const formData = {
        displayName: e.target.name.value,
        email: e.target.email.value,
        password: e.target.password.value
    };

    try {
        const response = await fetch(`${API_BASE}/auth/signup`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify(formData)
        });

        if (response.ok) {
            window.location.href = '../dashboard.html';
        } else {
            const data = await response.json();
            alert(data.error || 'Sign up failed. Please try again.');
        }
    } catch (err) {
        console.log('Backend not connected yet:', err);
        alert('Could not connect to server. Please try again later.');
    }
});