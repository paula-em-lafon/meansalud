'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Doctore Schema
 */
var DoctoreSchema = new Schema({
  name: {
    type: String,
    default: '',
    required: 'Please fill Doctore name',
    trim: true
  },
  created: {
    type: Date,
    default: Date.now
  },
  user: {
    type: Schema.ObjectId,
    ref: 'User'
  }
});

mongoose.model('Doctore', DoctoreSchema);
