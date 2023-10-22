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

    agregarRegistro(id, nombre ,precio, categoria, imagen){
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
        return this.productos.filter ((producto)=> producto.nombre.toLowerCase(). includes(palabra.toLowerCase()));
    
    }
}

class Carrito{
    constructor(){
        this.carrito = [];
        this.total = 0;
        this.cantidadProductos = 0;
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
        this.listar();
    }

    quitar(id){
        const indice = this.carrito.findIndex((producto) => producto.id == id);
        if(this.carrito[indice].cantidad > 1 ){
            this.carrito [indice].cantidad--;
        } else{
            this.carrito.splice (indice, 1);
        }
        this.listar();
    }

    listar(){
        this.total = 0;
        this.cantidadProductos = 0;
        divCarrito.innerHTML = "";

        for (const producto of this.carrito){
            divCarrito.innerHTML += `
            <div class="productoCarrito">
                <h2>${producto.nombre} </h2> 
                <p>$${producto.precio} </p>
                <p>Cantidad: ${producto.cantidad}</p>
                <a href="#" class= "btnQuitar" data-id="${producto.id}">Quitar del carrito</a>
            </div>
            `;
            this.total += producto.precio * producto.cantidad;
            this.cantidadProductos += producto.cantidad;
        }

        const botonesQuitar = document.querySelectorAll(".btnQuitar");
        for (const boton of botonesQuitar)
            boton.addEventListener("click",(Event)=>{
                Event.preventDefault();
                const idProducto = Number(boton.dataset.id);
                this.quitar(idProducto);
            });
            spanCantidadProductos.innerText = this.cantidadProductos;
            spanTotalCarrito.innerText = this.total;  
        }       
    
}


const bd = new Basedatos();
const carrito = new Carrito();
const spanCantidadProductos = document.querySelector("#Cantidadproductos");  
const spanTotalCarrito = document.querySelector("#totalcarrito");
const divProductos = document.querySelector("#productos");
const divCarrito = document.querySelector ("#Carrito");

cargarProductos(bd.TraerRegistros());
//
function cargarProductos(productos) {
    divProductos.innerHTML= ""
    for (const producto of productos) {
        divProductos.innerHTML += `
        <section class="container-fluid row mt-5 ">
            <div class="">
                <h2>${producto.nombre}</h2>
                <p class= "letrapedido">$${producto.precio}</p>
                <div class= " img bordes">
                    <img class ="img" src="asset/${producto.imagen}"< />
                </div>
        </section>        
                <a href="#" class= "letrapedido btnAgregar" data-id="${producto.id}">Agregar al carrito</a>
                </div>
            `;
    }


    const botonesAgregar = document.querySelectorAll(".btnAgregar");
    
    for (const boton of botonesAgregar) {
        boton.addEventListener("click", (event) => {
            event.preventDefault();
            const idProducto = +boton.dataset.id;
            const producto = bd.registrosPorId(idProducto);
            console.log (producto);
            carrito.agregar(producto);
        });
    }
}



