class Producto {
    constructor(id, nombre, precio, categoria, imagen){
        this.id = id;
        this.nombre= nombre;
        this.precio = precio;
        this.categoria = categoria;
        this.imagen = imagen;
    }
}


class Basedatos {
    constructor(){
        this.productos = [];
        this.agregarRegistro(1,"Hamburguesa con queso", 150,"burgers","pexels-oleksandr-p-12932961 (1).jpg");
        this.agregarRegistro(2,"Empanada", 190,"empanadas","empanadas.jpg")
        this.agregarRegistro(3,"Coca Cola", 50,"refrescos","gaseosa.jpg")
        this.agregarRegistro(4,"Pizza", 200,"Pizzas","pizza.jpg")
        this.agregarRegistro(5,"Papas fritas", 220,"fritas","fritas.jpg")
        this.agregarRegistro(6,"Tiramisú", 150,"postres","tiramisu.jpg")
    }

    agregarRegistro(id, nombre, precio, categoria, imagen){
        const producto = new Producto (id, nombre, precio, categoria, imagen);
        this.productos.push(producto);

    }
    TraerRegistros() {
        return this.productos;
    } 
    
    registrosPorId (id) {
        return this.productos.find ((producto)=> producto.id === id);
    
    }
    
    RegistrosPorNombre (palabra){
        return this.productos.filter ((producto)=> producto.nombre.toLowerCase().includes(palabra.toLowerCase()));
    
    }
}

class Carrito{
    constructor(){
        const carritoStorage= JSON.parse(localStorage.getItem("carrito"));
        this.carrito = carritoStorage || [];
        this.total = 0;
        this.CantidadProductos = 0;
        this.listar();
        
    }
    estaEnCarrito({ id }){
        return this.carrito.find((producto) => producto.id == id);
    }
    agregar(producto) {
        const productoEncarrito = this.estaEnCarrito(producto);
    
        if (!productoEncarrito) {
            this.carrito.push({...producto, cantidad: 1 });
        } else {
            productoEncarrito.cantidad++; 
            
        }
        localStorage.setItem("carrito", JSON.stringify(this.carrito));
        this.listar();
    }

    quitar(id){
        const indice = this.carrito.findIndex((producto) => producto.id == id);
        if(this.carrito[indice].cantidad > 1 ){
            this.carrito [indice].cantidad--;
        } else{
            this.carrito.splice (indice, 1);
        }
        localStorage.setItem("carrito", JSON.stringify(this.carrito));
        this.listar();
    }
    
    vaciar(){
        this.total=0;
        this.CantidadProductos = 0;
        this.carrito = [];
        localStorage.setItem("carrito", JSON.stringify(this.carrito));
        this.listar();
    }

    listar(){
        this.total = 0;
        this.CantidadProductos = 0;
        divCarrito.innerHTML = "";

        for (const producto of this.carrito){
            divCarrito.innerHTML += `
            <div class="productoCarrito">
                <h2>${producto.nombre} </h2> 
                <p>$${producto.precio} </p>
                <p>Cantidad: ${producto.cantidad}</p>
                <a href="#" class= "btnQuitar btn btn-danger" data-id="${producto.id}">Quitar del carrito</a>
            </div>
        
            `;
            this.total += producto.precio * producto.cantidad;
            this.CantidadProductos += producto.cantidad;
        }
        const botonesQuitar = document.querySelectorAll(".btnQuitar");
        for (const boton of botonesQuitar)
            boton.addEventListener("click",(Event)=>{
                Event.preventDefault();
                const idProducto = Number(boton.dataset.id);
                this.quitar(idProducto);
            });
            spanCantidadProductos.innerText = this.CantidadProductos;
            spanTotalCarrito.innerText = this.total;  
        }       
    
}

const bd = new Basedatos();

const spanCantidadProductos = document.querySelector("#CantidadProductos");  
const spanTotalCarrito = document.querySelector("#TotalCarrito");
const sectionProductos = document.querySelector("#productos");
const divCarrito = document.querySelector ("#Carrito");
const buscador = document.querySelector ("#buscador");
const botoncomprar = document.querySelector("#botoncomprar");

const carrito = new Carrito();

cargarProductos(bd.TraerRegistros());
//
function cargarProductos(productos) {
    sectionProductos.innerHTML= ""
    for (const producto of productos) {
        sectionProductos.innerHTML += `
        <section class="container row">
            <div class="productos">
                <h2>${producto.nombre}</h2>
                <div class= "img bordes">
                    <img class ="img" src="asset/${producto.imagen}"< />
                <p class= "letrapedido">$${producto.precio}</p>
            </div>
            <a href="#" class= "mt-4 letrapedido btnAgregar btn btn-success" data-id="${producto.id}">Agregar al carrito<a>
                </section>    
            `;
    }


    const botonesAgregar = document.querySelectorAll(".btnAgregar");
    
    for (const boton of botonesAgregar) {
        boton.addEventListener("click", (event) => {
            event.preventDefault();
            const idProducto = Number(boton.dataset.id);
            const producto = bd.registrosPorId(idProducto);
            carrito.agregar(producto);
            Toastify({
                        text: `Agregaste ${producto.nombre} a tu pedido`,
                        style: {
                        background: "linear-gradient(to right, #00b09b, #96c93d)",
                        }
                    }).showToast();
        });
    }
}

buscador.addEventListener("input", (event) =>{
    event.preventDefault();
    const palabra = buscador.value;
    const productos = bd.RegistrosPorNombre(palabra);
    cargarProductos(productos);
});

botoncomprar.addEventListener("click", (event) =>{
    event.preventDefault ();
    Swal.fire({
        position: 'center',
        icon: 'warning',
        title: 'Deseas finalizar la compra?',
        showCancelButton: true,
        confirmButtonText: "Si",
        cancelButton:"No",
    }) .then((result)=> {
        if (result.isConfirmed) {
            carrito.vaciar();
            Swal.fire({
                title: "Compra exitosa, disfruta de tu comida",
                icon: "success",
                text: "Su compra ha sido finalizada con éxito",
                timer:1800,
            })
        }
    })
});

