class Traslado {
  constructor(
    id,
    usuarioEnviaId,
    usuarioRecibeId,
    conductorId,
    fecha,
    createdAt,
    detalle,
    bodegaOrigen,
    bodegaDestino,
    placa
  ) {
    this.id = id;
    this.usuarioEnviaId = usuarioEnviaId;
    this.usuarioRecibeId = usuarioRecibeId;
    this.conductorId = conductorId;
    this.createdAt = createdAt;
    this.fecha = fecha;
    this.detalle = detalle;
    this.bodegaOrigen = bodegaOrigen;
    this.bodegaDestino = bodegaDestino;
    this.placa = placa;
  }
}

export default Traslado;
