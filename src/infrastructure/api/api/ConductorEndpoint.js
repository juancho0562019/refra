/* eslint-disable import/no-unresolved */
// @flow
import APIHandler from '../APIHandler';
import * as Globals from '../../../application/common/Globals';

export default {
  GetConductores: (id) => APIHandler.get(`${Globals.GetConductores}?id=${id}`),
  GetAllConductores: () => APIHandler.get(`${Globals.GetAllConductores}`),
};
