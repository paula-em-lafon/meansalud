// Doctores service used to communicate Doctores REST endpoints
(function () {
  'use strict';

  angular
    .module('doctores')
    .factory('DoctoresService', DoctoresService);

  DoctoresService.$inject = ['$resource'];

  function DoctoresService($resource) {
    return $resource('api/doctores/:doctoreId', {
      doctoreId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
}());
