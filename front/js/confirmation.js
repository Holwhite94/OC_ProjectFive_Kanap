
// getting the order ID parameter from the URL
const url = new URL(window.location.href);
const searchParams = new URLSearchParams(url.search);
const id = searchParams.get("orderId");

// inserting the order ID into the DOM 
document.querySelector('#orderId').innerText = id;
