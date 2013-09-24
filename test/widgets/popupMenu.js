describe('widgets popupMenu:', function() {

  var elem,
    triggerEl,
    menuEl,
    POPUP = kiui.PopupMenu,
    MenuFake = function() {
      return  jasmine.createSpyObj('kendoMenu', [
        'destroy',
        'bind'
      ]);
    };
  
  beforeEach(function() {
    elem = $('<div><a><span></span></a><ul><li></li></ul></div>').appendTo('body');
    triggerEl = elem.children('a');
    menuEl = elem.children('ul');
    spyOn(kendo.ui, 'Menu').andCallFake(MenuFake);
  });
  
  afterEach(function() {
    elem.remove();
    elem = triggerEl = menuEl = undefined;
    $(document).off('click');
  });
  
  it('should be a kiui class', function() {
    expect(kiui.PopupMenu).toEqual(jasmine.any(Function));
  });

  describe('init()', function() {
    
    describe('with no options', function() {
    
      var popup,
        WIDGET = kendo.ui.Widget;
        
      beforeEach(function() {
        spyOn(WIDGET.fn, 'init').andCallThrough();
        spyOn(POPUP.fn, 'toggle').andCallThrough();
        
        popup = new kiui.PopupMenu(elem, {});
      });
      
      afterEach(function() {
        popup.destroy();
        popup = undefined;
      });
      
      it('should call Widget init()', function() {
        expect(WIDGET.fn.init.calls.length).toEqual(1);
      });
      
      it('should set the right classes on DOM element', function() {
        expect(elem.is('.kiui-popup-menu')).toBeTruthy();
      });
      
      it('should set the right classes on trigger element', function() {
        expect(triggerEl.is('.kiui-popup-menu-trigger')).toBeTruthy();
      });
      
      it('should set the right classes on menu element', function() {
        expect(menuEl.is('.kiui-popup-menu-menu')).toBeTruthy();
      });
      
      it('should create a kendoMenu using the menu DOM element and passing default options', function() {
        expect(kendo.ui.Menu.calls.length).toBe(1);
        expect(kendo.ui.Menu.mostRecentCall.args[0].is(menuEl)).toBe(true);
        expect(kendo.ui.Menu.mostRecentCall.args[1]).toEqual({
          orientation: 'vertical',
          animation: {
            open: {
              effects: "expand"
            }
          }
        });
      });
      
      it('should attach click handler to trigger element', function() {
        triggerEl.click();
        
        expect(popup.toggle.calls.length).toBe(1);
      });
        
      function findCallByEventName(eventName) {
        return function(call) {
          return call.args[0] === eventName;
        };
      }
    
      ['open', 'close', 'select'].forEach(function(eventName) {
    
        it('should bind to menu ' + eventName + ' event', function() {
          spyOn(POPUP.fn, 'trigger').andReturn(false);
        
          expect(popup.menu.bind.calls.some(findCallByEventName(eventName))).toBeTruthy();
        });
    
        it('should bind to menu ' + eventName + ' event with a function that triggers the popup ' + eventName + ' event', function() {
          var boundFunction = function() {},
            param = { item: 'eventItem' };
            
          spyOn(POPUP.fn, 'trigger').andReturn(false);
            
          popup.menu.bind.calls.forEach(function(call) {
            if (call.args[0] === eventName) {
              boundFunction = call.args[1];
            }
          });
      
          boundFunction(param);
      
          expect(popup.trigger.calls.length).toBe(1);
          expect(popup.trigger.mostRecentCall.args[0]).toBe(eventName);
          expect(popup.trigger.mostRecentCall.args[1]).toEqual(param);
        });
    
        if (eventName !== 'select') {
        
          it('should cancel the popup ' + eventName + ' event if the menu ' + eventName + ' event was cancelled', function() {
            var boundFunction = function() {},
              eventObj = jasmine.createSpyObj('eventObj', ['preventDefault']);
              
            spyOn(POPUP.fn, 'trigger').andReturn(true);
            
            popup.menu.bind.calls.forEach(function(call) {
              if (call.args[0] === eventName) {
                boundFunction = call.args[1];
              }
            });
        
            boundFunction(eventObj);
      
            expect(eventObj.preventDefault).toHaveBeenCalled();
          });
          
        }
      
      });
    
    });
    
    describe('with "openOnHover" option', function() {
    
      var popup,
        TIMER_DELAY = 200;
        
      beforeEach(function() {
        spyOn(POPUP.fn, 'toggle').andCallThrough();
        spyOn(POPUP.fn, 'open').andCallThrough();
        spyOn(POPUP.fn, 'close').andCallThrough();
        jasmine.Clock.useMock();
      
        popup = new kiui.PopupMenu(elem, {
          openOnHover: true
        });
      });
      
      afterEach(function() {
        popup.destroy();
        popup = undefined;
      });
      
      it('should not attach click handler to trigger element', function() {
        triggerEl.click();
        
        expect(popup.toggle.calls.length).toBe(0);
      });
      
      it('should open() menu when mouseenter occurs', function() {
        expect(popup.open.calls.length).toBe(0);
        
        elem.mouseenter();
        jasmine.Clock.tick(TIMER_DELAY + 1);
      
        expect(popup.open.calls.length).toBe(1);
      });
      
      it('should not open() menu when mouseleave occurs right after mouseenter', function() {
        expect(popup.open.calls.length).toBe(0);
        
        elem.mouseenter();
        elem.mouseleave();
        jasmine.Clock.tick(TIMER_DELAY + 1);
      
        expect(popup.open.calls.length).toBe(0);
      });
      
      it('should close() menu when mouseleave occurs after the menu opened', function() {
        elem.mouseenter();
        jasmine.Clock.tick(TIMER_DELAY + 1);
        expect(popup.close.calls.length).toBe(0);
        
        elem.mouseleave();
        jasmine.Clock.tick(TIMER_DELAY + 1);
      
        expect(popup.close.calls.length).toBe(1);
      });
      
      it("should not close() menu when it's open and mouseenter occurs right after mouseleave", function() {
        elem.mouseenter();
        jasmine.Clock.tick(TIMER_DELAY + 1);
        expect(popup.close.calls.length).toBe(0);
        
        elem.mouseleave();
        elem.mouseenter();
        jasmine.Clock.tick(TIMER_DELAY + 1);
      
        expect(popup.close.calls.length).toBe(0);
      });
      
      it("should continue to open() the menu on mouseenter after it was opened and closed before", function() {
        expect(popup.open.calls.length).toBe(0);
        elem.mouseenter();
        jasmine.Clock.tick(TIMER_DELAY + 1);
        expect(popup.open.calls.length).toBe(1);
        elem.mouseleave();
        jasmine.Clock.tick(TIMER_DELAY + 1);
        expect(popup.open.calls.length).toBe(1);
        
        elem.mouseenter();
        jasmine.Clock.tick(TIMER_DELAY + 1);
        
        expect(popup.open.calls.length).toBe(2);
      });
      
      it('should close() the menu only once when clicking on an item', function() {
        expect(popup.close.calls.length).toBe(0);
        elem.mouseenter();
        jasmine.Clock.tick(TIMER_DELAY + 1);
        
        menuEl.find('li').click();
        
        expect(popup.close.calls.length).toBe(1);
      });
      
      it('should not open() the menu again when clicking on an item', function() {
        expect(popup.open.calls.length).toBe(0);
        elem.mouseenter();
        jasmine.Clock.tick(TIMER_DELAY + 1);
        expect(popup.open.calls.length).toBe(1);
        
        menuEl.find('li').click();
        
        expect(popup.open.calls.length).toBe(1);
      });
    
    });
    
    describe('with "animation" option', function() {
    
      var popup;
       
      describe('"fade"', function() {
        
        beforeEach(function() {
          popup = new kiui.PopupMenu(elem, {
            animation: 'fade'
          });
          
          spyOn(popup._menuEl, 'fadeToggle').andCallThrough();
        });
      
        afterEach(function() {
          popup.destroy();
          popup = undefined;
        });
        
        it('should create menu widget passing the right options', function() {
          expect(kendo.ui.Menu.mostRecentCall.args[1]).toEqual({
            orientation: 'vertical',
            animation: {
              open: {
                effects: "fadeIn"
              }
            }
          });
        });
        
        describe('open()', function() {
        
          beforeEach(function() {
            popup.open();
          });
      
          it('should open the menu with "fade" animation', function() {
            expect(popup._menuEl.fadeToggle.calls.length).toBe(1);
            expect(popup._menuEl.fadeToggle.calls[0].args[0]).toBe(200);
          });
        
        });
        
        describe('close()', function() {
        
          beforeEach(function() {
            popup.open();
            popup.close();
          });
      
          it('should close the menu with "fade" animation', function() {
            expect(popup._menuEl.fadeToggle.calls.length).toBe(2);
            expect(popup._menuEl.fadeToggle.mostRecentCall.args[0]).toBe(100);
          });
        
        });
      
      });
      
      describe('"none"', function() {
        
        beforeEach(function() {
          popup = new kiui.PopupMenu(elem, {
            animation: 'none'
          });
          
          spyOn(popup._menuEl, 'toggle').andCallThrough();
        });
      
        afterEach(function() {
          popup.destroy();
          popup = undefined;
        });
        
        it('should create menu widget passing the right options', function() {
          expect(kendo.ui.Menu.mostRecentCall.args[1]).toEqual({
            orientation: 'vertical',
            animation: false
          });
        });
        
        describe('open()', function() {
        
          beforeEach(function() {
            popup.open();
          });
      
          it('should open the menu with no animation', function() {
            expect(popup._menuEl.toggle.calls.length).toBe(1);
            expect(popup._menuEl.toggle.calls[0].args[0]).toBe(0);
          });
        
        });
        
        describe('close()', function() {
        
          beforeEach(function() {
            popup.open();
            popup.close();
          });
      
          it('should close the menu with no animation', function() {
            expect(popup._menuEl.toggle.calls.length).toBe(2);
            expect(popup._menuEl.toggle.mostRecentCall.args[0]).toBe(0);
          });
        
        });
      
      });
      
    });
    
    describe('with "direction" option', function() {
    
      var popup;
       
      describe('"top *"', function() {
        
        beforeEach(function() {
          popup = new kiui.PopupMenu(elem, {
            direction: 'top right'
          });
        });
      
        afterEach(function() {
          popup.destroy();
          popup = undefined;
        });
        
        it('should set "kiui-position-top" class on DOM element', function() {
          expect(elem.is('.kiui-position-top')).toBeTruthy();
        });
      
      });
      
      describe('"* left"', function() {
        
        beforeEach(function() {
          popup = new kiui.PopupMenu(elem, {
            direction: 'bottom left'
          });
        });
      
        afterEach(function() {
          popup.destroy();
          popup = undefined;
        });
        
        it('should create a kendoMenu passing the correct direction option', function() {
          expect(kendo.ui.Menu.calls.length).toBe(1);
          expect(kendo.ui.Menu.mostRecentCall.args[1].direction).toEqual('left');
        });
        
        it('should set "kiui-position-left" class on DOM element', function() {
          expect(elem.is('.kiui-position-left')).toBeTruthy();
        });
      
      });
      
    });
    
    describe('with "dataSource" option', function() {
    
      var popup,
        dataSource = [
          {
            text: "Custom menu"
          }
        ];
        
      beforeEach(function() {
        popup = new kiui.PopupMenu(elem, {
          dataSource: dataSource
        });
      });
    
      afterEach(function() {
        popup.destroy();
        popup = undefined;
      });
      
      it('should create a kendoMenu passing the correct dataSource option', function() {
          expect(kendo.ui.Menu.calls.length).toBe(1);
          expect(kendo.ui.Menu.mostRecentCall.args[1].dataSource).toEqual(dataSource);
        });
      
    });
    
  });
  
  describe('toggle()', function() {
  
    var popup;
        
    beforeEach(function() {
      spyOn(POPUP.fn, 'close').andCallThrough();
      spyOn(POPUP.fn, 'open').andCallThrough();
    
      popup = new kiui.PopupMenu(elem, {});
    });
    
    afterEach(function() {
      popup.destroy();
      popup = undefined;
    });
    
    it('should call close() if popup is open', function() {
      popup.open();
      
      popup.toggle();
      
      expect(popup.close.calls.length).toBe(1);
    });
    
    it('should call open() if popup is closed', function() {
      popup.close();
      
      popup.toggle();
      
      expect(popup.open.calls.length).toBe(1);
    });
  
  });
  
  describe('open()', function() {
  
    var popup;
        
    beforeEach(function() {
      spyOn(POPUP.fn, 'close').andCallThrough();
      spyOn(POPUP.fn, 'trigger').andCallThrough();
    
      popup = new kiui.PopupMenu(elem, {});
      
      spyOn(popup._menuEl, 'slideToggle').andCallThrough();
      
      popup.open();
    });
    
    afterEach(function() {
      popup.destroy();
      popup = undefined;
    });
    
    it('should add kiui-state-open class to the DOM element', function() {
      expect(elem.is('.kiui-state-open')).toBeTruthy();
    });
    
    it('should open the menu with "expand" animation', function() {
      expect(popup._menuEl.slideToggle.calls.length).toBe(1);
      expect(popup._menuEl.slideToggle.calls[0].args[0]).toBe(200);
    });
    
    it('should not open the menu when it is yet open', function() {
      popup.open();
    
      expect(popup._menuEl.slideToggle.calls.length).toBe(1);
    });
    
    it('should attach a handler to automatically close the menu when clicking everywhere on the document', function() {
      $('body').click();
      
      expect(popup.close).toHaveBeenCalled();
    });
    
    it('should attach only once the handler to automatically close the menu', function() {
      popup.close();
      popup.open();
      
      $('body').click();
      
      expect(popup.close.calls.length).toBe(2);
    });
    
    it('should trigger open event', function() {
      expect(popup.trigger.mostRecentCall.args[0]).toBe('open');
    });
    
    it('should trigger the open event passing the trigger element', function() {
      expect($(popup.trigger.mostRecentCall.args[1].item).is(triggerEl)).toBeTruthy();
    });
    
    it('should not trigger open event if the menu is yet open', function() {
      popup.open();
    
      expect(popup.trigger.calls.length).toBe(1);
    });
    
    it('should not open the menu if the event is cancelled', function() {
      popup.close();
      popup.bind('open', function(e) {
        e.preventDefault();
      });
      popup.open();
      
      expect(popup._menuEl.slideToggle.calls.length).toBe(2);
    });
  
  });
  
  describe('automatic menu close handler', function() {
  
    var popup;
        
    beforeEach(function() {
      spyOn(POPUP.fn, 'close').andCallThrough();
    
      popup = new kiui.PopupMenu(elem, {});
      
      popup.open();
    });
    
    afterEach(function() {
      popup.destroy();
      popup = undefined;
    });
    
    it('should automatically detach itself after the first execution', function() {
      $('body').click();
      $('body').click();
      
      expect(popup.close.calls.length).toBe(1);
    });
    
    it('should not detach itself if close event was cancelled', function() {
      popup.bind('close', function(e) {
        e.preventDefault();
      });
      
      $('body').click();
      $('body').click();
      
      expect(popup.close.calls.length).toBe(2);
    });
    
    it('should not close the menu if the trigger is clicked', function() {
      triggerEl.click();
      
      expect(popup.close.calls.length).toBe(1);
    });
    
    it("should not close the menu if one of trigger's children is clicked", function() {
      triggerEl.find('span').click();
      
      expect(popup.close.calls.length).toBe(1);
    });
  
  });
  
  describe('close()', function() {
  
    var popup;
        
    beforeEach(function() {
      spyOn(POPUP.fn, 'open').andCallThrough();
      spyOn(POPUP.fn, 'trigger').andCallThrough();
    
      popup = new kiui.PopupMenu(elem, {});
      
      spyOn(popup._menuEl, 'slideToggle').andCallThrough();
      
      popup.open();
      popup.close();
    });
    
    afterEach(function() {
      popup.destroy();
      popup = undefined;
    });
    
    it('should remove kiui-state-open class from the DOM element', function() {
      expect(elem.is('.kiui-state-open')).toBeFalsy();
    });
    
    it('should close the menu with "expand" animation', function() {
      expect(popup._menuEl.slideToggle.calls.length).toBe(2);
      expect(popup._menuEl.slideToggle.mostRecentCall.args[0]).toBe(100);
    });
    
    it('should not close the menu when it is yet closed', function() {
      popup.close();
    
      expect(popup._menuEl.slideToggle.calls.length).toBe(2);
    });
    
    it('should trigger close event', function() {
      expect(popup.trigger.mostRecentCall.args[0]).toBe('close');
    });
    
    it('should trigger the close event passing the trigger element', function() {
      expect($(popup.trigger.mostRecentCall.args[1].item).is(triggerEl)).toBeTruthy();
    });
    
    it('should not trigger open event if the menu is yet closed', function() {
      popup.close();
    
      expect(popup.trigger.calls.length).toBe(2);
    });
    
    it('should not open the menu if the event is cancelled', function() {
      popup.open();
      popup.bind('close', function(e) {
        e.preventDefault();
      });
      popup.close();
      
      expect(popup._menuEl.slideToggle.calls.length).toBe(3);
    });
  
  });
  
  describe('destroy()', function() {
    
    var popup,
      WIDGET = kendo.ui.Widget;
      
    beforeEach(function() {
      spyOn(WIDGET.fn, 'destroy').andCallThrough();
      spyOn(POPUP.fn, 'toggle').andCallThrough();
    
      popup = new kiui.PopupMenu(elem, {});
      popup.destroy();
    });
    
    afterEach(function() {
      popup = undefined;
    });
      
    it('should call Widget destroy()', function() {
      expect(WIDGET.fn.destroy.calls.length).toEqual(1);
    });
    
    it('should detach click handler from trigger element', function() {
      triggerEl.click();
        
      expect(popup.toggle.calls.length).toBe(0);
    });
    
    it('should call destroy() on the kendoMenu', function() {
      expect(popup.menu.destroy.calls.length).toBe(1);
    });
    
  });

});
