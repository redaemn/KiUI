describe('utility notifier:', function() {

  xdescribe('notifier() with no options', function() {
  
    var notifier;
    
    beforeEach(function() {
      notifier = kiui.notifier();
    });
    
    afterEach(function() {
      notifier.destroy();
      notifier = undefined;
    });
  
    it('should return a Notifier', function() {
      expect(notifier).toEqual(jasmine.any(kiui.Notifier));
    });
    
    it('should append a .kiui-notify DOM element to the body', function() {
      expect($('.kiui-notify').length).toBe(1);
      expect($('body > .kiui-notify').length).toBe(1);
    });
    
    describe('called after a destroy()', function() {
    
      beforeEach(function() {
        notifier.destroy();
        notifier.isTheSameOldOne = true;
        notifier = kiui.notifier();
      });
  
      it('should return a new Notifier', function() {
        expect(notifier).toEqual(jasmine.any(kiui.Notifier));
        expect(notifier.isTheSameOldOne).toBeFalsy();
      });
    
      it('should delete the old .kiui-notify DOM element and append a new one to the body', function() {
        expect($('.kiui-notify').length).toBe(1);
        expect($('body > .kiui-notify').length).toBe(1);
      });
    
    });
    
    describe('called two consecutive times', function() {
    
      beforeEach(function() {
        notifier.isTheSameOldOne = true;
        notifier = kiui.notifier();
      });
  
      it('should return the same Notifier', function() {
        expect(notifier).toEqual(jasmine.any(kiui.Notifier));
        expect(notifier.isTheSameOldOne).toBeTruthy();
      });
    
      it('should not create a new .kiui-notify DOM element', function() {
        expect($('.kiui-notify').length).toBe(1);
        expect($('body > .kiui-notify').length).toBe(1);
      });
    
    });
  
  });
  
  xdescribe('destroy()', function() {
  
    var notifier;
    
    beforeEach(function() {
      notifier = kiui.notifier();
      notifier.destroy();
    });
  
    it('should remove the .kiui-notify DOM element', function() {
      expect($('.kiui-notify').length).toBe(0);
    });
  
  });
  
  /*xdescribe('notifier() with "top-left" position', function() {
    
    var notifier;
    
    beforeEach(function() {
      notifier = kiui.notifier({
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
    
  });*/
  
  /*xdescribe('notifier() with invalid position', function() {
    
    var notifier;
    
    beforeEach(function() {
      notifier = kiui.notifier({
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
    
  });*/

  xdescribe('error()', function() {
  
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
      notifier = kiui.notifier({
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
      
        var notification, called = false;
        
        beforeEach(function() {
          notification = container().data('kendoKiuiNotification');
          spyOn(notification, 'hide').andCallFake(function() {
            called = true;
          });
        });
        
        afterEach(function() {
          notification = undefined;
        });
      
        it('should call hide() on Notification', function() {
          runs(function() {
            closeButton().click();
          });
          
          waitsFor(function() {
            return called;
          }, "hide() to be called", 3000);
          
          runs(function() {
            expect(notification.hide).toHaveBeenCalled();
          });
        });
      
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

    xdescribe('with html string parameter', function() {
    
      beforeEach(function() {
        notifier.error("this is <strong>HTML</strong> content");
      });
    
      it('should add html content to the container', function() {
        expect(content().length).toBe(1);
        expect(content().html()).toBe("this is <strong>HTML</strong> content");
      });
    
    });
  
    describe('with object parameter:', function() {
      
      xdescribe('html option', function() {
        
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
      
      xdescribe('invalid html option', function() {
        it('should throw', function() {
          var notification = function() {
            notifier.error({
              html: 42
            });
          };
          
          expect(notification).toThrow("Invalid html option");
        });
      });
      
      xdescribe('empty string html option', function() {
        it('should throw', function() {
          var notification = function() {
            notifier.error({
              html: ""
            });
          };
          
          expect(notification).toThrow("Invalid html option");
        });
      });
      
      xdescribe('autoHide option', function() {
      
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
      
      xdescribe('invalid autoHide option', function() {
      
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
      
      xdescribe('append option', function() {
      
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
      
      xdescribe('append option with no previous notification', function() {
      
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
  
    xdescribe ('with invalid options parameter', function() {
  
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
  
  
  var NotificationFake = function() {
    return jasmine.createSpyObj('Notification', [
      'destroy',
      'bind',
      'addHtml',
      'show',
      'height',
      'setPosition'
    ]);
  };
  
  describe('Notifier', function() {
  
    var elem,
      notifications,
      NOTIFICATION_TYPES = ['error', 'info', 'success'];
      
    beforeEach(function() {
      elem = $('<div>').appendTo('body');
      
      notifications = [];
      spyOn(kiui, 'Notification').andCallFake(function() {
        var spy = NotificationFake();
        notifications.push(spy);
        return spy;
      });
    });
    
    afterEach(function() {
      elem.remove();
      elem = notifications = undefined;
    });
  
    it('should be a kiui class', function() {
      expect(kiui.Notifier).toEqual(jasmine.any(Function));
    });
    
    describe('init()', function() {
      
      describe('with no options', function() {

        var notifier,
          WIDGET = kendo.ui.Widget;
        
        beforeEach(function() {
          spyOn(WIDGET.fn, 'init').andCallThrough();
          
          notifier = new kiui.Notifier(elem, {});
        });
        
        afterEach(function() {
          notifier.destroy();
          notifier = undefined;
        });
        
        it('should call Widget init()', function() {
          expect(WIDGET.fn.init.calls.length).toEqual(1);
        });
        
        it('should set the right classes on DOM element', function() {
          expect(elem.is('.kiui-position-top.kiui-position-right')).toBeTruthy();
        });
        
        it('on window resize should call setPosition on every notification', function() {
          notifier.error('first error');
          notifier.error('second error');
          notifier.error('third error');
        
          $(window).resize();
          
          expect(notifications[0].setPosition.calls.length).toEqual(4);
          expect(notifications[1].setPosition.calls.length).toEqual(3);
          expect(notifications[2].setPosition.calls.length).toEqual(2);
        });
        
      });
      
      describe('with valid position option', function() {
        var notifier;
        
        beforeEach(function() {
          notifier = new kiui.Notifier(elem, {
            position: 'bottom-left'
          });
        });
        
        afterEach(function() {
          notifier.destroy();
          notifier = undefined;
        });
        
        it('should set the right classes on DOM element', function() {
          expect(elem.is('.kiui-position-bottom.kiui-position-left')).toBeTruthy();
        });
      });
      
      describe('with invalid position option', function() {
        
        var notifier;
        
        beforeEach(function() {
          notifier = new kiui.Notifier(elem, {
            position: 'invalid-position'
          });
        });
        
        afterEach(function() {
          notifier.destroy();
          notifier = undefined;
        });
        
        it('should set the right classes on DOM element', function() {
          expect(elem.is('.kiui-position-top.kiui-position-right')).toBeTruthy();
        });
        
      });
      
    });
    
    describe('destroy()', function() {
      
      var notifier,
        WIDGET = kendo.ui.Widget;
        
        beforeEach(function() {
          spyOn(WIDGET.fn, 'destroy').andCallThrough();
          spyOn(kiui.Notifier.fn, 'trigger').andCallThrough();
          
          notifier = new kiui.Notifier(elem, {});
          notifier.error('first error');
          notifier.error('second error');
          notifier.destroy();
        });
        
        afterEach(function() {
          notifier = undefined;
        });
        
        it('should call Widget destroy()', function() {
          expect(WIDGET.fn.destroy.calls.length).toEqual(1);
        });
        
        it('should detach resize handler from window object', function() {
          $(window).resize();
          
          expect(notifications[0].setPosition.calls.length).toEqual(2);
          expect(notifications[1].setPosition.calls.length).toEqual(1);
        });
        
        it('should call destroy() on every existing notification', function() {
          expect(notifications.length).toBe(2);
          $.each(notifications, function(idx, notification) {
            expect(notification.destroy).toHaveBeenCalled();
          });
        });
        
        it('should trigger "destroy" event', function() {
          expect(notifier.trigger.calls.length).toEqual(1);
        });
      
    });
    
    $.each(NOTIFICATION_TYPES, function(idx, notificationType) {
    
      describe(notificationType + '()', function() {
      
        var notifier;
        
        var container = function() {
          return elem.find('div.kiui-notify');
        };
      
        beforeEach(function() {
          notifier = new kiui.Notifier(elem, {});
        });
      
        afterEach(function() {
          notifier.destroy();
          notifier = undefined;
        });
      
        describe('with string parameter', function() {
        
          beforeEach(function() {
            notifier[notificationType]('43 is not the answer!');
          });
        
          it('should create a Notification passing the string as "html" option', function() {
            expect(kiui.Notification.calls.length).toBe(1);
            expect(kiui.Notification.mostRecentCall.args[1].html).toEqual('43 is not the answer!');
          });
        
        });
      
        describe('wth object parameter', function() {
      
          describe('basics:', function() {
      
            beforeEach(function() {
              notifier[notificationType]({
                html: '43 is not the answer!'
              });
            });
      
            it('should create a Notification passing the "notificationClass" option', function() {
              expect(kiui.Notification.calls.length).toBe(1);
              expect(kiui.Notification.mostRecentCall.args[1].notificationClass).toEqual('kiui-notify-' + notificationType);
            });
      
            it('should create a DOM element to contain the notification', function() {
              expect(elem.children().length).toEqual(1);
              expect(container().length).toEqual(1);
            });
        
            it('should show the Notification', function() {
              expect(notifications[0].show.calls.length).toEqual(1);
            });
        
            it('should call setPosition on both on existing notifications and on the new one', function() {
              notifier.error('this is an error!');
              
              expect(notifications[0].setPosition.calls.length).toEqual(2);
              expect(notifications[1].setPosition.calls.length).toEqual(1);
            });
          
          });
        
          describe('with html option', function() {
        
            beforeEach(function() {
              notifier[notificationType]({
                html: '43 is not the answer!'
              });
            });
        
            it('should create a Notification passing the options', function() {
              expect(kiui.Notification.calls.length).toBe(1);
              expect(kiui.Notification.mostRecentCall.args[1].html).toEqual('43 is not the answer!');
            });
        
          });
        
          describe('with autoHide option', function() {
        
            beforeEach(function() {
              notifier[notificationType]({
                html: '43 is not the answer!',
                autoHide: 2000
              });
            });
        
            it('should show the Notification passing the option', function() {
              expect(notifications[0].show.calls.length).toEqual(1);
              expect(notifications[0].show.mostRecentCall.args[0]).toEqual(2000);
            });
        
          });
        
          describe('with append option', function() {
        
            beforeEach(function() {
              notifier[notificationType]('this is an error!');
            
              notifier[notificationType]({
                html: '43 is not the answer!',
                append: true
              });
            });
        
            it('should not create a new Notification', function() {
              expect(kiui.Notification.calls.length).toBe(1);
              expect(notifications.length).toBe(1);
            });
      
            it('should create a new DOM element to contain the notification', function() {
              expect(elem.children().length).toEqual(1);
              expect(container().length).toEqual(1);
            });
        
            it('should add html to the Notification', function() {
              expect(notifications[0].addHtml.calls.length).toBe(1);
              expect(notifications[0].addHtml.mostRecentCall.args[0]).toEqual('43 is not the answer!');
            });
        
          });
      
        });
      
      });
    
    });
  
  });
  
  describe('Notifier integration with Notification:', function() {
  
    var elem,
      notifier,
      notifications,
      Notification = kiui.Notification;
      
    var container = function() {
      return elem.find('div.kiui-notify');
    };
      
    beforeEach(function() {
      elem = $('<div>').appendTo('body');
      
      notifications = [];
      spyOn(kiui, 'Notification').andCallFake(function(element, options) {
        var notification = new Notification(element, options);
        notifications.push(notification);
        return notification;
      });
      
      notifier = new kiui.Notifier(elem, {});
    });
    
    afterEach(function() {
      notifier.destroy();
      elem.remove();
      elem = notifier = notifications = undefined;
    });
    
    describe('destroying notification', function() {
    
      it('should remove notification DOM element', function() {
        notifier.error('43 is not the answer!');
        
        notifications[0].destroy();
      
        expect(elem.children().length).toEqual(0);
        expect(container().length).toEqual(0);
      });
    
    });
    
    describe('hiding notification', function() {
    
      it('should destroy notification', function() {
        notifier.error('43 is not the answer!');
        spyOn(notifications[0], 'trigger').andCallThrough();
        spyOn(notifications[0], 'destroy').andCallThrough();
        
        runs(function() {
          notifications[0].hide();
        });
        
        waitsFor(function() {
          var calls = notifications[0].trigger.calls.length,
            hideArgument = false;
            
          $.each(notifications[0].trigger.calls, function(idx, call) {
            if (call.args[0] == 'hide') {
              hideArgument = true;
              return false; // break loop
            }
          });
          
          return calls > 0 && hideArgument;
        }, '"hide" event should have been triggered', 6000);
        
        runs(function() {
          expect(notifications[0].destroy).toHaveBeenCalled();
        });
      });
    
    });
  
  });
  
  describe('Notification', function() {
  
    var elem,
      NOTIFICATION_TYPES = ['error', 'info', 'success'],
      NOTIFICATION = kiui.Notification;
      
    beforeEach(function() {
      elem = $('<div>').appendTo('body');
    });
    
    afterEach(function() {
      elem.remove();
      elem = undefined;
    });
  
    it('should be a kiui class', function() {
      expect(kiui.Notification).toEqual(jasmine.any(Function));
    });
  
    describe('init()', function() {
    
      describe('with no options', function() {

        var notification,
          WIDGET = kendo.ui.Widget;
        
        beforeEach(function() {
          spyOn(WIDGET.fn, 'init').andCallThrough();
          spyOn(NOTIFICATION.fn, 'hide').andCallThrough();
          spyOn(NOTIFICATION.fn, 'addHtml').andCallThrough();
          
          notification = new kiui.Notification(elem, {});
        });
        
        afterEach(function() {
          notification.destroy();
          notification = undefined;
        });
        
        it('should call Widget init()', function() {
          expect(WIDGET.fn.init.calls.length).toEqual(1);
        });
        
        it('should set the right classes on DOM element', function() {
          expect(elem.is('.kiui-notify-container.k-block')).toBeTruthy();
        });
        
        it('should append default notification template', function() {
          expect(elem.children().length).toBe(2);
          expect(elem.find('span.kiui-notify-close.k-icon.k-i-close').length).toBe(1);
          expect(elem.find('span.kiui-notify-content').length).toBe(1);
        });
        
        it('shold set default notification width', function() {
          expect(elem.width()).toBe(250);
        });
        
        it('should not call addHtml()', function() {
          expect(notification.addHtml.calls.length).toBe(0);
        });
        
        it('should attach click handler to close button', function() {
          var closeButton = elem.find(".kiui-notify-close");
          expect(closeButton.length).toBe(1);
          
          closeButton.click();
          
          expect(notification.hide.calls.length).toBe(1);
        });
        
      });
      
      describe('with "html" option', function() {
      
        var notification;
        
        beforeEach(function() {
          spyOn(NOTIFICATION.fn, 'addHtml').andCallThrough();
        
          notification = new kiui.Notification(elem, {
            html: '43 is not the answer!'
          });
        });
        
        afterEach(function() {
          notification.destroy();
          notification = undefined;
        });
        
        it('should call addHtml()', function() {
          expect(notification.addHtml.calls.length).toBe(1);
          expect(notification.addHtml.mostRecentCall.args[0]).toBe('43 is not the answer!');
        });
      
      });
      
      describe('with "notificationClass" option', function() {
      
        var notification;
        
        beforeEach(function() {
          notification = new kiui.Notification(elem, {
            notificationClass: 'testNotificationClass'
          });
        });
        
        afterEach(function() {
          notification.destroy();
          notification = undefined;
        });
        
        it('should set the class on DOM element', function() {
          expect(elem.is('.testNotificationClass')).toBeTruthy();
        });
      
      });
    
    });
        
    $.each(NOTIFICATION_TYPES, function(idx, notificationType) {
    
      describe('init() with kiui-notify-' + notificationType + ' "notificationClass" option', function() {
      
        var notification;
        
        beforeEach(function() {
          notification = new kiui.Notification(elem, {
            notificationClass: 'kiui-notify-' + notificationType
          });
        });
        
        afterEach(function() {
          notification.destroy();
          notification = undefined;
        });
        
        it('should set k-' + notificationType + '-colored class on DOM element', function() {
          expect(elem.is('.k-' + notificationType + '-colored')).toBeTruthy();
        });
      
      });
      
    });
    
    describe('destroy()', function() {
    
      var notification,
        WIDGET = kendo.ui.Widget;
        
      beforeEach(function() {
        spyOn(WIDGET.fn, 'destroy').andCallThrough();
        spyOn(NOTIFICATION.fn, 'hide').andCallThrough();
        spyOn(NOTIFICATION.fn, 'trigger').andCallThrough();
      
        notification = new kiui.Notification(elem, {});
        notification.destroy();
      });
      
      afterEach(function() {
        notification = undefined;
      });
        
      it('should call Widget destroy()', function() {
        expect(WIDGET.fn.destroy.calls.length).toEqual(1);
      });
      
      it('should detach click handler from close button', function() {
        var closeButton = elem.find(".kiui-notify-close");
        expect(closeButton.length).toBe(1);
        
        closeButton.click();
        
        expect(notification.hide.calls.length).toBe(0);
      });
      
      it('should trigger "destroy" event', function() {
        expect(notification.trigger.calls.length).toEqual(1);
      });
      
    });
  
  });

});
