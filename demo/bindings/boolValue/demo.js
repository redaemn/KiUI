jQuery(function($) {
  var viewModel;

  viewModel = kendo.observable({
    likeKiui: null,
    likeKiuiText: function() {
      return kendo.stringify(this.get('likeKiui'));
    }
  });

  kendo.bind($('#bindings_boolValue_demo'), viewModel);

});
