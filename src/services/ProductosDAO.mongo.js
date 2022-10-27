import { BaseDAO, MongoClient } from '../classes';
import { ProductosModel } from '../models';

class ProductosDAOMongo extends BaseDAO {
  constructor() {
    super();
    this.collection = ProductosModel;
    this.client = new MongoClient();
  }

  async buscar(id, proyeccion) {
    try {
      await this.client.connect();
      return await this.collection.find(id ? { _id: id } : {}, proyeccion);
    } catch (error) {
      throw new Error(`Error al buscar el producto: ${id}. ${error}`);
    } finally {
      await this.client.disconnect();
    }
  }

  async guardar(producto) {
    try {
      await this.client.connect();
      return await this.collection.insertMany(producto);
    } catch (error) {
      throw new Error(`Error al guardar el producto: ${producto}. ${error}`);
    } finally {
      await this.client.disconnect();
    }
  }

  async actualizar(id, producto) {
    try {
      await this.client.connect();
      return await this.collection.findByIdAndUpdate(id, producto);
    } catch (error) {
      throw new Error(`Error al actualizar el producto: ${id}. ${error}`);
    } finally {
      await this.client.disconnect();
    }
  }

  async eliminar(id) {
    try {
      await this.client.connect();
      return await this.collection.findByIdAndDelete(id);
    } catch (error) {
      throw new Error(`Error al eliminar el producto: ${id}. ${error}`);
    } finally {
      await this.client.disconnect();
    }
  }
}

export default ProductosDAOMongo;
