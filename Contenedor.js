const fs = require("fs");

class Contenedor {
  constructor(archivo) {
    this.archivo = archivo;
  }

  async save(producto) {
    try {
      // Leo lo que tengo
      const data = await fs.promises.readFile(this.archivo, "utf-8");
      if (data.length) {
        // Si ya tengo datos, obtengo el array de productos y agrego uno nuevo
        const listaProd = JSON.parse(data);

        // Leo el indice del ultimo producto para actualizarlo
        producto.id = listaProd[listaProd.length - 1].id + 1;

        // Lo guardo
        listaProd.push(producto);
        fs.promises.writeFile(this.archivo, JSON.stringify(listaProd));
      } else {
        // Si no tengo ninguno, creo el arreglo con un solo producto
        producto.id = 1;
        fs.promises.writeFile(this.archivo, JSON.stringify([producto]));
      }
    } catch (err) {
      throw Error(err);
    }

    return producto.id;
  }

  async getById(id) {
    let producto = null;

    try {
      const data = await fs.promises.readFile(this.archivo, "utf-8");
      if (data.length) {
        const listProd = JSON.parse(data);
        for (const elem of listProd) {
          if (elem.id === id) {
            producto = elem;
            break;
          }
        }
      }
    } catch (err) {
      throw Error(err);
    }

    return producto;
  }

  async getAll() {
    try {
      const data = await fs.promises.readFile(this.archivo, "utf-8");
      if (data.length) return JSON.parse(data);
      else return null;
    } catch (err) {
      throw Error(err);
    }
  }

  async deleteById(id) {
    try {
      const data = await fs.promises.readFile(this.archivo, "utf-8");
      if (data.length) {
        const productos = JSON.parse(data);
        for (let i = 0; i < productos.length; i++) {
          if (productos[i].id === id) {
            productos.splice(i, 1);
            console.log(`Producto eliminado con id: ${id}`);
            break;
          }
        }

        await fs.promises.writeFile(
          this.archivo,
          productos.length ? JSON.stringify(productos) : ""
        );
      }
    } catch (err) {
      throw Error(err);
    }
  }

  async deleteAll() {
    try {
      await fs.promises.writeFile(this.archivo, "");
      console.log("Productos eliminados");
    } catch (err) {
      throw Error(err);
    }
  }
}

module.exports = {
  Contenedor
}