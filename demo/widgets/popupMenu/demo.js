jQuery(function($) {

  // basic layout needed
  $('#widgets_popupMenu_demo .basic-layout').kendoKiuiPopupMenu();
  
  // layout using a <span> and an <a>
  $('#widgets_popupMenu_demo .alternative-layout').kendoKiuiPopupMenu();
  
  // event handling
  
  // openOnHover
  $('#widgets_popupMenu_demo .openOnHover-option').kendoKiuiPopupMenu({
    openOnHover: true
  });
  
  //direction: 'bottom right', // can also be 'bottom left', 'top right' or 'top left'
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
  
  //animation: 'expand', // can also be 'fade' or 'none'
  
  // kendoMenu is accessible using the widget's "menu" property
  
  
  
  /*var blockOpen = false;
  
  $('#widgets_popupMenu_demo .ex2').data('kendoKiuiPopupMenu').bind('open', function(e) {
    console.log(e.item);
    if (blockOpen) {
      console.log('prevented');
      e.preventDefault();
    }
    
    blockOpen = !blockOpen;
  });*/

});
