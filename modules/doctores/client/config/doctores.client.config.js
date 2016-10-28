(function () {
  'use strict';

  angular
    .module('doctores')
    .run(menuConfig);

  menuConfig.$inject = ['Menus'];

  function menuConfig(menuService) {
    // Set top bar menu items
    menuService.addMenuItem('topbar', {
      title: 'Doctores',
      state: 'doctores',
      type: 'dropdown',
      roles: ['*']
    });

    // Add the dropdown list item
    menuService.addSubMenuItem('topbar', 'doctores', {
      title: 'List Doctores',
      state: 'doctores.list'
    });

    // Add the dropdown create item
    menuService.addSubMenuItem('topbar', 'doctores', {
      title: 'Create Doctore',
      state: 'doctores.create',
      roles: ['user']
    });
  }
}());
