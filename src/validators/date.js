/**
 * Check that the input field contains a valid date value based on a particular
 * format and/or culture
 */

(function ($, kendo, undefined) {
  
  kendo.ui.validator.rules.kiuiDate = function (input) {
    if (input.is('[data-kiui-date]')) {
      var value = input.val(),
        format = input.data('kiui-date') || "",
        culture = input.data('kiui-date-culture') || "";
        
      return value === "" ||
        kendo.parseDate(value, format, culture) !== null;
    }

    return true;
  };
  
  kendo.ui.validator.messages.kiuiDate = "{0} is not a valid date";
  
})(window.jQuery, window.kendo);

