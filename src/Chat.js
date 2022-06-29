const fs = require("fs");

class Chat {
  constructor(archivo) {
    this.archivo = archivo;
  }

  async save(mensaje) {
    try {
      const data = await fs.promises.readFile(this.archivo, "utf-8");
      if (data.length) {
        const mensajes = JSON.parse(data);

        mensajes.push(mensaje);
        fs.promises.writeFile(this.archivo, JSON.stringify(mensajes));
      } else
        fs.promises.writeFile(this.archivo, JSON.stringify([mensaje]));
    } catch (err) {
      throw new Error(err);
    }
  }

  async getMessages() {
    try {
      const mensajes = await fs.promises.readFile(this.archivo, "utf-8");

      if (mensajes.length)
        return JSON.parse(mensajes);
      else
        return null;
    } catch (err) {
      throw new Error(err);
    }
  }
}

module.exports = Chat;