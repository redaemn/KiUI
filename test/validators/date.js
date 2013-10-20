describe('validators date:', function() {
  
  var elem;
  
  function validate() {
    return kendo.ui.validator.rules.kiuiDate(elem);
  }
  
  beforeEach(function() {
    elem = $('<input data-kiui-date>').appendTo($('body'));
    
    // this line is needed to fix a bug in kendo.parseDate() that doesn't work
    // if the culture has not been set as default at least once
    kendo.culture("it-IT");
    kendo.culture("en-US");
  });
  
  afterEach(function() {
    elem.remove();
    elem = undefined;
    // reset default culture
    kendo.culture("en-US");
  });
  
  it('should be present among the standard kendo validators', function() {
    expect(kendo.ui.validator.rules.kiuiDate).toEqual(jasmine.any(Function));
  });
  
  it('should have a default error message', function() {
    expect(kendo.ui.validator.messages.kiuiDate).toBe("{0} is not a valid date");
  });
  
  describe('on input element without validation attribute', function() {
    
    beforeEach(function() {
      elem.removeAttr('data-kiui-date');
    });
    
    it('should return true', function() {
      expect(validate()).toBe(true);
    });
    
  });
  
  describe('with default "en-US" culture', function() {
    
    it('should return true when input value is a date with a valid format based on current default culture', function() {
      elem.val("03/25/2013");
      
      expect(validate()).toBe(true);
    });
    
    it('should return false when input value is not a date at all', function() {
      elem.val("foo bar");
      
      expect(validate()).toBe(false);
    });
    
    it('should return false when input value is a date with an invalid format based on current default culture', function() {
      elem.val("25/03/2013");
      
      expect(validate()).toBe(false);
      
      elem.val("03-25-2013");
      
      expect(validate()).toBe(false);
    });
    
    describe('with custom culture', function() {
      
      beforeEach(function() {
        elem.attr('data-kiui-date-culture', 'it-IT');
      });
      
      it('should return true when input value is a date with a valid format based on custom culture', function() {
        elem.val("25/03/2013");
        
        expect(validate()).toBe(true);
      });
      
      it('should return false when input value is a date with an invalid format based on custom culture', function() {
        elem.val("03/25/2013");
        
        expect(validate()).toBe(false);
        
        elem.val("25-03-2013");
        
        expect(validate()).toBe(false);
      });
      
    });
    
    describe('with custom format', function() {
      
      beforeEach(function() {
        elem.attr('data-kiui-date', 'dd--MM--yyyy');
      });
      
      it('should return true when input value is a date with a valid format based on custom format', function() {
        elem.val("25--03--2013");
        
        expect(validate()).toBe(true);
      });
      
      it('should return false even though input value is a date with a valid format based on current default culture', function() {
        elem.val("03/25/2013");
        
        expect(validate()).toBe(false);
      });
      
    });
    
    describe('with custom format and custom culture', function() {
      
      beforeEach(function() {
        elem.attr('data-kiui-date', 'dd--MM--yyyy');
        elem.attr('data-kiui-date-culture', 'it-IT');
      });
      
      it('should return true when input value is a date with a valid format based on custom format', function() {
        elem.val("25--03--2013");
        
        expect(validate()).toBe(true);
      });
      
      it('should return false even though input value is a date with a valid format based on current default culture', function() {
        elem.val("03/25/2013");
        
        expect(validate()).toBe(false);
      });
      
      it('should return false even though input value is a date with a valid format based on custom culture', function() {
        elem.val("25/03/2013");
        
        expect(validate()).toBe(false);
      });
      
    });
  
  });
  
  describe('with default "it-IT" culture', function() {
    
    beforeEach(function() {
      kendo.culture("it-IT");
    });
  
    it('should return true when input value is a date with a valid format based on current default culture', function() {
      elem.val("25/03/2013");
      
      expect(validate()).toBe(true);
    });
    
    it('should return false when input value is not a date at all', function() {
      elem.val("foo bar");
      
      expect(validate()).toBe(false);
    });
    
    it('should return false when input value is a date with an invalid format based on current default culture', function() {
      elem.val("03/25/2013");
      
      expect(validate()).toBe(false);
      
      elem.val("25-03-2013");
      
      expect(validate()).toBe(false);
    });
    
    describe('with custom culture', function() {
      
      beforeEach(function() {
        elem.attr('data-kiui-date-culture', 'en-US');
      });
      
      it('should return true when input value is a date with a valid format based on custom culture', function() {
        elem.val("03/25/2013");
        
        expect(validate()).toBe(true);
      });
      
      it('should return false when input value is a date with an invalid format based on custom culture', function() {
        elem.val("25/03/2013");
        
        expect(validate()).toBe(false);
        
        elem.val("03-25-2013");
        
        expect(validate()).toBe(false);
      });
      
    });
    
    describe('with custom format', function() {
      
      beforeEach(function() {
        elem.attr('data-kiui-date', 'dd--MM--yyyy');
      });
      
      it('should return true when input value is a date with a valid format based on custom format', function() {
        elem.val("25--03--2013");
        
        expect(validate()).toBe(true);
      });
      
      it('should return false even though input value is a date with a valid format based on current default culture', function() {
        elem.val("25/03/2013");
        
        expect(validate()).toBe(false);
      });
      
    });
    
    describe('with custom format and custom culture', function() {
      
      beforeEach(function() {
        elem.attr('data-kiui-date', 'dd--MM--yyyy');
        elem.attr('data-kiui-date-culture', 'en-US');
      });
      
      it('should return true when input value is a date with a valid format based on custom format', function() {
        elem.val("25--03--2013");
        
        expect(validate()).toBe(true);
      });
      
      it('should return false even though input value is a date with a valid format based on current default culture', function() {
        elem.val("25/03/2013");
        
        expect(validate()).toBe(false);
      });
      
      it('should return false even though input value is a date with a valid format based on custom culture', function() {
        elem.val("03/25/2013");
        
        expect(validate()).toBe(false);
      });
      
    });
  
  });
  
});
