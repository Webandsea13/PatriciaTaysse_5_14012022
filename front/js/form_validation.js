/****************gestion du formulaire*************** */

//controle des champs nom et prenom
function nameControl(input, msgElement, msgOK, msgError) {
	let nameRegExp = new RegExp(`^[A-Za-zéèêàç '-]+$`, `g`);
	const isValid = nameRegExp.test(input.value);
	if (isValid) {
		msgElement.textContent = msgOK;
		msgElement.style.color = "green";
		return true;
	} else {
		input.style.backgroundColor = "#FF6F61";
		msgElement.textContent = msgError;
		return false;
	}
}
//controle du champ adresse et ville
function locationControl(input, msgElement, msgOK, msgError) {
	let addressAndCityRegExp = new RegExp(`^[A-Za-z0-9éèêàç ',-]+$`, `g`);
	const isValid = addressAndCityRegExp.test(input.value);
	if (isValid) {
		msgElement.textContent = msgOK;
		msgElement.style.color = "green";
		return true;
	} else {
		input.style.backgroundColor = "#FF6F61";
		msgElement.textContent = msgError;
		return false;
	}
}

// contrôle du champ Email

function mailControl(input, msgElement, msgOK, msgError) {
	let emailRegExp = new RegExp(
		`^[a-zA-Z0-9.-_]+[@]{1}[a-zA-Z0-9._-]+[.][a-z]{2,8}$`,
		`g`
	);

	const isValid = emailRegExp.test(input.value);

	if (isValid) {
		msgElement.textContent = msgOK;
		msgElement.style.color = "green";
		return true;
	} else {
		input.style.backgroundColor = "#FF6F61";
		msgElement.textContent = msgError;
		return false;
	}
}
