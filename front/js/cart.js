// ! requires cart-library.js
// !requires form_validation.js

//récupérer le panier dans le local storage via la fonction recupererPanier définie dans gestion_panier.js
const panier = loadCart();
console.log(panier);
//si le panier est vide : affichage d'un message
if (panier.length == 0) {
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

//déclaration fonction qui affiche le prix total et la quantité totale des produits du panier
const refreshPriceAndQuantity = function () {
	let totalQuantity = 0;
	let totalPrice = 0;
	for (let p of panier) {
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

//définition de la fonction exécutée au change de la quantité par l'utilisateur (ligne 126)
const changeQuantityCallback = function (event) {
	//trouver élément proche du clic et contenant les informations du produit concerné
	let item = event.target.closest(".cart__item");

	//récupérer id et couleur produit concerné
	const chosenId = item.dataset.id;
	const chosenColor = item.dataset.color;
	//appliquer la nouvelle quantité dans le tableau panier
	const elementExistant = panier.find(
		(x) => x.id == chosenId && x.color == chosenColor
	);

	elementExistant.quantity = event.target.value;

	//appel fonction sauvegarder panier
	saveCart(panier);
	panier = loadCart();
	console.log(panier);

	refreshPriceAndQuantity();
};

//*************afficher les objets du panier sur la page panier************************

//boucle pour récupérer les objects du panier
const fetches = [];

for (let p of panier) {
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
				delIt.addEventListener("click", function (event) {
					let item = event.target.closest(".cart__item");
					const chosenId = item.dataset.id;
					const chosenColor = item.dataset.color;
					const panier = loadCart();

					const result = panier.filter(
						(n) => n.id !== chosenId && n.color !== chosenColor
					);
					console.log(result);
					saveCart(result);
					//rafraichir page ou afficher nouveau panier
					window.location.reload();
				});
			});
		})
		.catch(function (err) {
			alert("Erreur:" + err);
		});

	fetches.push(leFetch);
}

Promise.all(fetches).then(() => {
	refreshPriceAndQuantity();
});

//**************gestion du formulaire*********************** */
// sélection du bouton Valider

const btnOrder = document.querySelector("#order");

// Écoute du bouton Valider sur le click pour pouvoir créer, contrôler,
//valider et envoyer le formulaire et les produits au back-end.

//écoute click et création objet contact et tableau product
btnOrder.addEventListener("click", (event) => {
	event.preventDefault();

	if (panier.length == 0) {
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
	products = panier.map((x) => x.id);
	console.log(products);

	///////////////////////////////////////////////////////////
	//si tous les champs du formulaires sont valides//
	////////////////////////////////////////////////////////////
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
});
