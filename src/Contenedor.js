const fs = require("fs");

class Contenedor {
  constructor(archivo) {
    this.archivo = archivo;
  }

  async save(elemento) {
    try {
      const data = await fs.promises.readFile(this.archivo, "utf-8");
      if (data.length) {
        const lista = JSON.parse(data);

        if (elemento.id) {
          const elemEncontrado = (lista) => {
            for (const elem of lista) {
              if (elem.id === elemento.id)
                return elem;
            }

            return null;
          };

          const elemACambiar = elemEncontrado(lista);

          if (elemACambiar)
            lista[lista.indexOf(elemACambiar)] = elemento;
          else
            throw "no encontrado";
        } else {
          elemento.id = lista[lista.length - 1].id + 1;
          lista.push(elemento);
        }

        fs.promises.writeFile(this.archivo, JSON.stringify(lista));
      } else {
        elemento.id = 1;
        fs.promises.writeFile(this.archivo, JSON.stringify([elemento]));
      }
    } catch (err) {
      throw new Error(err);
    }

    return elemento.id;
  }

  async getById(id) {
    let elemento = null;

    try {
      const data = await fs.promises.readFile(this.archivo, "utf-8");
      if (data.length) {
        const lista = JSON.parse(data);
        for (const elem of lista) {
          if (elem.id === id) {
            elemento = elem;
            break;
          }
        }

        if (!elemento)
          throw "no encontrado";
      } else
        throw "no encontrado";
    } catch (err) {
      throw new Error(err);
    }

    return elemento;
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
        const lista = JSON.parse(data);
        let elemEliminado = false;

        for (let i = 0; i < lista.length && !elemEliminado; i++) {
          if (lista[i].id === id) {
            lista.splice(i, 1);
            elemEliminado = true;
          }
        }

        if (!elemEliminado)
          throw "no encontrado";

        await fs.promises.writeFile(
          this.archivo,
          lista.length ? JSON.stringify(lista) : ""
        );
      }
      else
        throw "no encontrado";
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