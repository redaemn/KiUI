/**
 * Contains kiui core functionalities that are needed by different modules
 * and defines kiui global object
 */

(function(window, $, kendo, undefined) {

  var KIUI = window.kiui = window.kiui || {},
    PREFIX = "Kiui",
    UI = kendo.ui,
    EXTEND = $.extend;

  var createPlugin = function(widget) {
    UI.plugin(widget, KIUI, PREFIX);
  };
  
  EXTEND(window.kiui, {
    prefix: PREFIX,
    plugin: createPlugin,
    roles: {}
  });

})(window, window.jQuery, window.kendo);
