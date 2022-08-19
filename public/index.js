

let productosCarrito = []
let modalBody = document.getElementById("modal-body")
let btnFinalizarCompra = document.getElementById("btnFinalizarCompra")
let carritoId = 0
postData('/getUsername')
    .then(data => {

        if (data.usuario == 'no registrado') {

            window.location = 'login.html'
        }
        const nombreUsuario = document.querySelector("#nombreUsuario")
        nombreUsuario.innerHTML = data.usuario
    });

cargarProductos()
iniciarCarrito()


async function cargarProductos() {
    fetch('/api/productos')
        .then(response => response.json())
        .then(data => {
            data.forEach(element => {
                let nuevoProducto = new Producto(element.codigo, element.nombre,
                    element.foto, element.id, element.precio, element.stock)
                listaProductos.push(nuevoProducto)
            });
        })
}



let btnProductos = document.getElementById("btnProductos")
btnProductos.addEventListener('click', () => {

    htmlCatalogoDeProductos();
    btnCarrito.addEventListener('click', () => {
        htmlCarrito();
    })


})

async function eliminarCarritoEnBD(id) {
    console.log("eliminarCarritoEnBD:" + id)
    const result = await fetch(`/api/carrito/${id}`, { method: 'DELETE' })
    console.log(result.json())
}

async function crearCarrito(username) {
    const result = await fetch(`/api/carrito`, { method: 'POST' })
    let data = await result.json()
    carritoId = data.id
    const updateCarrito = await fetch(`/userCarrito/${carritoId}/${username}`, { method: 'PUT' })
    let resultJSON = await updateCarrito.json()
    console.log(resultJSON)
}


async function enviarMailAdministrador(id) {
    console.log("EnviarMailAdministrador:" + id)
    const result = await fetch(`/api/carrito/finalizar/${id}`, { method: 'GET' })
    let resultJSON = await result.json()
    console.log(resultJSON)
}

//Genera el html del catalogo de prouctos, agrega los eventos cada boton agregar
function htmlCatalogoDeProductos() {
    divProductos.innerHTML = "";
    listaProductos.forEach((producto) => {
        divProductos.innerHTML += `
      <div class="card" id="${producto.codigo}" style="width: 18rem; margin:3px;">
          <div class="card-body">
              <h5 class="card-title">${producto.nombre}</h5>
              <div class="col-md-4">
              <img src="${producto.foto}" class="img-fluid rounded-start" alt="Producto sin imagen">
          </div>
              <p class="card-text">Codigo: ${producto.codigo}</p>
            
              <p class="card-text">Stock: ${producto.stock}</p>
              <p class="card-text">$${producto.precio}</p>
              <button class="btn btn-primary"><i class="fas fa-cart-plus fa-1x"></i></button>  
          </div>
      </div>       
  `
    })
    const listaBotonesAgregar = divProductos.querySelectorAll(".btn");

    listaBotonesAgregar.forEach(btn => {
        btn.addEventListener("click", (event) => {
            let codigo = btn.parentElement.parentElement.id;
            agregarACarrito(codigo, obtenerPrecioUnitario(codigo));

            Toastify({
                text: "Producto agregado!",
                duration: 3000,
                gravity: "top",
                position: "right",
                stopOnFocus: false,
                style: {
                    background: "linear-gradient(to right, #00b09b, #96c93d)",
                },
            }).showToast();

        });
    });

}


let btnPerfil = document.getElementById("btnPerfil")
btnPerfil.addEventListener('click', () => {
    divProductos.innerHTML = "";
    console.log('click en perfil')
    fetch('/getUserData')

        .then(response => response.json())
        .then(data => {
            divProductos.innerHTML += `
      <div class="card" id="${data.id}" style="width: 18rem; margin:3px;">
          <div class="card-body">
              <h5 class="card-title">${data.username}</h5>
              <div class="col-md-4">
              <img src="uploads/${data.foto}" class="img-fluid rounded-start" alt="Producto sin imagen">
          </div>
          <p class="card-text">Nombre: ${data.nombre}</p>
              <p class="card-text">Direccion: ${data.direccion}</p>            
              <p class="card-text">Edad: ${data.edad}</p>
              <p class="card-text">Telefono: ${data.telefono}</p>

             
          </div>
      </div>       
  `
        })
})

