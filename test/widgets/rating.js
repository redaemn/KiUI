describe('widgets rating:', function() {

  var elem,
    stars,
    RATING = kiui.Rating;
  
  describe('Rating', function() {
  
    beforeEach(function() {
      elem = $('<ul><li data-value="0"></li><li data-value="1"></li><li data-value="2"></li></ul>').appendTo('body');
      stars = elem.find('li');
    });
    
    afterEach(function() {
      elem.remove();
    });
    
    it('should be a kiui class', function() {
      expect(kiui.Rating).toEqual(jasmine.any(Function));
    });
    
    describe('init()', function() {
      
      describe('with no options', function() {
      
        var rating,
          WIDGET = kendo.ui.Widget;
          
        beforeEach(function() {
          spyOn(WIDGET.fn, 'init').andCallThrough();
          rating = new kiui.Rating(elem, {});
        });
        
        afterEach(function() {
          rating.destroy();
          rating = undefined;
        });
        
        it('should call Widget init()', function() {
          expect(WIDGET.fn.init.calls.length).toEqual(1);
        });
        
        it('should set the right classes on DOM element', function() {
          expect(elem.is('.kiui-rating')).toBeTruthy();
        });
        
        it('should set the right classes on every <li> element', function() {
          stars.each(function() {
            var star = $(this);
            expect(star.is('.kiui-rating-star-empty')).toBeTruthy();
            expect(star.is('.kiui-rating-star-full')).toBeFalsy();
          });
        });
        
        it('should have the default "null" value', function() {
          expect(rating.value()).toBe(null);
        });
        
        it('should not have readonly css class set on the rating element', function() {
          expect(elem.is('.kiui-state-readonly')).toBeFalsy();
        });
        
        describe('value()', function(){
          
          it('called with a valid value, should set the right classes on <li> elements', function() {
            var selectedStar, emptyStars, fullStars, value = 1;
            
            rating.value(value);
            
            selectedStar = elem.find('li[data-value="' + value + '"]');
            fullStars = selectedStar.prevAll('li').add(selectedStar);
            emptyStars = selectedStar.nextAll('li');
            
            fullStars.each(function() {
              var star = $(this);
              expect(star.is('.kiui-rating-star-full')).toBeTruthy();
              expect(star.is('.kiui-rating-star-empty')).toBeFalsy();
            });
            
            emptyStars.each(function() {
              var star = $(this);
              expect(star.is('.kiui-rating-star-full')).toBeFalsy();
              expect(star.is('.kiui-rating-star-empty')).toBeTruthy();
            });
          });
          
          it('called with an invalid value, should set the right classes on <li> elements', function(){
            rating.value(42);
            
            stars.each(function() {
              var star = $(this);
              expect(star.is('.kiui-rating-star-empty')).toBeTruthy();
            })
          });
          
          it('called with a null value, should set the right classes on <li> elements', function(){
            rating.value(null);
            
            elem.find('li').each(function() {
              var star = $(this);
              expect(star.is('.kiui-rating-star-empty')).toBeTruthy();
            });
          });
          
          it('called with an undefined value, should not modify <li> elements classes', function(){
            var selectedStar, emptyStars, fullStars, value = 1;
            
            rating.value(value);
            
            selectedStar = elem.find('li[data-value="' + value + '"]');
            fullStars = selectedStar.prevAll('li').add(selectedStar);
            emptyStars = selectedStar.nextAll('li');
            
            fullStars.each(function() {
              var star = $(this);
              expect(star.is('.kiui-rating-star-full')).toBeTruthy();
              expect(star.is('.kiui-rating-star-empty')).toBeFalsy();
            });
            
            emptyStars.each(function() {
              var star = $(this);
              expect(star.is('.kiui-rating-star-full')).toBeFalsy();
              expect(star.is('.kiui-rating-star-empty')).toBeTruthy();
            });
            
            rating.value(undefined);
            
            fullStars.each(function() {
              var star = $(this);
              expect(star.is('.kiui-rating-star-full')).toBeTruthy();
              expect(star.is('.kiui-rating-star-empty')).toBeFalsy();
            });
            
            emptyStars.each(function() {
              var star = $(this);
              expect(star.is('.kiui-rating-star-full')).toBeFalsy();
              expect(star.is('.kiui-rating-star-empty')).toBeTruthy();
            });
          });
          
          it('called with no value, should return the last set value', function() {
            rating.value(1);
            
            expect(rating.value()).toBe(1);
          });
          
        });
        
        describe('mouseover on a li', function() {
          
          var selectedStar;
          
          beforeEach(function() {
            spyOn(RATING.fn, 'trigger').andCallThrough();
            selectedStar = elem.find('li[data-value="1"]');
            selectedStar.mouseover();
          });
          
          it('should set the right classes on <li> elements', function(){
            var fullStars = selectedStar.prevAll('li').add(selectedStar),
              emptyStars = selectedStar.nextAll('li');
            
            fullStars.each(function() {
              var star = $(this);
              expect(star.is('.kiui-rating-star-full')).toBeTruthy();
              expect(star.is('.kiui-rating-star-empty')).toBeFalsy();
            });
            
            emptyStars.each(function() {
              var star = $(this);
              expect(star.is('.kiui-rating-star-full')).toBeFalsy();
              expect(star.is('.kiui-rating-star-empty')).toBeTruthy();
            });
          });
          
          it('should trigger the mouseover event passing the right values', function() {
            var arg;
            
            expect(rating.trigger.mostRecentCall.args[0]).toBe('mouseover');
            
            arg = rating.trigger.mostRecentCall.args[1];
            
            expect($(arg.item).is(selectedStar)).toBeTruthy();
            expect(arg.value).toBe(1);
          });
          
        });
        
        describe('mouseleave', function() {
          
          var selectedStar;
          
          beforeEach(function() {
            spyOn(RATING.fn, 'trigger').andCallThrough();
            selectedStar = elem.find('li[data-value="1"]');
            selectedStar.mouseover();
            elem.mouseleave();
          });
          
          it('should set the right classes on <li> elements', function(){
            stars.each(function() {
              var star = $(this);
              expect(star.is('.kiui-rating-star-empty')).toBeTruthy();
              expect(star.is('.kiui-rating-star-full')).toBeFalsy();
            });
          });
          
          it('should trigger the mouseleave event', function() {
            expect(rating.trigger.mostRecentCall.args[0]).toBe('mouseleave');
          });
          
        });
        
        describe('clicking on a <li>', function() {
          
          var selectedStar;
          
          beforeEach(function() {
            spyOn(RATING.fn, 'trigger').andCallThrough();
            spyOn(RATING.fn, 'value').andCallThrough();
            selectedStar = elem.find('li[data-value="1"]');
            selectedStar.click();
          });
          
          it('should call value() passing the selected value', function() {
            expect(rating.value.calls.length).toBe(1);
            expect(rating.value).toHaveBeenCalledWith(1);
          });
          
          it('should set the current rating value', function() {
            expect(rating.value()).toBe(1);
          });
          
          it('should trigger the select event passing the right values', function() {
            var arg;
            
            expect(rating.trigger.calls[0].args[0]).toBe('select');
            
            arg = rating.trigger.calls[0].args[1];
            
            expect($(arg.item).is(selectedStar)).toBeTruthy();
            expect(arg.value).toBe(1);
          });
          
          it('should trigger the change event', function() {
            expect(rating.trigger.mostRecentCall.args[0]).toBe('change');
          });
          
        });
        
        describe('readonly()', function() {
          
          it('called without parameters, should set readonly css class on the rating element', function() {
            rating.readonly();
            
            expect(elem.is('.kiui-state-readonly')).toBeTruthy();
          });
          
          it('called with "true" parameter, should set readonly css class on the rating element', function() {
            rating.readonly(true);
            
            expect(elem.is('.kiui-state-readonly')).toBeTruthy();
          });
          
          it('called with "false" parameter, should remove readonly css class from the rating element', function() {
            rating.readonly(false);
            
            expect(elem.is('.kiui-state-readonly')).toBeFalsy();
          });
          
        });
        
      });
      
      describe('with "value" option', function() {
        
        var rating;
          
        beforeEach(function() {
          spyOn(RATING.fn, 'value').andCallThrough();
          rating = new kiui.Rating(elem, { value: 1 });
        });
        
        afterEach(function() {
          rating.destroy();
          rating = undefined;
        });
        
        it('should call value() passing the specified value', function() {
          expect(rating.value.calls.length).toBe(1);
          expect(rating.value).toHaveBeenCalledWith(1);
        });
        
      });
      
      describe('with "starEmptyClass" option', function() {
        
        var rating;
          
        beforeEach(function() {
          rating = new kiui.Rating(elem, { starEmptyClass: "newEmptyClass" });
        });
        
        afterEach(function() {
          rating.destroy();
          rating = undefined;
        });
        
        it('should set the specified class on the <li> elements', function() {
          stars.each(function() {
            var star = $(this);
            expect(star.is('.newEmptyClass')).toBeTruthy();
          });
        });
        
        it('should use the specified class to indicate an empty star', function() {
          rating.value(1);
          
          expect(stars.filter('[data-value="2"]').is('.newEmptyClass')).toBeTruthy();
        });
        
      });
      
      describe('with "starFullClass" option', function() {
        
        var rating;
          
        beforeEach(function() {
          rating = new kiui.Rating(elem, { starFullClass: "newFullClass" });
        });
        
        afterEach(function() {
          rating.destroy();
          rating = undefined;
        });
        
        it('should use the specified class to indicate a full star', function() {
          rating.value(1);
          
          expect(stars.filter('[data-value="1"]').is('.newFullClass')).toBeTruthy();
        });
        
      });
      
      describe('with "readonly" option', function() {
        
        var rating;
          
        beforeEach(function() {
          rating = new kiui.Rating(elem, { readonly: true });
        });
        
        afterEach(function() {
          rating.destroy();
          rating = undefined;
        });
        
        it('should add readonly css class to the rating element', function() {
          expect(elem.is('.kiui-state-readonly')).toBeTruthy();
        });
        
        // TODO
        
      });
      
    });
    
    describe('destroy()', function() {
      
      var rating,
        WIDGET = kendo.ui.Widget;
        
      beforeEach(function() {
        spyOn(WIDGET.fn, 'destroy').andCallThrough();
      
        rating = new kiui.Rating(elem, {});
        rating.destroy();
      });
      
      afterEach(function() {
        rating = undefined;
      });
        
      it('should call Widget destroy()', function() {
        expect(WIDGET.fn.destroy.calls.length).toEqual(1);
      });
      
      xit('should detach all event handlers', function() {
        triggerEl.click();
          
        expect(popup.toggle.calls.length).toBe(0);
      });
      
    });
    
  });
  
});
