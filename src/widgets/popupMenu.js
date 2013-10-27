/**
 *
 */
 
(function($, kendo, kiui, document, window, undefined) {

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

})(window.jQuery, window.kendo, window.kiui, window.document, window);
