jQuery(function($) {
  
  // set Italian culture
  kendo.culture("it-IT");
  // reset default US culture
  kendo.culture("en-US");
  // I need to do this because there seems to be a bug in kendo.parseDate(): it
  // doesn't work for cultures that have never been set as default culture at
  // least one time
  
  var today = new Date();
  
  $('#validators_dateValue_demo [name="date"]').kendoDatePicker({
    value: today
  });
  
  $('#validators_dateValue_demo [name="date-format"]').kendoDatePicker({
    format: 'MM-dd-yyyy',
    value: today
  });
  
  $('#validators_dateValue_demo [name="date-culture"]').kendoDatePicker({
    culture: 'it-IT',
    value: today
  });
  
  var validator = $("#validators_dateValue_demo form").kendoValidator().data("kendoValidator");
  
});