function htmlCarrito() {
    let total = 0;
    modalBody.innerHTML = "";

    if (productosCarrito.length == 0) {
        modalBody.innerHTML = "No hay productos en el carrito.";
        btnFinalizarCompra.disabled = true;
    } else {
        btnFinalizarCompra.disabled = false;
        productosCarrito.forEach(producto => {
            const elementoEnCatalogo = listaProductos.find(elemento => elemento.codigo == producto.codigo)
            modalBody.innerHTML += `
               <div class="card mb-3"  id="c${producto.codigo}">
                  <div class="row g-0">
                       <div class="col-md-4">
                           <img src="${elementoEnCatalogo?.foto}" class="img-fluid rounded-start" alt="Producto sin imagen">
                       </div>
                      <div class="col-md-8">
                          <div class="card-body">
                              <h5 class="card-title">${elementoEnCatalogo?.nombre || "SIN DEFINIR"}</h5>
                              <p class="card-text">Codigo:${producto.codigo}</p>
                              <p class="card-text">Cantidad:${producto.cantidad}</p>
                              <p class="card-text">Unitario: $ ${producto.precioUnitario}</p>                               
                              <p class="card-text">Total: $ ${producto.totalLinea()}</p>
                              
                              <button class="btn btn-danger"><i class="fas fa-trash-alt"></i></button>                              
                              </div>
                      </div>
                  </div>
              </div>
            `
        }
        )

        const totalR = productosCarrito.reduce((acumulador, elemento) => acumulador + elemento.totalLinea(), 0)
        console.log(`Total Carrito $: ${totalR}`);
        const listaBotonesEliminar = modalBody.querySelectorAll(".btn");

        listaBotonesEliminar.forEach(btn => {
            btn.addEventListener("click", () => {

                Swal.fire({
                    title: 'Estas seguro?',
                    text: "El producto se eliminará del carrito!",
                    icon: 'warning',
                    showCancelButton: true,
                    confirmButtonColor: '#3085d6',
                    cancelButtonColor: '#d33',
                    confirmButtonText: 'Si, eliminarlo!'
                }).then((result) => {
                    if (result.isConfirmed) {

                        let codigo = btn.parentElement.parentElement.parentElement.parentElement.id.replace('c', '');
                        eliminarDelCarrito(codigo);

                        Swal.fire(
                            'Eliminado!',
                            'El producto ya no está en tu carrito.',
                            'success'
                        )
                    }
                })
            });
        });
    }
    actualizarCantidadCarritoEnHeader();
}


function obtenerPrecioUnitario(codigo) {
    let precio = 0;
    let indice = listaProductos.findIndex(productoC => productoC.codigo == codigo);
    if (indice != -1) {
        precio = listaProductos[indice].precio;
    }
    return precio
}

function obtenerProductoId(codigo) {
    let id = 0;
    let indice = listaProductos.findIndex(productoC => productoC.codigo == codigo);
    if (indice != -1) {
        id = listaProductos[indice].id;
    }
    return id
}

//Actualiza la cantidad de productos en el carrito que se visualiza en el Header
function actualizarCantidadCarritoEnHeader() {
    let cantidad = document.getElementById("carritoCantidad");
    let cuenta = productosCarrito.reduce((acumulador, elemento) => acumulador + elemento.cantidad, 0);
    cantidad.innerText = cuenta != 0 ? cuenta : "";
}


