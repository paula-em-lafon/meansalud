'use strict';

describe('Doctores E2E Tests:', function () {
  describe('Test Doctores page', function () {
    it('Should report missing credentials', function () {
      browser.get('http://localhost:3001/doctores');
      expect(element.all(by.repeater('doctore in doctores')).count()).toEqual(0);
    });
  });
});
