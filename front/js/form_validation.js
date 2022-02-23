/**
 * Exécute une validation sur un input de type texte simple (sans chiffre).
 * @param {HTMLInputElement} input l'input à valider
 * @param {HTMLElement} msgElement l'élément HTML où afficher le message d'erreur
 * @param {string} msgOK le message de validation
 * @param {string} msgError le message d'erreur
 * @returns true si la validation s'est bien déroulée, false sinon
 */
function nameValidation(input, msgElement, msgOK, msgError) {
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

/**
 * Exécute une validation sur un input de type adresse(avec chiffres).
 * @param {HTMLInputElement} input l'input à valider
 * @param {HTMLElement} msgElement l'élément HTML où afficher le message d'erreur
 * @param {string} msgOK le message de validation
 * @param {string} msgError le message d'erreur
 * @returns true si la validation s'est bien déroulée, false sinon
 */
function locationValidation(input, msgElement, msgOK, msgError) {
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

/**
 * Exécute une validation sur une adresse email
 * @param {HTMLInputElement} input l'input à valider
 * @param {HTMLElement} msgElement l'élément HTML où afficher le message d'erreur
 * @param {string} msgOK le message de validation
 * @param {string} msgError le message d'erreur
 * @returns  true si la validation s'est bien déroulée, false sinon
 */
function mailValidation(input, msgElement, msgOK, msgError) {
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
