// getting the value of the ID parameter from the URL
const apiUrl = "http://localhost:3000/api/products";
const url = new URL(window.location.href);
const searchParams = new URLSearchParams(url.search);
const id = searchParams.get("id");

// fetch request using the ID parameter to retrieve the remaining product info to be displayed on the product page
const data = fetch(`${apiUrl}/${id}`)
  .then((response) => {
    return response.json();
  })
  .then((data) => {
    const product = data;

    // UPDATING PRODUCT NAME WITHIN PROMISE CHAIN FOR ADDING TO CART FUNCTION

    const productName = product.name;

    // adding image

    const productImg = document.querySelector(".item__img");

    productImg.innerHTML = `<img class="productImage" src="${product.imageUrl}" alt="${product.altTxt}">`;

    // adding title

    const productTitle = document.querySelector("#title");
    productTitle.innerText = `${product.name}`;

    // adding price
    const productPrice = document.querySelector("#price");
    productPrice.innerText = `${product.price}`;

    // adding description
    const productDescription = document.querySelector("#description");
    productDescription.innerText = `${product.description}`;

    // adding color options
    const productColors = document.querySelector("select");

    let html = "";
    product.colors.forEach((color) => {
      html += `<option value="${color}">${color}</option>`;
    });

    productColors.innerHTML = html;
  });

//adding an event listener to find value of color and quantity selected + including data to be used on the next page
const cartButton = document.querySelector("button");

cartButton.addEventListener("click", function () {
  const chosenColor = document.querySelector("select").value;
  const itemQuantity = document.querySelector("input").value;
  const productName = document.querySelector("#title").innerText;
  const imageUrl = document.querySelector(".productImage");
  

  //error message if nothing is selected
  let error = {
    noColor: "Please choose a color!",
    noQuantity: "Please choose a quantity!",
  };

  if (chosenColor === "") {
    alert(error.noColor);
    return;
  }
  if (itemQuantity === "0") {
    alert(error.noQuantity);
    return;
  }

  // calling add to cart function if there are no errors
  else addToCart(id, imageUrl, productName, chosenColor, itemQuantity);
});

// function which creates 'cart object' with 6 parameters and sores in local storage
function addToCart(
  id,
  imageUrl,
  productName,
  chosenColor,
  itemQuantity
) {
  // checking if cart exists / assigning an empty array
  let cart = JSON.parse(localStorage.getItem("cart")) || [];

  // checking if item has already been added to the cart
  const duplicateCartItem = cart.find((item) => {
    return item.id === id && item.color === chosenColor;
  });
  // alerting user to duplicate item if it has been found
  if (duplicateCartItem) {
    alert("This item is already in the cart.");
    return;
  }

  // creating a new object for the product selected
  const cartItem = {
    id: id,
    image: imageUrl.src,
    title: productName,
    color: chosenColor,
    quantity: itemQuantity,
  };


  // push used to add the product object to the cart
  cart.push(cartItem);

  // storing product object in local storage/ using .stringify to convert back into a string to store
  localStorage.setItem("cart", JSON.stringify(cart));
}
