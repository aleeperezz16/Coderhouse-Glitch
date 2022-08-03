import { ContenedorArchivo } from "../../db/index.js";

class MensajesArchivo extends ContenedorArchivo {
  constructor() {
    super("mensajes");
  }
}

export default MensajesArchivo;