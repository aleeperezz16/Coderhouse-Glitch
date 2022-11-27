export default function calcularPrecio(productos) {
  let total = 0;

  productos.forEach((elem) => {
    total += elem.cantidad * elem.precio;
  });

  return total;
}
