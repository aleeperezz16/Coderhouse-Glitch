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
      
      elemento.timestamp = Date.now();
      elemento.id = ultimo ? ultimo.id + 1 : 1;

      data.push(elemento);

      await fs.writeFile(this.nombreArchivo, JSON.stringify(data));

      return elemento;
    } catch (error) {
      throw new Error(error);
    }
  }

  async update(id, elemento) {
    try {
      const data = await this.getAll();
      const index = data.findIndex(item => item.id === parseInt(id));

      if (index === -1)
        return { error: "Elemento no encontrado" };

      Object.keys(elemento).forEach(key => !elemento[key] && delete elemento[key]);      

      const actualizado = { ...data[index], ...elemento };
      data[index] = actualizado;

      await fs.writeFile(this.nombreArchivo, JSON.stringify(data));
      return actualizado;
    } catch (error) {
      throw new Error(error);
    }
  }

  async getById(id) {
    try {
      const data = await this.getAll();
      const elemento = data.find(item => item.id === parseInt(id));

      if (!elemento)
        return { error: "Elemento no encontrado" };

      return elemento; 
    } catch (error) {
      throw new Error(error);
    }
  }

  async getAll() {
    try {
      const data = await fs.readFile(this.nombreArchivo, "utf-8");
      return data.length ? JSON.parse(data) : [];
    } catch (error) {
      throw new Error(error);
    }
  }

  async deleteById(id) {
    try {
      const data = await this.getAll();
      const index = data.findIndex(item => item.id === parseInt(id));

      if (index === -1)
        return { error: "Elemento no encontrado" };

      const elementoAEliminar = data[index];

      data.splice(index, 1);
      await fs.writeFile(this.nombreArchivo, data.length ? JSON.stringify(data) : "");

      return elementoAEliminar;
    } catch (error) {
      throw new Error(error);
    }
  }

  async deleteAll() {
    try {
      await fs.writeFile(this.nombreArchivo, "");
      return { mensaje: "Todos los elementos fueron eliminados" }
    } catch (error) {
      throw new Error(error);
    }
  }
}

export { ContenedorArchivo };