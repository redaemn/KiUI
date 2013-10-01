jQuery(function($) {

  // basic layout needed
  $('#widgets_popupMenu_demo .basic-layout').kendoKiuiPopupMenu();
  
  // layout using an <a>
  $('#widgets_popupMenu_demo .alternative-layout').kendoKiuiPopupMenu();
  
  // openOnHover
  $('#widgets_popupMenu_demo .openOnHover-option').kendoKiuiPopupMenu({
    openOnHover: true
  });
  
  //direction
  $('#widgets_popupMenu_demo .bottom-right-direction-option').kendoKiuiPopupMenu({
    direction: 'bottom right'
  });
  
  $('#widgets_popupMenu_demo .bottom-left-direction-option').kendoKiuiPopupMenu({
    direction: 'bottom left'
  });
  
  $('#widgets_popupMenu_demo .top-right-direction-option').kendoKiuiPopupMenu({
    direction: 'top right'
  });
  
  $('#widgets_popupMenu_demo .top-left-direction-option').kendoKiuiPopupMenu({
    direction: 'top left'
  });
  
  //animation
  $('#widgets_popupMenu_demo .expand-animation-option').kendoKiuiPopupMenu({
    animation: 'expand'
  });
  
  $('#widgets_popupMenu_demo .fade-animation-option').kendoKiuiPopupMenu({
    animation: 'fade'
  });
  
  $('#widgets_popupMenu_demo .none-animation-option').kendoKiuiPopupMenu({
    animation: 'none'
  });
  
  // dataSource
  $('#widgets_popupMenu_demo .datasource-option').kendoKiuiPopupMenu({
    dataSource: [
      {
        text: "Menu 1",
        spriteCssClass: "k-icon k-i-clock",
        items: [
          {
            text: "<b>SubMenu 1</b>",
            encoded: false
          },
          {
            text: "SubMenu 2"
          }
        ]
      },
      {
        text: "Menu 2",
        spriteCssClass: "k-icon k-i-search"
      }
    ]
  });
  
  // event handling
  var eventLogger = $('#widgets_popupMenu_demo .kiuiEventLogger ul');
  
  $('#widgets_popupMenu_demo .trigger-events').kendoKiuiPopupMenu({
    open: function(e) {
      var itemName = $(e.item).is('button') ?
        'Button menu' : 
        $(e.item).children('.k-link').text().trim();
      
      eventLogger.logEvent("Opened: " + itemName);
    },
    close: function(e) {
      var itemName = $(e.item).is('button') ?
        'Button menu' : 
        $(e.item).children('.k-link').text().trim();
      
      eventLogger.logEvent("Closed: " + itemName);
    },
    select: function(e) {
      eventLogger.logEvent('Selected: ' + $(e.item).children('.k-link').text().trim());
    }
  });
  
  var blockEvent = false;
  
  $('#widgets_popupMenu_demo .cancel-event').kendoKiuiPopupMenu({
    open: function(e) {
      var itemName = $(e.item).is('button') ?
        'Button menu' : 
        $(e.item).children('.k-link').text().trim();
      
      if (itemName === 'Button menu' && blockEvent) {
        e.preventDefault();
       
        eventLogger.logEvent("Open prevented: " + itemName);
      }
      else {
        eventLogger.logEvent("Opened: " + itemName);
      }
      
      if (itemName === 'Button menu') {
         blockEvent = !blockEvent;
      }
    }
  });
  
  // you can also subscribe to the event after the widget was created
  $('#widgets_popupMenu_demo .bind-event').kendoKiuiPopupMenu({});
  // retrieve the widget object
  $('#widgets_popupMenu_demo .bind-event').data('kendoKiuiPopupMenu')
    // bind the event
    .bind('select', function(e) {
      eventLogger.logEvent('Selected: ' + $(e.item).children('.k-link').text().trim());
    });

});
