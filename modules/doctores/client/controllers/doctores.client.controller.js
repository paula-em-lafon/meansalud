(function () {
  'use strict';

  // Doctores controller
  angular
    .module('doctores')
    .controller('DoctoresController', DoctoresController);

  DoctoresController.$inject = ['$scope', '$state', '$window', 'Authentication', 'doctoreResolve'];

  function DoctoresController ($scope, $state, $window, Authentication, doctore) {
    var vm = this;

    vm.authentication = Authentication;
    vm.doctore = doctore;
    vm.error = null;
    vm.form = {};
    vm.remove = remove;
    vm.save = save;

    // Remove existing Doctore
    function remove() {
      if ($window.confirm('Are you sure you want to delete?')) {
        vm.doctore.$remove($state.go('doctores.list'));
      }
    }

    // Save Doctore
    function save(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.doctoreForm');
        return false;
      }

      // TODO: move create/update logic to service
      if (vm.doctore._id) {
        vm.doctore.$update(successCallback, errorCallback);
      } else {
        vm.doctore.$save(successCallback, errorCallback);
      }

      function successCallback(res) {
        $state.go('doctores.view', {
          doctoreId: res._id
        });
      }

      function errorCallback(res) {
        vm.error = res.data.message;
      }
    }
  }
}());
