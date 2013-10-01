/*jQuery(function($) {

  $('[data-toggle="tooltip"]').tooltip();

});*/


(function($) {

  $.fn.logEvent = function(text) {
    
    var lastEvent = this.find('li:first');
    var lastEventMargin = lastEvent.length === 0 ? 0 : parseInt(lastEvent.css('margin-top'), 10);
    var li = $('<li>' + text + '</li>').css({
      'margin-top': lastEventMargin - 20
    });
    
    lastEvent.stop()
      .css('margin-top', 0);
    
    this.scrollTop(0).prepend(li);
    
    li.animate({
      'margin-top': '0px'
    });
    
    return this;
  }
  
})(jQuery);
