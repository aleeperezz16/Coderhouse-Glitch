import BaseController from './BaseController.controller';
import MongoClient from '../services';
import { usuarios } from '../models';

export default class UsuariosMongo extends BaseController {
  constructor() {
    super();
    this.collection = usuarios;
    this.client = new MongoClient();
  }

  async guardar(usuario) {
    try {
      await this.client.connect();
      return await this.collection.insertMany(usuario);
    } catch (error) {
      throw new Error(`Error al guardar usuario: ${usuario.email}. ${error}`);
    } finally {
      await this.client.disconnect();
    }
  }

  async obtener(email) {
    try {
      await this.client.connect();
      return await this.collection.findOne({ email });
    } catch (error) {
      throw new Error(`Error al obtener el email: ${email}. ${error}`);
    } finally {
      await this.client.disconnect();
    }
  }

  async obtenerPorId(id) {
    try {
      await this.client.connect();
      return await this.collection.findById(id);
    } catch (error) {
      throw new Error(`Error al obtener el id: ${id}. ${error}`);
    } finally {
      await this.client.disconnect();
    }
  }
}
