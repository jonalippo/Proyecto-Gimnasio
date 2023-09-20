// Carrito visible
let carritoVisible = false;

// Esperamos a que todos los elementos de la página carguen para ejecutar el script
(document.readyState == "loading") ? document.addEventListener("DOMContentLoaded", ready) : ready();

const contenedorItems = document.querySelector(".contenedor-items");

async function ready() {
  try {
    // Agregar funcionalidad a los botones eliminar del carrito
    const botonesEliminarItem = document.getElementsByClassName("btn-eliminar");
    for (let i = 0; i < botonesEliminarItem.length; i++) {
      let button = botonesEliminarItem[i];
      button.addEventListener("click", eliminarItemCarrito);
    }

    // Agrego funcionalidad al botón sumar cantidad
    const botonesSumarCantidad = document.getElementsByClassName("sumar-cantidad");
    for (let i = 0; i < botonesSumarCantidad.length; i++) {
      let button = botonesSumarCantidad[i];
      button.addEventListener("click", sumarCantidad);
    }

    // Agrego funcionalidad al botón restar cantidad
    const botonesRestarCantidad =
      document.getElementsByClassName("restar-cantidad");
    for (let i = 0; i < botonesRestarCantidad.length; i++) {
      let button = botonesRestarCantidad[i];
      button.addEventListener("click", restarCantidad);
    }

    // Cargar el archivo JSON de forma asíncrona usando Fetch API
    const response = await fetch('../JSON/productos.json');
    const data = await response.json();

    data.forEach((producto) => {
      crearItemProducto(producto); // Llamo a la función para crear el elemento del producto
    });

    // Agrego funcionalidad al botón Agregar al carrito
    const botonesAgregarAlCarrito = document.getElementsByClassName("boton-item");
    for (let i = 0; i < botonesAgregarAlCarrito.length; i++) {
      let button = botonesAgregarAlCarrito[i];
      button.addEventListener("click", agregarAlCarritoClicked);
      button.addEventListener('click', (e) => {
        e.preventDefault();
        Swal.fire({
          icon: 'success',
          title: 'Genial!!',
          text: 'Tu producto se agregó correctamente!',
        });
      });
    }

    // Agrego funcionalidad al botón comprar
    document
      .getElementsByClassName("btn-pagar")[0]
      .addEventListener("click", pagarClicked);

    // Cargar el carrito desde localStorage al cargar la página
    cargarCarritoDesdeLocalStorage();

  } catch (error) {
    console.error('Error en la inicialización:', error);
  }
}

const crearItemProducto = (producto) => {
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
};

// Eliminar todos los elementos del carrito y los oculto
function pagarClicked() {
  // Elimino todos los elementos del carrito
  const carritoItems = document.getElementsByClassName("carrito-items")[0];
  while (carritoItems.hasChildNodes()) {
    carritoItems.removeChild(carritoItems.firstChild);
  }
  actualizarTotalCarrito();
  ocultarCarrito();

  // Limpiar el carrito en localStorage
  localStorage.removeItem("carrito");
}

const agregarAlCarritoClicked = (event) => {
  console.log("llego " + event);
  let button = event.target;
  let item = button.parentElement;
  let titulo = item.getElementsByClassName("titulo-item")[0].innerText;
  let precio = item.getElementsByClassName("precio-item")[0].innerText;
  let imagenSrc = item.getElementsByClassName("img-item")[0].src;

  agregarItemAlCarrito(titulo, precio, imagenSrc);

  hacerVisibleCarrito();
}

// Hago visible el carrito
const hacerVisibleCarrito = () => {
  carritoVisible = true;
  let carrito = document.getElementsByClassName("carrito")[0];
  carrito.style.marginRight = "0";
  carrito.style.opacity = "1";

  let items = document.getElementsByClassName("contenedor-items")[0];
  items.style.width = "60%";
}

// Agrego un item al carrito
const agregarItemAlCarrito = (titulo, precio, imagenSrc) => {
  let item = document.createElement("div");
  item.classList.add("item");
  let itemsCarrito = document.getElementsByClassName("carrito-items")[0];

  let itemCarritoContenido = `
        <div class="carrito-item">
            <img src="${imagenSrc}" width="80px" alt="">
            <div class="carrito-item-detalles">
                <span class="carrito-item-titulo">${titulo}</span>
                <div class="selector-cantidad">
                    <i class="fa-solid fa-minus restar-cantidad"></i>
                    <input type="text" value="1" class="carrito-item-cantidad" disabled>
                    <i class="fa-solid fa-plus sumar-cantidad"></i>
                </div>
                <span class="carrito-item-precio">${precio}</span>
            </div>
            <button class="btn-eliminar">
                <i class="fa-solid fa-trash"></i>
            </button>
        </div>
    `;
  item.innerHTML = itemCarritoContenido;
  itemsCarrito.append(item);

  // Agrego la funcionalidad eliminar al nuevo item
  item
    .getElementsByClassName("btn-eliminar")[0]
    .addEventListener("click", eliminarItemCarrito);

  // Agrego la funcionalidad restar cantidad del nuevo item
  const botonRestarCantidad = item.getElementsByClassName("restar-cantidad")[0];
  botonRestarCantidad.addEventListener("click", restarCantidad);

  // Agrego la funcionalidad sumar cantidad del nuevo item
  const botonSumarCantidad = item.getElementsByClassName("sumar-cantidad")[0];
  botonSumarCantidad.addEventListener("click", sumarCantidad);

  // Actualizo el total
  actualizarTotalCarrito();

  // Guardo el carrito en localStorage después de agregar el elemento
  guardarCarritoEnLocalStorage();
}

