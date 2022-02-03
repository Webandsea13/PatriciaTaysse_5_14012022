// Récupérer l'url
const Url = window.location.href;
console.log(Url);

// Parse l'url récupéré
const UrlProduct = new URL(Url);
console.log(UrlProduct);

// Récupérer l'orderId  depuis l'URL
const orderId = UrlProduct.searchParams.get("id");
console.log(orderId);

//insérer l'orderID dans le html
document.getElementById("orderId").innerHTML = `${orderId}`;
