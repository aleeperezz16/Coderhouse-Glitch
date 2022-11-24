import BaseController from './BaseController.controller';
import MongoClient from '../services';
import { mensajes } from '../models';

export default class MensajesMongo extends BaseController {
  constructor() {
    super();
    this.collection = mensajes;
    this.client = new MongoClient();
  }

  async guardar(mensaje) {
    try {
      await this.client.connect();
      return await this.collection.insertMany(mensaje);
    } catch (error) {
      throw new Error(`Error al guardar el mensaje: ${mensaje}. ${error}`);
    } finally {
      await this.client.disconnect();
    }
  }

  async obtener(email) {
    try {
      await this.client.connect();
      return await this.collection.find({ email });
    } catch (error) {
      throw new Error(`Error al obtener los mensajes de email: ${email}. ${error}`);
    } finally {
      await this.client.disconnect();
    }
  }
}
