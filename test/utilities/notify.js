xdescribe('utility notify', function() {

  describe('notifyError', function() {
  
    beforeEach(function() {
      kiui.notifyError('this is first error');
    });
  
    it('should create container', function() {
      expect($('.kiui-notify.kiui-notify-error').length).toBe(1);
    });
    
  });
  
  // test kiui-notify positioning
  
  // append when no previous notify exists
  
  // autohide when appending

});
