describe('utility notify:', function() {

  describe('notify() with no options', function() {
  
    var notifier;
    
    beforeEach(function() {
      notifier = kiui.notify();
    });
    
    afterEach(function() {
      notifier.destroy();
      notifier = undefined;
    });
  
    it('should return a notify wrapper', function() {
      expect(notifier).toEqual(jasmine.any(Object));
      expect(Object.keys(notifier).length).toBe(2);
      expect(notifier.destroy).toEqual(jasmine.any(Function));
      expect(notifier.error).toEqual(jasmine.any(Function));
    });
    
    it('should attach a .kiui-notify DOM element to the body', function() {
      expect($('.kiui-notify').length).toBe(1);
      expect($('body > .kiui-notify').length).toBe(1);
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
    
      it('should delete the old .kiui-notify DOM element and attach a new one to the body', function() {
        expect($('.kiui-notify').length).toBe(1);
        expect($('body > .kiui-notify').length).toBe(1);
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
        expect($('body > .kiui-notify').length).toBe(1);
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
      notifier = undefined;
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
      notifier = undefined;
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
    var container = function() {
      return wrapper.find('.kiui-notify-container.kiui-notify-error');
    };
    var content = function(containerElem) {
      if (!containerElem) {
        containerElem = container();
      }
      return containerElem.find('.kiui-notify-content');
    };
    var closeButton = function() {
      return container().find('.kiui-notify-close');
    };

    beforeEach(function() {
      notifier = kiui.notify({
        position: "top-right"
      });
      wrapper = $('.kiui-notify');
    });
  
    afterEach(function() {
      notifier.destroy();
      notifier = wrapper = undefined;
    });
    
    describe('basics:', function() {
    
      beforeEach(function() {
        notifier.error("this is an error");
      });
  
      it('should create an error container', function() {
        expect(container().length).toBe(1);
      });
      
      it('should add text content to the container', function() {
        expect(content().length).toBe(1);
        expect(content().html()).toBe("this is an error");
      });
    
      describe('called a second time', function() {
    
        beforeEach(function() {
          notifier.error("this is another error");
        });
    
        it('should create a new container', function() { 
          expect(container().length).toBe(2);
        });
      
        it('should add the new error to the new container', function() {
          expect(content(container().last()).length).toBe(1);
          expect(content(container().last()).html()).toBe("this is another error");
        });
      
      });
      
      describe('clicking close button', function() {
      
        it('should delete the container', function() {
          runs(function() {
            closeButton().click();
          });
          
          waitsFor(function() {
            return container().length === 0;
          }, "Container should have been removed", 3000);
          
          runs(function() {
            expect(container().length).toBe(0);
          });
        });
      
      });
      
    });

    describe('with html string parameter', function() {
    
      beforeEach(function() {
        notifier.error("this is <strong>HTML</strong> content");
      });
    
      it('should add html content to the container', function() {
        expect(content().length).toBe(1);
        expect(content().html()).toBe("this is <strong>HTML</strong> content");
      });
    
    });
  
    describe('with object parameter:', function() {
      
      describe('html option', function() {
        
        beforeEach(function() {
          notifier.error({
            html: "html option content"
          });
        });
        
        it('should add content to the container', function() {
          expect(content().length).toBe(1);
          expect(content().html()).toBe("html option content");
        });
        
      });
      
      describe('invalid html option', function() {
        it('should throw', function() {
          var notification = function() {
            notifier.error({
              html: 42
            });
          };
          
          expect(notification).toThrow("Invalid html option");
        });
      });
      
      describe('empty string html option', function() {
        it('should throw', function() {
          var notification = function() {
            notifier.error({
              html: ""
            });
          };
          
          expect(notification).toThrow("Invalid html option");
        });
      });
      
      describe('autoHide option', function() {
      
        beforeEach(function() {
          jasmine.Clock.useMock();
          notifier.error({
            html: "error with autoHide",
            autoHide: 2000
          });
        });
        
        it('should hide notification after the right time', function() {
          runs(function() {
            jasmine.Clock.tick(2000);
          });
          
          waitsFor(function() {
            return container().length === 0;
          }, "Container should have been removed", 3000);
          
          runs(function() {
            expect(container().length).toBe(0);
          });
        });
        
        // FIXME: don't know how to test this...
        
//         it('should do nothing if notification was previously closed', function() {
//           runs(function() {
//             closeButton().click();
//           });
//           
//           waitsFor(function() {
//             return container().length === 0;
//           }, "Container should have been removed", 3000);
//           
//           runs(function() {
//             expect(container().length).toBe(0);
//             jasmine.Clock.tick(2000);
//           });
//         });
      
      });
      
      describe('invalid autoHide option', function() {
      
        beforeEach(function() {
          jasmine.Clock.useMock();
          notifier.error({
            html: "error with autoHide",
            autoHide: "invalid option"
          });
        });
        
        it('should not hide notification automatically', function() {
          runs(function() {
            jasmine.Clock.tick(1000 * 60 * 60 * 24); // tick clock one day ahead
          });
          
          var now = new Date();
          
          waitsFor(function() {
            return (new Date()) - now >= 3000; // wait for 3 seconds
          }, "Container should have been removed", 4000);
          
          runs(function() {
            expect(container().length).toBe(1);
          });
        });
      
      });
      
      describe('append option', function() {
      
        beforeEach(function() {
          notifier.error({
            html: "first error"
          });
          notifier.error({
            html: "second error",
            append: true
          });
        });
        
        it('should not create a second container', function() {
          expect(container().length).toBe(1);
        });
        
        it('should append content to the existing container', function() {
          expect(content().html()).toBe("first errorsecond error");
        });
      
      });
      
      describe('append option with no previous notification', function() {
      
        beforeEach(function() {
          notifier.error({
            html: "first error",
            append: true
          });
        });
        
        it('should create a container', function() {
          expect(container().length).toBe(1);
        });
        
        it('should set container content', function() {
          expect(content().html()).toBe("first error");
        });
      
      });
      
    });
  
    describe ('with invalid options parameter', function() {
  
      it('should throw', function() {
        var functionParameter = function() {
          notifier.error(function() {
            var a = 1;
            return a++;
          });
        };
        
        var numberParameter = function() {
          notifier.error(42);
        };
        
        expect(functionParameter).toThrow("Invalid options object");
        expect(numberParameter).toThrow("Invalid options object");
      });
  
    });
  
  });
  
  // append when no previous notify exists
  
  // autohide when appending

});
