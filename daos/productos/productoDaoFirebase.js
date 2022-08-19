const ContainerFirestore = require("../../contenedores/ContainerFirestore")

class ProductoDaoFirestore extends ContainerFirestore {
    constructor() {

        super('productos')
        this.id = 0

    }

    // Chequea para obtener el ultimo ID y asignarlo al id local (this.id)
    async checkId() {


        let id = 0
        let productos = await this.getAll()
        if (productos.length > 0) {

            id = Math.max(...productos.map(p => p.id))

        }
        id = id + 1

        return id
    }

    async create(producto) {
        if (producto) {

            try {

                producto.id = await this.checkId()
                producto.timestamp = Date.now()
                this.save(producto, producto.id)
                console.log(producto)
                this.id++
                return producto.id
            } catch (error) {
                console.log(`Error al crear producto: ${err}`)
                return null
            }
        } else {
            return 'Not saved'
        }
    }

    saveProducto(producto) {
        if (producto) {
            console.log(producto)
            this.save(producto, this.id)
            // console.log(this.id)
            this.id++
            return producto
        } else {
            return 'Not saved'
        }
    }

    async updateProducto(id, producto) {
        let prod = await this.getById(id)
        if (prod === null) {
            return null
        }
        else {
            try {
                await this.update(producto, id)
                return id
            } catch (error) {
                console.log(`Error al actualizar producto: ${err}`)
                return null
            }
        }
    }

    async getDataById(id) {
        let producto = await this.getById(id)
        let result = null
        if (producto) {
            result = producto.data
        }
        return result
    }
    async getDataAll() {
        let producto = await this.getAll()
        let result = []

        producto.forEach(p => {
            result.push(p.data)
        });

        return result
    }

    async deleteProducto(id) {
        return await this.delete(id)
	}


}

module.exports = ProductoDaoFirestore
