const  {mongoConnection} = require("../config")


class ContainerMongo {
  constructor(model) {
       this.model = model
       mongoConnection()
  }

  async getAll() {  
    return await this.model.find({})
  }

  async save(data) {
    return await this.model.create(data)
  }

  async create(data) {
    let dataSave = await this.model.create(data)    
    return dataSave
  }

  async getById(id) {
    return await this.model.find({ _id: id })   
  }

  async getByDataId(id) {
    return await this.model.find({ id: id })   
  }

  async update(content, id) {   
    let item = await this.model.updateOne({ _id: id }, content)
    console.log(item)
    return item
  }
  async updateByDataId(content, id) {   
    let item = await this.model.updateOne({ id: id }, content)
    console.log(item)
    return item
  }

  async delete(id){ 
    let item = await this.model.deleteOne({ _id: id })
    return (id)
  }

  
  async deleteByDataId(id){  
        let item = await this.model.deleteOne({ id: id })
    return (id)
  }




}

module.exports= ContainerMongo
