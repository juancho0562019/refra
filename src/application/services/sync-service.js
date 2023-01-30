import { DatabaseConnection } from "./Database/db-service";
import {
  createTableUser,
  createTableBodega,
  createTableProducto,
  createTableConductor,
  removeTableUser,
  createTableTraslado,
  createTableDetalleTraslado,
  removeTableTraslado,
  createTableUnidades,
  createTableColor,
  createTableMarca,
} from "./Models";

export const DatabaseInit = async () => {
  const db = DatabaseConnection.getConnection();
  let createUser = () => createTableUser(db);
  let createBodega = () => createTableBodega(db);
  let createUnidades = () => createTableUnidades(db);
  let createColor = () => createTableColor(db);
  let createMarca = () => createTableMarca(db);
  let createConductor = () => createTableConductor(db);
  let createProducto = () => createTableProducto(db);
  let createTraslado = () => createTableTraslado(db);
  let createDetalleTraslado = () => createTableDetalleTraslado(db);
  let dropUser = () => removeTableTraslado(db);

  //dropUser().then(
  createUser()
    .then(createBodega)
    .then(createUnidades)
    .then(createColor)
    .then(createMarca)
    .then(createConductor)
    .then(createProducto)
    .then(createTraslado)
    .then(createDetalleTraslado)
    .then(console.log("Database created succesfully"))
    .catch(function (error) {
      console.log(`Bad luck, Error to initialize database!`);
      console.log(error);
    });
};
