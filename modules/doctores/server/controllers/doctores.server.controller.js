'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Doctore = mongoose.model('Doctore'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  _ = require('lodash');

/**
 * Create a Doctore
 */
exports.create = function(req, res) {
  var doctore = new Doctore(req.body);
  doctore.user = req.user;

  doctore.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(doctore);
    }
  });
};

/**
 * Show the current Doctore
 */
exports.read = function(req, res) {
  // convert mongoose document to JSON
  var doctore = req.doctore ? req.doctore.toJSON() : {};

  // Add a custom field to the Article, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Article model.
  doctore.isCurrentUserOwner = req.user && doctore.user && doctore.user._id.toString() === req.user._id.toString();

  res.jsonp(doctore);
};

/**
 * Update a Doctore
 */
exports.update = function(req, res) {
  var doctore = req.doctore;

  doctore = _.extend(doctore, req.body);

  doctore.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(doctore);
    }
  });
};

/**
 * Delete an Doctore
 */
exports.delete = function(req, res) {
  var doctore = req.doctore;

  doctore.remove(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(doctore);
    }
  });
};

/**
 * List of Doctores
 */
exports.list = function(req, res) {
  Doctore.find().sort('-created').populate('user', 'displayName').exec(function(err, doctores) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(doctores);
    }
  });
};

/**
 * Doctore middleware
 */
exports.doctoreByID = function(req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Doctore is invalid'
    });
  }

  Doctore.findById(id).populate('user', 'displayName').exec(function (err, doctore) {
    if (err) {
      return next(err);
    } else if (!doctore) {
      return res.status(404).send({
        message: 'No Doctore with that identifier has been found'
      });
    }
    req.doctore = doctore;
    next();
  });
};
