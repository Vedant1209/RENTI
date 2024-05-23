document.addEventListener('DOMContentLoaded', () => {
    const registerButton = document.getElementById('registerButton');
    const loginButton = document.getElementById('loginButton');
    const logoutButton = document.getElementById('logoutButton');
    const registerSection = document.getElementById('registerSection');
    const loginSection = document.getElementById('loginSection');
    const propertySection = document.getElementById('propertySection');
    const registerForm = document.getElementById('registerForm');
    const loginForm = document.getElementById('loginForm');
    const propertiesDiv = document.getElementById('properties');
  
    const apiUrl = 'http://localhost:5000/api';
  
    let token = localStorage.getItem('token');
  
    function showSection(section) {
      registerSection.style.display = 'none';
      loginSection.style.display = 'none';
      propertySection.style.display = 'none';
      if (section) section.style.display = 'block';
    }
  
    function displayProperties() {
      propertiesDiv.innerHTML = '';
      fetch(`${apiUrl}/properties`)
        .then(response => response.json())
        .then(data => {
          data.forEach(property => {
            const propertyDiv = document.createElement('div');
            propertyDiv.classList.add('property');
            propertyDiv.innerHTML = `
              <h3>${property.place}</h3>
              <p>Area: ${property.area} sq ft</p>
              <p>Bedrooms: ${property.bedrooms}</p>
              <p>Bathrooms: ${property.bathrooms}</p>
              <p>Nearby Hospitals: ${property.nearbyHospitals}</p>
              <p>Nearby Colleges: ${property.nearbyColleges}</p>
              <button class="interestedButton" data-id="${property._id}">I'm Interested</button>
            `;
            propertiesDiv.appendChild(propertyDiv);
          });
        });
    }
  
    function setupUser() {
      if (token) {
        loginButton.style.display = 'none';
        registerButton.style.display = 'none';
        logoutButton.style.display = 'inline';
        showSection(propertySection);
        displayProperties();
      } else {
        loginButton.style.display = 'inline';
        registerButton.style.display = 'inline';
        logoutButton.style.display = 'none';
        showSection(null);
      }
    }
  
    registerButton.addEventListener('click', () => showSection(registerSection));
    loginButton.addEventListener('click', () => showSection(loginSection));
    logoutButton.addEventListener('click', () => {
      localStorage.removeItem('token');
      token = null;
      setupUser();
    });
  
    registerForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const formData = new FormData(registerForm);
      const userData = {
        firstName: formData.get('firstName'),
        lastName: formData.get('lastName'),
        email: formData.get('email'),
        phoneNumber: formData.get('phoneNumber'),
        password: formData.get('password'),
        role: formData.get('role')
      };
      fetch(`${apiUrl}/users/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(userData)
      })
        .then(response => response.json())
        .then(data => {
          console.log('User registered:', data);
          if (data.token) {
            localStorage.setItem('token', data.token);
            token = data.token;
            setupUser();
          }
        })
        .catch(err => console.error(err));
    });
  
    loginForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const formData = new FormData(loginForm);
      const userData = {
        email: formData.get('email'),
        password: formData.get('password')
      };
      fetch(`${apiUrl}/users/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(userData)
      })
        .then(response => response.json())
        .then(data => {
          console.log('User logged in:', data);
          if (data.token) {
            localStorage.setItem('token', data.token);
            token = data.token;
            setupUser();
          }
        })
        .catch(err => console.error(err));
    });
  
    propertiesDiv.addEventListener('click', (e) => {
      if (e.target.classList.contains('interestedButton')) {
        const propertyId = e.target.getAttribute('data-id');
        console.log(`Interested in property ID: ${propertyId}`);
        // Implement showing seller details here
      }
    });
  
    setupUser();
  });
  