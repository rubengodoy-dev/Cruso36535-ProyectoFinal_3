const ContainerMongo = require('../../contenedores/ContainerMongo')
const productoModel = require("../../models/productos")

class ProductoDaoMongo extends ContainerMongo {
	constructor(){
       
		super(productoModel)
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

            }
        } else {
            return 'Not saved'
        }
    }

	async getDataById(id) {
        let producto = await this.getByDataId(id)
        let result = null
        if (producto) {
            result = producto
        }
        return result
    }
    async getDataAll() {
        let producto = await this.getAll()
        let result = []

        producto.forEach(p => {
            result.push(p)
        });

        return result
    }
 
	
    async updateProducto(id, producto) {
        let prod = await this.getByDataId(id)
        if (prod === null) {
            return null
        }
        else {
            try {
		
                await this.updateByDataId(producto,id)
                return id
            } catch (error) {
                console.log(`Error al actualizar producto: ${err}`)
                return null
            }
        }
    }
	async deleteProducto(id) {
        return await this.deleteByDataId(id)
        
	}

}

module.exports =   ProductoDaoMongo

