// ! requires cart-library.js
// ! requires form_validation.js

//creation tableau des articles pour regrouper les données venant du localStorage et du fetch
let articlesArray = [];
//declaration tableau panier avec élément provenant du localstorage (id, couleur, quantité)
let cart;

////////////////////////////////////////////////////////////////////////////////////
/////definition des fonctions utilisées dans le fichier////////////////////////////
///////////////////////////////////////////////////////////////////////////////////

//fonction qui réunit dans un objet article les informations du fetch
//et du local storage, article pushé dans un tableau articlesArray
/**
 * récupération des données du localStorage et du backend par un fetch
 * remplissage tableau articlesAray avec objet article
 */
const getMixedData = async function () {
	//récupération panier localStorage
	cart = loadCart();
	console.log(cart);

	//récupération des promesses des fetchs pour chaque élément du panier
	//et gestion de l'objet article et du tableau articlesArray
	await Promise.all(
		cart.map(async function (cartElement) {
			const idProduct = cartElement.id;
			const UrlFetch = "http://localhost:3000/api/products/" + idProduct;
			const oneFetch = await fetch(UrlFetch)
				.then(function (res) {
					return res.json();
				})
				.catch(function (err) {
					alert(err);
				});
			let article = {
				id: cartElement.id,
				color: cartElement.color,
				quantity: cartElement.quantity,
				price: oneFetch.price,
				name: oneFetch.name,
				url: oneFetch.imageUrl,
				altTxt: oneFetch.altTxt,
			};
			articlesArray.push(article);

			console.log(articlesArray);
		})
	);
	/*for (let c of cart) {
		const idProduct = c.id;
		const UrlFetch = "http://localhost:3000/api/products/" + idProduct;

		const oneFetch = await fetch(UrlFetch)
			.then(function (res) {
				return res.json();
			})
			.catch(function (err) {
				alert(err);
			});

		let article = {
			id: c.id,
			color: c.color,
			quantity: c.quantity,
			price: oneFetch.price,
			name: oneFetch.name,
			url: oneFetch.imageUrl,
			altTxt: oneFetch.altTxt,
		};
		articlesArray.push(article);

		console.log(articlesArray);
	}*/
};

//fonction callback de l'événement modification de quantité
//mise à jour de articlesArray et cart avec la nouvelle quantité
//mise à jour des totaux du panier
/**
 * Handler de changement de quantité d'un produit
 * @param {*} event
 */
const changeQuantityCallback = function (event) {
	//trouver élément proche du clic et contenant les informations du produit concerné
	let item = event.target.closest(".cart__item");

	//récupérer id et couleur produit concerné
	const chosenId = item.dataset.id;
	const chosenColor = item.dataset.color;
	//chercher l'élément dans le tableau des articles
	const chosenItem = articlesArray.find(
		(x) => x.id == chosenId && x.color == chosenColor
	);
	//Appliquer la nouvelle quantité dans le tableau d'articles
	chosenItem.quantity = parseInt(event.target.value);
	//chercher l'élément dans le panier
	const chosenItem2 = cart.find(
		(x) => x.id == chosenId && x.color == chosenColor
	);
	//Appliquer la nouvelle quantité dans l'élément panier localStorage
	chosenItem2.quantity = parseInt(event.target.value);

	//appel fonction sauvegarder panier
	saveCart(cart);
	console.log(cart);
	console.log(articlesArray);
	//recalculer prix total et quantité totale
	refreshPriceAndQuantity();
};

// fonction callback exécutée à la suppression d'un produit du panier par l'utilisateur
//modification de articlesArray et cart
//affichage du nouveau panier
/**
 * Handler de suppression d'un produit du panier
 * @param {event} evenement suppression
 */
const deleteItemCallback = function (event) {
	let item = event.target.closest(".cart__item");
	const chosenId = item.dataset.id;
	const chosenColor = item.dataset.color;
	const cart = loadCart();
	//filtrer le panier sans l'élément à supprimer
	const result = cart.filter(
		(n) => !(n.id === chosenId && n.color === chosenColor)
	);
	console.log(result);
	saveCart(result);
	//filter le tableau des articles sans l'element à supprimer
	articlesArray = articlesArray.filter(
		(n) => !(n.id === chosenId && n.color === chosenColor)
	);
	console.log(articlesArray);
	//afficher nouveau panier
	displayCart();
};

/**
 * affichage des articles de articlesArray et des totaux
 * écoute des événements de la page : modification, suppression, commande
 */
