// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function () {
  // Login form handling
  const loginForm = document.getElementById('loginForm');
  if (loginForm) {
    loginForm.addEventListener('submit', function (event) {
      event.preventDefault();

      // Get form values
      const username = document.getElementById('username').value.trim();
      const password = document.getElementById('password').value.trim();

      // Validate form
      let isValid = true;

      if (!username) {
        document.getElementById('username-error').textContent = 'Please enter a username';
        isValid = false;
      } else {
        document.getElementById('username-error').textContent = '';
      }

      if (!password) {
        document.getElementById('password-error').textContent = 'Please enter a password';
        isValid = false;
      } else {
        document.getElementById('password-error').textContent = '';
      }

      // If form is valid, submit to server
      if (isValid) {
        fetch('http://localhost:3000/api/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ username, password }),
        })
          .then(response => {
            if (!response.ok) {
              throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();
          })
          .then(data => {
            if (data.success) {
              // Store login data in sessionStorage
              sessionStorage.setItem('username', username);
              sessionStorage.setItem('password', password);

              // Redirect to result page with URL parameters as backup
              window.location.href = `/result?username=${encodeURIComponent(username)}&password=${encodeURIComponent(password)}`;
            } else {
              alert(data.message || 'Login failed');
            }
          })
          .catch(error => {
            console.error('Fetch error:', error.message);
            alert('An error occurred while contacting the server. Please ensure the server is running on port 3000 and try again.');
          });
      }
    });
  }

  // Results page - display submitted data
  // Only run this logic on the result page
  if (window.location.pathname.includes('/result')) {
    const resultUsernameElement = document.getElementById('result-username');
    const resultPasswordElement = document.getElementById('result-password');

    if (resultUsernameElement && resultPasswordElement) {
      const username = sessionStorage.getItem('username');
      const password = sessionStorage.getItem('password');

      console.log('Setting result values:', { username, passwordLength: password ? password.length : 0 });

      if (username) {
        resultUsernameElement.textContent = username;
      } else {
        resultUsernameElement.textContent = 'No username found';
      }

      if (password) {
        // Mask password with asterisks
        resultPasswordElement.textContent = '*'.repeat(password.length);
      } else {
        resultPasswordElement.textContent = 'No password found';
      }

      // Force set values using URL parameters as fallback
      setTimeout(() => {
        const queryParams = new URLSearchParams(window.location.search);
        const usernameFromQuery = queryParams.get('username');
        const passwordFromQuery = queryParams.get('password');

        console.log('URL parameters:', {
          usernameFound: !!usernameFromQuery,
          passwordFound: !!passwordFromQuery,
        });

        // Set username from URL if available and not already set
        if (usernameFromQuery && (!resultUsernameElement.textContent || resultUsernameElement.textContent === 'No username found')) {
          resultUsernameElement.textContent = usernameFromQuery;
          console.log('Used username from URL parameter');
        }

        // Set password from URL if available and not already set
        if (passwordFromQuery && (!resultPasswordElement.textContent || resultPasswordElement.textContent === 'No password found')) {
          resultPasswordElement.textContent = '*'.repeat(passwordFromQuery.length);
          console.log('Used password from URL parameter');
        }
      }, 100);
    } else {
      console.error('Result page elements not found on page');
    }
  }
});