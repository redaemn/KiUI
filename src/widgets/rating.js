/**
 * Allows users to set ratings on anything
 */
 
(function($, kendo, kiui, undefined) {

  var NS = ".kiuiRating",
    PREFIX = kiui.prefix,
    WIDGET = kendo.ui.Widget,
    PROXY = $.proxy,
    STAR = 'li',
    SELECT = "select",
    CHANGE = "change",
    MOUSEOVER = "mouseover",
    MOUSELEAVE = "mouseleave",
    CLICK = 'click',
    KIUI_RATING = 'kiui-rating',
    KIUI_STATE_READONLY = 'kiui-state-readonly';
    
  var Rating = WIDGET.extend({
    init: function (element, options) {
      var that = this;

      WIDGET.fn.init.call(that, element, options);

      element = that.element;
      options = that.options;
      
      element.addClass(KIUI_RATING)
        .on(MOUSEOVER + NS, STAR, PROXY(that._mouseover, that))
        .on(MOUSELEAVE + NS, PROXY(that._mouseleave, that))
        .on(CLICK + NS, STAR, PROXY(that._select, that));
      element.find(STAR).addClass(options.starEmptyClass);
      
      that.value(options.value);
      that.readonly(options.readonly);
    },

    options: {
      prefix: PREFIX,
      name: "Rating",
      starEmptyClass: "kiui-rating-star-empty",
      starFullClass: "kiui-rating-star-full",
      value: null,
      readonly: false
    },
    
    events: [
      MOUSEOVER,
      MOUSELEAVE,
      SELECT,
      CHANGE
    ],
    
    value: function(value) {
      var that = this;
      
      if (value === undefined) {
        return that._currentValue;
      }
      else {
        that._currentValue = value;
        that._render(value);
      }
    },
    
    readonly: function(readonly) {
      var that = this;
      
      if (readonly === undefined) {
        readonly = true;
      }
      
      if (readonly) {
        that.element.addClass(KIUI_STATE_READONLY);
      }
      else {
        that.element.removeClass(KIUI_STATE_READONLY);
      }
      
      that._readonly = readonly;
    },
    
    _mouseover: function(e) {
      var that = this,
        star = $(e.currentTarget),
        value = star.data('value');
      
      if (!that._readonly) {
        that._render(value);
        that.trigger(MOUSEOVER, { value: value, item: star });
      }
    },
    
    _mouseleave: function() {
      var that = this;
      
      if (!that._readonly) {
        that._render(that.value());
        that.trigger(MOUSELEAVE);
      }
    },
    
    _select: function(e) {
      var that = this,
        star = $(e.currentTarget),
        value = star.data('value');
      
      if (!that._readonly) {
        that.value(value);
        that.trigger(SELECT, { value: value, item: star });
        that.trigger(CHANGE);
      }
    },
    
    _render: function(value) {
      var that = this,
        opt = that.options,
        star = that.element.find(STAR + '[data-value="' + value + '"]');
        
        if (value === null || value === undefined || star.length === 0) {
          that.element.find(STAR).removeClass(opt.starFullClass).addClass(opt.starEmptyClass);
        }
        else {
          star.prevAll(STAR).removeClass(opt.starEmptyClass).addClass(opt.starFullClass);
          star.removeClass(opt.starEmptyClass).addClass(opt.starFullClass);
          star.nextAll(STAR).removeClass(opt.starFullClass).addClass(opt.starEmptyClass);
        }
    },
    
    destroy: function() {
      var that = this;

      that.element.off(NS);

      WIDGET.fn.destroy.call(that);
    }
  });
  
  kiui.plugin(Rating);
  
})(window.jQuery, window.kendo, window.kiui);
