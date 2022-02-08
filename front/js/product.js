//******************affichage de la page produit************************
// ! requires cart_library.js (utilisation addToCart)

//declaration de la fonction callback de l'evenement du bouton "ajouter au panier"
/**
 * Handler d'ajout dans le panier
 * @param {string} idProduct (l'id du produit affiché)
 */

const addToCartCallback = function (idProduct) {
	return function (event) {
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
	};
};

//declaration fonction pour afficher un produit dans la page product.html
//et écoute bouton ajouter au panier
/**
 * récuperation d'un produit dans la base de données et insertion du HTML
 * écoute du bouton ajouter au panier
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
		.appendChild(document.createElement("img"));
	document
		.querySelector(".item__img img")
		.setAttribute("src", `${product.imageUrl}`);
	document
		.querySelector(".item__img img")
		.setAttribute("alt", `${product.altTxt}`);

	//insertion détails éléments
	document.getElementById("title").textContent = `${product.name}`;

	document.getElementById("price").textContent = `${product.price}`;

	document.getElementById(
		"description"
	).textContent = `${product.description}`;

	//insertion des couleurs dans le menu déroulant
	for (let color of product.colors) {
		document
			.getElementById("colors")
			.insertAdjacentHTML(
				"beforeend",
				`<option value="${color}"> ${color} </option>  `
			);
	}

	//écoute du bouton ajouter au panier et appel fonction callback

	document
		.getElementById("addToCart")
		.addEventListener("click", addToCartCallback(idProduct));
};

//appel fonction onLoadOne
onLoadOne();
