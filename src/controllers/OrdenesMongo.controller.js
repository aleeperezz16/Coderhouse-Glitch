import BaseController from './BaseController.controller';
import MongoClient from '../services';
import { ordenes } from '../models';

export default class OrdenesMongo extends BaseController {
  constructor() {
    super();
    this.collection = ordenes;
    this.client = new MongoClient();
  }

  async guardar(orden) {
    try {
      await this.client.connect();
      return await this.collection.insertMany(orden);
    } catch (error) {
      throw new Error(`Error al guardar la orden: ${orden}. ${error}`);
    } finally {
      await this.client.disconnect();
    }
  }

  async obtenerNroOrden() {
    try {
      await this.client.connect();
      return await this.collection.find().count();
    } catch (error) {
      throw new Error(`Error al obtener número de orden. ${error}`);
    } finally {
      await this.client.disconnect();
    }
  }
}
