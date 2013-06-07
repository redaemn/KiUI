/**
 *
 */
 
(function($, kendo, kiui, window, undefined) {

  // TODO: rename css classes to notification and notifier
  var NS = ".kiuiNotifier",
    PREFIX = kiui.prefix,
    WIDGET = kendo.ui.Widget,
    UI = kendo.ui,
    PROXY = $.proxy,
    ERROR = 'kiui-notify-error',
    INFO = 'kiui-notify-info',
    SUCCESS = 'kiui-notify-success',
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
    SHOW = 'show',
    HIDE = 'hide',
    DESTROY = 'destroy',
    STRING = 'string',
    OBJECT = 'object',
    NUMBER = 'number',
    EMPTY = '',
    BODY = 'body';
    
  var Notifier = WIDGET.extend({
    init: function (element, options) {
      var that = this,
        position,
        positions,
        isInvalidPosition;
      
      isInvalidPosition = (
        options &&
        options.position !== TOP_RIGHT &&
        options.position !== TOP_LEFT &&
        options.position !== BOTTOM_RIGHT &&
        options.position !== BOTTOM_LEFT
      );
      
      if (isInvalidPosition) {
        options.position = that.options.position;
      }

      WIDGET.fn.init.call(that, element, options);

      element = that.element;
      options = that.options;

      positions = /^([^-]+)-(.+)$/.exec(options.position);
      element
        .addClass(KIUI_POSITION + positions[1])
        .addClass(KIUI_POSITION + positions[2]);
        
      $(window).on("resize" + NS, PROXY(that._setNotificationsPosition, that));
      
      that._notifications = [];
    },

    options: {
      prefix: PREFIX,
      name: "Notifier",
      position: TOP_RIGHT
      // TODO: notificationsMargin: 10
    },
    
    events: [
      DESTROY
    ],
    
    _setNotificationsPosition: function() {
      var that = this,
        position = that.options.position,
        margin = 10,
        maxVertical = $(window).height(),
        currentVertical = margin,
        currentHorizontal = margin;
      
      $.each(that._notifications, function(idx, notification) {
        var height = notification.height();
        var nextVertical = currentVertical + margin;
        
        if (currentVertical + height > maxVertical - margin) {
          currentVertical = margin;
          currentHorizontal += notification.width() + margin;
        }
        
        if (position == TOP_RIGHT) {
          notification.setPosition({
            top: currentVertical,
            right: currentHorizontal
          });
        }
        else if (position == TOP_LEFT) {
          notification.setPosition({
            top: currentVertical,
            left: currentHorizontal
          });
        }
        else if (position == BOTTOM_RIGHT) {
          notification.setPosition({
            bottom: currentVertical,
            right: currentHorizontal
          });
        }
        else if (position == BOTTOM_LEFT) {
          notification.setPosition({
            bottom: currentVertical,
            left: currentHorizontal
          });
        }
        
        currentVertical += height + margin;
      });
    },
    
    _notify: function(options, notificationClass) {
      var that = this,
        notification;

      if (typeof options === STRING) {
        options = { html: options };
      }

      options = $.extend({}, options, { notificationClass: notificationClass });
    
      if (options.append) {
        notification = that._notifications[that._notifications.length - 1];
        notification.addHtml(options.html);
      }
    
      if (notification === undefined) {
        notification = new kiui.Notification(
          $('<div class="' + KIUI_NOTIFY + '"></div>').appendTo(that.element),
          options);
          
        that._notifications.push(notification);
        
        notification.bind(DESTROY, function() {
          notification.element.remove();
        });
        
        notification.bind(HIDE, function() {
          that._notifications.splice(that._notifications.indexOf(notification), 1);
          that._setNotificationsPosition();
          notification.destroy();
        });
      }
    
      that._setNotificationsPosition();
      notification.show(options.autoHide);
    },
    
    error: function(options) {
      var that = this;
      
      that._notify(options, ERROR);
    },
    
    info: function(options) {
      var that = this;
      
      that._notify(options, INFO);
    },
    
    success: function(options) {
      var that = this;
      
      that._notify(options, SUCCESS);
    },
    
    destroy: function() {
      var that = this,
        element = that.element;

      //element.off(NS);
      $(window).off(NS);
      
      $.each(that._notifications, function(idx, notification) {
        notification.destroy();
      });
      that._notifications = [];
      
      that.trigger(DESTROY);

      WIDGET.fn.destroy.call(that);
    }
    
  });
  
  var Notification = WIDGET.extend({
    init: function (element, options) {
      var that = this,
        isInvalidAutoHide,
        isInvalidHtml;
    
      isInvalidHtml = (
        options.html &&
        typeof options.html !== STRING
      );
    
      if (isInvalidHtml) {
        throw new Error("Invalid html option");
      }
    
      isInvalidAutoHide = (
        options.autoHide &&
        options.autoHide !== false &&
        typeof options.autoHide !== NUMBER
      );
    
      if (isInvalidAutoHide) {
        options.autoHide = undefined;
      }
      
      WIDGET.fn.init.call(that, element, options);

      element = that.element;
      options = that.options;
      
      element
        .addClass(KIUI_NOTIFY_CONTAINER + ' ' + options.notificationClass + ' k-block')
        .append(options.template)
        .css('width', options.width)
        .on('click' + NS, '.' + KIUI_NOTIFY_CLOSE, PROXY(that.hide, that));
        
      if (options.notificationClass === ERROR) {
        element.addClass('k-error-colored');
      }
      else if (options.notificationClass === INFO) {
        element.addClass('k-info-colored');
      }
      else if (options.notificationClass === SUCCESS) {
        element.addClass('k-success-colored');
      }
      
      that._visible = false;
      
      if (options.html) {
        that.addHtml(options.html);
      }
    },

    options: {
      prefix: PREFIX,
      name: "Notification",
      template: '<span class="' + KIUI_NOTIFY_CLOSE + ' k-icon k-i-close"></span>' +
        '<span class="' + KIUI_NOTIFY_CONTENT + '"></span>',
      notificationClass: ERROR,
      html: "",
      // TODO: icon, title, content, template
      autoHide: false,
      width: 250,
      append: false
      // TODO: events onShow, onHide
      // TODO: animation
    },
    
    events: [
      SHOW,
      HIDE,
      DESTROY
    ],
    
    show: function(autoHide) {
      var that = this;
      
      if (!that._visible) {
        that._visible = true;
        //container.css({'left': -20});
        //container.animate({ 'left': 0 }, { queue: false });
        that.element.fadeIn({ queue: false });
        
        that.trigger(SHOW);
      }
      
      // TODO: unset previously set timeout
      
      // TODO: it should be possible to pause the timeout when the mouse hovers over notification
      
      if (autoHide) {
        setTimeout(PROXY(that.hide, that), autoHide);
      }
    },

    hide: function() {
      var that = this;
      
      if (that._visible) {
        that._visible = false;
        //container.animate({ 'left': -20 }, { queue: false });
        that.element.fadeOut({
          queue: false,
          complete: function() {
            that.trigger(HIDE);
          }
        });
      }
    },

    addHtml: function (html) {
      var that = this;
      
      that.element.find('.' + KIUI_NOTIFY_CONTENT).append(html);
    },
    
    // TODO: addIcon, addTitle, addContent
    
    setPosition: function (position) {
      var that = this;
      
      that.element.css(position);
    },
    
    height: function() {
      var that = this;
      
      return that.element.outerHeight();
    },
    
    width: function() {
      var that = this;
      
      return that.element.outerWidth();
    },
    
    destroy: function() {
      var that = this,
        element = that.element;

      element.off(NS);

      that.trigger(DESTROY);

      WIDGET.fn.destroy.call(that);
    }
    
  });

  var notifiers = {};

  kiui.notifier = function(options) {
    var notifier, notifierElem, isInvalidPosition;
    
    options = options || {};
    
    isInvalidPosition = (
      !options.position || (
        options.position !== TOP_RIGHT &&
        options.position !== TOP_LEFT &&
        options.position !== BOTTOM_RIGHT &&
        options.position !== BOTTOM_LEFT
      )
    );
    
    if (isInvalidPosition) {
      options.position = TOP_RIGHT;
    }
    
    notifier = notifiers[options.position];
    
    if (!notifier) {
      notifierElem = $('<div class="' + KIUI_NOTIFY + '"></div>').appendTo(BODY);
      notifier = notifiers[options.position] = new Notifier(notifierElem, options);
      
      notifier.bind(DESTROY, function() {
        notifiers[options.position] = undefined;
        notifier.element.remove();
      });
    }
    
    return notifier;
  };
  
  kiui.plugin(Notification);
  
  kiui.plugin(Notifier);
  
  ////////////////////////////////////////////////////////

/*  var ERROR = 'kiui-notify-error',
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

  function createContainer(options, wrapperDomEl, onHide) {
    var containerType = options.containerType;
    var width = options.width;
    var containerObj;
    var container = $(
      '<div class="' + KIUI_NOTIFY_CONTAINER + ' ' + containerType + ' k-block k-error-colored">' +
        '<span class="' + KIUI_NOTIFY_CLOSE + ' k-icon k-i-close"></span>' +
        '<span class="' + KIUI_NOTIFY_CONTENT + '"></span>' +
      '</div>').css('width', width);
    var visible = false;
      
    var closeButton = container.find('.' + KIUI_NOTIFY_CLOSE);
    
    function show(autoHide) {
      if (!visible) {
        visible = true;
        //container.css({'left': -20});
        //container.animate({ 'left': 0 }, { queue: false });
        container.fadeIn({ queue: false });
      }
      
      // TODO: unset previously set timeout
      
      // TODO: it should be possible to pause the timeout when the mouse hovers over notification
      
      if (autoHide) {
        setTimeout(hide, autoHide);
      }
    }

    function hide() {
      if (visible) {
        visible = false;
        //container.animate({ 'left': -20 }, { queue: false });
        container.fadeOut({
          queue: false,
          complete: function() {
            container.remove();
            onHide(containerObj);
          }
        });
      }
    }

    function addHtml(html) {
      container.find('.' + KIUI_NOTIFY_CONTENT).append(html);
    }
    
    function setPosition(position) {
      container.css(position);
    }
    
    function containerHeight() {
      return container.outerHeight();
    }
    
    function containerWidth() {
      return container.outerWidth();
    }
    
    closeButton.on('click', hide);
    
    wrapperDomEl.append(container);

    containerObj = {
      addHtml: addHtml,
      // TODO: addIcon, addTitle, addContent
      show: show,
      hide: hide,
      setPosition: setPosition,
      height: containerHeight,
      width: containerWidth
    };
    
    return containerObj;
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
    
    function setContainersPosition() {
      var margin = 10;
      var maxVertical = $(window).height();
      var currentVertical = margin;
      var currentHorizontal = margin;
      
      $.each(containers, function(idx, container) {
        var height = container.height();
        var nextVertical = currentVertical + margin;
        
        if (currentVertical + height > maxVertical - margin) {
          currentVertical = margin;
          currentHorizontal += container.width() + margin;
        }
        
        if (position == TOP_RIGHT) {
          container.setPosition({
            top: currentVertical,
            right: currentHorizontal
          });
        }
        else if (position == TOP_LEFT) {
          container.setPosition({
            top: currentVertical,
            left: currentHorizontal
          });
        }
        else if (position == BOTTOM_RIGHT) {
          container.setPosition({
            bottom: currentVertical,
            right: currentHorizontal
          });
        }
        else if (position == BOTTOM_LEFT) {
          container.setPosition({
            bottom: currentVertical,
            left: currentHorizontal
          });
        }
        
        currentVertical += height + margin;
      });
    }
    
    function onHide(container) {
      containers.splice(containers.indexOf(container), 1);
      setContainersPosition();
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
        // TODO: icon, title, content, template
        autoHide: false,
        width: 250,
        append: false
        // TODO: events onShow, onHide
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
        container = createContainer(options, wrapperDomEl, onHide);
        containers.push(container);
      }
    
      container.addHtml(options.html);
      setContainersPosition();
      container.show(options.autoHide);
    }

    $(window).resize(setContainersPosition);

    return notifyWrapper;
  }
  
  function notifyFactory(options) {
    var defaultOptions = {
      position: TOP_RIGHT
      // TODO: notificationsMargin: 10
    };
    var isInvalidPosition;

    if (typeof options !== OBJECT) {
      options = { html: options };
    }

    options = $.extend({}, defaultOptions, options);
    
    isInvalidPosition = (
      options.position !== TOP_RIGHT &&
      options.position !== TOP_LEFT &&
      options.position !== BOTTOM_RIGHT &&
      options.position !== BOTTOM_LEFT
    );
    
    if (isInvalidPosition) {
      options.position = defaultOptions.position;
    }

    return getNotifyWrapper(options);
  }

  kiui.notify = notifyFactory;*/

})(window.jQuery, window.kendo, window.kiui, window);
