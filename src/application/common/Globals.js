/* eslint-disable global-require */
import * as SQLite from "expo-sqlite";

exports.globalVars = {
  userSalt: "TOHV7eOQRAXmbe433BilgtJeCkugs1rgvZ",
  currentCountryCode: "",
};
//export const BaseURL = "http://192.168.1.14:9091/api/";
//export const BaseURL = "http://hfvera-001-site1.etempurl.com/api/";
//export const BaseURL = "http://refratechnik987-001-site1.ctempurl.com/api/";
export const BaseURL = "http://refratechnik987-001-site1.ctempurl.com/api/";
export const TaskList = "Bodega/Get?Id=1";

export const Login = "Auth/login";

export const GetArticulos = "Producto/Get";
export const GetAllArticulos = "Producto/GetAll";

export const GetBodegas = "Bodega/Get";
export const GetAllBodegas = "Bodega/GetAll";

export const GetConductores = "Conductor/Get";
export const GetAllConductores = "Conductor/GetAll";

export const SaveTraslado = "Traslado/Create";
export const GetTrasladosBodega = "Traslado/TrasladosBodega";
export const RecibirTraslado = "Traslado/RecibirTraslado";

export const GetAllUnidades = "Unidad/GetAll";
export const GetAllMarcas = "Marca/GetAll";
export const GetAllColores = "Color/GetAll";

export const apiVersion = "events/";
export const Authsecret = "";
export const timeoutDuration = 30000;

// Error Messages
export const errorEncountered = "Error was encountered processing this request";
export const timeoutMessage =
  "We are unable to fetch data at this time, kindly check your internet connection and we'll reconnect you.";

export const DB_NAME = "refra_db_d33.db";
