// getting the cart data from the local storage / parse data
const cartData = JSON.parse(localStorage.getItem("cart"));

if (cartData) {
  // getting the section in which cart items will be displayed
  const cartSection = document.querySelector("#cart__items");
  // updating the DOM with products in cart
  let html = "";
  cartData.forEach((product) => {
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
  cartData.forEach((product) => {
    //going through the array
    tempPrice += product.price * product.quantity; // temporary price is price x quantity
  });

  totalPrice = tempPrice; // updating total price
  document.querySelector("#totalPrice").innerText = totalPrice; // pushing to DOM

  // dealing with item quantity
  document.querySelectorAll(".itemQuantity").forEach((item) => {
    totalQuantity += Number(item.value);
    item.addEventListener(
      "click",
      () => {
        let tempQuantity = 0;
        // grab all item values
        document.querySelectorAll(".itemQuantity").forEach((item) => {
          tempQuantity += Number(item.value);
        });
        // reference/hook/placeholder to the DOM element
        document.querySelector("#totalQuantity").innerText = tempQuantity;
      },
      false
    );
  });

  document.querySelector("#totalQuantity").innerHTML = totalQuantity;

  //dealing with delete button 1. grab button and add event listener 2. delete item closest when clicked 3. update DOM and Local storage

  document.querySelectorAll(".deleteItem").forEach((item) => {
    item.addEventListener("click", (event) => {
      let deleteId = event.target.closest(".cart-item").dataset.id;
      console.log(deleteId); // locating the ID of the item to be deleted.
      //find the item with matching ID in cart data
      let deleteItem = cartData.findIndex((item) => item.id === deleteId); // if not found will give value of -1

      if (deleteItem !== -1) {
        //check to see if a matching ID has been found
        cartData.splice(deleteItem, 1); // remove from cart array
        event.target.closest(".cart-item").remove(); // remove from DOM
        localStorage.setItem("cartData", JSON.stringify(cartData)); // remove from local storage

        // Update the total quantity with logic used above
        let tempQuantity = 0;
        document.querySelectorAll(".itemQuantity").forEach((item) => {
          tempQuantity += Number(item.value);
        });
        totalQuantity = tempQuantity;
        document.querySelector("#totalQuantity").innerText = totalQuantity;

        let tempPrice = 0;
        cartData.forEach((product) => {
          tempPrice += product.price * product.quantity;
        });
        totalPrice = tempPrice;
        document.querySelector("#totalPrice").innerText = totalPrice;
      }
    });
  });
}

// FORM steps


// validate form before saving (regex)

function validateForm () {
  
}



// save form data after validation 
// get form data create a contact object 
// dont forget error messages 
