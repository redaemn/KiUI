jQuery(function($) {

  

  $('#widgets_rating_demo .star-rating').kendoKiuiRating({});

  window.viewModel = kendo.observable({
    rating: 0
  });

  kendo.bind($('#widgets_rating_demo'), window.viewModel);
  
});