///Agrega productos al carrito y actualiza el localStorage
async function agregarACarrito(codigo, precioUnitario) {
    //verifico si ya existe en el carrito    
    const elementoEnCarrito = productosCarrito.find(elemento => elemento.codigo == codigo)
    let existeEnCarrito = (elementoEnCarrito === undefined) ? false : true;

    if (existeEnCarrito) {
        //Existe en carrito, incremento la cantidad
        elementoEnCarrito.cantidad++;

    } else {
        //no existe en carrito
        let elemento = new ProductoCarrito(codigo, 1, precioUnitario);
        productosCarrito.push(elemento);
    }
    let id = obtenerProductoId(codigo)
    let data = [{ id }]
    const result = await fetch(`/api/carrito/${carritoId}/productos`,
        {
            method: 'POST', headers: {
                'Content-Type': 'application/json'
                // 'Content-Type': 'application/x-www-form-urlencoded',
            },
            redirect: 'follow', // manual, *follow, error
            referrerPolicy: 'no-referrer', // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
            body: JSON.stringify(data) // body data type must match "Content-Type" header })
        })
    let resultJson = await result.json()
    console.log(resultJson)

    //actualizar al localstorage
    // localStorage.setItem("carrito", JSON.stringify(productosCarrito));

    actualizarCantidadCarritoEnHeader();

}

///Elimina productos del carrito y actualiza el localStorage
async function eliminarDelCarrito(codigo) {
    productosCarrito = productosCarrito.filter(elemeto => elemeto.codigo != codigo)
    //actualizar al localstorage
    //localStorage.setItem("carrito", JSON.stringify(productosCarrito));

    let id = obtenerProductoId(codigo)

    const result = await fetch(`/api/carrito/${carritoId}/productos/${id}`,
        {
            method: 'DELETE', headers: {
                'Content-Type': 'application/json'
                // 'Content-Type': 'application/x-www-form-urlencoded',
            },
            redirect: 'follow', // manual, *follow, error
            referrerPolicy: 'no-referrer', // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url

        })
    let resultJson = await result.json()
    console.log(resultJson)

    htmlCarrito();
}

async function iniciarCarrito() {
    const userData = await fetch("/getUserData")
    let data = await userData.json()
    carritoId = data.carritoId

    if (carritoId === 0) {
        //crear carrito y actualizar en usuario
        crearCarrito(data.username)


    } else {
        let url = `/api/carrito/${carritoId}/productos`
        console.log(url)
        const carritoData = await fetch(url, { method: 'GET' })
        let carritoJSON = await carritoData.json()


        carritoJSON.forEach(element => {
            let elemento = new ProductoCarrito(element.codigo, 1, element.precio);
            productosCarrito.push(elemento);
        });
    }
    htmlCarrito();



    btnFinalizarCompra.addEventListener('click', () => {
        //  DescontarStockDelCatalogo();
        // localStorage.setItem('carrito', JSON.stringify([]))
        productosCarrito = []
        //actualizar al localstorage
        // localStorage.setItem("carrito", JSON.stringify(productosCarrito));

        // eliminarCarritoEnBD(carritoId)
        enviarMailAdministrador(carritoId)

        htmlCarrito();
        actualizarCantidadCarritoEnHeader();
        swal.fire("Gracias por su compra!", "Los productos seran enviados en la brevedad", "success");
        // htmlCatalogoDeProductos();
    })




}


async function postData(url = '', data = {}) {
    // Opciones por defecto estan marcadas con un *
    const response = await fetch(url, {
        method: 'POST', // *GET, POST, PUT, DELETE, etc.
        mode: 'cors', // no-cors, *cors, same-origin
        cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
        credentials: 'same-origin', // include, *same-origin, omit
        headers: {
            'Content-Type': 'application/json'
            // 'Content-Type': 'application/x-www-form-urlencoded',
        },
        redirect: 'follow', // manual, *follow, error
        referrerPolicy: 'no-referrer', // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
        body: JSON.stringify(data) // body data type must match "Content-Type" header
    });
    return response.json(); // parses JSON response into native JavaScript objects
}