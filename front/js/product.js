
const apiUrl = 'http://localhost:3000/api/products';

const url = new URL(window.location.href);
console.log(url);
const searchParams = new URLSearchParams(url.search);
const id = searchParams.get('id');

// console.log(id);

const data = fetch(`${apiUrl}/${id}`)
.then(response => {
console.log(response);  
return response.json()})
.then(data => {
  console.log(data);
  const product = data;

  // adding image
 
  const productImg = document.getElementsByClassName('item__img')[0];
  productImg.innerHTML = `<img src="${product.imageUrl}" alt="${product.altTxt}">`;

  // adding title

  const productTitle = document.getElementById('title');
  productTitle.innerText = `${product.name}`;

  // adding price 
  const productPrice = document.getElementById('price'); 
  productPrice.innerText = `${product.price}`;

  // adding description
  const productDescription = document.getElementById('description');
  productDescription.innerText = `${product.description}`;

  // adding color options
  const productColors = document.getElementsByTagName('select')[0];

  console.log(productColors);

  let html = "";
  product.colors.forEach((color) => {
    html += `<option value="${color}">${color}</option>`;
  });

  productColors.innerHTML = html;
});



