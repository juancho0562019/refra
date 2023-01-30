/* eslint-disable import/no-unresolved */
// @flow
import APIHandler from '../APIHandler';

export default {
  GetAll: (url) => APIHandler.get(`${url}`),
};
