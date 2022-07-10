const knex = require("knex").knex({
  client: "sqlite3",
  connection: {
    filename: "./db/ecommerce.db3"
  },
  useNullAsDefault: true
})

function Chat() {
  this.crearTabla = async () => {
    try {
      if (!await knex.schema.hasTable("chat")) {
        await knex.schema.createTable("chat", table => {
          table.increments("id").primary();
          table.string("autor", 65);
          table.dateTime("fecha");
          table.text("mensaje");
        })
          .then(() => console.log("Tabla de chats creada"))
          .catch(err => console.error(err));
      }
    } catch (err) {
      throw new Error(err);
    }
  };

  this.save = async (mensaje) => {
    try {
      await knex("chat")
        .insert(mensaje)
        .catch(err => console.error(err));
    } catch (err) {
      throw new Error(err);
    }
  }

  this.getMessages = async () => {
    try {
      return await knex("chat")
        .select("autor", "fecha", "mensaje")
        .then(res => res)
        .catch(err => console.error(err));
    } catch (err) {
      throw new Error(err);
    }
  }
}


/* const fs = require("fs");

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
} */

module.exports = Chat;