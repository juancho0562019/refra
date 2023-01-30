/* eslint-disable import/no-unresolved */
// @flow
import APIHandler from '../APIHandler';
import * as Globals from '../../../application/common/Globals';

export default {
  GetBodegas: (id) => APIHandler.get(`${Globals.GetBodegas}?id=${id}`),
  GetAllBodegas: () => APIHandler.get(`${Globals.GetAllBodegas}`),
};
