// getting the cart data from the local storage / parse data
const cart = JSON.parse(localStorage.getItem("cart"));

// if there is something in the cart: inserting the product into the DOM and working out quantity and price.
if (cart) {
  // getting the section in which cart items will be displayed
  const cartSection = document.querySelector("#cart__items");
  // updating the DOM with products in cart
  let html = "";
  cart.forEach((product) => {
    html += `<article class="cart-item" data-id="${product.id}" data-color="${product.color}">
                <div class="cart__item__img">
                 <img src="${product.image}">
                </div>
                <div class="cart__item__content">
                  <div class="cart__item__content__description">
                    <h2>${product.title}</h2>
                    <p>Color: ${product.color}</p>
                    <p>Price: ${product.price}€</p>
                  </div>
                  <div class="cart__item__content__settings">
                    <div class="cart__item__content__settings__quantity">
                      <p>Quantity : </p>
                      <input type="number" class="itemQuantity" name="itemQuantity" min="1" max="100" value="${product.quantity}">
                    </div>
                    <div class="cart__item__content__settings__delete">
                      <p class="deleteItem">Delete</p>
                    </div>
                  </div>
                </div>
              </article>`;
  });

  cartSection.innerHTML = html;

  //dealing with price
  let tempPrice = 0; //declaring temp price
  let tempQuantity = 0;
  cart.forEach((product) => {
    //going through the array
    tempPrice += product.price * product.quantity; // temporary price is price x quantity
    tempQuantity += Number(product.quantity);
  });

  document.querySelector("#totalQuantity").innerHTML = tempQuantity;
  // totalPrice = tempPrice; // updating total price
  document.querySelector("#totalPrice").innerText = tempPrice; // pushing to DOM

  // dealing with item quantity
  document.querySelectorAll(".itemQuantity").forEach((item) => {
    let totalQuantity = Number(item.value);
    item.addEventListener("click", () => {
      let tempQuantity = 0;
      // grab all item values
      document.querySelectorAll(".itemQuantity").forEach((item) => {
        tempQuantity += Number(item.value);
      });
      document.querySelector("#totalQuantity").innerText = tempQuantity; // pushing to DOM
    });
  });

  //dealing with delete button
  document.querySelectorAll(".deleteItem").forEach((item) => {
    item.addEventListener("click", (event) => {
      let deleteId = event.target.closest(".cart-item").dataset.id; // locating the ID of the item to be deleted.

      //find the item with matching ID in cart data
      let deleteItem = cart.findIndex((item) => item.id === deleteId); // if not found will give value of -1

      if (deleteItem !== -1) {
        //check to see if a matching ID has been found
        cart.splice(deleteItem, 1); // remove from cart array
        event.target.closest(".cart-item").remove(); // remove from DOM
        localStorage.setItem("cart", JSON.stringify(cart)); // remove from local storage

        // Update the total quantity with logic used above
        let tempQuantity = 0;
        document.querySelectorAll(".itemQuantity").forEach((item) => {
          tempQuantity += Number(item.value);
        });
        totalQuantity = tempQuantity;
        document.querySelector("#totalQuantity").innerText = totalQuantity;

        let tempPrice = 0;
        cart.forEach((product) => {
          tempPrice += product.price * product.quantity;
        });
        totalPrice = tempPrice;
        document.querySelector("#totalPrice").innerText = totalPrice;
      }
    });
  });
}

// adding event listener to order button and calling validateForm function when clicked
const orderButton = document.querySelector("#order");
orderButton.addEventListener("click", validateForm);

// function to validate the form: gets input value's, uses Regex to check values, if valid creates contact object and calls postOrder function
function validateForm(event) {
  event.preventDefault(); // prevent refresh
  // grab values
  const firstName = document.querySelector("#firstName").value;
  const lastName = document.querySelector("#lastName").value;
  const address = document.querySelector("#address").value;
  const city = document.querySelector("#city").value;
  const email = document.querySelector("#email").value;


  // grab all error messages

  const firstNameErrorMsg = document.querySelector("#firstNameErrorMsg");
  const lastNameErrorMsg = document.querySelector("#lastNameErrorMsg");
  const addressErrorMsg = document.querySelector("#addressErrorMsg");
  const cityErrorMsg = document.querySelector("#cityErrorMsg");
  const emailErrorMsg = document.querySelector("#emailErrorMsg");


  // regex
  const firstNameRegex = /^[a-zA-Z]+$/;
  const lastNameRegex = /^[a-zA-Z]+$/;
  const addressRegex = /^[a-zA-Z0-9\s]+$/;
  const cityRegex = /^[a-zA-Z]+$/;
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

  // validate
  let valid = true;

  if (!firstNameRegex.test(firstName)) {
    valid = false;
    firstNameErrorMsg.innerText = "Enter a valid name!";
  }

  if (!lastNameRegex.test(lastName)) {
    valid = false;
    lastNameErrorMsg.innerText = "Enter a valid name!";
  }

  if (!addressRegex.test(address)) {
    valid = false;
    addressErrorMsg.innerText = "Enter a valid address!";
  }

  if (!cityRegex.test(city)) {
    valid = false;
    cityErrorMsg.innerText = "Enter a valid city!";
  }

  if (!emailRegex.test(email)) {
    valid = false;
    emailErrorMsg.innerText = "Enter a valid email!";
  }

  if (valid == true) {
    let validatedContact = {
      // creating a contact object
      firstName: firstName,
      lastName: lastName,
      address: address,
      city: city,
      email: email,
    };

    postOrder(validatedContact, cart);
  }
}

// defining api URL for POST request
const apiUrl = "http://localhost:3000/api/products";

// function to create an order object with product ID and contact object created previously, then sending object using POST
function postOrder(validatedContact, cart) {
  const cartId = [];
  cart.forEach((product) => {
    cartId.push(product.id);
  });

  let order = {
    contact: { ...validatedContact },
    products: cartId,
  }; // adding both to one variable

  fetch(
    apiUrl + "/order", // endpoint
    {
      method: "POST",
      headers: {
        Accept: "application/json", // accepts JSON in return
        "Content-Type": "application/json", // sent in JSON
      },

      body: JSON.stringify(order), // adding the order to the body of the post request
    }
  )
    .then((response) => response.json()) // parse

    .then((data) => {
      window.location.href =
        "http://127.0.0.1:5501/front/html/confirmation.html?orderId=" +
        data.orderId; // setting search param
      localStorage.removeItem("cart"); // remove order from the local storage
    })

    .catch((error) => {
      console.error("Error:", error); // handle errors
    });
}
