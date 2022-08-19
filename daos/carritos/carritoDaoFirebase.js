const ContainerFirestore = require("../../contenedores/ContainerFirestore")
const ProductoDaoFirestore = require("../productos/productoDaoFirebase")

class CarritoDaoFirestore extends ContainerFirestore {
    constructor() {
        super('carritos')
        this.id = 0

       
    }

    // Chequea para obtener el ultimo ID y asignarlo al id local (this.id)
    async checkId() {
        let id = 0
        let carritos = await this.getAll()
        if (carritos.length > 0) {
            id = Math.max(...carritos.map(p => p.id))

        }
        id = id + 1
        return id
    }

    async create(carrito) {
        if (carrito) {
            carrito.id = await this.checkId()
            console.log(carrito)

            this.save(carrito, carrito.id)
            // console.log(this.id)
            this.id++
            return carrito
        } else {
            return 'Not saved'
        }
    }

    updateCarrito(carrito, id) {
        if (carrito) {
            console.log(carrito)
            this.update(carrito, id)
            return carrito
        } else {
            return 'Not updated'
        }
    }
    async updateProductos(id, listaIdsProductos) {
        let carrito = await this.getById(id)
        if (carrito === null) {
            return null
        }
        else {
            const dataProductos = new ProductoDaoFirestore()
            const productos = carrito.data.productos ?? [];
            for (const pId of listaIdsProductos) {

                let producto = await dataProductos.getById(pId.id)//TODO: buscar el producto
                productos.push(producto.data)
            }

            try {

                this.updateCarrito({ productos }, id)
                return id
            } catch (err) {
                console.log(`Error al guardar productos en el carrito: ${err}`)
            }
        }
    }
    async deleteProducto(id, id_prod) {
        let carrito = await this.getById(id)
        if (carrito === null) {
            return null
        }
        else {
            let data = carrito.data

            data.productos = data.productos.filter(p => p.id != id_prod)

            try {
                this.updateCarrito({ productos: data.productos }, id)
                return id
            } catch (err) {
                console.log(`Error al eliminar producto del carrito: ${err}`)
            }
        }




    }


    async getDataById(id) {
        let carrito = await this.getById(id)
        let result = null
        if (carrito) {
            result = carrito.data
            console.log("carrito get by id")
            console.log(carrito.data)
        }

        return result
    }

    async deleteCarrito(id) {
        return await this.delete(id)
	}

}

module.exports = CarritoDaoFirestore
