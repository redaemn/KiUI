(function($, kendo, kiui, undefined) {

  var ERROR = 'kiui-notify-error',
    KIUI_NOTIFY = 'kiui-notify',
    KIUI_POSITION = 'kiui-position-',
    KIUI_NOTIFY_CONTAINER = 'kiui-notify-container',
    KIUI_NOTIFY_CLOSE = 'kiui-notify-close',
    KIUI_NOTIFY_CONTENT = 'kiui-notify-content',
    TOP = 'top',
    BOTTOM = 'bottom',
    RIGHT = 'right',
    LEFT = 'left',
    SEPARATOR = '-',
    TOP_LEFT = TOP + SEPARATOR + LEFT,
    TOP_RIGHT = TOP + SEPARATOR + RIGHT,
    BOTTOM_LEFT = BOTTOM + SEPARATOR + LEFT,
    BOTTOM_RIGHT = BOTTOM + SEPARATOR + RIGHT,
    STRING = 'string',
    OBJECT = 'object',
    NUMBER = 'number',
    EMPTY = '',
    BODY = 'body';

  var globalNotifiers = {};

  function createContainer(options) {
    var containerType = options.containerType;
    var autoHide = options.autoHide;
    var width = options.width;
    var container = $(
      '<div class="' + KIUI_NOTIFY_CONTAINER + ' ' + containerType + ' k-block k-error-colored">' +
        '<span class="' + KIUI_NOTIFY_CLOSE + ' k-icon k-i-close"></span>' +
        '<span class="' + KIUI_NOTIFY_CONTENT + '"></span>' +
      '</div>').css('width', width);
    var visible = false;
    var containerObj;
      
    var closeButton = container.find('.' + KIUI_NOTIFY_CLOSE);
    
    function show() {
      if (!visible) {
        visible = true;
        container.css({'left': -20});
        container.animate({ 'left': 0 }, { queue: false });
        container.fadeIn({ queue: false });
      }
    }

    function hide() {
      if (visible) {
        container.animate({ 'left': -20 }, { queue: false });
        container.fadeOut({
          queue: false,
          complete: function() {
            container.remove();
          }
        });
      }
    }

    function addContent(html) {
      container.find('.' + KIUI_NOTIFY_CONTENT).append(html);
    }
    
    closeButton.on('click', hide);
    
    if (autoHide) {
      setTimeout(hide, autoHide);
    }

    containerObj = {
      addContent: addContent,
      show: show,
      hide: hide,
      _element: container
    };
    
    container.data(KIUI_NOTIFY_CONTAINER, containerObj);
    
    return containerObj;
  }

  function getGlobalNotify(options) {
    var position = options.position;
    var globalNotify = globalNotifiers[position];
    var positions;

    if (!globalNotify) {
      globalNotify = globalNotifiers[options.position] = $('<div class="' + KIUI_NOTIFY + '"></div>').appendTo(BODY);
      positions = /^([^-]+)-(.+)$/.exec(position);
      globalNotify.addClass(KIUI_POSITION + positions[1]).addClass(KIUI_POSITION + positions[2]);
    }

    return globalNotify;
  }

  function notify(options, containerType) {
    var defaultOptions = {
      autoHide: false,
      position: TOP_RIGHT,
      width: 250,
      append: false
    };
    var isInvalidOptions;
    var isInvalidPosition;
    var isInvalidAutoHide;
    var globalNotify;
    var container;

    if (typeof options === STRING) {
      options = { html: options };
    }

    isInvalidOptions = (
      typeof options !== OBJECT ||
      typeof options.html !== STRING ||
      options.html === EMPTY
    );
      
    if (isInvalidOptions) {
      return;
    }

    options = $.extend({}, defaultOptions, options, { containerType: containerType });
    
    isInvalidPosition = (
      options.position !== TOP_RIGHT &&
      options.position !== TOP_LEFT &&
      options.position !== BOTTOM_RIGHT &&
      options.position !== BOTTOM_RIGHT
    );
    
    if (isInvalidPosition) {
      options.position = defaultOptions.position;
    }
    
    isInvalidAutoHide = (
      options.autoHide !== false &&
      typeof options.autoHide !== NUMBER
    );
    
    if (isInvalidAutoHide) {
      options.autoHide = defaultOptions.autoHide;
    }

    globalNotify = getGlobalNotify(options);
    
    if (options.append) {
      container = globalNotify.find('.' + KIUI_NOTIFY_CONTAINER).last().data(KIUI_NOTIFY_CONTAINER);
    }
    
    if (container === undefined || container === null) {
      container = createContainer(options);
      globalNotify.append(container['_element']);
    }
    
    container.addContent(options.html);
    container.show();
  }

  kiui.notifyError = function(options) {
    notify(options, ERROR);
  };

})(window.jQuery, window.kendo, window.kiui);
