/**
 * récupérer le panier depuis le local storage
 * @params : none
 * @returns : {array} panier
 */
function loadCart() {
	let panierLinea = localStorage.getItem("panierLocalstorage");
	let panier = JSON.parse(panierLinea);

	if (panier == null) {
		return [];
	}
	return panier;
}

/**
 * envoyer le panier vers le local storage pour sauvegarde
 * params : {array}
 * returns : {string} panierLinea
 */
function saveCart(panier) {
	let panierLinea = JSON.stringify(panier);
	localStorage.setItem("panierLocalstorage", panierLinea);
}

/**
 * fonction ajouter un choix (!format objet) au panier ou cumuler quantité si
 *choix déjà existant dans le panier (id et couleur)--fonction utilisée dans product.js
 *params : {objet} newChoice
 *returns : {string} panierLinea
 */
function addToCart(newChoice) {
	// appel fonction Récupérer le panier existant
	const panier = loadCart();

	// Ajouter l'élément dans panier ou incrémenter la quantité si élément identique déjà existant
	//recherche d'un élément identique :
	const elementExistant = panier.find(
		(x) => x.id == newChoice.id && x.color == newChoice.color
	);
	if (elementExistant == null) {
		panier.push(newChoice);
	} else {
		elementExistant.quantity += newChoice.quantity;
	}

	//appel fonction sauvegarder panier
	saveCart(panier);
}
