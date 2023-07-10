
const apiUrl = 'http://localhost:3000/api/products';

const url = new URL(window.location.href);
console.log(url);
const searchParams = new URLSearchParams(url.search);
const id = searchParams.get('id');

// console.log(id);

const data = fetch(`${apiUrl}/${id}`)
.then(response => {
// console.log(response);  
return response.json()})
.then(data => {
  console.log(data);
  const product = data;

  // UPDATING PRODUCT NAME WITHIN PROMISE CHAIN FOR ADDING TO CART FUNCTION 

  const productName = product.name; 

  // adding image
 
  const productImg = document.querySelector('.item__img');

  console.log(productImg);
  productImg.innerHTML = `<img class="productImage" src="${product.imageUrl}" alt="${product.altTxt}">`;

  // adding title

  const productTitle = document.querySelector('#title');
  productTitle.innerText = `${product.name}`;

  // adding price 
  const productPrice = document.querySelector('#price'); 
  productPrice.innerText = `${product.price}`;

  // adding description
  const productDescription = document.querySelector('#description');
  productDescription.innerText = `${product.description}`;

  // adding color options
  const productColors = document.querySelector('select');

  // console.log(productColors);

  let html = "";
  product.colors.forEach((color) => {
    html += `<option value="${color}">${color}</option>`;
  });

  productColors.innerHTML = html;
});




//adding an event listener to find value of color and quantity selected

const cartButton = document.querySelector('button')[0]; 



cartButton.addEventListener('click', function() {

  const chosenColor = document.querySelector('select')[0].value;
  const itemQuantity = document.querySelector('input')[0].value;
  const productName = document.querySelector('title').innerText; 
  const imageUrl = document.querySelector('.productImage');

  // console.log(imageUrl);

  // console.log(productName);
  //error message if nothing is selected
  let error = {
    noColor: 'Please choose a color!', 
    noQuantity: 'Please choose a quantity!' 
  };

  if (chosenColor === '') {
    alert (error.noColor);
    return;
  }
  if (itemQuantity === '0') {
    alert (error.noQuantity);
    return;
  }

  // adding the selection to the cart 
  else addToCart(id, imageUrl, productName, chosenColor, itemQuantity);

});

function addToCart (id, imageUrl, productName, chosenColor, itemQuantity) {
 console.log('imageUrl ', imageUrl);
  // checking if cart exists / assigning an empty array
  let cart = JSON.parse(localStorage.getItem('cart')) || [];

  // creating a new object for the product selected
  const cartItem = {
    productId: id,
    productImage: imageUrl.src,
    title: productName, 
    color: chosenColor,
    quantity: itemQuantity
  };

  // push used to add the product object to the cart 
  cart.push(cartItem);

  // storing product object in local storage/ using .stringify to convert back into a string to store
  localStorage.setItem('cart', JSON.stringify(cart));

  console.log(cartItem);
}

