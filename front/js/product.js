//******************affichage de la page produit************************
// Récupérer l'url
const Url = window.location.href;
console.log(Url);

// Parse l'url récupéré pour trouver l'id
const UrlProduct = new URL(Url);
console.log(UrlProduct);

// Récupérer l'id depuis l'URL
const idProduct = UrlProduct.searchParams.get("id");
console.log(idProduct);

// Fetch le produit d'id {id}
const UrlFetch = "http://localhost:3000/api/products/" + idProduct;
console.log(UrlFetch);

fetch(UrlFetch)
	.then(function (res) {
		return res.json();
	})
	.then(function (product) {
		console.log(product);
		console.log(product.imageUrl);
		console.log(product.name);
		// Insérer les éléments correspondants dans le HTML :
		//insertion image
		document
			.querySelector(".item__img")
			.insertAdjacentHTML(
				"beforeend",
				`<img src= "${product.imageUrl}" alt="${product.altTxt}">`
			);

		//insertion détails éléments
		document
			.getElementById("title")
			.insertAdjacentHTML("beforeend", product.name);

		document
			.getElementById("price")
			.insertAdjacentHTML("beforeend", product.price);

		document
			.getElementById("description")
			.insertAdjacentHTML("beforeend", product.description);

		//insertion des couleurs dans le menu déroulant
		for (let color of product.colors) {
			document
				.getElementById("colors")
				.insertAdjacentHTML(
					"beforeend",
					`<option value="${color}"> ${color} </option>  `
				);
		}
	})

	.catch(function (err) {
		alert("Erreur:" + err);
	});

//***************gestion de l'ajout au local storage par le bouton envoyer********************

//creation d'un tableau vide qui contiendra tous les choix à ajouter au panier
let panier = [];
/*
//fonction ajouter un choix au panier ou cumuler quantité si choix déjà existant dans le panier(id et couleur identiques)
function ajout_panier(nouveauchoix) {
	for (let object of panier) {
		if (object[0] === idProduct && object[1] === choixColor) {
			object[2] += choixQuantity;
		} else {
			panier.push(nouveauchoix);
		}
	}
}
*/

//écoute du bouton ajouter au panier et recupération d'un choix utilisateur
document
	.getElementById("addToCart")
	.addEventListener("click", function (event) {
		event.preventDefault();
		//récupération du choix utilisateur
		let choixColor = document.getElementById("colors").value;
		console.log(choixColor);
		let choixQuantity = document.getElementById("quantity").value;
		console.log(choixQuantity);
		//création d'un tableau pour stocker le choix utilisateur
		let choix = [idProduct, choixColor, choixQuantity];
		console.log(choix);
		//ajout du choix dans le tableau qui cumule les différents choix
		panier.push(choix); /*ou appel de la fonction ajout_panier(choix);*/
		console.log(panier);

		//envoi du tableau dans local storage
		let panierLinea = JSON.stringify(panier);
		localStorage.setItem("panierLocalstorage", panierLinea);
	});
