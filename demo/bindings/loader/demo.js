jQuery(function($) {
  var viewModel;

  viewModel = kendo.observable({
    ongoingOperation: false,

    startAsyncOperation: function() {
      var that = this;

      this.set('ongoingOperation', true);

      // fake async operation
      setTimeout(function() {
        that.set('ongoingOperation', false);
      }, 3000);
    },
    
    ongoingOperationText: function() {
      return kendo.stringify(this.get('ongoingOperation'));
    }
  });

  kendo.bind($('#bindings_loader_demo'), viewModel);

});
