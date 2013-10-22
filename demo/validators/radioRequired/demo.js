jQuery(function($) {
  
  var validator = $("#validators_radioRequired_demo form").kendoValidator().data("kendoValidator");
  
  $('#validators_radioRequired_demo form button').click(function(e) {
    e.preventDefault();
    
    if (validator.validate()) {
      $(this)
        .removeClass('btn-primary')
        .addClass('btn-success')
        .text('The form is valid! Yay!');
    }
  });
  
  validator.validate();
  
});
