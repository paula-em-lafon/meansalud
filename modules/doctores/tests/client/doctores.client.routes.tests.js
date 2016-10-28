(function () {
  'use strict';

  describe('Doctores Route Tests', function () {
    // Initialize global variables
    var $scope,
      DoctoresService;

    // We can start by loading the main application module
    beforeEach(module(ApplicationConfiguration.applicationModuleName));

    // The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
    // This allows us to inject a service but then attach it to a variable
    // with the same name as the service.
    beforeEach(inject(function ($rootScope, _DoctoresService_) {
      // Set a new global scope
      $scope = $rootScope.$new();
      DoctoresService = _DoctoresService_;
    }));

    describe('Route Config', function () {
      describe('Main Route', function () {
        var mainstate;
        beforeEach(inject(function ($state) {
          mainstate = $state.get('doctores');
        }));

        it('Should have the correct URL', function () {
          expect(mainstate.url).toEqual('/doctores');
        });

        it('Should be abstract', function () {
          expect(mainstate.abstract).toBe(true);
        });

        it('Should have template', function () {
          expect(mainstate.template).toBe('<ui-view/>');
        });
      });

      describe('View Route', function () {
        var viewstate,
          DoctoresController,
          mockDoctore;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          viewstate = $state.get('doctores.view');
          $templateCache.put('modules/doctores/client/views/view-doctore.client.view.html', '');

          // create mock Doctore
          mockDoctore = new DoctoresService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Doctore Name'
          });

          // Initialize Controller
          DoctoresController = $controller('DoctoresController as vm', {
            $scope: $scope,
            doctoreResolve: mockDoctore
          });
        }));

        it('Should have the correct URL', function () {
          expect(viewstate.url).toEqual('/:doctoreId');
        });

        it('Should have a resolve function', function () {
          expect(typeof viewstate.resolve).toEqual('object');
          expect(typeof viewstate.resolve.doctoreResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(viewstate, {
            doctoreId: 1
          })).toEqual('/doctores/1');
        }));

        it('should attach an Doctore to the controller scope', function () {
          expect($scope.vm.doctore._id).toBe(mockDoctore._id);
        });

        it('Should not be abstract', function () {
          expect(viewstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(viewstate.templateUrl).toBe('modules/doctores/client/views/view-doctore.client.view.html');
        });
      });

      describe('Create Route', function () {
        var createstate,
          DoctoresController,
          mockDoctore;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          createstate = $state.get('doctores.create');
          $templateCache.put('modules/doctores/client/views/form-doctore.client.view.html', '');

          // create mock Doctore
          mockDoctore = new DoctoresService();

          // Initialize Controller
          DoctoresController = $controller('DoctoresController as vm', {
            $scope: $scope,
            doctoreResolve: mockDoctore
          });
        }));

        it('Should have the correct URL', function () {
          expect(createstate.url).toEqual('/create');
        });

        it('Should have a resolve function', function () {
          expect(typeof createstate.resolve).toEqual('object');
          expect(typeof createstate.resolve.doctoreResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(createstate)).toEqual('/doctores/create');
        }));

        it('should attach an Doctore to the controller scope', function () {
          expect($scope.vm.doctore._id).toBe(mockDoctore._id);
          expect($scope.vm.doctore._id).toBe(undefined);
        });

        it('Should not be abstract', function () {
          expect(createstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(createstate.templateUrl).toBe('modules/doctores/client/views/form-doctore.client.view.html');
        });
      });

      describe('Edit Route', function () {
        var editstate,
          DoctoresController,
          mockDoctore;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          editstate = $state.get('doctores.edit');
          $templateCache.put('modules/doctores/client/views/form-doctore.client.view.html', '');

          // create mock Doctore
          mockDoctore = new DoctoresService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Doctore Name'
          });

          // Initialize Controller
          DoctoresController = $controller('DoctoresController as vm', {
            $scope: $scope,
            doctoreResolve: mockDoctore
          });
        }));

        it('Should have the correct URL', function () {
          expect(editstate.url).toEqual('/:doctoreId/edit');
        });

        it('Should have a resolve function', function () {
          expect(typeof editstate.resolve).toEqual('object');
          expect(typeof editstate.resolve.doctoreResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(editstate, {
            doctoreId: 1
          })).toEqual('/doctores/1/edit');
        }));

        it('should attach an Doctore to the controller scope', function () {
          expect($scope.vm.doctore._id).toBe(mockDoctore._id);
        });

        it('Should not be abstract', function () {
          expect(editstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(editstate.templateUrl).toBe('modules/doctores/client/views/form-doctore.client.view.html');
        });

        xit('Should go to unauthorized route', function () {

        });
      });

    });
  });
}());
