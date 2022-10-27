class BaseDAO {
  static async buscar() {
    throw new Error('Método "buscar" no implementado');
  }

  static async guardar() {
    throw new Error('Método "guardar" no implementado');
  }

  static async actualizar() {
    throw new Error('Método "actualizar" no implementado');
  }

  static async eliminar() {
    throw new Error('Método "eliminar" no implementado');
  }
}

export default BaseDAO;
