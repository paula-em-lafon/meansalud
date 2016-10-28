(function () {
  'use strict';

  angular
    .module('doctores')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('doctores', {
        abstract: true,
        url: '/doctores',
        template: '<ui-view/>'
      })
      .state('doctores.list', {
        url: '',
        templateUrl: 'modules/doctores/client/views/list-doctores.client.view.html',
        controller: 'DoctoresListController',
        controllerAs: 'vm',
        data: {
          pageTitle: 'Doctores List'
        }
      })
      .state('doctores.create', {
        url: '/create',
        templateUrl: 'modules/doctores/client/views/form-doctore.client.view.html',
        controller: 'DoctoresController',
        controllerAs: 'vm',
        resolve: {
          doctoreResolve: newDoctore
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Doctores Create'
        }
      })
      .state('doctores.edit', {
        url: '/:doctoreId/edit',
        templateUrl: 'modules/doctores/client/views/form-doctore.client.view.html',
        controller: 'DoctoresController',
        controllerAs: 'vm',
        resolve: {
          doctoreResolve: getDoctore
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Edit Doctore {{ doctoreResolve.name }}'
        }
      })
      .state('doctores.view', {
        url: '/:doctoreId',
        templateUrl: 'modules/doctores/client/views/view-doctore.client.view.html',
        controller: 'DoctoresController',
        controllerAs: 'vm',
        resolve: {
          doctoreResolve: getDoctore
        },
        data: {
          pageTitle: 'Doctore {{ doctoreResolve.name }}'
        }
      });
  }

  getDoctore.$inject = ['$stateParams', 'DoctoresService'];

  function getDoctore($stateParams, DoctoresService) {
    return DoctoresService.get({
      doctoreId: $stateParams.doctoreId
    }).$promise;
  }

  newDoctore.$inject = ['DoctoresService'];

  function newDoctore(DoctoresService) {
    return new DoctoresService();
  }
}());
