/****************gestion du formulaire*************** */

//controle du champ prénom (le regexp.test() renvoie true ou false)

//definition des 3 regexp utilisées : nom, localisation, email

//declaration des fonctions de validation des champs du formulaire

function FirstNameControl(contact) {
	let inputFirstName = document.querySelector("#firstName");
	let message = document.querySelector("#firstNameErrorMsg");
	let nameRegExp = new RegExp(`^[A-Za-zéèêàç '-]+$`, `g`);
	let isValid = nameRegExp.test(contact.firstName);

	if (isValid) {
		inputFirstName.style.backgroundColor = "green";
		message.textContent = "Prénom valide";
		message.style.color = "green";
		return true;
	} else {
		inputFirstName.style.backgroundColor = "#FF6F61";
		message.textContent = "Prénom invalide";
		return false;
	}
}
//controle du champ nom

function LastNameControl(contact) {
	let inputLastName = document.querySelector("#lastName");
	let message = document.querySelector("#lastNameErrorMsg");
	let nameRegExp = new RegExp(`^[A-Za-zéèêàç '-]+$`, `g`);
	let isValid = nameRegExp.test(contact.lastName);
	console.log(isValid);

	if (isValid) {
		inputLastName.style.backgroundColor = "green";
		message.textContent = "Nom valide";
		message.style.color = "green";
		return true;
	} else {
		inputLastName.style.backgroundColor = "#FF6F61";
		message.textContent = "Nom invalide";
		return false;
	}
}

//controle du champ adresse

function addressControl(contact) {
	let inputAddress = document.querySelector("#address");
	let message = document.querySelector("#addressErrorMsg");
	let addressAndCityRegExp = new RegExp(`^[A-Za-z0-9éèêàç ',-]+$`, `g`);

	let isValid = addressAndCityRegExp.test(contact.address);

	if (isValid) {
		inputAddress.style.backgroundColor = "green";
		message.textContent = "Adresse valide";
		message.style.color = "green";
		return true;
	} else {
		inputAddress.style.backgroundColor = "#FF6F61";
		message.textContent = "Adresse invalide, exemple: 10 rue du port ";
		return false;
	}
}

//controle du champ ville

function cityControl(contact) {
	let inputCity = document.querySelector("#city");
	let message = document.querySelector("#cityErrorMsg");
	let addressAndCityRegExp = new RegExp(`^[A-Za-z0-9éèêàç ',-]+$`, `g`);

	let isValid = addressAndCityRegExp.test(contact.city);

	if (isValid) {
		inputCity.style.backgroundColor = "green";
		message.textContent = "Ville valide";
		message.style.color = "green";
		return true;
	} else {
		inputCity.style.backgroundColor = "#FF6F61";
		message.textContent =
			"Ville invalide, exemple: 33510 Andernos-les-Bains";
		return false;
	}
}

// contrôle du champ Email

function mailControl(contact) {
	let inputMail = document.querySelector("#email");
	let message = document.querySelector("#emailErrorMsg");
	let emailRegExp = new RegExp(
		`^[a-zA-Z0-9.-_]+[@]{1}[a-zA-Z0-9._-]+[.][a-z]{2,8}$`,
		`g`
	);

	let isValid = emailRegExp.test(contact.email);

	if (isValid) {
		inputMail.style.backgroundColor = "green";
		message.textContent = "Email valide";
		return true;
	} else {
		inputMail.style.backgroundColor = "#FF6F61";
		message.textContent = "Email invalide, exemple: contact@monsite.fr";
		return false;
	}
}
