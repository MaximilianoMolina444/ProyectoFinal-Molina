let productos = [
    {
        id: "1",   
        nombre: "Remeras de bandas: Queen",
        imagen: "https://i.ibb.co/sm0nB9s/Sin-t-tulo2.jpg",
        precio: 2500
    },
    {
        id: "2",
        nombre: "Remeras de bandas: The Cure",
        imagen: "https://i.ibb.co/XJw53Sq/Sin-t-tulo3.jpg",
        precio: 2000
    },
    {
        id: "3",
        nombre: "Barbijos Personalizados",
        imagen: "https://i.ibb.co/TqkK0wN/Sin-t-tulo4.jpg",
        precio: 300
    },
    {
        id: "4",
        nombre: "Remeras personalizadas: Tattoo",
        imagen: "https://i.ibb.co/4jJBvWc/sin-titulo5.jpg",
        precio: 1500
    },
    {
        id: "5",
        nombre: "Remeras personalizadas: Diseños",
        imagen: "https://i.ibb.co/DQcjRvf/sin-titulo6.jpg",
        precio: 1500
    },
    {
        id: "6",
        nombre: "Barbijos Personalizados",
        imagen: "https://i.ibb.co/p04Z84y/sin-titulo7.jpg",
        precio: 200
    },
    {
        id: "7",
        nombre: "Pedidos especiales: Mariposa",
        imagen: "https://i.ibb.co/8MDVDhb/musculosa.jpg",
        precio: 1800
    },
    {
        id: "8",
        nombre: "Pedidos especiales: Vampiros",
        imagen: "https://i.ibb.co/gWJzxsh/vampires.jpg",
        precio: 1200
    },
    {
        id: "9",
        nombre: "Pedidos especiales: Deftones",
        imagen: "https://i.ibb.co/vQk7BKK/deftones.jpg",
        precio: 3000
    },
];

let carrito;
if (JSON.parse(localStorage.getItem(`carrito`))) {
    carrito = JSON.parse(localStorage.getItem(`carrito`))
}else{
    localStorage.setItem(`carrito`, JSON.stringify([]))
    carrito = JSON.parse(localStorage.getItem(`carrito`))
}

for (let i = 0; i < productos.length; i++) {
    const producto = productos[i];
    let card = `
    <div class="contenedor__card">
        <p class="contenedor__titulo">
            <img src="../img/logo-modified.png" alt="logo mini" class="contenedor__titulo__img">
            Ramona_Custom
        </p>
        <img src=${producto.imagen} alt="Remera Queen" class="contenedor__imagen">
        <p class="contenedor__texto">
            <i class="texto">Precio: $${producto.precio}</i>
        </p>
        <hr>
        <p class="contenedor__link">
            <button class="boton" id=${producto.id}>
                <i class="bi bi-bag-plus-fill"></i>Pedi la tuya
            </button>
        </p>
    </div>
    `
    const contenedor = document.getElementById(`container`);
    contenedor.innerHTML += card;
}

let botonesAniadirCarrito = document.getElementsByClassName(`boton`);

for (let i = 0; i < botonesAniadirCarrito.length; i++) {
    const element = botonesAniadirCarrito[i];
    element.addEventListener('click', aniadirCarritoClick)
}


function alerta() {
    alert('Prenda añadida, consultar el carrito al final de la página')
}
const shoppingCartItemsContainer = document.querySelector('.shoppingCartItemsContainer');

function aniadirCarritoClick(e) {
    const btn = e.target;
    let idBoton = btn.getAttribute('id');
    let prodEncontrado = productos.filter(prod => prod.id == idBoton);
    //------------------------------------------
    let guardarCarrito = productos.find(prod => prod.id == idBoton)
    const enCarrito = carrito.find(prod => prod.id == guardarCarrito.id)
    if(!enCarrito) {
        carrito.push({...prodEncontrado, cantidad: 1})
    } else {
        let carritoFiltrado = carrito.filter(prod => prod.id != enCarrito.id)
        carrito = [...carritoFiltrado, {...enCarrito, cantidad: enCarrito.cantidad + 1}]
    }
    console.log(carrito)
    localStorage.setItem('carrito', JSON.stringify(carrito))
    //-------------------------------------------------------
    aniadirProductos(prodEncontrado[0].precio, prodEncontrado[0].imagen);
    alerta()
}

function aniadirProductos(itemPrecio, itemImg) {
    const carritoRow = document.createElement('div');
    const carritoContenido = `
    <div class="row shoppingCartItem">
        <div class="col-6">
            <div class="shopping-cart-item d-flex align-items-center h-100 border-bottom pb-2 pt-3">
                <img src=${itemImg} class="shopping-cart-image">
            </div>
        </div>
        <div class="col-2">
            <div class="shopping-cart-price d-flex align-items-center h-100 border-bottom pb-2 pt-3">
                <p class="item-price mb-0 shoppingCartItemPrice">$${itemPrecio}</p>
            </div>
        </div>
        <div class="col-4">
            <div
                class="shopping-cart-quantity d-flex justify-content-between align-items-center h-100 border-bottom pb-2 pt-3">
                <input class="shopping-cart-quantity-input shoppingCartItemQuantity" type="number"
                    value="1">
                <button class="btn btn-danger buttonDelete" type="button">X</button>
            </div>
        </div>
    </div>`;
    carritoRow.innerHTML = carritoContenido
    shoppingCartItemsContainer.append(carritoRow);
    updateShoppingCartTotal();
}


// actualizar precio del carrito------------------------------------------------------

function updateShoppingCartTotal() {
    let total = 0;
    const shoppingCartTotal = document.querySelector('.shoppingCartTotal');
    const shoppingCartItems = document.querySelectorAll('.shoppingCartItem')

    shoppingCartItems.forEach(shoppingCartItem => {
        const shoppingCartItemPriceElement = shoppingCartItem.querySelector(`.shoppingCartItemPrice`);

        const shoppingCartItemPrice = Number(shoppingCartItemPriceElement.textContent.replace(`$`, ""));
        const shoppingCartItemQuantityElement =  shoppingCartItem.querySelector(`.shoppingCartItemQuantity`);
        const shoppingCartItemQuantity = Number(shoppingCartItemQuantityElement.value)
        console.log(shoppingCartItemQuantity);
        total = total + shoppingCartItemPrice * shoppingCartItemQuantity
        console.log(total);
    })
    shoppingCartTotal.innerHTML = `
        $${total}
    `;

}