/* eslint-disable import/no-unresolved */
// @flow
import APIHandler from '../APIHandler';
import * as Globals from '../../../application/common/Globals';

export default {
  Login: (user) => APIHandler.post(`${Globals.Login}`, user),
};
