
// getting the cart data from the local storage / parse data 
const cartData = JSON.parse(localStorage.getItem('cart'));

console.log(cartData);
//adding data to an array of products - create an empty array and using a loop to push each product into the array 
const products = []

cartData.forEach((cartItem) => {
    const product = cartItem;
    products.push(product);
});

console.log(products);

// getting the section in which cart items will be displayed

const cartSection = document.querySelector('.cart__items')
let html = "";

products.forEach((product) => {
    html += `<article class="cart-item" data-id="${product.productId}" data-color="${product.color}">
                <div class="cart__item__img">
                 <img src="${product.productImage}">
                </div>`;
});
//fix the above holly haway what is that 
console.log(html);
