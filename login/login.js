let emailEl;
let passwordEl;

window.onload=function() {
    createForm()
}

const createInput = (id, type, name, placeholder) => {
    const section = document.createElement('section');
    section.classList.add('form-field')
    
    const input = document.createElement("input");
    input.setAttribute('id', id)
    input.setAttribute('type', type);
    input.setAttribute('name', name);
    input.setAttribute('placeholder', placeholder);
    input.setAttribute('class', 'form__input');
    
    section.appendChild(input);
    const small = document.createElement('small');
    section.appendChild(small)
    return section;
}

const responseErrorMessage = (message, article) => {
    article.textContent = message
}

const toggleRegisterButton = () => {
    const section = document.getElementById('register')
    section.hidden = !section.hidden
}

const submitSignIn = (registration) => {
    const error = document.getElementById('error');
    fetch('https://d3vbn0ixkks4al.cloudfront.net/login', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(registration)
    })
    .then(response => {
        const data = response.json();
        data.then(res => {
            if (response.status === 200) {
                sessionStorage.removeItem("Authorization");
                sessionStorage.removeItem("RefreshToken");
                sessionStorage.setItem("Authorization", response.headers.get('Authorization').split(' ')[1]);
                sessionStorage.setItem("RefreshToken", response.headers.get('RefreshToken').split(' ')[1]);
                responseErrorMessage('', error)
                window.location.href = '/player';
            }
            else if (response.status === 404) {
                responseErrorMessage(res.message, error);
                toggleRegisterButton()
                sessionStorage.removeItem("Authorization");
                sessionStorage.removeItem("RefreshToken");
            } 
            else {
                responseErrorMessage(res.message, error);
                sessionStorage.removeItem("Authorization");
                sessionStorage.removeItem("RefreshToken");
            }

        })
    });
}

const submitButtonEventListener = (button) => {
    button.addEventListener('click', (e) => {
        let isEmailValid = checkEmail(),
            isPasswordValid = checkPassword();

        let isFormValid = isEmailValid &&
            isPasswordValid;
        if (isFormValid) {
            const email = document.getElementById("email").value;
            const password = document.getElementById("password").value;
            submitSignIn({email, password})
        };
    })
}

const cancelButtonEventListener = (button) => {
    button.addEventListener('click', (e) => {
        window.location.href = '/';
    })
}

const registerButtonEventListener = (button) => {
    button.addEventListener('click', (e) => {
        console.log('yaya');
        window.location.href = '/register';
    })
}

const createButton = (text, className) => {
    const button = document.createElement('button');
    button.classList.add(className);
    button.setAttribute('type', 'button');
    button.innerText = text;
    return button
}

const fromInputEventListener = (form) => {
    form.addEventListener('input', debounce(function (e) {
        switch (e.target.id) {
            case 'email':
                checkEmail();
                break;
            case 'password':
                checkPassword();
                break;
        }
    }));
}

const createForm = () => {
    const article = document.getElementById("card");
    const form = document.createElement('form')
    form.id = 'registerForm'
    article.appendChild(form);

    const email = createInput('email', 'email', 'Email', 'Email');
    form.appendChild(email)

    const password = createInput('password', 'password', 'Password', 'Password');
    form.appendChild(password)

    const signInButton = createButton('SIGN IN', 'signIn');
    submitButtonEventListener(signInButton);
    form.appendChild(signInButton);
    
    const cancelButton = createButton('CANCEL', 'cancel');
    cancelButtonEventListener(cancelButton);
    form.appendChild(cancelButton);

    const error = document.createElement('article');
    error.classList.add('error');
    error.id = 'error'
    form.appendChild(error);

    const registerButton = createButton('Register', 'register');
    const section = document.createElement('section');
    section.id = 'register'
    registerButtonEventListener(registerButton);
    section.appendChild(registerButton);
    form.appendChild(section);
    
    emailEl = document.querySelector('#email');
    passwordEl = document.querySelector('#password');
    
    fromInputEventListener(form);
    toggleRegisterButton()
}

const showError = (input, message) => {
    const formField = input.parentElement;
    formField.classList.remove('success');
    formField.classList.add('error');
    const error = formField.querySelector('small');
    error.textContent = message;
};

const showSuccess = (input) => {
    const formField = input.parentElement;
    formField.classList.remove('error');
    formField.classList.add('success');
    const error = formField.querySelector('small');
    error.textContent = '';
}

const isEmailValid = (email) => {
    const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
};

const isPasswordSecure = (password) => {
    const re = new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})");
    return re.test(password);
};

const isRequired = value => value === '' ? false : true;

const isBetween = (length, min, max) => length < min || length > max ? false : true;

const checkEmail = () => {
    let valid = false;
    const email = emailEl.value.trim();
    if (!isRequired(email)) {
        showError(emailEl, 'Email cannot be blank.');
    } else if (!isEmailValid(email)) {
        showError(emailEl, 'Email is not valid.')
    } else {
        showSuccess(emailEl);
        valid = true;
    }
    return valid;
};

const checkPassword = () => {
    let valid = false;
    const password = passwordEl.value.trim();
    if (!isRequired(password)) {
        showError(passwordEl, 'Password cannot be blank.');
    }
    else if (!isPasswordSecure(password)) {
        showError(passwordEl, 'Password must has at least 8 characters that include at least 1 lowercase character, 1 uppercase characters, 1 number, and 1 special character in (!@#$%^&*)');
    }
    else {
        showSuccess(passwordEl);
        valid = true;
    }
    return valid;
};

const debounce = (fn, delay = 500) => {
    let timeoutId;
    return (...args) => {
        if (timeoutId) {
            clearTimeout(timeoutId);
        }
        timeoutId = setTimeout(() => {
            fn.apply(null, args)
        }, delay);
    };
};

