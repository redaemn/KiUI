/**
 *
 */
 
(function($, kendo, kiui, window, undefined) {

  var NS = ".kiuiNotifier",
    PREFIX = kiui.prefix,
    WIDGET = kendo.ui.Widget,
    UI = kendo.ui,
    PROXY = $.proxy,
    ERROR = 'kiui-notification-error',
    INFO = 'kiui-notification-info',
    SUCCESS = 'kiui-notification-success',
    KIUI_NOTIFIER = 'kiui-notifier',
    KIUI_POSITION = 'kiui-position-',
    KIUI_NOTIFICATION = 'kiui-notification',
    KIUI_NOTIFICATION_ICON = 'kiui-notification-icon',
    KIUI_NOTIFICATION_CLOSE = 'kiui-notification-close',
    KIUI_NOTIFICATION_TITLE = 'kiui-notification-title',
    KIUI_NOTIFICATION_CONTENT = 'kiui-notification-content',
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
        positions;

      WIDGET.fn.init.call(that, element, options);

      element = that.element;
      options = that.options;

      positions = /^([^-]+)-(.+)$/.exec(options.position);
      element
        .addClass(KIUI_NOTIFIER)
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
        maxHorizontal = 0,
        currentVertical = margin,
        currentHorizontal = margin;
      
      $.each(that._notifications, function(idx, notification) {
        var height = notification.height();
        var width = notification.width();
        
        if (width > maxHorizontal) {
          maxHorizontal = width;
        }
        
        if (idx > 0 && currentVertical + height > maxVertical - margin) {
          currentVertical = margin;
          currentHorizontal += maxHorizontal + margin;
          maxHorizontal = 0;
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
    
    _notify: function(options, notificationType) {
      var that = this,
        notification;
    
      if (options.append) {
        $.each(that._notifications, function(idx, _notification) {
          if (_notification.element.hasClass(notificationType)) {
            notification = _notification;
          }
        });
      }
    
      if (notification !== undefined) {
        notification.addContent(options.content);
      }
      else {
        notification = new kiui.Notification(
          $('<div></div>').appendTo(that.element),
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
    
    _createNotificationOptions: function(options, notificationType) {
      var that = this;
      
      if (typeof options === STRING) {
        options = { content: options };
      }
      
      if (notificationType == ERROR) {
        if (options.icon === undefined) {
          options.icon = '<span class="k-icon k-i-note"></span>';
        }
        options.notificationClass = notificationType + ' k-error-colored';
      }
      else if (notificationType == INFO) {
        if (options.icon === undefined) {
          options.icon = '<span class="k-icon k-i-pencil"></span>';
        }
        options.notificationClass = notificationType + ' k-info-colored';
      }
      else if (notificationType == SUCCESS) {
        if (options.icon === undefined) {
          options.icon = '<span class="k-icon k-i-tick"></span>';
        }
        options.notificationClass = notificationType + ' k-success-colored';
      }
      
      return options;
    },
    
    error: function(options) {
      var that = this;
      
      that._notify(that._createNotificationOptions(options, ERROR), ERROR);
    },
    
    info: function(options) {
      var that = this;
      
      that._notify(that._createNotificationOptions(options, INFO), INFO);
    },
    
    success: function(options) {
      var that = this;
      
      that._notify(that._createNotificationOptions(options, SUCCESS), SUCCESS);
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
      var that = this;
      
      WIDGET.fn.init.call(that, element, options);

      element = that.element;
      options = that.options;
      
      element
        .addClass(KIUI_NOTIFICATION + ' k-block')
        .addClass(options.notificationClass)
        .append(options.template)
        .css('width', options.width)
        .on('click' + NS, '.' + KIUI_NOTIFICATION_CLOSE, PROXY(that.hide, that));
      
      that._visible = false;
      
      that.setIcon(options.icon);
      that.setTitle(options.title);
      that.addContent(options.content);
    },

    options: {
      prefix: PREFIX,
      name: "Notification",
      template:
        '<div class="' + KIUI_NOTIFICATION_ICON + '"></div>' +
        '<div class="' + KIUI_NOTIFICATION_CLOSE + '">' +
          '<span class="k-icon k-i-close">' +
        '</div>' +
        '<div class="' + KIUI_NOTIFICATION_TITLE + '"></div>' +
        '<div class="' + KIUI_NOTIFICATION_CONTENT + '"></div>',
      notificationClass: 'k-error-colored',
      icon: "",
      title: "",
      content: "",
      autoHide: false,
      width: 250,
      append: false
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
        
        that.element.fadeIn({
          queue: false,
          complete: function() {
            that.trigger(SHOW);
          }
        });
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
        
        that.element.fadeOut({
          queue: false,
          complete: function() {
            that.trigger(HIDE);
          }
        });
      }
    },
    
    setIcon: function (iconHtml) {
      var that = this,
        iconElement = that.element.find('.' + KIUI_NOTIFICATION_ICON);
       
      iconElement.html(iconHtml);
        
      if (iconHtml === EMPTY) {
        iconElement.hide();
      }
      else {
        iconElement.show();
      }
    },
    
    setTitle: function (htmlTitle) {
      var that = this,
        titleElement = that.element.find('.' + KIUI_NOTIFICATION_TITLE);
      
      titleElement.html(htmlTitle);
      
      if (htmlTitle === EMPTY) {
        titleElement.hide();
      }
      else {
        titleElement.show();
      }
    },

    addContent: function (htmlContent) {
      var that = this;
      
      that.element.find('.' + KIUI_NOTIFICATION_CONTENT).append(htmlContent);
    },
    
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
      notifierElem = $('<div></div>').appendTo(BODY);
      notifier = notifiers[options.position] = new kiui.Notifier(notifierElem, options);
      
      notifier.bind(DESTROY, function() {
        notifiers[options.position] = undefined;
        notifier.element.remove();
      });
    }
    
    return notifier;
  };
  
  kiui.plugin(Notification);
  
  kiui.plugin(Notifier);

})(window.jQuery, window.kendo, window.kiui, window);
