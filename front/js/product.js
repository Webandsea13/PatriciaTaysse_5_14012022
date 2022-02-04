//******************affichage de la page produit************************
// ! requires cart_library.js (utilisation addToCart)

//declaration fonction pour afficher un produit dans la page product.html
//et action bouton ajouter au panier
/**
 * récuperation d'un produit dans la base de données
 * @param : none
 * @return :
 *
 */
const onLoadOne = async function () {
	// Récupérer l'url
	const Url = window.location.href;

	// Parse l'url récupéré pour trouver l'id
	const UrlProduct = new URL(Url);

	// Récupérer l'id depuis l'URL
	const idProduct = UrlProduct.searchParams.get("id");

	// Fetch le produit d'id {id}
	const UrlFetch = "http://localhost:3000/api/products/" + idProduct;
	const product = await fetch(UrlFetch)
		.then(function (res) {
			return res.json();
		})

		.catch(function (err) {
			alert("Un problème d'accès au serveur est survenu.\n" + err);
		});

	console.log(product);

	// Insérer les éléments du produit dans le HTML :
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

	//***************gestion de l'ajout au local storage par le bouton ajouter au panier********************

	//écoute du bouton ajouter au panier et recupération d'un choix utilisateur
	document
		.getElementById("addToCart")
		.addEventListener("click", function (event) {
			event.preventDefault();

			//récupération du choix utilisateur
			let chosenColor = document.getElementById("colors").value;

			let chosenQuantity = document.getElementById("quantity").value;

			//création d'un objet pour stocker le choix utilisateur
			let choice = {
				id: idProduct,
				color: chosenColor,
				quantity: parseInt(chosenQuantity),
			};
			console.log(choice);

			// appel fonction définie dans cart_library.js
			//definition conditions ajout au panier
			if (chosenColor == "" || chosenQuantity == 0) {
				alert("Vous devez choisir une couleur et une quantité !");
			} else {
				addToCart(choice);
			}
		});
};

//appel fonction onLoadOne
onLoadOne();