// Aumento en uno la cantidad del elemento seleccionado
const sumarCantidad = (event) => {
  let buttonClicked = event.target;
  let selector = buttonClicked.parentElement;
  let cantidadActual = selector.getElementsByClassName(
    "carrito-item-cantidad"
  )[0].value;
  cantidadActual++;
  selector.getElementsByClassName("carrito-item-cantidad")[0].value =
    cantidadActual;
  actualizarTotalCarrito();

  // Guardo el carrito en localStorage después de actualizar la cantidad
  guardarCarritoEnLocalStorage();
}

// Resto en uno la cantidad del elemento seleccionado
const restarCantidad = (event) => {
  let buttonClicked = event.target;
  let selector = buttonClicked.parentElement;
  let cantidadActual = selector.getElementsByClassName(
    "carrito-item-cantidad"
  )[0].value;
  cantidadActual--;
  cantidadActual >= 1 ? (
      (selector.getElementsByClassName("carrito-item-cantidad")[0].value = cantidadActual),
      actualizarTotalCarrito(),
      
    // Guardo el carrito en localStorage después de actualizar la cantidad
      guardarCarritoEnLocalStorage()
    ) : null; 
}

// Elimino el item seleccionado del carrito
const eliminarItemCarrito = (event) => {
  const buttonClicked = event.target;
  buttonClicked.parentElement.parentElement.remove();
  // Actualizo el total del carrito
  actualizarTotalCarrito();

  // Función para controlar si hay elementos en el carrito y si no hay, elimino el carrito
  ocultarCarrito();

  // Guardo el carrito en localStorage después de eliminar el elemento
  guardarCarritoEnLocalStorage();
}

// Controlo si hay elementos en el carrito. Si no hay, oculto el carrito.
const ocultarCarrito = () => {
  let carritoItems = document.getElementsByClassName("carrito-items")[0];
  carritoItems.childElementCount === 0 ? (
      (document.getElementsByClassName("carrito")[0].style.marginRight = "-100%"),
      (document.getElementsByClassName("carrito")[0].style.opacity = "0"),
      (carritoVisible = false),
      (document.getElementsByClassName("contenedor-items")[0].style.width = "100%")
    ) : null;
}

// Actualizo el total del Carrito
const actualizarTotalCarrito = () => {
  // Selección del contenedor carrito
  let carritoContenedor = document.getElementsByClassName("carrito")[0];
  let carritoItems = carritoContenedor.getElementsByClassName("carrito-item");
  let total = 0;
  // Recorremos cada elemento del carrito para actualizar el total
  for (let i = 0; i < carritoItems.length; i++) {
    let item = carritoItems[i];
    let precioElemento = item.getElementsByClassName("carrito-item-precio")[0];
    // Quito el símbolo peso y el punto de milesimos.
    let precio = parseFloat(
      precioElemento.innerText.replace("$", "").replace(".", "")
    );
    let cantidadItem = item.getElementsByClassName("carrito-item-cantidad")[0];
    let cantidad = cantidadItem.value;
    total = total + precio * cantidad;
  }

  total = Math.round(total * 100) / 100;

  document.getElementsByClassName("carrito-precio-total")[0].innerText =
    "$" + total.toLocaleString("es") + ",00";
}

// Función para guardar el carrito en localStorage
const guardarCarritoEnLocalStorage = () => {
  const carritoItems = document.getElementsByClassName("carrito-items")[0];
  const items = carritoItems.getElementsByClassName("carrito-item");

  const carrito = [];

  for (let i = 0; i < items.length; i++) {
    const item = items[i];
    const titulo = item.getElementsByClassName("carrito-item-titulo")[0].innerText;
    const precio = item.getElementsByClassName("carrito-item-precio")[0].innerText;
    const cantidad = item.getElementsByClassName("carrito-item-cantidad")[0].value;
    const imagenSrc = item.querySelector("img").src;

    carrito.push({
      titulo: titulo,
      precio: precio,
      cantidad: cantidad,
      imagenSrc: imagenSrc,
    });
  }

  localStorage.setItem("carrito", JSON.stringify(carrito));
}

// Función para cargar el carrito desde localStorage al cargar la página
const cargarCarritoDesdeLocalStorage = () => {
  const carritoString = localStorage.getItem("carrito");
  if (carritoString) {
    const carrito = JSON.parse(carritoString);

    for (const item of carrito) {
      agregarItemAlCarrito(item.titulo, item.precio, item.imagenSrc, item.cantidad);
    }
  }
}
