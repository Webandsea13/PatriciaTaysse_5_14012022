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
const panier = [];
//problème : elle se vide quand on ouvre la page d'un autre produit
//solution récupérer d'abord le panier dans le local storage
/*let panierLinea = localStorage.getItem("panierLocalstorage");
let panier = JSON.parse(panierLinea);
console.log(panier);
*/
//si le panier est vide, cela ne fonctione pas (null)

/*--------------essai fonction avec choix en format tableau
//fonction ajouter un choix au panier ou cumuler quantité si choix déjà existant dans le panier(id et couleur identiques)
function ajout_panier(nouveauchoix) {
	for (let object of panier) {
		if (object[0] === nouveauchoix[0] && object[1] === nouveauchoix[1]) {
			object[2] += nouveauchoix[2];
		} else {
			panier.push(nouveauchoix);
		}
	}
}
*/

//fonction ajouter un choix (!format objet) au panier ou cumuler quantité si choix déjà existant dans le panier (id et couleur)

/*function ajout_panier(nouveauchoix) {
	for (let objet of panier) {
		if (nouveauchoix.id == objet.id && nouveauchoix.color == objet.color) {
			objet.quantity += nouveauchoix.quantity;
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

		//création d'un objet pour stocker le choix utilisateur
		let choix = {
			id: idProduct,
			color: choixColor,
			quantity: choixQuantity,
		};
		console.log(choix);

		//ajout du choix dans le tableau panier qui cumule les différents choix
		// et Vérification de l'existence d'un produit identique ou non avec la fonction ajout_panier

		panier.push(choix);
		//ou appel fonction
		//ajout_panier(choix);
		console.log(panier);

		//envoi du tableau dans local storage
		let panierLinea = JSON.stringify(panier);
		localStorage.setItem("panierLocalstorage", panierLinea);
	});
