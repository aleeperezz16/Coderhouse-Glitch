export default class BaseController {
  static async guardar() {
    throw new Error('Método "guardar" no implementado');
  }

  static async obtener() {
    throw new Error('Método "obtener" no implementado');
  }

  static async actualizar() {
    throw new Error('Método "actualizar" no implementado');
  }

  static async eliminar() {
    throw new Error('Método "eliminar" no implementado');
  }
}
