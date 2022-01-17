const itemsSection = document.getElementById("items");

fetch("http://localhost:3000/api/products")
	.then(function (res) {
		return res.json();
	})
	.then(function (products) {
		console.log(products);
		//boucle pour récupérer les objects du tableau
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
		alert("Erreur:" + err);
	});
