
// setear carrito en localStorage------------------------------------------------------
let carrito;
JSON.parse(localStorage.getItem(`carrito`)) ? carrito = JSON.parse(localStorage.getItem(`carrito`)) : localStorage.setItem(`carrito`, JSON.stringify([])); carrito = JSON.parse(localStorage.getItem(`carrito`));

// renderizar productos------------------------------------------------------
for (const producto of productos) {
    const {id, imagen} = producto
    let precio = producto.precio
    let iva = 1.21
    precio = precio*iva
    let card = `
    <div class="contenedor__card">
        <p class="contenedor__titulo">
            <img src="../img/logo-modified.png" alt="logo mini" class="contenedor__titulo__img">
            Ramona_Custom
        </p>
        <img src=${imagen} alt="Remera Queen" class="contenedor__imagen">
        <p class="contenedor__texto">
            <i class="texto">Precio: $${precio}</i>
        </p>
        <hr>
        <p class="contenedor__link">
            <button class="boton" id=${id}>
                <i class="bi bi-bag-plus-fill"></i>Pedi la tuya
            </button> 
        </p>
        <p class="contenedor__link">
            <button class="boton2" id=${id}>
                <i class="bi bi-bag-plus-fill"></i>Visualizar
            </button> 
        </p>
    </div>
    `
    const contenedor = document.getElementById(`container`);
    contenedor.innerHTML += card;
}

// añadir al carrito en click------------------------------------------------------
let botonesAniadirCarrito = document.getElementsByClassName(`boton`);
for(const boton of botonesAniadirCarrito){
    boton.addEventListener('click', aniadirCarritoClick)
}

// visualizar en click------------------------------------------------------
let botonesVisualizar = document.getElementsByClassName(`boton2`);
for(const boton of botonesVisualizar){
    boton.addEventListener('click', visualizar)
}

// visualizar item alerta------------------------------------------------------
function alertaVisualizar(imagen, nombre) {
    Swal.fire({
        imageUrl: imagen,
        imageHeight: 450,
        imageWidth: 400,
        imageAlt: nombre
    })
      
}
// visualizar item------------------------------------------------------
const shoppingCartItemsContainer = document.querySelector('.shoppingCartItemsContainer');
function visualizar(e){
    const btn = e.target;
    let idBoton = btn.getAttribute('id');
    let prodEncontrado = productos.filter(prod => prod.id == idBoton);
    alertaVisualizar(prodEncontrado[0].imagen, prodEncontrado[0].nombre)
}
// alerta al comprar------------------------------------------------------
function alerta(){
    Swal.fire({
        position: 'center',
        icon: 'success',
        title: 'Producto añadido, consultar carrito al final de la página.',
        showConfirmButton: false,
        timer: 2500
    })
}
// añadir al carrito------------------------------------------------------
function aniadirCarritoClick(e) {
    let iva = 1.21
    fetch('../js/productos.json')
    .then((res)=> res.json())
    .then((data)=>{
        const btn = e.target;
        const idBoton = btn.getAttribute('id')
        const prodEncontrado = data.filter(prod => prod.id == idBoton)
        const prodEncontrado1 = data.find(prod => prod.id == idBoton)
        const enCarrito = carrito.find(prod => prod.id == prodEncontrado1.id)
        if(!enCarrito) {
            carrito.push({...prodEncontrado1, cantidad: 1})
        } else {
            let carritoFiltrado = carrito.filter(prod => prod.id != enCarrito.id)
            carrito = [...carritoFiltrado, {...enCarrito, cantidad: enCarrito.cantidad + 1}]
        }
        localStorage.setItem('carrito', JSON.stringify(carrito))
        aniadirProductos(prodEncontrado[0].precio*iva, prodEncontrado[0].imagen, prodEncontrado[0].nombre),
        alerta()
    })
    .catch(() =>{
        console.log("Error del sistema");
    })
    
}

// Mostrar items en carrito------------------------------------------------------
function aniadirProductos(itemPrecio, itemImg, itemNombre) {
    const carritoRow = document.createElement('div');
    const carritoContenido = `
    <div class="row shoppingCartItem pb-5">
        <div class="col-2">
            <div>
                <h6 class="shopping-cart-item-title shoppingCartItemTitle text-truncate ml-3 mb-0">${itemNombre}</h6>
            </div>
        </div>
        <div class=" col-4 shopping-cart-item d-flex align-items-center h-100 border-bottom pb-2 pt-3">
                <img src=${itemImg} class="shopping-cart-image">
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
    carritoRow.querySelector(`.buttonDelete`).addEventListener(`click`, removeShoppingCartItem)
    carritoRow.querySelector(`.shoppingCartItemQuantity`).addEventListener(`change`, quantityChanged)
    updateShoppingCartTotal();
}


// actualizar precio del carrito------------------------------------------------------
function updateShoppingCartTotal() {
    let total = 0;
    const shoppingCartTotal = document.querySelector('.shoppingCartTotal');
    const shoppingCartItems = document.querySelectorAll('.shoppingCartItem')

    shoppingCartItems.forEach(shoppingCartItem => {
        let iva = 1.21
        const shoppingCartItemPriceElement = shoppingCartItem.querySelector(`.shoppingCartItemPrice`);
        const shoppingCartItemPrice = Number(shoppingCartItemPriceElement.textContent.replace(`$`, ""));
        const shoppingCartItemQuantityElement = shoppingCartItem.querySelector(`.shoppingCartItemQuantity`);
        const shoppingCartItemQuantity = Number(shoppingCartItemQuantityElement.value)
        total = total + shoppingCartItemPrice * shoppingCartItemQuantity
    })
    shoppingCartTotal.innerHTML = `
        $${total.toFixed(2)}
    `;
}

// remover item del carrito------------------------------------------------------
function removeShoppingCartItem(e){
    const buttonClicked = e.target 
    buttonClicked.closest('.shoppingCartItem').remove()
    localStorage.setItem('carrito', JSON.stringify(carrito))
    updateShoppingCartTotal()
}
// actualizar cantidad del carrito------------------------------------------------------
function quantityChanged(e){
    const input = e.target
    input.value <= 0 ? (input.value = 1) : null
    updateShoppingCartTotal()
}
// boton comprar del carrito------------------------------------------------------

const comprarButton = document.querySelector(`.comprarButton`)
comprarButton.addEventListener(`click`, finalizarCompra)

function finalizarCompra(){
    alertaDeCompra()
    shoppingCartItemsContainer.innerHTML = "";
    updateShoppingCartTotal()
}


// alerta al finalizar compra--------------------------------------------------------------
function alertaDeCompra(){
    Swal.fire({
        title: '¿Finalizar Compra?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Terminar Compra',
        cancelButtonText: 'Volver'
      }).then((result) => {
        if (result.isConfirmed) {
          Swal.fire({
            title: 'Compra Realizada',
            icon: 'success',
            text: "pedido numero:" +""+ numeroRandom(1,100),
            input: 'number',
            inputPlaceholder: ' Ingresa tu número de teléfono',
            footer: 'Pronto nos pondremos en contacto, gracias por tu compra.'
          })
            
        }
      })

}

// numero de pedido------------------------------------------------------
const numeroRandom = function random(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}

