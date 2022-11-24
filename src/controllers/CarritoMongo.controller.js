import BaseController from './BaseController.controller';
import MongoClient from '../services';
import { carrito } from '../models';

export default class CarritoMongo extends BaseController {
  constructor() {
    super();
    this.collection = carrito;
    this.client = new MongoClient();
  }

  async guardar(cart) {
    try {
      await this.client.connect();
      return await this.collection.insertMany(cart);
    } catch (error) {
      throw new Error(`Error al guardar el carrito: ${cart}. ${error}`);
    } finally {
      await this.client.disconnect();
    }
  }

  async obtener(email) {
    try {
      await this.client.connect();
      return await this.collection.findOne({ email }, 'productos');
    } catch (error) {
      throw new Error(`Error al obtener los productos del carrito para: ${email}. ${error}`);
    } finally {
      await this.client.disconnect();
    }
  }

  async obtenerPorId(id) {
    try {
      await this.client.connect();
      return await this.collection.findById(id, 'productos');
    } catch (error) {
      throw new Error(`Error al obtener los productos del carrito con id: ${id}. ${error}`);
    } finally {
      await this.client.disconnect();
    }
  }

  async actualizar(id, productos) {
    try {
      await this.client.connect();
      return await this.collection.findByIdAndUpdate(id, productos);
    } catch (error) {
      throw new Error(`Error al actualizar el carrito con id: ${id}. ${error}`);
    } finally {
      await this.client.disconnect();
    }
  }

  async eliminar(id) {
    try {
      await this.client.connect();
      return await this.collection.findByIdAndDelete(id);
    } catch (error) {
      throw new Error(`Error al eliminar el carrito con id: ${id}. ${error}`);
    } finally {
      await this.client.disconnect();
    }
  }
}
