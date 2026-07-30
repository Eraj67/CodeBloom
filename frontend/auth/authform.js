/* FORM SUBMIT HANDLING  */


document.getElementById('login-form').addEventListener('submit', async (e) => {
    e.preventDefault();//stop
    const formData = {
        email: e.target.email.value,
        password: e.target.password.value
    };
    //backend response
    try {
        const response = await fetch('/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formData)
        });

        if (response.ok) {
            window.location.href = 'dashboard.html';
        } else {
            alert('Login failed. Please check your details.');
        }
    } catch (err) {
        console.log('Backend not connected yet:', err);
    }
});

document.getElementById('signup-form').addEventListener('submit', async (e) => {
    e.preventDefault();//stop

    if (e.target.password.value !== e.target.confirmPassword.value){
        alert('Passwords do not match.');
        return;
    }

    const formData = {
        name: e.target.name.value,
        email: e.target.email.value,
        password: e.target.password.value
    }; 
        //backend response
    try {
        const response = await fetch('/api/auth/signup', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formData)
        });

        if (response.ok) {
            window.location.href = 'dashboard.html';
        } else {
            alert('Sign up failed. Please try again.');
        }
    } catch (err) {
        console.log('Backend not connected yet:', err);
    }
});