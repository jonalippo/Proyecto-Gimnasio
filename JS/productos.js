const productos = [
  {
    titulo: "Guantes gym 'Proyect'",
    imagen: "../images/guantes1.jpg",
    precio: "$ 10.000",
  },
  {
    titulo: "Guantes gym con abrojo",
    imagen: "../images/guantes2.jpg",
    precio: "$ 8.000",
  },
  {
    titulo: "Guantes gym con muñequeras",
    imagen: "../images/guantes3.jpg",
    precio: "$ 12.000",
  },
  {
    titulo: "Vaso Shaker 'Everlast'",
    imagen: "../images/sheker1.jpg",
    precio: "$ 8.000",
  },
  {
    titulo: "Vaso Shaker 'Proyect'",
    imagen: "../images/sheker2.jpg",
    precio: "$ 6.000",
  },
  {
    titulo: "Vaso Shaker generico",
    imagen: "../images/sheker3.jpg",
    precio: "$ 4.000",
  },
  {
    titulo: "Toallas de mano (35*50)",
    imagen: "../images/toalla1.jpg",
    precio: "$ 3.000",
  },
  {
    titulo: "Muñequera gym 'Balboafit'",
    imagen: "../images/muñequera1.jpg",
    precio: "$ 6.550",
  },
];

//Generacion de la estructura HTML para recorrer el aiorreglo de productos
const contenedorItems = document.querySelector(".contenedor-items");

productos.forEach((producto) => {
  const itemDiv = document.createElement("div");
  itemDiv.classList.add("item");

  const tituloItem = document.createElement("span");
  tituloItem.classList.add("titulo-item");
  tituloItem.textContent = producto.titulo;

  const imagenItem = document.createElement("img");
  imagenItem.classList.add("img-item");
  imagenItem.src = producto.imagen;
  imagenItem.alt = producto.titulo;

  const precioItem = document.createElement("span");
  precioItem.classList.add("precio-item");
  precioItem.textContent = `${producto.precio}`;

  const botonItem = document.createElement("button");
  botonItem.classList.add("boton-item");
  botonItem.textContent = "Agregar al carrito";

  itemDiv.appendChild(tituloItem);
  itemDiv.appendChild(imagenItem);
  itemDiv.appendChild(precioItem);
  itemDiv.appendChild(botonItem);

  contenedorItems.appendChild(itemDiv);
});




