jQuery(function($) {

  var notifier = kiui.notify();

  function notifyError() {
    notifier.error("this is an error");
  }

  $('#utilities_notify_demo button#error').click(notifyError);

});
