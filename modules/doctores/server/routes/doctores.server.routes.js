'use strict';

/**
 * Module dependencies
 */
var doctoresPolicy = require('../policies/doctores.server.policy'),
  doctores = require('../controllers/doctores.server.controller');

module.exports = function(app) {
  // Doctores Routes
  app.route('/api/doctores').all(doctoresPolicy.isAllowed)
    .get(doctores.list)
    .post(doctores.create);

  app.route('/api/doctores/:doctoreId').all(doctoresPolicy.isAllowed)
    .get(doctores.read)
    .put(doctores.update)
    .delete(doctores.delete);

  // Finish by binding the Doctore middleware
  app.param('doctoreId', doctores.doctoreByID);
};
