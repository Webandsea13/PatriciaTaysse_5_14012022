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
			quantity: parseInt(choixQuantity),
		};
		console.log(choix);

		//ajout du choix dans le tableau panier qui cumule les différents choix
		// et Vérification de l'existence d'un produit identique ou non avec la fonction ajoutPanier

		//ou appel fonction
		ajoutPanier(choix);
	});
