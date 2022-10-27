import mongoose from 'mongoose';
import config from '../utils/config';
import DBClient from './DBClient.class';

class MongoClient extends DBClient {
  constructor() {
    super();
    this.client = mongoose;
  }

  async connect() {
    try {
      this.client.connect(config.mongodb.uri, config.mongodb.options);
    } catch (error) {
      throw new Error(`Error al conectarse a MongoDB. Error: ${error}`);
    }
  }

  async disconnect() {
    try {
      await this.client.connection.close();
    } catch (error) {
      throw new Error(`Error al desconectarse de MongoDB. Error: ${error}`);
    }
  }
}

export default MongoClient;
