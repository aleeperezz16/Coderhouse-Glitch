import { ContenedorFirebase } from "../../db/index.js";

class MensajesFirebase extends ContenedorFirebase {
  constructor() {
    super("mensajes");
  }
}

export default MensajesFirebase;