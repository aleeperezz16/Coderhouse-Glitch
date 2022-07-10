const socket = io.connect();

socket.on("cargar-tabla", data => {
  if (data) {
    const html = data.map(elem => {
      return `<tr>
                <td>${elem.title}</td>
                <td>$${elem.price}</td>
                <td><img src="${elem.thumbnail}" width="48" /></td>
              </tr>`
    }).join(" ");
    document.getElementById("itemsProductos").innerHTML = html;
  }
})

socket.on("cargar-mensajes", data => {
  if (data) {
    const html = data.map(elem => {
      return `<div>
                <strong class="text-primary">${elem.autor}</strong> [<span class="text-danger">${elem.fecha}</span>]: <i class="text-success">${elem.mensaje}</i>
              </div>`
    }).join(" ");
    document.getElementById("chat").innerHTML = html;
  }
});

function agregarProducto() {
  const producto = {
    title: document.querySelector("[name=title]").value,
    price: parseFloat(document.querySelector("[name=price]").value),
    thumbnail: document.querySelector("[name=thumbnail]").value
  }

  socket.emit("agregar-producto", producto);
  return false;
}

function enviarMensaje() {
  const mensaje = {
    autor: document.getElementById("emailChat").value,
    fecha: new Date().toLocaleString(),
    mensaje: document.getElementById("msgChat").value
  }

  socket.emit("enviar-mensaje", mensaje);
  return false;
}