//récupérer le panier depuis le local storage
function recupererPanier() {
	let panierLinea = localStorage.getItem("panierLocalstorage");
	let panier = JSON.parse(panierLinea);

	if (panier == null) {
		return [];
	}
	return panier;
}

//envoyer le panier vers le local storage
function sauvegarderPanier(panier) {
	let panierLinea = JSON.stringify(panier);
	localStorage.setItem("panierLocalstorage", panierLinea);
}

//fonction ajouter un choix (!format objet) au panier ou cumuler quantité si choix déjà existant dans le panier (id et couleur)
function ajoutPanier(nouveauchoix) {
	// appel fonction Récupérer le panier existant
	const panier = recupererPanier();

	// Ajouter l'élément dans panier ou incrémenter la quantité si élément identique déjà existant
	//recherche d'un élément identitique :
	const elementExistant = panier.find(
		(x) => x.id == nouveauchoix.id && x.color == nouveauchoix.color
	);
	if (elementExistant == null) {
		panier.push(nouveauchoix);
	} else {
		elementExistant.quantity += nouveauchoix.quantity;
	}
	//appel fonction sauvegarder panier
	sauvegarderPanier(panier);
}
