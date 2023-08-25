// getting the cart data from the local storage / parse data
const cart = JSON.parse(localStorage.getItem("cart"));
const apiUrl = "http://localhost:3000/api/products";
let products = [];

// Fetch products from the API so we can get price
fetch(apiUrl)
  .then((response) => response.json())
  .then((data) => {
    products = data;

    // if there is something in the cart: inserting the product into the DOM and working out quantity and price.
    if (cart) {
      // getting the section in which cart items will be displayed
      const cartSection = document.querySelector("#cart__items");
      // updating the DOM with products in cart
      let html = "";
      cart.forEach((cartItem) => {
        const matchingProduct = products.find(  // matching the cart item ID to the product ID from API so we can access the price
          (product) => cartItem.id === product._id
        );
        if (matchingProduct) {
          html += `<article class="cart-item" data-id="${cartItem.id}" data-color="${cartItem.color}">
                <div class="cart__item__img">
                 <img src="${cartItem.image}">
                </div>
                <div class="cart__item__content">
                  <div class="cart__item__content__description">
                    <h2>${cartItem.title}</h2>
                    <p>Color: ${cartItem.color}</p>
                    <p>Price: ${matchingProduct.price}€</p>
                  </div>
                  <div class="cart__item__content__settings">
                    <div class="cart__item__content__settings__quantity">
                      <p>Quantity : </p>
                      <input type="number" class="itemQuantity" name="itemQuantity" min="1" max="100" value="${cartItem.quantity}">
                    </div>
                    <div class="cart__item__content__settings__delete">
                      <p class="deleteItem">Delete</p>
                    </div>
                  </div>
                </div>
              </article>`;

          cartSection.innerHTML = html;
        }
      });
    }

    // declare temp price and quantity
    let totalQuantity = 0;
    let totalPrice = 0;

    cart.forEach((cartItem) => {
      const matchingProduct = products.find(
        (product) => cartItem.id === product._id
      );

      if (matchingProduct) {
        totalQuantity += Number(cartItem.quantity);
        totalPrice += matchingProduct.price * cartItem.quantity;
      }
    });

    // Update total quantity and total price in DOM

    document.querySelector("#totalQuantity").innerText = totalQuantity;
    document.querySelector("#totalPrice").innerText = totalPrice;

    // Event listener to handle quantity changes
    document.querySelectorAll(".itemQuantity").forEach((item) => {
      item.addEventListener("input", () => {
        // Recalculate and update quantity and price
        let newTotalQuantity = 0;
        let newTotalPrice = 0;

        document.querySelectorAll(".itemQuantity").forEach((item) => {
          const cartItem = cart.find(
            (cartItem) => cartItem.id === item.closest(".cart-item").dataset.id
          );
          const matchingProduct = products.find(
            (product) => cartItem.id === product._id
          );

          if (matchingProduct) {
            const quantity = Number(item.value);
            newTotalQuantity += quantity;
            newTotalPrice += matchingProduct.price * quantity;
            cartItem.quantity = quantity;
          }
        });

        document.querySelector("#totalQuantity").innerText = newTotalQuantity;
        document.querySelector("#totalPrice").innerText = newTotalPrice;
      });
    });

    // Event listener to handle delete button clicks
    document.querySelectorAll(".deleteItem").forEach((item) => {
      item.addEventListener("click", (event) => {
        const deleteId = event.target.closest(".cart-item").dataset.id;
        const deleteItem = cart.findIndex(
          (cartItem) => cartItem.id === deleteId
        );

        if (deleteItem !== -1) {
          cart.splice(deleteItem, 1);
          event.target.closest(".cart-item").remove();
          localStorage.setItem("cart", JSON.stringify(cart));

          // Update total quantity and total price after deletion
          let newTotalQuantity = 0;
          let newTotalPrice = 0;

          cart.forEach((cartItem) => {
            const matchingProduct = products.find(
              (product) => cartItem.id === product._id
            );

            if (matchingProduct) {
              newTotalQuantity += Number(cartItem.quantity);
              newTotalPrice += matchingProduct.price * cartItem.quantity;
            }
          });

          document.querySelector("#totalQuantity").innerText = newTotalQuantity;
          document.querySelector("#totalPrice").innerText = newTotalPrice;
        }
      });
    });
  });

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
      firstName,
      lastName,
      address,
      city,
      email,
    };

    postOrder(validatedContact, cart);
  }
}

// function to create an order object with product ID and contact object created previously, then sending object using POST
function postOrder(validatedContact, cart) {
  const cartId = [];
  cart.forEach((cartItem) => {
    cartId.push(cartItem.id);
  });

  let order = {
    contact: { ...validatedContact },
    products: cartId,
  }; // adding both to one variable

  const orderUrl = "http://127.0.0.1:5501/front/html/confirmation.html";

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
      window.location.href = `${orderUrl}?orderId=${data.orderId}`; // setting search param
      localStorage.removeItem("cart"); // remove order from the local storage
    })

    .catch((error) => {
      alert("Error", error); // handle errors
    });
}
