function recupererPanier() {
	let panierLinea = localStorage.getItem("panierLocalstorage");
	let panier = JSON.parse(panierLinea);

	if (panier == null) {
		return [];
	}
	return panier;
}

//fonction ajouter un choix (!format objet) au panier ou cumuler quantité si choix déjà existant dans le panier (id et couleur)
function ajoutPanier(nouveauchoix) {
	// Récupérer le panier existant
	const panier = recupererPanier();

	// Ajouter l'élément dans panier ou incrémenter la quantité
	const elementExistant = panier.find(
		(x) => x.id == nouveauchoix.id && x.color == nouveauchoix.color
	);
	if (elementExistant == null) {
		panier.push(nouveauchoix);
	} else {
		elementExistant.quantity += nouveauchoix.quantity;
	}

	// Sauvegarder le nouveau panier
	let panierLinea = JSON.stringify(panier);
	localStorage.setItem("panierLocalstorage", panierLinea);
}
