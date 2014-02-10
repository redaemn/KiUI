/**
 * Add kendo binder that makes it possible to bind a loader overlay on a DOM element to a boolean value
 */

(function ($, kendo, undefined) {

kendo.data.binders.loader = kendo.data.Binder.extend({

  init: function (element, bindings, options) {
    //call the base constructor
    kendo.data.Binder.fn.init.call(this, element, bindings, options);

    element = $(this.element);

    var position = element.css('position');

    if (position !== 'relative' && position !== 'absolute') {
      element.css('position', 'relative');
    }
  },

  refresh: function () {
    var that = this,
      element = $(this.element),
      value = that.bindings.loader.get(); //get the value from the View-Model

    if (value) {
      kendo.ui.progress(element, true);
    }
    else {
      kendo.ui.progress(element, false);
    }
  }

});

})(window.jQuery, window.kendo);
