jQuery(function($) {
  
  $('#validators_dateValue_demo .datePicker').kendoDatePicker({
    //format: 'dd-MM-yyyy'
  });
  
  var validator = $("#validators_dateValue_demo form").kendoValidator().data("kendoValidator");
  
});