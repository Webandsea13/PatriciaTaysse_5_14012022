// ! requires cart-library.js
// !requires form_validation.js

////////////////////////////////////////////////////////////////////////////////////
/////definition des fonctions utilisées dans le fichier////////////////////////////
///////////////////////////////////////////////////////////////////////////////////

//définition fonction qui affiche le prix total et la quantité totale des produits du panier
const refreshPriceAndQuantity = function () {
	let totalQuantity = 0;
	let totalPrice = 0;
	for (let p of cart) {
		//cumul nombre articles
		totalQuantity += parseInt(p.quantity);

		//cumul prix
		//on récupère le prix stocké dans priceProducts grace à la clé p.id
		//pour le mettre dans la constante prixProduit
		const priceProduct = priceProducts[p.id];
		let price = priceProduct * p.quantity;
		totalPrice += price;
	}

	//affichage nombre articles
	document.getElementById("totalQuantity").textContent = `${totalQuantity}`;
	//affichage du prix total
	document.getElementById("totalPrice").textContent = `${totalPrice}`;
};

//définition de la fonction exécutée au change de la quantité par l'utilisateur
const changeQuantityCallback = function (event) {
	//trouver élément proche du clic et contenant les informations du produit concerné
	let item = event.target.closest(".cart__item");

	//récupérer id et couleur produit concerné
	const chosenId = item.dataset.id;
	const chosenColor = item.dataset.color;
	//chercher l'élément dans le panier
	const chosenItem = cart.find(
		(x) => x.id == chosenId && x.color == chosenColor
	);
	//Appliquer la nouvelle quantité dans l'élément panier
	chosenItem.quantity = event.target.value;

	//appel fonction sauvegarder panier
	saveCart(cart);
	console.log(cart);
	//recalculer prix total et quantité totale
	refreshPriceAndQuantity();
};

//definition de la fonction exécutée à la suppression d'un produit du panier par l'utilisateur
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
	//rafraichir page ou afficher nouveau panier
	window.location.reload();
};

// définition de la fonction qui écoute le bouton Commander
const submitOrder = function () {
	//selection du bouton envoyer
	const btnOrder = document.querySelector("#order");

	// Écoute  click pour pouvoir créer les éléments à envoyer au backend,
	// contrôler, valider et envoyer le formulaire via formSubmitCallback
	btnOrder.addEventListener("click", formSubmitCallback);
};

//definition de la fonction exécutée au click du bouton commander
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

	if (
		FirstNameControl(contact) &&
		LastNameControl(contact) &&
		addressControl(contact) &&
		cityControl(contact) &&
		mailControl(contact)
	) {
		//appel fonction pour envoyer les données contact et product au serveur
		sendOrder();
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
};

///////////////////////////////////////////////////////////////////////////////////////
//*************afficher les objets du panier sur la page panier************************
/////////////////////////////////////////////////////////////////////////////////////////

//récupérer le panier dans le local storage via la fonction recupererPanier définie dans gestion_panier.js
const cart = loadCart();
console.log(cart);
//si le panier est vide : affichage d'un message
if (cart.length == 0) {
	let titre = document.querySelector("h1");
	let precision = document.createElement("p");
	let precisionText = document.createTextNode(
		"Le panier est vide ! Retournez en page d'accueil choisir vos articles."
	);
	precision.appendChild(precisionText);
	precision.style.color = "red";
	precision.style.backgroundColor = "white";
	document
		.getElementById("cartAndFormContainer")
		.insertBefore(precision, document.querySelector(".cart"));
}

// cache des prix des produits pour les utiliser en dehors du fetch
const priceProducts = {};
console.log("priceProducts :" + priceProducts);
//boucle pour récupérer les objects du panier
//création du tableau contenant les promesses des fetches
const fetches = [];

for (let p of cart) {
	//récupération de l'id du produit
	const idProduct = p.id;

	// Fetch le produit d'id {id}
	const UrlFetch = "http://localhost:3000/api/products/" + idProduct;

	const leFetch = fetch(UrlFetch)
		.then(function (res) {
			return res.json();
		})
		.then(function (product) {
			//declaration de la constante contenant le html pour un produit du panier
			//p est un objet du panier provenant du localstorage, product est un objet provenant du backend
			console.log(product);

			const objectAsHTML = `<article class="cart__item" data-id=${p.id} data-color=${p.color}>
            <div class="cart__item__img">
            <img src="${product.imageUrl}" alt="${product.altTxt}">
            </div>
            <div class="cart__item__content">
            <div class="cart__item__content__description">
                <h2>${product.name}</h2>
                <p>${p.color}</p>
                <p>${product.price} €</p>
            </div>
            <div class="cart__item__content__settings">
                <div class="cart__item__content__settings__quantity">
                <p>Qté : </p>
                <input type="number" class="itemQuantity" name="itemQuantity" min="1" max="100" value=${p.quantity}>
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

			// stocker le prix en "cache"
			priceProducts[p.id] = product.price;

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
		})
		.catch(function (err) {
			alert("Erreur:" + err);
		});

	fetches.push(leFetch);
}
//ensemble des promesses résolues
Promise.all(fetches).then(() => {
	//calcul et affichage quantité totale et prix total
	refreshPriceAndQuantity();
});

//*************appel fonction affichage de la page*************** */
//cartDisplay();

//**************appel fonction action du bouton commander*********************** */

submitOrder();
