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

export default ProductoCarrito