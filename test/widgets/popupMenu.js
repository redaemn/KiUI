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
    elem = $('<div><a><span></span></a><ul></ul></div>').appendTo('body');
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
        expect(kendo.ui.Menu.mostRecentCall.args[1]).toEqual({ orientation: 'vertical' });
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
    
    describe('with "menuOptions" option', function() {
    
      var popup,
        menuOptions;
        
      beforeEach(function() {
        menuOptions = { orientation: 'custom', myCustomOptions: true };
        
        popup = new kiui.PopupMenu(elem, {
          menuOptions: menuOptions
        });
      });
      
      afterEach(function() {
        popup.destroy();
        popup = menuOptions = undefined;
      });
      
      it('should create a kendoMenu using the menu DOM element and passing custom menuOptions', function() {
        expect(kendo.ui.Menu.calls.length).toBe(1);
        expect(kendo.ui.Menu.mostRecentCall.args[0].is(menuEl)).toBe(true);
        expect(kendo.ui.Menu.mostRecentCall.args[1]).toEqual(menuOptions);
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
    
    it('should slide open the menu', function() {
      expect(popup._menuEl.slideToggle).toHaveBeenCalled();
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
    
    it('should slide close the menu', function() {
      expect(popup._menuEl.slideToggle.calls.length).toBe(2);
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
