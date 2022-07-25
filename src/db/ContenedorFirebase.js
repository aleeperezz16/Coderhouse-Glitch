import admin from "firebase-admin";

admin.initializeApp({
  credential: admin.credential.applicationDefault()
});

class ContenedorFirebase {
  constructor(coleccion) {
    this.coleccion = admin.firestore().collection(coleccion);
  }

  async save(elemento) {
    try {
      return await this.coleccion.doc().create(elemento);
    } catch (error) {
      throw new Error(error);
    }
  }

  async update(id, elemento) {
    try {
      return await this.coleccion.doc(id).update(elemento);
    } catch (error) {
      throw new Error(error);
    }
  }

  async getById(id) {
    try {
      return await this.coleccion.doc(id).get();
    } catch (error) {
      throw new Error(error);
    }
  }

  async getAll() {
    try {
      return await this.coleccion.doc().get();
    } catch (error) {
      throw new Error(error);
    }
  }

  async deleteById(id) {
    try {
      return await this.coleccion.doc(id).delete();
    } catch (error) {
      throw new Error(error);
    }
  }

  async deleteAll() {
    try {
      return await this.coleccion.doc().delete();
    } catch (error) {
      throw new Error(error);
    }
  }
}

export { ContenedorFirebase };