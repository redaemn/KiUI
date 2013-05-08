jQuery(function($) {

  function notifyError() {
    kiui.notifyError("this is an error");
  }

  $('#utilities_notify_demo button#error').click(notifyError);

});
