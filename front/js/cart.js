//récupérer le panier dans le local storage via la fonction recupererPanier définie dans gestion_panier.js
const panier = loadCart();
console.log(panier);
//si le panier est vide : affichage d'un message
if (panier == []) {
	let titre = document.querySelector("h1");
	console.log(titre);
	let precision = document.createElement("p");
	let precisionText = document.createTextNode(
		"Le panier est vide, retournez en page d'accueil choisir vos articles."
	);
	precision.appendChild(precisionText);
	precision.style.color = "red";
	console.log(precision);
	document
		.getElementById("cartAndFormContainer")
		.insertBefore(precision, document.querySelector(".cart"));
}

// cache des prix des produits pour les utiliser en dehors du fetch
const prixProduits = {};

//déclaration fonction qui affiche le prix total et la quantité totale des produits du panier
const actualiserPrixQuantite = function () {
	let totalQuantity = 0;
	let totalPrice = 0;
	for (let p of panier) {
		//cumul nombre articles
		totalQuantity += parseInt(p.quantity);

		//cumul prix
		//on récupère le prix stocké dans prixProduits grace à la clé p.id
		//pour le mettre dans la constante prixProduit
		const prixProduit = prixProduits[p.id];
		let price = prixProduit * p.quantity;
		totalPrice += price;
	}

	//affichage nombre articles
	document.getElementById("totalQuantity").textContent = `${totalQuantity}`;
	//affichage du prix total
	document.getElementById("totalPrice").textContent = `${totalPrice}`;
};

