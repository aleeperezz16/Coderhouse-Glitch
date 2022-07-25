import mongoose from "mongoose";
import { mongo } from "../config/index.js";

mongoose.connect(mongo.uri, { useNewUrlParser: true, useUnifiedTopology: true, dbName: "coderhouse" });

class ContenedorMongo {
  constructor(coleccion, schema) {
    this.model = mongoose.model(coleccion, schema);
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
      return await this.model.findByIdAndUpdate(id, { $set: elemento });
    } catch (error) {
      throw new Error(error);
    }
  }

  async getById(id) {
    try {
      return await this.model.findById(id);
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
      return await this.model.findByIdAndDelete(id);
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