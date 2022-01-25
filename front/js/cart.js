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
		})

		.catch(function (err) {
			alert("Erreur:" + err);
		});
}

//
//*****************modification de la quantité************ */
//écouter evenement, récuperer donnée, renvoyer en local storage
let tabItemQ = document.querySelectorAll("#itemQuantity");
console.log(tabItemQ);
tabItemQ.addEventListener("change", function () {
	//trouver élément proche du clic
	let response = element.closest();
	//récupérer id produit concerné
	response.querySelector(".cart__item").id;
});

//*************************suppression d'un article************* */
document.querySelectorAll(".deleteItem").addEventListener("click", function () {
	panier = panier.filter((n) => n.id != p.id);
	sauvegarderPanier(panier);
});

//**************gestion du formulaire*********************** */
