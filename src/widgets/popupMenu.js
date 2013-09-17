/**
 *
 */
 
(function($, document, undefined) {

  var NS = ".kiuiPopupMenu",
    PREFIX = kiui.prefix,
    WIDGET = kendo.ui.Widget,
    UI = kendo.ui,
    PROXY = $.proxy,
    CLICK = 'click',
    KIUI_POPUP_MENU = "kiui-popup-menu",
    KIUI_POPUP_MENU_TRIGGER = "kiui-popup-menu-trigger",
    KIUI_POPUP_MENU_MENU = "kiui-popup-menu-menu",
    KIUI_STATE_OPEN = "kiui-state-open";
    
  var PopupMenu = WIDGET.extend({
    init: function (element, options) {
      var that = this,
        positions;

      WIDGET.fn.init.call(that, element, options);

      element = that.element;
      options = that.options;
      
      element.addClass(KIUI_POPUP_MENU);
      
      that._createMenu();
    },

    options: {
      prefix: PREFIX,
      name: "PopupMenu",
      menuOptions: {
        orientation: "vertical"
      },
      openOnHover: false, // TODO: handle this option
      direction: 'bottom right' // TODO: handle this option
    },
    
    events: [
      // TODO: add events
    ],
    
    _createMenu: function() {
      var that = this,
        triggerEl = that._triggerEl = that.element.children().first(),
        menuEl = that._menuEl = triggerEl.next('ul');
      
      function clickWrapper(e) {
        e.preventDefault();
        that.toggle();
      }
      
      triggerEl
        .addClass(KIUI_POPUP_MENU_TRIGGER)
        .on(CLICK + NS, clickWrapper);
      
      menuEl.addClass(KIUI_POPUP_MENU_MENU);
      that.menu = new UI.Menu(menuEl, that.options.menuOptions);
      
      that._open = false;
      that._automaticallyCloseMenuAttached = false;
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
      var that = this;
    
      if (!that._open) {
        that._open = true;
        that.element.addClass(KIUI_STATE_OPEN);
        that._setAutomaticClose();
        that._menuEl.stop().slideToggle('fast');
      }
    },
    
    _setAutomaticClose: function() {
      var that = this;
      
      function automaticallyCloseMenu(e) {
        if (!that._triggerEl.find('*').add(that._triggerEl).is(e.target)) {
          that.close();
          that._automaticallyCloseMenuAttached = false;
          $(document).off(CLICK + NS, automaticallyCloseMenu);
        }
      }
      
      if (!that._automaticallyCloseMenuAttached) {
        that._automaticallyCloseMenuAttached = true;
        $(document).on(CLICK + NS, automaticallyCloseMenu);
      }
    },
    
    close: function() {
      var that = this;
    
      if (that._open) {
        that._open = false;
        that.element.removeClass(KIUI_STATE_OPEN);
        that._menuEl.stop().slideToggle('fast');
      }
    },
    
    destroy: function() {
      var that = this;

      that._triggerEl.off(NS);
      that.menu.destroy();

      WIDGET.fn.destroy.call(that);
    }
    
  });
  
  kiui.plugin(PopupMenu);

})(window.jQuery, window.document);
