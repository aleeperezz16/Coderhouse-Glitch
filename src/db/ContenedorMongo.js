import mongoose from "mongoose";
import { mongo } from "../config/index.js";

mongoose.connect(mongo.uri, { useNewUrlParser: true, useUnifiedTopology: true, dbName: "coderhouse" });

class ContenedorMongo {
  constructor(coleccion, schema) {
    this.model = mongoose.model(coleccion, new mongoose.Schema(schema));
  }

  async save(elemento) {
    try {
      return await this.model.insertMany(elemento);
    } catch (error) {
      throw new Error(error);
    }
  }

  async update(id, elemento) {
    try {
      const respuesta = (await this.model.findByIdAndUpdate(id, { $set: elemento }));
      return respuesta ? respuesta : { error: "Elemento no encontrado" };
    } catch (error) {
      throw new Error(error);
    }
  }

  async getById(id) {
    try {
      const respuesta = await this.model.findById(id);
      return respuesta ? respuesta : { error: "Elemento no encontrado" };
    } catch (error) {
      throw new Error(error);
    }
  }

  async getAll() {
    try {
      return await this.model.find(undefined);
    } catch (error) {
      throw new Error(error);
    }
  }

  async deleteById(id) {
    try {
      const respuesta = await this.model.findByIdAndDelete(id);
      return respuesta ? respuesta : { error: "Elemento no encontrado" };
    } catch (error) {
      throw new Error(error);
    }
  }

  async deleteAll() {
    try {
      return await this.model.deleteMany(undefined);
    } catch (error) {
      throw new Error(error);
    }
  }
}

export { ContenedorMongo };