jQuery(function($) {

  var viewModel,
    ratingWidget;

  ratingWidget = $('#widgets_rating_demo .star-rating').kendoKiuiRating({
    mouseover: function(e) {
      console.log(e);
      var title = e.item.attr('title');
      $('#widgets_rating_demo .star-hover').text(" - " + e.value + ": " + title);
    },
    mouseleave: function() {
      $('#widgets_rating_demo .star-hover').text("");
    }
  }).data('kendoKiuiRating');

  viewModel = kendo.observable({
    rating: null,
    readonly: false,
    toggleReadonly: function() {
      this.readonly = !this.readonly;
      
      if (this.readonly) {
        this.set('toggleReadonlyText', 'readonly');
        this.set('toggleReadonlyClass', 'btn btn-danger');
      }
      else {
        this.set('toggleReadonlyText', 'read-write');
        this.set('toggleReadonlyClass', 'btn');
      }
      
      ratingWidget.readonly(this.readonly);
    },
    toggleReadonlyText: "read-write",
    toggleReadonlyClass: "btn"
  });

  kendo.bind($('#widgets_rating_demo'), viewModel, kendo.ui, kiui);
  
  $('#widgets_rating_demo .custom-star-rating').kendoKiuiRating({
    starEmptyClass: "icon-check-empty",
    starFullClass: "icon-check",
    mouseover: function(e) {
      console.log(e);
      var title = e.item.attr('title');
      $('#widgets_rating_demo .custom-star-hover').text(" - " + e.value + ": " + title);
    },
    mouseleave: function() {
      $('#widgets_rating_demo .custom-star-hover').text("");
    }
  });
  
});
