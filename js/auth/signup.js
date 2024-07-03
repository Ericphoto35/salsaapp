//Implémenter le JS de ma page

const inputNom = document.getElementById("NomInput");
const inputMail = document.getElementById("EmailInput");
const inputPassword = document.getElementById("PasswordInput");
const selectChoice = document.getElementById("SelectChoice");
const btnSignup = document.getElementById('btnSignup');
const formInscription = document.getElementById('formulaireInscription');


inputNom.addEventListener("keyup", validateForm);
inputMail.addEventListener("keyup", validateForm);
inputPassword.addEventListener("keyup", validateForm);
selectChoice.addEventListener("change", validateForm);

btnSignup.addEventListener("click", InscrireUtilisateur);


//Function permettant de valider tout le formulaire
btnSignup.disabled = true;
function validateForm() {
    validateRequired(inputNom);
    validateRequired(inputMail);
    validatePassword(inputPassword);
    validateChoice(selectChoice);

    // Vérifier si tous les champs sont valides
    const isValid = inputNom.classList.contains("is-valid") &&
        inputMail.classList.contains("is-valid") &&
        inputPassword.classList.contains("is-valid") &&
        selectChoice.classList.contains("is-valid");

    // Activer ou désactiver le bouton en fonction de la validité du formulaire
    btnSignup.disabled = !isValid;
}


function validateRequired(input) {
    if (input.value != '') {
        input.classList.add("is-valid");
        input.classList.remove("is-invalid");
    }
    else {
        input.classList.remove("is-valid");
        input.classList.add("is-invalid");
    }
}

function validatePassword(input) {
    //Définir mon regex
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_])[A-Za-z\d\W_]{8,}$/;
    const passwordUser = input.value;
    if (passwordUser.match(passwordRegex)) {
        input.classList.add("is-valid");
        input.classList.remove("is-invalid");
        return true;
    }
    else {
        input.classList.remove("is-valid");
        input.classList.add("is-invalid");
        return false;
    }
}
function validateChoice(select) {
    if (select.value != 'Selectionne ton cours') {
        select.classList.add("is-valid");
        select.classList.remove("is-invalid");
    }
    else {
        select.classList.remove("is-valid");
        select.classList.add("is-invalid");
    }
}

function InscrireUtilisateur() {
    const dataForm = new FormData(formInscription);
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    const raw = JSON.stringify({
        "email": dataForm.get("email"),
        "password": dataForm.get("password"),
        "nom": dataForm.get("nom"),
        "cours": dataForm.get("cours")

    });

    const requestOptions = {
        method: "POST",
        headers: myHeaders,
        body: raw,
        redirect: "follow"
    };

    fetch("http://127.0.0.1:8000/api/registration", requestOptions)
    .then(response => {
        if(response.ok){
            return response.json();
        }
        else{
            alert("Erreur lors de l'inscription");
        }
    })
    .then(result => {
        alert("Bravo "+dataForm.get("nom")+", vous êtes maintenant inscrit, vous pouvez vous connecter.");
        document.location.href="/login";
    })
    .catch(error => console.log('error', error));
}