const socket = io.connect();
const authorSchema = new normalizr.schema.Entity("author", undefined, { idAttribute: "email" });
const postsSchema = new normalizr.schema.Entity("posts", {
  mensajes: [{ author: authorSchema }]
});

socket.on("cargar-mensajes", data => {
  const allMessages = normalizr.denormalize(data.result, postsSchema, data.entities);
  const html = allMessages.mensajes.map(elem => {
    return `<div>
              <strong class="text-primary">${elem.author.email}</strong>
              [<span class="text-danger">${new Date(elem.timestamp).toLocaleString()}</span>] : <i class="text-success">${elem.text}</i> 
              <img src="${elem.author.avatar}" width="32">
            </div>`
  }).join(" ");

  document.getElementById("chat").innerHTML = html;
});

function enviarMensaje() {
  const author = {
    email: document.querySelector("[name=email]").value,
    nombre: document.querySelector("[name=nombre]").value,
    apellido: document.querySelector("[name=apellido]").value,
    edad: document.querySelector("[name=edad]").value,
    apodo: document.querySelector("[name=apodo]").value,
    avatar: document.querySelector("[name=avatar]").value
  }

  const text = document.querySelector("[name=mensaje]").value;

  socket.emit("enviar-mensaje", { author, text });
  return false;
}