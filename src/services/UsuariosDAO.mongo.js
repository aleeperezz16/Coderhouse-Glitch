import { BaseDAO, MongoClient } from '../classes';
import { UsuariosModel } from '../models';

class UsuariosDAOMongo extends BaseDAO {
  constructor() {
    super();
    this.collection = UsuariosModel;
    this.connection = new MongoClient();
  }

  async buscar(email) {
    try {
      await this.connection.connect();
      return await this.collection.findOne({ email });
    } catch (error) {
      throw new Error(`Error al buscar el email: ${email}. ${error}`);
    } finally {
      await this.connection.disconnect();
    }
  }

  async buscarPorId(id) {
    try {
      await this.connection.connect();
      return await this.collection.findById(id);
    } catch (error) {
      throw new Error(`Error al buscar el id: ${id}. ${error}`);
    } finally {
      await this.connection.disconnect();
    }
  }

  async guardar(usuario) {
    try {
      await this.connection.connect();
      return await this.collection.insertMany(usuario);
    } catch (error) {
      throw new Error(`Error al guardar usuario: ${usuario}. ${error}`);
    } finally {
      await this.connection.disconnect();
    }
  }
}

export default UsuariosDAOMongo;
