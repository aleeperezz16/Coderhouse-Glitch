import { archivo } from "../config/index.js";
import fs from "fs/promises";

class ContenedorArchivo {
  constructor(nombreArchivo) {
    this.nombreArchivo = `${archivo.directorio}/${nombreArchivo}.txt`;
  }

  async save(elemento) {
    try {
      const data = await this.getAll();
      const ultimo = data[data.length - 1];
      
      elemento.id = ultimo ? ultimo.id + 1 : 1;
      
      data.push(elemento);
      await fs.writeFile(this.nombreArchivo, JSON.stringify(data));
      
      return elemento.id;
    } catch (error) {
      throw new Error(error);
    }
  }

  async update(id, elemento) {
    try {
      const data = await this.getAll();
      const index = data.findIndex(item => item.id === parseInt(id));

      if (index === -1)
        throw "no encontrado";

      const actualizado = { ...data[index], ...elemento };
      data[index] = actualizado;

      await fs.writeFile(this.nombreArchivo, JSON.stringify(data));
      return id;
    } catch (error) {
      throw new Error(error);
    }
  }

  async getById(id) {
    try {
      const data = await this.getAll();
      const elemento = data.find(item => item.id === parseInt(id));

      if (!elemento)
        throw "no encontrado";

      return elemento; 
    } catch (error) {
      throw new Error(error);
    }
  }

  async getAll() {
    try {
      const data = await fs.readFile(this.nombreArchivo, "utf-8");
      return data.length ? JSON.parse(data) : null;
    } catch (error) {
      throw new Error(error);
    }
  }

  async deleteById(id) {
    try {
      const data = await this.getAll();
      const index = data.findIndex(item => item.id === parseInt(id));

      if (index === -1)
        throw "no encontrado";

      data.splice(index, 1);
      await fs.writeFile(this.nombreArchivo, data.length ? JSON.stringify(data) : "");

    } catch (error) {
      throw new Error(error);
    }
  }

  async deleteAll() {
    try {
      await fs.writeFile(this.nombreArchivo, "");
    } catch (error) {
      throw new Error(error);
    }
  }
}

export { ContenedorArchivo };