'use strict';

var should = require('should'),
  request = require('supertest'),
  path = require('path'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Doctore = mongoose.model('Doctore'),
  express = require(path.resolve('./config/lib/express'));

/**
 * Globals
 */
var app,
  agent,
  credentials,
  user,
  doctore;

/**
 * Doctore routes tests
 */
describe('Doctore CRUD tests', function () {

  before(function (done) {
    // Get application
    app = express.init(mongoose);
    agent = request.agent(app);

    done();
  });

  beforeEach(function (done) {
    // Create user credentials
    credentials = {
      username: 'username',
      password: 'M3@n.jsI$Aw3$0m3'
    };

    // Create a new user
    user = new User({
      firstName: 'Full',
      lastName: 'Name',
      displayName: 'Full Name',
      email: 'test@test.com',
      username: credentials.username,
      password: credentials.password,
      provider: 'local'
    });

    // Save a user to the test db and create new Doctore
    user.save(function () {
      doctore = {
        name: 'Doctore name'
      };

      done();
    });
  });

  it('should be able to save a Doctore if logged in', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new Doctore
        agent.post('/api/doctores')
          .send(doctore)
          .expect(200)
          .end(function (doctoreSaveErr, doctoreSaveRes) {
            // Handle Doctore save error
            if (doctoreSaveErr) {
              return done(doctoreSaveErr);
            }

            // Get a list of Doctores
            agent.get('/api/doctores')
              .end(function (doctoresGetErr, doctoresGetRes) {
                // Handle Doctores save error
                if (doctoresGetErr) {
                  return done(doctoresGetErr);
                }

                // Get Doctores list
                var doctores = doctoresGetRes.body;

                // Set assertions
                (doctores[0].user._id).should.equal(userId);
                (doctores[0].name).should.match('Doctore name');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to save an Doctore if not logged in', function (done) {
    agent.post('/api/doctores')
      .send(doctore)
      .expect(403)
      .end(function (doctoreSaveErr, doctoreSaveRes) {
        // Call the assertion callback
        done(doctoreSaveErr);
      });
  });

  it('should not be able to save an Doctore if no name is provided', function (done) {
    // Invalidate name field
    doctore.name = '';

    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new Doctore
        agent.post('/api/doctores')
          .send(doctore)
          .expect(400)
          .end(function (doctoreSaveErr, doctoreSaveRes) {
            // Set message assertion
            (doctoreSaveRes.body.message).should.match('Please fill Doctore name');

            // Handle Doctore save error
            done(doctoreSaveErr);
          });
      });
  });

  it('should be able to update an Doctore if signed in', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new Doctore
        agent.post('/api/doctores')
          .send(doctore)
          .expect(200)
          .end(function (doctoreSaveErr, doctoreSaveRes) {
            // Handle Doctore save error
            if (doctoreSaveErr) {
              return done(doctoreSaveErr);
            }

            // Update Doctore name
            doctore.name = 'WHY YOU GOTTA BE SO MEAN?';

            // Update an existing Doctore
            agent.put('/api/doctores/' + doctoreSaveRes.body._id)
              .send(doctore)
              .expect(200)
              .end(function (doctoreUpdateErr, doctoreUpdateRes) {
                // Handle Doctore update error
                if (doctoreUpdateErr) {
                  return done(doctoreUpdateErr);
                }

                // Set assertions
                (doctoreUpdateRes.body._id).should.equal(doctoreSaveRes.body._id);
                (doctoreUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should be able to get a list of Doctores if not signed in', function (done) {
    // Create new Doctore model instance
    var doctoreObj = new Doctore(doctore);

    // Save the doctore
    doctoreObj.save(function () {
      // Request Doctores
      request(app).get('/api/doctores')
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Array).and.have.lengthOf(1);

          // Call the assertion callback
          done();
        });

    });
  });

  it('should be able to get a single Doctore if not signed in', function (done) {
    // Create new Doctore model instance
    var doctoreObj = new Doctore(doctore);

    // Save the Doctore
    doctoreObj.save(function () {
      request(app).get('/api/doctores/' + doctoreObj._id)
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Object).and.have.property('name', doctore.name);

          // Call the assertion callback
          done();
        });
    });
  });

  it('should return proper error for single Doctore with an invalid Id, if not signed in', function (done) {
    // test is not a valid mongoose Id
    request(app).get('/api/doctores/test')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'Doctore is invalid');

        // Call the assertion callback
        done();
      });
  });

  it('should return proper error for single Doctore which doesnt exist, if not signed in', function (done) {
    // This is a valid mongoose Id but a non-existent Doctore
    request(app).get('/api/doctores/559e9cd815f80b4c256a8f41')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'No Doctore with that identifier has been found');

        // Call the assertion callback
        done();
      });
  });

  it('should be able to delete an Doctore if signed in', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new Doctore
        agent.post('/api/doctores')
          .send(doctore)
          .expect(200)
          .end(function (doctoreSaveErr, doctoreSaveRes) {
            // Handle Doctore save error
            if (doctoreSaveErr) {
              return done(doctoreSaveErr);
            }

            // Delete an existing Doctore
            agent.delete('/api/doctores/' + doctoreSaveRes.body._id)
              .send(doctore)
              .expect(200)
              .end(function (doctoreDeleteErr, doctoreDeleteRes) {
                // Handle doctore error error
                if (doctoreDeleteErr) {
                  return done(doctoreDeleteErr);
                }

                // Set assertions
                (doctoreDeleteRes.body._id).should.equal(doctoreSaveRes.body._id);

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to delete an Doctore if not signed in', function (done) {
    // Set Doctore user
    doctore.user = user;

    // Create new Doctore model instance
    var doctoreObj = new Doctore(doctore);

    // Save the Doctore
    doctoreObj.save(function () {
      // Try deleting Doctore
      request(app).delete('/api/doctores/' + doctoreObj._id)
        .expect(403)
        .end(function (doctoreDeleteErr, doctoreDeleteRes) {
          // Set message assertion
          (doctoreDeleteRes.body.message).should.match('User is not authorized');

          // Handle Doctore error error
          done(doctoreDeleteErr);
        });

    });
  });

  it('should be able to get a single Doctore that has an orphaned user reference', function (done) {
    // Create orphan user creds
    var _creds = {
      username: 'orphan',
      password: 'M3@n.jsI$Aw3$0m3'
    };

    // Create orphan user
    var _orphan = new User({
      firstName: 'Full',
      lastName: 'Name',
      displayName: 'Full Name',
      email: 'orphan@test.com',
      username: _creds.username,
      password: _creds.password,
      provider: 'local'
    });

    _orphan.save(function (err, orphan) {
      // Handle save error
      if (err) {
        return done(err);
      }

      agent.post('/api/auth/signin')
        .send(_creds)
        .expect(200)
        .end(function (signinErr, signinRes) {
          // Handle signin error
          if (signinErr) {
            return done(signinErr);
          }

          // Get the userId
          var orphanId = orphan._id;

          // Save a new Doctore
          agent.post('/api/doctores')
            .send(doctore)
            .expect(200)
            .end(function (doctoreSaveErr, doctoreSaveRes) {
              // Handle Doctore save error
              if (doctoreSaveErr) {
                return done(doctoreSaveErr);
              }

              // Set assertions on new Doctore
              (doctoreSaveRes.body.name).should.equal(doctore.name);
              should.exist(doctoreSaveRes.body.user);
              should.equal(doctoreSaveRes.body.user._id, orphanId);

              // force the Doctore to have an orphaned user reference
              orphan.remove(function () {
                // now signin with valid user
                agent.post('/api/auth/signin')
                  .send(credentials)
                  .expect(200)
                  .end(function (err, res) {
                    // Handle signin error
                    if (err) {
                      return done(err);
                    }

                    // Get the Doctore
                    agent.get('/api/doctores/' + doctoreSaveRes.body._id)
                      .expect(200)
                      .end(function (doctoreInfoErr, doctoreInfoRes) {
                        // Handle Doctore error
                        if (doctoreInfoErr) {
                          return done(doctoreInfoErr);
                        }

                        // Set assertions
                        (doctoreInfoRes.body._id).should.equal(doctoreSaveRes.body._id);
                        (doctoreInfoRes.body.name).should.equal(doctore.name);
                        should.equal(doctoreInfoRes.body.user, undefined);

                        // Call the assertion callback
                        done();
                      });
                  });
              });
            });
        });
    });
  });

  afterEach(function (done) {
    User.remove().exec(function () {
      Doctore.remove().exec(done);
    });
  });
});
