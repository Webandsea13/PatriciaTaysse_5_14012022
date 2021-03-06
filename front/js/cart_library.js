/**
 * récupérer le panier depuis le local storage
 * @returns  {array} cart le panier
 */
function loadCart() {
	let panierLinea = localStorage.getItem("panierLocalstorage");
	let cart = JSON.parse(panierLinea);

	if (cart == null) {
		return [];
	}
	return cart;
}

/**
 * envoyer le panier vers le local storage pour sauvegarde
 * @param {array} panier le panier
 */
function saveCart(panier) {
	let panierLinea = JSON.stringify(panier);
	localStorage.setItem("panierLocalstorage", panierLinea);
}

/**
 * fonction ajouter un choix (!format objet) au panier ou cumuler quantité si
 * choix déjà existant dans le panier (id et couleur)
 * @param  {object} newChoice (choix de l'utilisateur : id, couleur et quantité)
 */
function addToCart(newChoice) {
	// appel fonction Récupérer le panier existant depuis le local storage
	const cart = loadCart();

	// Ajouter l'élément dans panier ou incrémenter la quantité si élément identique déjà existant
	//recherche d'un élément identique :
	const elementExistant = cart.find(
		(x) => x.id == newChoice.id && x.color == newChoice.color
	);
	if (elementExistant == null) {
		cart.push(newChoice);
	} else {
		elementExistant.quantity += parseInt(newChoice.quantity);
	}
	alert("Votre choix vient d'être ajouté au panier");
	//appel fonction sauvegarder panier
	saveCart(cart);
}

/**
 *Vide le panier quand la commande est validée
 */
function clearCart() {
	localStorage.clear();
}
