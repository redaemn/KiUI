/**
 * Extends require validator to handle radio buttons inputs
 */

(function ($, kendo, undefined) {
  
  kendo.ui.validator.rules.required = function (input) {
    var validator;
    
    if (input.is("[type=radio]")) {
      validator = input.parents('[data-role="validator"]').first();
      return !input.is("[required]") || validator.find("[name=" + input.attr("name") + "]").is(":checked");
    }
    else {
      return kendo.ui.Validator.fn.options.rules.required(input);
    }
  };
  
})(window.jQuery, window.kendo);
