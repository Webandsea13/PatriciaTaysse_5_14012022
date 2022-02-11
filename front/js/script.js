/***************affichage de la page d'accueil****************************/

//declaration de la fonction onLoad qui charge les produits sur la page index.html
/**
 * Appel à l'API, retourne un tableau d'objets, et insertion du HTML de tous les produits
 */

const onLoad = function () {
	const itemsSection = document.getElementById("items");

	fetch("http://localhost:3000/api/products")
		.then(function (res) {
			return res.json();
		})
		.then(function (products) {
			//les produits sont retournés sous forme de tableau d'objets
			console.log(products);
			//boucle pour récupérer les objets du tableau
			for (let product of products) {
				//déclaration de la constante contenant le html pour afficher les valeurs de chaque objet grâce aux clefs
				const productAsHTML = `<a href="./product.html?id=${product._id}">
					<article>
						<img src="${product.imageUrl}" alt=${product.altTxt}>
						<h3 class="productName">${product.name}</h3>
						<p class="productDescription">${product.description}</p>
					</article>
				</a>`;
				//insérer le html à la fin de la <div class"items">
				itemsSection.insertAdjacentHTML("beforeend", productAsHTML);
			}
		})
		.catch(function (err) {
			alert("Problème d'accès au serveur.\n" + err);
		});
};
//appel de la fonction
onLoad();
