
const apiUrl = 'http://localhost:3000/api/products';

const url = new URL(window.location.href);

const searchParams = new URLSearchParams(url.search);
const id = searchParams.get('id');

// console.log(id);

const data = fetch(`${apiUrl}/${id}`)
.then(response => response.json())
.then(data => {
  console.log(data);
})

