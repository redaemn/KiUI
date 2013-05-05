/**
 * Add kendo binder that makes it possible to bind radio inputs to boolean values
 */

(function ($, kendo, undefined) {

kendo.data.binders.boolValue = kendo.data.Binder.extend({

  init: function (element, bindings, options) {
    // this binder can be applied only to checkbox input
    if (element.type !== "radio") {
      // delete refresh function
      this.refresh = function(){};
      return;
    }

    //call the base constructor
    kendo.data.Binder.fn.init.call(this, element, bindings, options);

    var that = this;
    //listen for the change event of the element
    $(that.element).on("change", function () {
      that.change(); //call the change function
    });
  },

  refresh: function () {
    var that = this,
      element = this.element,
      vmValue = that.bindings.boolValue.get(), //get the value from the View-Model
      elementValue = $(element).val();

    if (elementValue === "true") {
      elementValue = true;
    }
    else if (elementValue === "false") {
      elementValue = false;
    }
    else {
      elementValue = null;
    }

    //update the HTML input element
    element.checked = vmValue === elementValue;
  },

  change: function () {
    var that = this,
      element = that.element,
      elementValue = $(element).val(),
      vmValue = null;

    if (elementValue === "true") {
      vmValue = true;
    }
    else if (elementValue === "false") {
      vmValue = false;
    }
    else {
      vmValue = null;
    }

    this.bindings.boolValue.set(vmValue); //update the View-Model
  }

});

})(jQuery, kendo);
