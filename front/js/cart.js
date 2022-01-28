//récupérer le panier dans le local storage via la fonction recupererPanier
const panier = recupererPanier();
console.log(panier);

//*************afficher les objets du panier sur la page panier************************
//boucle pour récupérer les objects du panier
let totalQuantity = 0;
let totalPrice = 0;
for (let p of panier) {
	//récupération de l'id du produit
	const idProduct = p.id;

	// Fetch le produit d'id {id}
	const UrlFetch = "http://localhost:3000/api/products/" + idProduct;

	fetch(UrlFetch)
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
			//cumul nombre articles
			totalQuantity += p.quantity;
			console.log(totalQuantity);
			//affichage nombre articles
			document.getElementById(
				"totalQuantity"
			).innertHTML = `${totalQuantity}`;

			//cumul prix
			let price = `${product.price}` * `${p.quantity}`;
			console.log(price);
			totalPrice += price;
			console.log(totalPrice);
			//affichage du prix total
			document.getElementById("totalPrice").innerHTML = `${totalPrice}`;

			//**********************changement quantité par l'utilisateur*********************

			//écoute click + appel fonction modif quantity
			let tabItemQuantity = document.querySelectorAll(".itemQuantity");
			console.log(tabItemQuantity);
			for (let itemQuantity of tabItemQuantity) {
				let modifQuantity = function (event) {
					//trouver élément proche du clic
					let item = event.target.closest(".cart__item");
					console.log(item);
					console.log(itemQuantity);
					//récupérer id et couleur produit concerné
					const choixId = item.dataset.id;
					const choixColor = item.dataset.color;
					//appliquer la nouvelle quantité dans le tableau panier
					const elementExistant = panier.find(
						(x) => x.id == choixId && x.color == choixColor
					);

					elementExistant.quantity = event.target.value;
					//appel fonction sauvegarder panier
					sauvegarderPanier(panier);
				};
				itemQuantity.addEventListener("click", modifQuantity);
			}

			//*************************suppression d'un article************* */
			//mettre sous forme de boucle pour que le addEventListener fonctionne ?
			/*
			document
			.querySelectorAll(".deleteItem")
			.addEventListener("click", function (event) {
			let item = event.target.closest("cart__item");
			const choixId = item.dataset.id;
			const choixColor = item.dataset.color;
			panier = panier.filter((n) => n.id != choixId && n.color != choixColor);
			sauvegarderPanier(panier);
			});
			*/
		})

		.catch(function (err) {
			alert("Erreur:" + err);
		});
}

//**************gestion du formulaire*********************** */
// sélection du bouton Valider

const btnOrder = document.querySelector("#order");

// Écoute du bouton Valider sur le click pour pouvoir créer, contrôler, valider et envoyer le formulaire et les produits au back-end
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

	let product = [];
	for (let p of panier) {
		product.push(p.id);
	}
	console.log(product);

	//Controle du formulaire
	//controle du champ prénom
	FirstNameControl(this);

	function FirstNameControl() {
		let inputFirstName = document.querySelector("#firstName");
		let message = document.querySelector("#firstNameErrorMsg");

		let firstNameRegExp = new RegExp(`^[A-Za-zéèê -]+$`, `g`);

		let isValid = firstNameRegExp.test(contact.firstName);
		console.log(isValid);
		if (isValid) {
			inputFirstName.style.backgroundColor = "green";
			//ne fonctionne qu'en l'absence de texte ????????????????
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

		let lastNameRegExp = new RegExp(`^[a-zA-Z-' ]+$`, `g`);

		let isValid = lastNameRegExp.test(contact.lastName);
		console.log(isValid);
		if (isValid) {
			inputLastName.style.backgroundColor = "green";
			//ne fonctionne qu'en l'absence de texte ????????????????
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

		let addressRegExp = new RegExp(`^[a-zA-Z0-9\s]{1,15}$`, `g`);

		let isValid = addressRegExp.test(contact.address);
		console.log(isValid);
		if (isValid) {
			inputAddress.style.backgroundColor = "green";
			//ne fonctionne qu'en l'absence de texte ????????????????
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

		let cityRegExp = new RegExp(`^[a-zA-Z-' ]{1,5}$`, `g`);

		let isValid = cityRegExp.test(contact.city);
		console.log(isValid);
		if (isValid) {
			inputCity.style.backgroundColor = "green";
			//ne fonctionne qu'en l'absence de texte ????????????????
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
			`^[a-zA-Z0-9.-_]+[@]{1}[a-zA-Z0-9-._]+[.][a-z]{2,8}$`,
			`g`
		);

		let isValid = emailRegExp.test(contact.email);
		console.log(isValid);
		if (isValid) {
			inputMail.style.backgroundColor = "green";
			//ne fonctionne qu'en l'absence de texte ????????????????
			message.innerHTML = '<span style="color:green">Email valide</span>';
			return true;
		} else {
			inputMail.style.backgroundColor = "#FF6F61";

			message.textContent = "Email invalide, exemple: contact@monsite.fr";
			return false;
		}
	}
});
