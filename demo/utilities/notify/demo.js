jQuery(function($) {

  var notifier = kiui.notifier();

  function notifyError() {
    notifier.error({
      html: "this is an error"
    });
  }
  
  function notifyInfo() {
    notifier.info({
      html: "this is an info"
    });
  }
  
  function notifySuccess() {
    notifier.success({
      html: "this is a success"
    });
  }

  $('#utilities_notify_demo button#error').click(notifyError);
  $('#utilities_notify_demo button#info').click(notifyInfo);
  $('#utilities_notify_demo button#success').click(notifySuccess);

});
