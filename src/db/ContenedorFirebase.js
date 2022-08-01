import admin from "firebase-admin";

admin.initializeApp({
  credential: admin.credential.applicationDefault()
});

const db = admin.firestore();
db.settings({ ignoreUndefinedProperties: true });

class ContenedorFirebase {
  constructor(coleccion) {
    this.coleccion = db.collection(coleccion);
  }

  async save(elemento) {
    try {
      await this.coleccion.doc().set(elemento);
      return elemento;
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
      const doc = await this.coleccion.doc(id).get();
      return !doc.exists ? { error: "Elemento no encontrado" } : doc.data();
    } catch (error) {
      throw new Error(error);
    }
  }

  async getAll() {
    try {
      const snapshot = await this.coleccion.get();
      return snapshot.docs.map(item => item.data());
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

  // Este es medio rebuscado. Como no se usa lo comento
  // async deleteAll() {
  //   try {
  //     return await this.coleccion.doc().delete();
  //   } catch (error) {
  //     throw new Error(error);
  //   }
  // }
}

export { ContenedorFirebase };