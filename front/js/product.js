// Récupérer l'url
const Url = window.location.href;
console.log(Url);

// Parse l'url récupéré pour trouver l'id
const UrlProduct = new URL(Url);
console.log(UrlProduct);

// Récupérer l'id depuis l'URL
const idProduct = UrlProduct.searchParams.get("id");
console.log(idProduct);

// Fetch le produit d'id {id}
const UrlFetch = "http://localhost:3000/api/products/" + idProduct;
const place = document.querySelector(".item__img");
console.log(place);

fetch(UrlFetch)
	.then(function (res) {
		return res.json();
	})
	.then(function (product) {
		console.log(product);
		console.log(product.imageUrl);
		console.log(product.name);
		// Insérer les éléments correspondants dans le HTML
		place.insertAdjacentHTML(
			"beforeend",
			`<img src= "${product.imageUrl}" alt="${product.altTxt}">`
		);

		document
			.getElementById("title")
			.insertAdjacentHTML("beforeend", product.name);

		document
			.getElementById("price")
			.insertAdjacentHTML("beforeend", product.price);

		document
			.getElementById("description")
			.insertAdjacentHTML("beforeend", product.description);

		for (let color of product.colors) {
			document
				.getElementById("colors")
				.insertAdjacentHTML(
					"beforeend",
					`<option value="${color}"> ${color} </option>  `
				);
		}
	})

	.catch(function (err) {
		alert("Erreur:" + err);
	});
