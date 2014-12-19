describe('binding loader', function() {

  var container;

  beforeEach(function() {
    container = $('<div data-bind="loader: loader"></div>').appendTo($('body'));
    container.css({
      width: 100,
      height: 100
    });
  });

  afterEach(function() {
    container.remove();
  });

  describe('init', function() {

    var viewModel;

    beforeEach(function() {
      viewModel = kendo.observable({
        loader: false
      });
    });

    afterEach(function() {
      kendo.unbind(container);
    });

    describe('on an element with no css position set', function () {

      beforeEach(function() {
        kendo.bind(container, viewModel);
      });

      it ('should set element position to "relative"', function () {
        expect(container.css('position')).toBe('relative');
      });

    });

    describe('on an element with css position set to "relative"', function () {

      beforeEach(function() {
        container.css('position', 'relative');

        kendo.bind(container, viewModel);
      });

      it ('should leave element position set to "relative"', function () {
        expect(container.css('position')).toBe('relative');
      });

    });

    describe('on an element with css position set to "absolute"', function () {

      beforeEach(function() {
        container.css('position', 'absolute');

        kendo.bind(container, viewModel);
      });

      it ('should leave element position set to "absolute"', function () {
        expect(container.css('position')).toBe('absolute');
      });

    });

  });

  describe('init with view-model value true', function() {

    var viewModel;

    beforeEach(function() {
      viewModel = kendo.observable({
        loader: true
      });

      kendo.bind(container, viewModel);
    });

    afterEach(function() {
      kendo.unbind(container);
    });

    it('should show the loader overlay', function() {
      expect(container.children().first().is('.k-loading-mask')).toBe(true);
      expect(container.children().first().is(':visible')).toBe(true);
    });

  });

  describe('init with view-model value false', function() {

    var viewModel;

    beforeEach(function() {
      viewModel = kendo.observable({
        loader: false
      });

      kendo.bind(container, viewModel);
    });

    afterEach(function() {
      kendo.unbind(container);
    });

    it('should not show the loader overlay', function() {
      expect(container.find('.k-loading-mask').length).toBe(0);
    });

  });

  describe('refresh', function() {

    var viewModel;

    beforeEach(function() {
      viewModel = kendo.observable({
        loader: false
      });

      kendo.bind(container, viewModel);
    });

    afterEach(function() {
      kendo.unbind(container);
    });

    describe('when view-model value is set to true', function() {

      beforeEach(function() {
        viewModel.set('loader', true);
      });

      it('should show the loader overlay', function() {
        expect(container.children().first().is('.k-loading-mask')).toBe(true);
        expect(container.children().first().is(':visible')).toBe(true);
      });

    });

    describe('when view-model value is set to false', function() {

      beforeEach(function() {
        viewModel.set('loader', true);
        viewModel.set('loader', false);
      });

      it('should hide the loader overlay', function() {
        expect(container.find('.k-loading-mask').length).toBe(0);
      });

    });

    describe('when view-model value is set to a non-boolean value', function() {

      it('should not throw', function() {
        expect(function () {
          viewModel.set('loader', 'hello world');
        }).not.toThrow();
      });

    });

  });

});
