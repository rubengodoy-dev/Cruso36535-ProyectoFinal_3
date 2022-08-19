const ContainerMongo = require('../../contenedores/ContainerMongo')
const carritoModel = require('../../models/carritos')
const ProductoDaoMongo = require("../productos/productoDaoMongo")


class CarritoDaoMongo extends ContainerMongo {
	constructor() {
		super(carritoModel)
	}

	// Chequea para obtener el ultimo ID y asignarlo al id local (this.id)
	async checkId() {
		let id = 0
		console.log(`CheckId`)
		let carritos = await this.getAll()
		console.log(`post check: ${carritos}`)
		if (carritos.length > 0) {
			id = Math.max(...carritos.map(p => p.id))

		}
		id = id + 1
		return id
	}
	async create(carrito) {
		if (carrito) {
			try {
				carrito.id = await this.checkId()
				carrito.timestamp = Date.now()
				this.save(carrito)
				return carrito.id
			} catch (error) {
				console.log(`Error al crear carrito: ${error}`)
				return null
			}
		} else {
			return 'Not saved'
		}
	}


	saveCarrito(carrito) {
		this.save(carrito)
		return carrito
	}
	async deleteCarrito(id) {
		return await this.deleteByDataId(id)
	}

	async getDataById(id) {
		let carrito = await this.getByDataId(id)

	//	console.log(` carrito dao mongo: getDataById(${id}) ${carrito}`)
		let result = null
		if (carrito) {
			result = carrito
		}
		return result
	}

	async updateProductos(id, listaIdsProductos) {
		let carrito = await this.getByDataId(id)

		

		if (carrito === null) {
			return null
		}
		else {
			const dataProductos = new ProductoDaoMongo()
			const productos = carrito.productos ?? [];
			for (const pId of listaIdsProductos) {

				let producto = await dataProductos.getByDataId(pId.id)//TODO: buscar el producto
				console.log(`isArray: ${producto}`)
				const newProduct = {
					id: producto.id,
					timestamp: producto.timestamp,
					nombre: producto.nombre,
					descripcion: producto.descripcion,
					codigo: producto.codigo,
					foto: producto.foto,
					precio: producto.precio,
					stock: producto.stock,
				};
				console.log(`productoN: ${newProduct}`)
				//productos.push(newProduct)
				productos.push(...producto)
			
			}

			try {
		
				await this.updateByDataId({ productos }, id)
				return id
			} catch (err) {
				console.log(`Error al guardar productos en el carrito: ${err}`)
			}
		}
	}
	async deleteProducto(id, id_prod) {
		let carrito = await this.getByDataId(id)
        if (carrito === null) {
            return null
        }
        else {

			const productos = carrito.productos ?? [];          

            productos = productos.filter(p => p.id != id_prod)

            try {
                this.updateCarrito({  productos }, id)
                return id
            } catch (err) {
                console.log(`Error al eliminar producto del carrito: ${err}`)
            }
        }
	}
}

module.exports = CarritoDaoMongo 
