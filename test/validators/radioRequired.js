describe('validators radioRequired:', function() {
  
  function validate(elem) {
    return kendo.ui.validator.rules.required(elem);
  }
  
  it('should be present among the standard kendo validators', function() {
    expect(kendo.ui.validator.rules.required).toEqual(jasmine.any(Function));
  });
  
  describe('with radio buttons', function() {
    
    var validator, radio1, radio2;
    
    beforeEach(function() {
      validator = $('<div data-role="validator"></div>').appendTo($('body'));
      radio1 = $('<input name="inputName" type="radio" value="1" required />').appendTo(validator);
      radio2 = $('<input name="inputName" type="radio" value="2" required />').appendTo(validator);
    });
    
    afterEach(function() {
      validator.remove();
      validator = radio1 = radio2 = undefined;
    });
    
    it('should return true if the radio buttons are not required', function() {
      radio1.prop('required', false);
      radio2.prop('required', false);
      
      expect(validate(radio1)).toBe(true);
      expect(validate(radio2)).toBe(true);
    });
    
    it('should return false if the radio buttons are required and none is checked', function() {
      expect(validate(radio1)).toBe(false);
      expect(validate(radio2)).toBe(false);
    });
    
    it('should return true if the radio buttons are required and the first one is checked', function() {
      radio1.prop('checked', true);
      
      expect(validate(radio1)).toBe(true);
      expect(validate(radio2)).toBe(true);
    });
    
    it('should return true if the radio buttons are required and the second one is checked', function() {
      radio2.prop('checked', true);
      
      expect(validate(radio1)).toBe(true);
      expect(validate(radio2)).toBe(true);
    });
    
    describe('together with other radio buttons', function() {
      
      var otherRadio1, otherRadio2;
      
      beforeEach(function() {
        otherRadio1 = $('<input name="otherInputName" type="radio" value="1" />').appendTo(validator);
        otherRadio2 = $('<input name="otherInputName" type="radio" value="2" />').appendTo(validator);
      });
      
      afterEach(function() {
        otherRadio1 = otherRadio2 = undefined;
      });
      
      it('should return false if the radio buttons are required and a different radio button is checked', function() {
        otherRadio1.prop('checked', true);
        
        expect(validate(radio1)).toBe(false);
        expect(validate(radio2)).toBe(false);
      });
      
      it('should return true if the radio buttons are required, the first one is checked and none of the other radio buttons are checked', function() {
        radio1.prop('checked', true);
        
        expect(validate(radio1)).toBe(true);
        expect(validate(radio2)).toBe(true);
      });
      
    });
    
  });
  
  describe('with input[type="text"] elements', function() {
    
    var validator, elem;
    
    beforeEach(function() {
      validator = $('<div data-role="validator"></div>').appendTo($('body'));
      elem = $('<input name="inputName" type="text" required />').appendTo(validator);
      spyOn(kendo.ui.Validator.fn.options.rules, 'required').andReturn(true);
    });
    
    afterEach(function() {
      validator.remove();
      validator = elem = undefined;
    });
    
    it('should call the standard Kendo required validator', function() {
      validate(elem);
      
      expect(kendo.ui.Validator.fn.options.rules.required).toHaveBeenCalledWith(elem);
    });
    
  });
  
});
