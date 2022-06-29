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
        // Si ya tengo datos, obtengo el array de productos
        const listaProd = JSON.parse(data);

        // Si "producto" tiene una propiedad "id" es porque lo quiero modificar
        if (producto.id !== undefined) {
          const productoEncontrado = (listaProductos) => {
            for (const prod of listaProductos) {
              if (prod.id === producto.id)
                return prod;
            }

            return null;
          };

          const productoACambiar = productoEncontrado(listaProd);

          if (productoACambiar !== null)
            listaProd[listaProd.indexOf(productoACambiar)] = producto;
          else
            throw "Producto no encontrado";
        } else {
          // Es uno nuevo, lo agrego
          // Leo el indice del ultimo producto para actualizarlo
          producto.id = listaProd[listaProd.length - 1].id + 1;
          listaProd.push(producto);
        }

        fs.promises.writeFile(this.archivo, JSON.stringify(listaProd));
      } else {
        // Si no tengo ninguno, creo el arreglo con un solo producto
        producto.id = 1;
        fs.promises.writeFile(this.archivo, JSON.stringify([producto]));
      }
    } catch (err) {
      throw new Error(err);
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

        if (producto === null)
          throw "Producto no encontrado";
      }
    } catch (err) {
      throw new Error(err);
    }

    return producto;
  }

  async getAll() {
    try {
      const data = await fs.promises.readFile(this.archivo, "utf-8");
      if (data.length) 
        return JSON.parse(data);
      else 
        return null;
    } catch (err) {
      throw new Error(err);
    }
  }

  async deleteById(id) {
    try {
      const data = await fs.promises.readFile(this.archivo, "utf-8");
      if (data.length) {
        const productos = JSON.parse(data);
        let productoEliminado = false;

        for (let i = 0; i < productos.length && !productoEliminado; i++) {
          if (productos[i].id === id) {
            productos.splice(i, 1);
            productoEliminado = true;
          }
        }

        // Terminé el ciclo y no borré nada
        if (!productoEliminado)
          throw "Producto no encontrado";

        await fs.promises.writeFile(
          this.archivo,
          productos.length ? JSON.stringify(productos) : ""
        );
      }
    } catch (err) {
      throw new Error(err);
    }
  }

  async deleteAll() {
    try {
      await fs.promises.writeFile(this.archivo, "");
    } catch (err) {
      throw new Error(err);
    }
  }
}

module.exports = Contenedor;