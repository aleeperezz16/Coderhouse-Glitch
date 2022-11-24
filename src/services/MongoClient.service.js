import mongoose from 'mongoose';
import DBClient from './DBClient.service';
import { database } from '../config';

export default class MongoClient extends DBClient {
  constructor() {
    super();
    this.client = mongoose;
  }

  async connect() {
    try {
      await this.client.connect(database.mongodb.uri, database.mongodb.options);
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
