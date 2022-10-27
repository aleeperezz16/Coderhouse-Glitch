import { BaseDAO, MongoClient } from '../classes';
import { CarritoModel } from '../models';

class CarritoDAOMongo extends BaseDAO {
  constructor() {
    super();
    this.collection = CarritoModel;
    this.client = new MongoClient();
  }

  async buscar(id) {
    try {
      await this.client.connect();
      return await this.collection.findById(id);
    } catch (error) {
      throw new Error(`Error al buscar el carrito: ${id}. ${error}`);
    } finally {
      await this.client.disconnect();
    }
  }

  async guardar(productos) {
    try {
      await this.client.connect();
      return await this.collection.insertMany(productos);
    } catch (error) {
      throw new Error(`Error al guardar productos en el carrito: ${productos}. ${error}`);
    } finally {
      await this.client.disconnect();
    }
  }

  async actualizar(id, carrito) {
    try {
      await this.client.connect();
      return await this.collection.findByIdAndUpdate(id, carrito);
    } catch (error) {
      throw new Error(`Error al actualizar el carrito: ${id}. ${error}`);
    } finally {
      await this.client.disconnect();
    }
  }

  async eliminar(id) {
    try {
      await this.client.connect();
      return await this.collection.findByIdAndDelete(id);
    } catch (error) {
      throw new Error(`Error al eliminar el carrito: ${id}. ${error}`);
    } finally {
      await this.client.disconnect();
    }
  }
}

export default CarritoDAOMongo;
