const apiUrl = "http://localhost:3000/api/products";

// adding items to the homepage

// fetch request which asks for the products from the API

fetch(apiUrl)
  .then((response) => {
    if (response.ok) {
      return response.json();
    } else {
      throw new Error("Error: " + response.status);
    }
  })
  .then((data) => {
    const products = data;
    const items = document.querySelector("#items");

    const url = new URL(window.location.href);
    url.searchParams.set("id", products.id);

    // inserting the products received from the API request to the DOM

    let html = "";

    products.forEach((product) => {
      html += `
        <a href="product.html?id=${product._id}">
          <article>
            <img class="productImage" src="${product.imageUrl}" alt="${product.altTxt}">
            <h3 class="productName">${product.name}</h3>
            <p class="productDescription">${product.description}</p>
          </article>
        </a>`;
    });

    items.innerHTML = html;
  });