//définition de la fonction exécutée au change de la quantité par l'utilisateur (ligne 109)
const modifQuantity = function (event) {
	//trouver élément proche du clic et contenant les informations du produit concerné
	let item = event.target.closest(".cart__item");

	//récupérer id et couleur produit concerné
	const choixId = item.dataset.id;
	const choixColor = item.dataset.color;
	//appliquer la nouvelle quantité dans le tableau panier
	const elementExistant = panier.find(
		(x) => x.id == choixId && x.color == choixColor
	);

	elementExistant.quantity = event.target.value;

	//appel fonction sauvegarder panier
	saveCart(panier);
	loadCart();
	console.log(panier);

	actualiserPrixQuantite();
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

			// stocker le prix en "cache"
			prixProduits[p.id] = product.price;

			//insertion du html
			document
				.getElementById("cart__items")
				.insertAdjacentHTML("beforeend", objectAsHTML);

			//**********************changement quantité par l'utilisateur*********************

			//écoute click + appel fonction modif quantity
			//récupérer dans un tableau les éléments susceptibles d'être cliqués +/-
			let tabItemQuantity = document.querySelectorAll(".itemQuantity");

			for (let itemQuantity of tabItemQuantity) {
				itemQuantity.addEventListener("change", modifQuantity);
			}

			//*************************suppression d'un article************* */
			//récupérer dans un tableau les éléments susceptibles d'etre cliqués pour la suppression

			let tabDeleteItems = document.querySelectorAll(".deleteItem");

			tabDeleteItems.forEach(function (delIt) {
				delIt.addEventListener("click", function (event) {
					let item = event.target.closest(".cart__item");
					const choixId = item.dataset.id;
					const choixColor = item.dataset.color;
					const panier = loadCart();

					const result = panier.filter(
						(n) => n.id !== choixId && n.color !== choixColor
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
	actualiserPrixQuantite();
});

//**************gestion du formulaire*********************** */
// sélection du bouton Valider

const btnOrder = document.querySelector("#order");

// Écoute du bouton Valider sur le click pour pouvoir créer, contrôler,
//valider et envoyer le formulaire et les produits au back-end.

//écoute click et création objet contact et tableau product
btnOrder.addEventListener("click", (event) => {
	event.preventDefault();

	let contact = {
		firstName: document.querySelector("#firstName").value,
		lastName: document.querySelector("#lastName").value,
		address: document.querySelector("#address").value,
		city: document.querySelector("#city").value,
		email: document.querySelector("#email").value,
	};

	console.log(contact);

	let products = [];
	for (let p of panier) {
		products.push(p.id);
	}
	console.log(products);

	//Controle du formulaire
	//controle du champ prénom (le regexp.test() renvoie true ou false)
	FirstNameControl(this);

	function FirstNameControl() {
		let inputFirstName = document.querySelector("#firstName");
		let message = document.querySelector("#firstNameErrorMsg");

		let firstNameRegExp = new RegExp(`^[A-Za-zéèêàç -]+$`, `g`);

		let isValid = firstNameRegExp.test(contact.firstName);

		if (isValid) {
			inputFirstName.style.backgroundColor = "green";

			message.innerHTML =
				'<span style="color:green">Prénom valide</span>';
			return true;
		} else {
			inputFirstName.style.backgroundColor = "#FF6F61";

			message.textContent = "Prénom invalide";
			return false;
		}
	}
	//controle du champ nom
	LastNameControl(this);

	function LastNameControl() {
		let inputLastName = document.querySelector("#lastName");
		let message = document.querySelector("#lastNameErrorMsg");

		let lastNameRegExp = new RegExp(`^[A-Za-zéèêàç '-]+$`, `g`);

		let isValid = lastNameRegExp.test(contact.lastName);

		if (isValid) {
			inputLastName.style.backgroundColor = "green";

			message.innerHTML = '<span style="color:green">Nom valide</span>';
			return true;
		} else {
			inputLastName.style.backgroundColor = "#FF6F61";

			message.textContent = "Nom invalide";
			return false;
		}
	}

	//controle du champ adresse
	addressControl(this);

	function addressControl() {
		let inputAddress = document.querySelector("#address");
		let message = document.querySelector("#addressErrorMsg");

		let addressRegExp = new RegExp(`^[A-Za-z0-9éèêàç ',-]+$`, `g`);

		let isValid = addressRegExp.test(contact.address);

		if (isValid) {
			inputAddress.style.backgroundColor = "green";

			message.innerHTML =
				'<span style="color:green">Adresse valide</span>';
			return true;
		} else {
			inputAddress.style.backgroundColor = "#FF6F61";

			message.textContent = "Adresse invalide, exemple: 10 rue du port ";
			return false;
		}
	}

	//controle du champ ville
	cityControl(this);

	function cityControl() {
		let inputCity = document.querySelector("#city");
		let message = document.querySelector("#cityErrorMsg");

		let cityRegExp = new RegExp(`^[A-Za-z0-9éèêàç '-]+$`, `g`);

		let isValid = cityRegExp.test(contact.city);

		if (isValid) {
			inputCity.style.backgroundColor = "green";

			message.innerHTML = '<span style="color:green">Ville valide</span>';
			return true;
		} else {
			inputCity.style.backgroundColor = "#FF6F61";

			message.textContent =
				"Ville invalide, exemple: 33400 Andernos-les-Bains";
			return false;
		}
	}

	// contrôle du champ Email
	mailControl(this);

	function mailControl() {
		let inputMail = document.querySelector("#email");
		let message = document.querySelector("#emailErrorMsg");

		let emailRegExp = new RegExp(
			`^[a-zA-Z0-9.-_]+[@]{1}[a-zA-Z0-9._-]+[.][a-z]{2,8}$`,
			`g`
		);

		let isValid = emailRegExp.test(contact.email);

		if (isValid) {
			inputMail.style.backgroundColor = "green";

			message.innerHTML = '<span style="color:green">Email valide</span>';
			return true;
		} else {
			inputMail.style.backgroundColor = "#FF6F61";

			message.textContent = "Email invalide, exemple: contact@monsite.fr";
			return false;
		}
	}
	///////////////////////////////////////////////////////////
	//si tous les champs du formulaires sont valides//
	////////////////////////////////////////////////////////////
	if (
		FirstNameControl() &&
		LastNameControl() &&
		addressControl() &&
		cityControl() &&
		mailControl() &&
		panier != []
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
