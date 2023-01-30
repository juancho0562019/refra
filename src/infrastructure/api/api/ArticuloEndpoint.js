/* eslint-disable import/no-unresolved */
// @flow
import APIHandler from '../APIHandler';
import * as Globals from '../../../application/common/Globals';

export default {
  GetArticulo: (id) => APIHandler.get(`${Globals.GetArticulos}?id=${id}`),
  GetAllArticulos: () => APIHandler.get(`${Globals.GetAllArticulos}`),
};
