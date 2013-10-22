/*
 * KiUI v0.0.3 (https://github.com/redaemn/KiUI)
 * 2013-10-22
 * Author: https://github.com/redaemn/KiUI/graphs/contributors
 *
 * This software is licensed under the GNU General Public License (GPL) version 3
 * http://www.gnu.org/copyleft/gpl.html
 */

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

})(window.jQuery, window.kendo);

/**
 *
 */
 
// TODO: add event handling
 
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

/**
 *
 */
 
(function($, document, window, undefined) {

  var NS = ".kiuiPopupMenu",
    PREFIX = kiui.prefix,
    WIDGET = kendo.ui.Widget,
    UI = kendo.ui,
    PROXY = $.proxy,
    CLICK = 'click',
    MOUSEENTER = 'mouseenter',
    MOUSELEAVE = 'mouseleave',
    KIUI_POPUP_MENU = "kiui-popup-menu",
    KIUI_POPUP_MENU_TRIGGER = "kiui-popup-menu-trigger",
    KIUI_POPUP_MENU_MENU = "kiui-popup-menu-menu",
    KIUI_STATE_OPEN = "kiui-state-open",
    KIUI_POSITION_TOP = "kiui-position-top",
    KIUI_POSITION_LEFT = "kiui-position-left",
    OPEN = "open",
    CLOSE = "close",
    SELECT = "select";
    
  var PopupMenu = WIDGET.extend({
    init: function (element, options) {
      var that = this,
        positions;

      WIDGET.fn.init.call(that, element, options);

      element = that.element;
      options = that.options;
      
      that._triggerEl = element.children().first();
      that._menuEl = that._triggerEl.next('ul');
      
      element.addClass(KIUI_POPUP_MENU);
      that._triggerEl.addClass(KIUI_POPUP_MENU_TRIGGER);
      that._menuEl.addClass(KIUI_POPUP_MENU_MENU);
      
      that._createMenu();
      that._bindMenuEvents();
      that._attachTriggerHandlers();
    },

    options: {
      prefix: PREFIX,
      name: "PopupMenu",
      openOnHover: false,
      direction: 'bottom right', // can also be 'bottom left', 'top right' or 'top left'
      animation: 'expand', // can also be 'fade' or 'none'
      dataSource: null,
      collisionDetection: false // TODO: handle this option
    },
    
    events: [
      OPEN,
      CLOSE,
      SELECT
    ],
    
    _createMenu: function() {
      var that = this,
        options = that.options,
        menuOptions = {
          orientation: "vertical",
          animation: {
            open: {
              effects: "expand"
            }
          }
        },
        directions = options.direction.split(' ');
        
      if (options.animation === 'fade') {
        menuOptions.animation = { open: { effects: "fadeIn" } };
      } else if (options.animation === 'none') {
        menuOptions.animation = false;
      }
      
      if (directions[1] === 'left') {
        menuOptions.direction = 'left';
        that.element.addClass(KIUI_POSITION_LEFT);
      }
      if (directions[0] === 'top') {
        that.element.addClass(KIUI_POSITION_TOP);
      }
      
      if (options.dataSource) {
        menuOptions.dataSource = options.dataSource;
      }
      
      that.menu = new UI.Menu(that._menuEl, menuOptions);
      
      that._open = false;
      that._automaticallyCloseMenuAttached = false;
    },
    
    _attachTriggerHandlers: function() {
      var that = this;
      
      function clickWrapper(e) {
        e.preventDefault();
        that.toggle();
      }
      
      var toggleTimer;
      
      function clearTimer() {
        window.clearTimeout(toggleTimer);
        toggleTimer = undefined;
      }
      
      function mouseenterWrapper(e) {
        toggleTimer = window.setTimeout(function() {
          toggleTimer = undefined;
          that.element.off(MOUSEENTER + NS + ' ' + MOUSELEAVE + NS);
          that.element.on(MOUSELEAVE + NS, mouseleaveWrapper);
          that.open();
        }, 200);
      
        that.element.one(MOUSELEAVE + NS, clearTimer);
      }
      
      function mouseleaveWrapper(e) {
        toggleTimer = window.setTimeout(function() {
          toggleTimer = undefined;
          that.element.off(MOUSELEAVE + NS + ' ' + MOUSEENTER + NS);
          that.element.on(MOUSEENTER + NS, mouseenterWrapper);
          that.close();
        }, 200);
      
        that.element.one(MOUSEENTER + NS, clearTimer);
      }
      
      if (that.options.openOnHover) {
        that.element.on(MOUSEENTER + NS, mouseenterWrapper);
      } else {  
        that._triggerEl.on(CLICK + NS, clickWrapper);
      }
    },
    
    _bindMenuEvents: function() {
      var that = this;
      
      that.menu.bind('open', function(e) {
        if(that.trigger('open', { item: e.item }) === true) {
          e.preventDefault();
        }
      });
      
      that.menu.bind('close', function(e) {
        if(that.trigger('close', { item: e.item }) === true) {
          e.preventDefault();
        }
      });
      
      that.menu.bind('select', function(e) {
        that.trigger('select', { item: e.item });
      });
    },
    
    toggle: function() {
      var that = this;
      
      if (that._open) {
        that.close();
      }
      else {
        that.open();
      }
    },
    
    open: function() {
      var that = this,
        animation = 'slideToggle',
        duration = 200;
      
      if (that.options.animation === 'fade') {
        animation = 'fadeToggle';
      }
      else if (that.options.animation === 'none') {
        animation = 'toggle';
        duration = 0;
      }
      
      // TODO: maybe this method should use a setTimeout() as close() does
    
      if (!that._open && that.trigger(OPEN, { item: that._triggerEl[0] }) === false) {
        that._open = true;
        that.element.addClass(KIUI_STATE_OPEN);
        that._setAutomaticClose();
        that._menuEl.stop()[animation](duration);
      }
    },
    
    _setAutomaticClose: function() {
      var that = this;
      
      function automaticallyCloseMenu(e) {
        if (!that._triggerEl.find('*').add(that._triggerEl).is(e.target)) {
          that.close();
        }
      }
      
      if (!that._automaticallyCloseMenuAttached) {
        that._automaticallyCloseMenuAttached = true;
        that._automaticallyCloseMenuFunction = automaticallyCloseMenu;
        $(document).on(CLICK + NS, automaticallyCloseMenu);
      }
    },
    
    close: function() {
      var that = this,
        animation = 'slideToggle',
        duration = 100;
        
      if (that.options.animation === 'fade') {
        animation = 'fadeToggle';
      }
      else if (that.options.animation === 'none') {
        animation = 'toggle';
        duration = 0;
      }
      
      if (that._open) {
        that.menu.close();
      
        setTimeout(function() {
        if (that._open && that.trigger(CLOSE, { item: that._triggerEl[0] }) === false) {
            that._open = false;
            that.element.removeClass(KIUI_STATE_OPEN);
            that._menuEl.stop()[animation](duration);
            
            that._automaticallyCloseMenuAttached = false;
            $(document).off(CLICK + NS, that._automaticallyCloseMenuFunction);
          }
        }, that.menu.options.hoverDelay + 1);
      }
      
      return that._open === false; // return whether the menu has been closed
    },
    
    destroy: function() {
      var that = this;

      that._triggerEl.off(NS);
      that.element.off(NS);
      that.menu.destroy();

      WIDGET.fn.destroy.call(that);
    }
    
  });
  
  kiui.plugin(PopupMenu);

})(window.jQuery, window.document, window);
