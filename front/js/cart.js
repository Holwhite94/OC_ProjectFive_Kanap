
// getting the cart data from the local storage / parse data 
const cartData = JSON.parse(localStorage.getItem('cart'));

 if (cartData){
// getting the section in which cart items will be displayed
 const cartSection = document.querySelector('#cart__items');
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
        
}

const totalItems = cartQuantity(cartData); 

function cartQuantity (cart) {
  let totalItems = 0;

  for (let item of cart) {
    totalItems += item.quantity;
  };

  return totalItems;
};







