import BaseController from './BaseController.controller';
import MongoClient from '../services';
import { productos } from '../models';

export default class ProductosMongo extends BaseController {
  constructor() {
    super();
    this.collection = productos;
    this.client = new MongoClient();
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

  async obtener(id, proyeccion) {
    try {
      await this.client.connect();
      return await this.collection.find(id ? { _id: id } : {}, proyeccion);
    } catch (error) {
      throw new Error(`Error al obtener el producto: ${id}. ${error}`);
    } finally {
      await this.client.disconnect();
    }
  }

  async obtenerPorCategoria(categoria) {
    try {
      await this.client.connect();
      return await this.collection.find({ categoria });
    } catch (error) {
      throw new Error(`Error al obtener productos por categoria: ${categoria}. ${error}`);
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
