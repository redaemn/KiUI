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

  var notifyWrappers = {};

  function createContainer(options, wrapperDomEl) {
    var containerType = options.containerType;
    var width = options.width;
    var container = $(
      '<div class="' + KIUI_NOTIFY_CONTAINER + ' ' + containerType + ' k-block k-error-colored">' +
        '<span class="' + KIUI_NOTIFY_CLOSE + ' k-icon k-i-close"></span>' +
        '<span class="' + KIUI_NOTIFY_CONTENT + '"></span>' +
      '</div>').css('width', width);
    var visible = false;
      
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
        visible = false;
        container.animate({ 'left': -20 }, { queue: false });
        container.fadeOut({
          queue: false,
          complete: function() {
            container.remove();
            //TODO: remove from containers
          }
        });
      }
    }

    function addContent(html) {
      container.find('.' + KIUI_NOTIFY_CONTENT).append(html);
    }
    
    closeButton.on('click', hide);
    
    wrapperDomEl.append(container);

    return {
      addContent: addContent,
      show: show,
      hide: hide
    };
  }

  function getNotifyWrapper(options) {
    var position = options.position;
    var notifyWrapper = notifyWrappers[position];
    var wrapperDomEl;
    var positions;
    
    var containers = [];

    if (!notifyWrapper) {
      wrapperDomEl = $('<div class="' + KIUI_NOTIFY + '"></div>').appendTo(BODY);
      positions = /^([^-]+)-(.+)$/.exec(position);
      wrapperDomEl.addClass(KIUI_POSITION + positions[1]).addClass(KIUI_POSITION + positions[2]);
      
      notifyWrapper = notifyWrappers[options.position] = {
        error: function(options) {
          notify(options, ERROR);
        },
        destroy: destroy
      };
    }
    
    function destroy() {
      wrapperDomEl.remove();
      containers = [];
      notifyWrappers[position] = undefined;
      $.each(notifyWrapper, function(key) {
        notifyWrapper[key] = undefined;
      });
    }

  function notify(options, containerType) {
    var defaultOptions = {
      html: "",
      autoHide: false,
      width: 250,
      append: false
    };
    var isInvalidOptions;
    var isInvalidAutoHide;
    var isInvalidHtml;
    var container;

    if (typeof options === STRING) {
      options = { html: options };
    }

    isInvalidOptions = (
      typeof options !== OBJECT
    );
      
    if (isInvalidOptions) {
      throw new Error("Invalid options object");
    }
    
    isInvalidHtml = (
      typeof options.html !== STRING ||
      options.html === EMPTY
    );
    
    if (isInvalidHtml) {
      throw new Error("Invalid html option");
    }

    options = $.extend({}, defaultOptions, options, { containerType: containerType });
    
    isInvalidAutoHide = (
      options.autoHide !== false &&
      typeof options.autoHide !== NUMBER
    );
    
    if (isInvalidAutoHide) {
      options.autoHide = defaultOptions.autoHide;
    }
    
    if (options.append) {
      container = containers[containers.length - 1];
    }
    
    if (container === undefined) {
      container = createContainer(options, wrapperDomEl);
      containers.push(container);
    }
    
    container.addContent(options.html);
    container.show();
    
    if (options.autoHide) {
      setTimeout(container.hide(), options.autoHide);
    }
  }

    return notifyWrapper;
  }
  
  function notifyFactory(options) {
    var defaultOptions = {
      position: TOP_RIGHT
    };
    var isInvalidPosition;
    var globalNotify;
    var container;

    if (typeof options !== OBJECT) {
      options = { html: options };
    }

    options = $.extend({}, defaultOptions, options);
    
    isInvalidPosition = (
      options.position !== TOP_RIGHT &&
      options.position !== TOP_LEFT &&
      options.position !== BOTTOM_RIGHT &&
      options.position !== BOTTOM_RIGHT
    );
    
    if (isInvalidPosition) {
      options.position = defaultOptions.position;
    }

    return getNotifyWrapper(options);
  }

  kiui.notify = notifyFactory;

})(window.jQuery, window.kendo, window.kiui);
