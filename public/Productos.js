class Producto{
    constructor (codigo, nombre,foto,id, precio, stock){
        this.codigo=codigo
        this.nombre=nombre
        this.foto=foto
        this.id=id
        this.precio=precio
        this.stock=stock
    }

    aumentarStock(cantiad)
    {
        this.stock+=cantiad;
    }
    disminuirStock(cantiad)
    {
        if (cantiad<=this.stock) {
            this.stock-=cantiad;
        }else{
            console.log("La cantidad a disminuir supera al stock disponible");
        }
    }

    mostrarInformacion(){
        console.log(`Codigo:${this.codigo}  
                     Producto:${this.nombre}  
                     Stock:${this.stock} 
                     Precio:${this.precio}` )
    }

}


let listaProductos=[]


class ProductoCarrito{
    constructor (codigo, cantidad, precioUnitario){
        this.codigo=codigo;
        this.cantidad=cantidad;
        this.precioUnitario=precioUnitario;
    } 

    totalLinea(){
        return this.precioUnitario*this.cantidad;
    }
}