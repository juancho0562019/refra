class Producto {
  constructor(
    codigo,
    codigoInterno,
    nombre,
    marca,
    serie,
    tipo,
    unidad,
    nombreUnidad,
    color,
    centroCosto,
    createdAt
  ) {
    this.codigo = codigo;
    this.codigoInterno = codigoInterno;
    this.nombre = nombre;
    this.marca = marca;
    this.serie = serie;
    this.tipo = tipo;
    this.unidad = unidad;
    this.nombreUnidad = nombreUnidad;
    this.color = color;
    this.centroCosto = centroCosto;
    this.createdAt = createdAt;
  }
}

export default Producto;
