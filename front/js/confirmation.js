/**
 * récupère et affiche le numéro de commande
 */
function displayOrderId() {
	// Récupérer l'url
	const Url = window.location.href;

	// Parse l'url récupéré
	const UrlProduct = new URL(Url);

	// Récupérer l'orderId  depuis l'URL
	const orderId = UrlProduct.searchParams.get("id");
	console.log(orderId);

	//insérer l'orderID dans le html
	document.getElementById("orderId").textContent = `${orderId}`;
}

//appel fonction
displayOrderId();