const displayCart = function () {
	document.getElementById("cart__items").innerHTML = "";
	if (articlesArray.length == 0) {
		let titre = document.querySelector("h1");
		let precision = document.createElement("p");
		let precisionText = document.createTextNode(
			"Le panier est vide ! Retournez en page d'accueil choisir vos articles."
		);
		precision.appendChild(precisionText);
		precision.style.color = "#FF6F61";
		precision.style.backgroundColor = "white";
		document
			.getElementById("cartAndFormContainer")
			.insertBefore(precision, document.querySelector(".cart"));
	}

	for (let article of articlesArray) {
		//declaration de la constante contenant le html pour un produit du panier
		const objectAsHTML = `<article class="cart__item" data-id=${article.id} data-color=${article.color}>
				<div class="cart__item__img">
				<img src="${article.url}" alt="${article.altTxt}">
				</div>
				<div class="cart__item__content">
				<div class="cart__item__content__description">
					<h2>${article.name}</h2>
					<p>${article.color}</p>
					<p>${article.price} €</p>
				</div>
				<div class="cart__item__content__settings">
					<div class="cart__item__content__settings__quantity">
					<p>Qté : </p>
					<input type="number" class="itemQuantity" name="itemQuantity" min="1" max="100" value=${article.quantity}>
					</div>
					<div class="cart__item__content__settings__delete">
					<p class="deleteItem">Supprimer</p>
					</div>
				</div>
				</div>
				</article>`;

		//insertion du html
		document
			.getElementById("cart__items")
			.insertAdjacentHTML("beforeend", objectAsHTML);
	}

	refreshPriceAndQuantity();

	/////////gestion des evenements de la page ///////////////

	//**********************changement quantité par l'utilisateur*********************

	//écoute click + appel fonction changeQuantityCallback
	//récupérer dans un tableau les éléments susceptibles d'être cliqués +/-
	let tabItemQuantity = document.querySelectorAll(".itemQuantity");

	for (let itemQuantity of tabItemQuantity) {
		itemQuantity.addEventListener("change", changeQuantityCallback);
	}

	//*************************suppression d'un article************* */
	//récupérer dans un tableau les éléments susceptibles d'etre cliqués pour la suppression

	let tabDeleteItems = document.querySelectorAll(".deleteItem");

	tabDeleteItems.forEach(function (delIt) {
		delIt.addEventListener("click", deleteItemCallback);
	});
};

/**
 * calculs et affichage du nombre total d'articles et du prix total du panier
 */
const refreshPriceAndQuantity = function () {
	let totalQuantity = 0;
	let totalPrice = 0;
	for (let article of articlesArray) {
		//cumul nombre articles
		totalQuantity += parseInt(article.quantity);

		//cumul prix
		//on récupère le prix stocké dans priceProducts grace à la clé p.id
		//pour le mettre dans la constante prixProduit

		let price = article.price * article.quantity;
		totalPrice += price;
	}

	//affichage nombre articles
	document.getElementById("totalQuantity").textContent = `${totalQuantity}`;
	//affichage du prix total
	document.getElementById("totalPrice").textContent = `${totalPrice}`;
};

////////////gestion du formulaire/////////////////////
function submitOrder() {
	//selection du bouton envoyer
	const btnOrder = document.querySelector("#order");

	// Écoute  click pour pouvoir créer les éléments à envoyer au backend,
	// contrôler, valider et envoyer le formulaire via formSubmitCallback
	btnOrder.addEventListener("click", formSubmitCallback);
}

//definition de la fonction exécutée au click du bouton commander
/**
 * Vérifie le formulaire et envoie la commande
 * @param {event} evenement click "commander"
 *
 */
const formSubmitCallback = function (event) {
	event.preventDefault();

	if (cart.length == 0) {
		alert("Attention, le panier est vide !");
		return;
	}
	//creation objet contact
	let contact = {
		firstName: document.querySelector("#firstName").value,
		lastName: document.querySelector("#lastName").value,
		address: document.querySelector("#address").value,
		city: document.querySelector("#city").value,
		email: document.querySelector("#email").value,
	};

	console.log(contact);

	//creation du tableau products contenant les id des produits du panier
	products = cart.map((x) => x.id);
	console.log(products);

	//verification du formulaire avec les fonctions définies dans form_validation.js
	//si tous les champs du formulaires sont valides

	const validations = [
		nameControl(
			document.querySelector("#firstName"),
			document.querySelector("#firstNameErrorMsg"),
			"Prénom valide",
			"Prénom invalide"
		),

		nameControl(
			document.querySelector("#lastName"),
			document.querySelector("#lastNameErrorMsg"),
			"Nom valide",
			"Nom invalide"
		),
		locationControl(
			document.querySelector("#address"),
			document.querySelector("#addressErrorMsg"),
			"Adresse valide",
			"Adresse invalide. Exemple : 10 rue du port"
		),
		locationControl(
			document.querySelector("#city"),
			document.querySelector("#cityErrorMsg"),
			"Ville valide",
			"Ville invalide. Exemple : 33510 Andernos-les-Bains"
		),
		mailControl(
			document.querySelector("#email"),
			document.querySelector("#emailErrorMsg"),
			"Email valide",
			"Email invalide. Exemple : contact@monsite.fr"
		),
	];

	if (validations.includes(false)) {
		return;
	}

	function sendOrder() {
		fetch("http://localhost:3000/api/products/order", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				accept: "application/json",
			},
			body: JSON.stringify({ contact, products }),
		})
			.then(function (response) {
				if (response.ok) {
					return response.json();
				}
			})

			.then(function (request) {
				orderId = request.orderId;
				console.log(orderId);
				window.location.href =
					"../html/confirmation.html?id=" + `${orderId}`;
			})
			.catch(function (err) {
				alert(err);
			});
	}
	sendOrder();
};

//////////////////////////////////////////////////
////lancement de la page////////////////////////
////////////////////////////////////////////////

const onLoad = async function () {
	await getMixedData();
	displayCart();
	submitOrder();
};

//appel fonction lancement de la page
onLoad();
