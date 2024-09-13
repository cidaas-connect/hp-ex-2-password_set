// ## Common Javascript functionality to get started:
//
// # Read url parameter
// const x = urlParams.get('x');
//
// # Get html element
// const errorMessage = document.getElementById('error-message');
//
// # Set text content
// errorMessage.textContent = 'Nothing to see here.';
//
// # Disable element 
// resetButton.disabled = true;
//
// # Add / Remove css class
// errorMessage.classList.add('hidden');
// errorMessage.classList.remove('hidden');
//
// # Add event listener for Cancel button
// cancelButton.addEventListener('click', function() {
//     doSomething();
// });
//
// # Http fetch:
// fetch(url, {
//     method: 'POST',
//     headers: {
//         'Content-Type': 'application/json'
//     },
//     body: JSON.stringify({
//         a: "b"
//     })
// })
//     .then(response => {
//         if (response.ok) {
//             let json = response.json();
//             doSomethingWithJson(json);
//         } else {
//             console.error('Something went wrong');
//         }
//     })
//     .catch(error => {
//         console.error('Error:', error);
//     });
//
// # Set global css variables:
// document.documentElement.style.setProperty('--form-border-color', data.data.accentColor);
//
// # Basepath: https://connect-prod.cidaas.eu

document.addEventListener('DOMContentLoaded', function () {
    const urlParams = new URLSearchParams(window.location.search);
    /*
        Step 1:

        Load & check that the requestId, exchangeId, rprq are set in the browser URL.

        Javascript function: urlParams.get('');
        If it is not set, display error message in errorMessage.textContent = ''
    */
    const requestId = urlParams.get('requestId')
    if (!requestId) {
        errorMessage.textContent = 'Request ID is missing in the URL. Please check the link you followed.';
        errorMessage.classList.remove('hidden');
    }

    const exchangeId = urlParams.get('exchangeId')
    if (!exchangeId) {
        errorMessage.textContent = 'Exchange ID is missing in the URL. Please check the link you followed.';
        errorMessage.classList.remove('hidden');
    }

    const rprq = urlParams.get('rprq')
    if (!rprq) {
        errorMessage.textContent = 'rprq is missing in the URL. Please check the link you followed.';
        errorMessage.classList.remove('hidden');
    }

    /*
        Step 2:

        On click of the set PW button, trigger the setPassword function.
    */
    const setPWButton = document.getElementById('set-password-button');
    setPWButton.addEventListener('click', function () {
        setPassword(rprq, exchangeId);
    });

    /*
        Step 3:

        Add functionality to the cancel button.
        If clicked, it should redirect back to the login page.

        client_id = b48565f3-456e-4251-9437-51ee330bdc02
        We use the token flow for simplicities sake.
        redirect_uri=https://connect-prod.cidaas.eu/user-profile/editprofile

        Better than going back to the Authz - call the authz resolve_redirect API:
        https://connect-prod.cidaas.eu/authz-srv/authz/resolve_redirect/4a509397-939d-42c9-a5f8-907dbd896bba

        Creating a new authz wil create a new login flow, so the user will loose any context information available through the requestId - 
        E.g. already set invite information for the user (family_name / given_name).
        Calling the authz/resolve_redirect will keep the same requestId
    */
    document.getElementById('cancel-button').addEventListener('click', function () {
        window.location.href = ' https://connect-prod.cidaas.eu/authz-srv/authz/resolve_redirect/' + requestId;
    });


    /*
        Step 4:

        Upon click on the password Eye Icons, toggle the password visibility.
    */
    const passwordToggles = document.querySelectorAll('.password-toggle');

    passwordToggles.forEach(toggle => {
        toggle.addEventListener('click', function () {
            const input = this.previousElementSibling;
            if (input.type === 'password') {
                input.type = 'text';
                this.textContent = 'visibility';
            } else {
                input.type = 'password';
                this.textContent = 'visibility_off';
            }
        });
    });

    /*
        Step 5:

        upon page load, load the styling information from the server.
    */
    if (requestId) {
        loadStylingInformation(requestId);
    }
});

/**
 * 
 * Step 2.: Call the set Password API
 * 
 */
function setPassword(resetRequestId, exchangeId) {
    const setPasswordUrl = 'https://connect-prod.cidaas.eu/users-srv/resetpassword/accept';
    // Body: resetRequestId=ddb3e552-e9c4-4c13-b299-8cdd36b4bec7&exchangeId=30aac844-3ca8-4149-8fba-be94ce7b7062&password=test123&confirmPassword=test123
    let password = document.getElementById('password-input').value
    let confirmPassword = document.getElementById('confirm-password-input').value
    if (password !== confirmPassword) {
        document.getElementById('error-message').textContent = 'Passwords do not match';
        document.getElementById('error-message').classList.remove('hidden');
        return
    }
    if (password.length === 0) {
        document.getElementById('error-message').textContent = 'Please enter a password'
        document.getElementById('error-message').classList.remove('hidden');
        return
    }
    createFormPost(setPasswordUrl, {
        resetRequestId: resetRequestId,
        exchangeId: exchangeId,
        password: password,
        confirmPassword: confirmPassword,
    })
}

// We are using a form post, because we want to automatically follow redirects
function createFormPost(url, body) {
    try {
        const form = document.createElement('form');
        form.action = url;
        form.method = 'POST';
        for (const key in body) {
            if (body.hasOwnProperty(key)) {
                const hiddenField = document.createElement("input");
                hiddenField.setAttribute("type", "hidden");
                hiddenField.setAttribute("name", key);
                hiddenField.setAttribute("value", body[key]);

                form.appendChild(hiddenField);
            }
        }
        document.body.appendChild(form);
        form.submit();
    } catch (ex) {
        document.getElementById('error-message').textContent = 'Error: ' + ex.message;
        document.getElementById('error-message').classList.remove('hidden');
    }
}

/**
 * Step 5: Load Styling information & password policy from app
 * @param {string} requestId 
 */
function loadStylingInformation(requestId) {
    // fetch from "https://connect-prod.cidaas.eu/public-srv/public/" + requestId
    fetch("https://connect-prod.cidaas.eu/public-srv/public/" + requestId).then(response => {
        if (response.ok) {
            response.json().then(data => {
                console.log(data)
                document.getElementById('background').style.backgroundImage = `url('${data.data.backgroundUri}')`;
                document.documentElement.style.setProperty('--form-border-color', data.data.accentColor);
                document.documentElement.style.setProperty('--primary-button-color', data.data.primaryColor);
                if (data.data.password_policy) {
                    console.log("Password policy: ", data.data.password_policy)
                }
            }).catch(error => {
                console.error('Error:', error);
            })
        } else {
            console.error('Failed to initiate password reset');
        }
    })
}