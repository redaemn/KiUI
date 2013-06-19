jQuery(function($) {

  var notifier = kiui.notifier();

  function notifyError() {
    notifier.error({
      title: "Error",
      content: "This is an error with a title and a content"
    });
  }
  
  function notifyInfo() {
    notifier.info({
      title: "Info",
      content: "This is an info with a title and a content"
    });
  }
  
  function notifySuccess() {
    notifier.success({
      title: "Success",
      content: "This is a success notification with a title"
    });
  }

  $('#utilities_notify_demo button#error').click(notifyError);
  $('#utilities_notify_demo button#info').click(notifyInfo);
  $('#utilities_notify_demo button#success').click(notifySuccess);
  
  function appendNotification() {
    notifier.error({
      title: "This title is not considered if appended",
      content: "<p>This error will be appended to the last one if it's still visible</p>",
      append: true
    });
  }
  
  $('#utilities_notify_demo button#append-notification').click(appendNotification);
  
  function autoHideNotification() {
    notifier.success({
      title: "Auto-hide",
      content: "This notification will hide automatically in 4 seconds.",
      autoHide: 4000
    });
  }
  
  $('#utilities_notify_demo button#autoHide-notification').click(autoHideNotification);
  
  function noTitleNotification() {
    notifier.info({
      content: "This notification has no title, just content!!"
    });
  }
  
  $('#utilities_notify_demo button#no-title-notification').click(noTitleNotification);
  
  function customIconNotification() {
    notifier.error({
      icon: '<span class="k-icon k-i-cancel"></span>',
      title: "Custom icon",
      content: "This notification has a custom icon"
    });
  }
  
  function noIconNotification() {
    notifier.info({
      icon: "",
      title: "No icon",
      content: "This notification has no icon"
    });
  }
  
  $('#utilities_notify_demo button#custom-icon-notification').click(customIconNotification);
  $('#utilities_notify_demo button#no-icon-notification').click(noIconNotification);
  
  function widerNotification() {
    notifier.success({
      title: "Wider",
      content: "This notification is wider than the others",
      width: 400
    });
  }
  
  function narrowerNotification() {
    notifier.success({
      title: "Narrower",
      content: "This notification is narrower than the others",
      width: 150
    });
  }
  
  $('#utilities_notify_demo button#wider-notification').click(widerNotification);
  $('#utilities_notify_demo button#narrower-notification').click(narrowerNotification);
  
  var topLeftNotifier = kiui.notifier({
    position: "top-left"
  });
  
  var bottomLeftNotifier = kiui.notifier({
    position: "bottom-left"
  });
  
  var bottomRightNotifier = kiui.notifier({
    position: "bottom-right"
  });
  
  var topRightNotifier = kiui.notifier({
    position: "top-right"
  });
  
  function topLeftNotification() {
    topLeftNotifier.success({
      title: "Top-left positioning",
      content: "This notification is positioned in the top-left corner of the screen"
    });
  }
  
  $('#utilities_notify_demo button#top-left-positioning').click(topLeftNotification);
  
  function bottomLeftNotification() {
    bottomLeftNotifier.info({
      title: "Bottom-left positioning",
      content: "This notification is positioned in the bottom-left corner of the screen"
    });
  }
  
  $('#utilities_notify_demo button#bottom-left-positioning').click(bottomLeftNotification);
  
  function bottomRightNotification() {
    bottomRightNotifier.error({
      title: "Bottom-right positioning",
      content: "This notification is positioned in the bottom-right corner of the screen"
    });
  }
  
  $('#utilities_notify_demo button#bottom-right-positioning').click(bottomRightNotification);
  
  function topRightNotification() {
    topRightNotifier.info({
      title: "Top-right positioning",
      content: "This notification is positioned in the top-right corner of the screen"
    });
  }
  
  $('#utilities_notify_demo button#top-right-positioning').click(topRightNotification);

});
