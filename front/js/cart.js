//récupérer le panier dans le local strorage
let panierLinea = localStorage.getItem("panierLocalstorage");
let panier = JSON.parse(panierLinea);
console.log(panier);

//*************afficher les objets du panier sur la page panier************************
//boucle pour récupérer les objects du panier
for (let p of panier) {
	//récupération de l'id du produit
	const idProduct = p.id;
	console.log(idProduct);

	// Fetch le produit d'id {id}
	const UrlFetch = "http://localhost:3000/api/products/" + idProduct;
	console.log(UrlFetch);

	fetch(UrlFetch)
		.then(function (res) {
			return res.json();
		})
		.then(function (product) {
			//declaration de la constante contenant le html pour un produit du panier
			//p est un objet du panier provenant du localstorage, product est un objet provenant du backend
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
		})

		.catch(function (err) {
			alert("Erreur:" + err);
		});
}
//calcul du prix total du panier
