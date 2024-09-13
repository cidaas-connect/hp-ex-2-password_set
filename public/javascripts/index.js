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

    /*
        Step 2:

        On click of the set PW button, trigger the setPassword function.
    */
    
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

        /*
            Step 4:

            Upon click on the password Eye Icons, toggle the password visibility.
            // Hint: textContent
        */

        /*
            Step 5:

            upon page load, load the styling information from the server.
        */
});

/**
 * 
 * Step 2.: Call the set Password API
 * 
 */
function setPassword(resetRequestId, exchangeId) {
    const setPasswordUrl = 'https://connect-prod.cidaas.eu/users-srv/resetpassword/accept';
    // Body: resetRequestId=ddb3e552-e9c4-4c13-b299-8cdd36b4bec7&exchangeId=30aac844-3ca8-4149-8fba-be94ce7b7062&password=test123&confirmPassword=test123
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

}