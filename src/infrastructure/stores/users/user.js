class User {
    constructor(username, nombres, apellidos, bodegaId, bodegaNombre, token, refreshToKen, lastAccess) {
      this.username = username;
      this.nombres = nombres;
      this.apellidos = apellidos;
      this.bodegaId = bodegaId;
      this.bodegaNombre = bodegaNombre;
      this.token = token;
      this.refreshToKen = refreshToKen;
      this.lastAccess = lastAccess;
    }
  }
  
  export default User;
  