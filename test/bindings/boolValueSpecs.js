describe('binding boolValue', function() {

  describe('on radio input element', function() {

    var container,
      radioTrue,
      radioFalse;

    beforeEach(function() {
      container = $('<div></div>').appendTo($('body'));
      radioTrue = $('<input type="radio" name="testRadio" value="true" data-bind="boolValue: boolVar" />').appendTo(container);
      radioFalse = $('<input type="radio" name="testRadio" value="false" data-bind="boolValue: boolVar" />').appendTo(container);
    });

    afterEach(function() {
      container.remove();
    });

    describe('init with view-model value true', function() {

      var viewModel;

      beforeEach(function() {
        viewModel = kendo.observable({
          boolVar: true
        });

        kendo.bind(container, viewModel);
      });

      afterEach(function() {
        kendo.unbind(container);
      });

      it('should initialize the input based on view-model value', function() {
        expect(radioTrue.prop('checked')).toBe(true);
        expect(radioFalse.prop('checked')).toBe(false);
      });

    });

    describe('init with view-model value null', function() {

      var viewModel;

      beforeEach(function() {
        viewModel = kendo.observable({
          boolVar: null
        });

        kendo.bind(container, viewModel);
      });

      afterEach(function() {
        kendo.unbind(container);
      });

      it('should initialize the input based on view-model value', function() {
        expect(radioTrue.prop('checked')).toBe(false);
        expect(radioFalse.prop('checked')).toBe(false);
      });

    });

    describe('change', function() {

      var viewModel;

      beforeEach(function() {
        viewModel = kendo.observable({
          boolVar: null
        });

        kendo.bind(container, viewModel);
      });

      afterEach(function() {
        kendo.unbind(container);
      });

      describe('when true radio is checked', function() {

        beforeEach(function() {
          radioTrue.prop('checked', true);
          radioTrue.change();
        });

        it('should set view-model value to true', function() {
          expect(viewModel.boolVar).toBe(true);
        });

      });

      describe('when false radio is checked', function() {

        beforeEach(function() {
          radioFalse.prop('checked', true);
          radioFalse.change();
        });

        it('should set view-model value to true', function() {
          expect(viewModel.boolVar).toBe(false);
        });

      });

    });

    describe('refresh', function() {

      var viewModel;

      beforeEach(function() {
        viewModel = kendo.observable({
          boolVar: null
        });

        kendo.bind(container, viewModel);
      });

      afterEach(function() {
        kendo.unbind(container);
      });

      describe('when view-model value is set to true', function() {

        beforeEach(function() {
          viewModel.set('boolVar', true);
        });

        it('should check true radio', function() {
          expect(radioTrue.prop('checked')).toBe(true);
          expect(radioFalse.prop('checked')).toBe(false);
        });

      });

      describe('when view-model value is set to false', function() {

        beforeEach(function() {
          viewModel.set('boolVar', false);
        });

        it('should check false radio', function() {
          expect(radioTrue.prop('checked')).toBe(false);
          expect(radioFalse.prop('checked')).toBe(true);
        });

      });

    });

  });

  xdescribe('init on element different from radio input', function() {

    it('should not change checked when view-model value changes', function() {

    });

    it('should not change view-model value when checked changes', function() {

    });

  });

});
