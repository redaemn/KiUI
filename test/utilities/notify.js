describe('utility notify:', function() {

  describe('notify() with no options', function() {
  
    var notifier;
    
    beforeEach(function() {
      notifier = kiui.notify();
    });
    
    afterEach(function() {
      notifier.destroy();
    });
  
    it('should return a notify wrapper', function() {
      expect(notifier).toEqual(jasmine.any(Object));
      expect(Object.keys(notifier).length).toBe(2);
      expect(notifier.destroy).toEqual(jasmine.any(Function));
      expect(notifier.error).toEqual(jasmine.any(Function));
    });
    
    it('should create a .kiui-notify DOM element', function() {
      expect($('.kiui-notify').length).toBe(1);
    });
    
    describe('called after a destroy()', function() {
    
      beforeEach(function() {
        notifier.destroy();
        notifier.isOld = true;
        notifier = kiui.notify();
      });
  
      it('should return a new notify wrapper', function() {
        expect(notifier).toEqual(jasmine.any(Object));
        expect(Object.keys(notifier).length).toBe(2);
        expect(notifier.destroy).toEqual(jasmine.any(Function));
        expect(notifier.error).toEqual(jasmine.any(Function));
      });
    
      it('should create a new .kiui-notify DOM element', function() {
        expect($('.kiui-notify').length).toBe(1);
      });
    
    });
    
    describe('called two consecutive times', function() {
    
      beforeEach(function() {
        notifier.isOld = true;
        notifier = kiui.notify();
      });
  
      it('should return the same notify wrapper', function() {
        expect(notifier).toEqual(jasmine.any(Object));
        expect(notifier.isOld).toBeTruthy();
      });
    
      it('should not create a new .kiui-notify DOM element', function() {
        expect($('.kiui-notify').length).toBe(1);
      });
    
    });
  
  });
  
  describe('destroy()', function() {
  
    var notifier;
    
    beforeEach(function() {
      notifier = kiui.notify();
      notifier.destroy();
    });
  
    it('should destroy the notify wrapper and the .kiui-notify DOM element', function() {
      expect(notifier).toEqual(jasmine.any(Object));
      expect(Object.keys(notifier).length).toBe(2);
      expect(notifier.destroy).toBeUndefined();
      expect(notifier.error).toBeUndefined();
      
      expect($('.kiui-notify').length).toBe(0);
    });
  
  });
  
  describe('notify() with "top-left" position', function() {
    
    var notifier;
    
    beforeEach(function() {
      notifier = kiui.notify({
        position: "top-left"
      });
    });
    
    afterEach(function() {
      notifier.destroy();
    });
    
    it('should create a .kiui-notify DOM element with the right positioning', function() {
      var element = $('.kiui-notify');
      expect(element.length).toBe(1);
      expect(element.hasClass('kiui-position-top')).toBeTruthy();
      expect(element.hasClass('kiui-position-left')).toBeTruthy();
    });
    
  });
  
  describe('notify() with invalid position', function() {
    
    var notifier;
    
    beforeEach(function() {
      notifier = kiui.notify({
        position: "not-valid"
      });
    });
    
    afterEach(function() {
      notifier.destroy();
    });
    
    it('should create a .kiui-notify DOM element with "top-right" positioning', function() {
      var element = $('.kiui-notify');
      expect(element.length).toBe(1);
      expect(element.hasClass('kiui-position-top')).toBeTruthy();
      expect(element.hasClass('kiui-position-right')).toBeTruthy();
    });
    
  });

  describe('error()', function() {
    
    var notifier;
    var wrapper;
  
    beforeEach(function() {
      notifier = kiui.notify({
        position: "top-right"
      });
      wrapper = $('.kiui-notify');
      notifier.error("this is an error");
    });
    
    afterEach(function() {
      notifier.destroy();
    });
  
    it('should create an error container', function() {
      expect(wrapper.find('.kiui-notify-container.kiui-notify-error').length).toBe(1);
    });
    
  });
  
  // append when no previous notify exists
  
  // autohide when appending

});
