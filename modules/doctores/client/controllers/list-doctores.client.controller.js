(function () {
  'use strict';

  angular
    .module('doctores')
    .controller('DoctoresListController', DoctoresListController);

  DoctoresListController.$inject = ['DoctoresService'];

  function DoctoresListController(DoctoresService) {
    var vm = this;

    vm.doctores = DoctoresService.query();
  }
}());
