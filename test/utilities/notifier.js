describe('utility notifier:', function() {

  describe('notifier() with no options', function() {
  
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
    
    it('should append a .kiui-notifier DOM element to the body', function() {
      expect($('.kiui-notifier').length).toBe(1);
      expect($('body > .kiui-notifier').length).toBe(1);
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
    
      it('should delete the old .kiui-notifier DOM element and append a new one to the body', function() {
        expect($('.kiui-notifier').length).toBe(1);
        expect($('body > .kiui-notifier').length).toBe(1);
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
    
      it('should not create a new .kiui-notifier DOM element', function() {
        expect($('.kiui-notifier').length).toBe(1);
        expect($('body > .kiui-notifier').length).toBe(1);
      });
    
    });
  
    describe('when destroyed', function() {
  
      beforeEach(function() {
        notifier.destroy();
      });
  
      it('should remove the .kiui-notifier DOM element', function() {
        expect($('.kiui-notifier').length).toBe(0);
      });
  
    });
  
  });
  
  describe('notifier() with "top-left" position', function() {
    
    var notifier,
      kiuiNotifier;
    
    beforeEach(function() {
      kiuiNotifier = kiui.Notifier;
      spyOn(kiui, 'Notifier').andCallFake(function(element, options) {
        return new kiuiNotifier(element, options);
      });
      notifier = kiui.notifier({
        position: "top-left"
      });
    });
    
    afterEach(function() {
      notifier.destroy();
      notifier = originalNotifier = undefined;
    });
    
    it('should create a .kiui-notifier DOM element with the right positioning', function() {
      var element = $('.kiui-notifier');
      expect(element.length).toBe(1);
      expect(element.hasClass('kiui-position-top')).toBeTruthy();
      expect(element.hasClass('kiui-position-left')).toBeTruthy();
    });
    
    it('should call Notifier passing the option', function() {
      expect(kiui.Notifier.calls.length).toBe(1);
      expect(kiui.Notifier.mostRecentCall.args[1].position).toEqual("top-left");
    });
    
  });
  
  describe('notifier() with invalid position', function() {
    
    var notifier,
      kiuiNotifier;
    
    beforeEach(function() {
      kiuiNotifier = kiui.Notifier;
      spyOn(kiui, 'Notifier').andCallFake(function(element, options) {
        return new kiuiNotifier(element, options);
      });
      notifier = kiui.notifier({
        position: "not-valid"
      });
    });
    
    afterEach(function() {
      notifier.destroy();
      notifier = undefined;
    });
    
    it('should create a .kiui-notifier DOM element with "top-right" positioning', function() {
      var element = $('.kiui-notifier');
      expect(element.length).toBe(1);
      expect(element.hasClass('kiui-position-top')).toBeTruthy();
      expect(element.hasClass('kiui-position-right')).toBeTruthy();
    });
    
    it('should call Notifier passing "top-right" position', function() {
      expect(kiui.Notifier.calls.length).toBe(1);
      expect(kiui.Notifier.mostRecentCall.args[1].position).toEqual("top-right");
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
          expect(elem.is('.kiui-notifier.kiui-position-top.kiui-position-right')).toBeTruthy();
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
          expect(elem.is('.kiui-notifier.kiui-position-bottom.kiui-position-left')).toBeTruthy();
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
          expect(elem.is('.kiui-notifier.kiui-position-top.kiui-position-right')).toBeTruthy();
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
          return elem.find('div.kiui-notifier');
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
              expect(kiui.Notification.mostRecentCall.args[1].notificationClass).toEqual('kiui-notification-' + notificationType);
            });
      
            it('should create a DOM element to contain the notification', function() {
              expect(elem.children().length).toEqual(1);
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
      
            it('should not create a new DOM element to contain the notification', function() {
              expect(elem.children().length).toEqual(1);
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
      return elem.find('div.kiui-notifier');
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
          expect(elem.is('.kiui-notification.k-block')).toBeTruthy();
        });
        
        it('should append default notification template', function() {
          expect(elem.children().length).toBe(2);
          expect(elem.find('span.kiui-notification-close.k-icon.k-i-close').length).toBe(1);
          expect(elem.find('span.kiui-notification-content').length).toBe(1);
        });
        
        it('shold set default notification width', function() {
          expect(elem.width()).toBe(250);
        });
        
        it('should not call addHtml()', function() {
          expect(notification.addHtml.calls.length).toBe(0);
        });
        
        it('should attach click handler to close button', function() {
          var closeButton = elem.find(".kiui-notification-close");
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
    
      describe('init() with kiui-notification-' + notificationType + ' "notificationClass" option', function() {
      
        var notification;
        
        beforeEach(function() {
          notification = new kiui.Notification(elem, {
            notificationClass: 'kiui-notification-' + notificationType
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
        var closeButton = elem.find(".kiui-notification-close");
        expect(closeButton.length).toBe(1);
        
        closeButton.click();
        
        expect(notification.hide.calls.length).toBe(0);
      });
      
      it('should trigger "destroy" event', function() {
        expect(notification.trigger.calls.length).toEqual(1);
      });
      
    });
  
    describe('addHtml()', function() {
  
      var notification;
        
      beforeEach(function() {
        notification = new kiui.Notification(elem, {});
        notification.addHtml('43 is not the answer!');
      });
    
      afterEach(function() {
        notification.destroy();
        notification = undefined;
      });
    
      it('should add html to the .kiui-notification-content DOM element', function() {
        expect(elem.find('.kiui-notification-content').html()).toEqual('43 is not the answer!');
      });
      
      it('called a second time, should append the html to the .kiui-notification-content DOM element', function() {
        notification.addHtml('this is another error');
      
        expect(elem.find('.kiui-notification-content').html()).toEqual('43 is not the answer!this is another error');
      });
  
    });
    
    describe('hide()', function() {
    
      var notification;
        
      beforeEach(function() {
        spyOn(NOTIFICATION.fn, 'trigger').andCallThrough();
      
        notification = new kiui.Notification(elem, {});
        
        spyOn(notification.element, 'fadeOut').andCallFake(function(options) {
          options.complete();
        });
      });
    
      afterEach(function() {
        notification.destroy();
        notification = undefined;
      });
      
      describe('when notification is visible', function() {
      
        beforeEach(function() {
          notification.show();
          notification.hide();
        });
        
        it('should fadeOut() notification DOM element', function() {
          expect(notification.element.fadeOut.calls.length).toBe(1);
        });
      
        it('should trigger hide event', function() {
          expect(notification.trigger.mostRecentCall.args[0]).toBe('hide');
        });
      
      });
      
      describe('when notification is hidden', function() {
      
        beforeEach(function() {
          notification.hide();
        });
        
        it('should not fadeOut() notification DOM element', function() {
          expect(notification.element.fadeOut).not.toHaveBeenCalled();
        });
      
        it('should not trigger hide event', function() {
          expect(notification.trigger).not.toHaveBeenCalledWith('hide');
        });
      
      });
    
    });
    
    describe('show()', function() {
    
      var notification;
        
      beforeEach(function() {
        spyOn(NOTIFICATION.fn, 'trigger').andCallThrough();
        spyOn(NOTIFICATION.fn, 'hide').andCallThrough();
      
        notification = new kiui.Notification(elem, {});
        
        spyOn(notification.element, 'fadeIn').andCallFake(function(options) {
          options.complete();
        });
      });
    
      afterEach(function() {
        notification.destroy();
        notification = undefined;
      });
      
      describe('when notification is hidden', function() {
      
        beforeEach(function() {
          notification.show();
        });
        
        it('should fadeIn() notification DOM element', function() {
          expect(notification.element.fadeIn.calls.length).toBe(1);
        });
      
        it('should trigger show event', function() {
          expect(notification.trigger.calls.length).toBe(1);
          expect(notification.trigger.mostRecentCall.args[0]).toBe('show');
        });
      
      });
      
      describe('when notification is visible', function() {
      
        beforeEach(function() {
          notification.show();
          notification.show();
        });
        
        it('should not fadeIn() notification DOM element', function() {
          expect(notification.element.fadeIn.calls.length).toBe(1);
        });
      
        it('should not trigger show event', function() {
          expect(notification.trigger.calls.length).toBe(1);
        });
      
      });
      
      describe('called with autoHide parameter', function() {
      
        beforeEach(function() {
          jasmine.Clock.useMock();
          notification.show(2000);
        });
        
        it('should call hide() after the right amount of time', function() {
          jasmine.Clock.tick(2000);
          
          expect(notification.hide.calls.length).toBe(1);
        });
      
      });
    
    });
    
    describe('setPosition()', function() {
    
      var notification;
        
      beforeEach(function() {
        notification = new kiui.Notification(elem, {});
        
        spyOn(notification.element, 'css').andCallThrough();
      });
    
      afterEach(function() {
        notification.destroy();
        notification = undefined;
      });
      
      it('should set css position on notification DOM element', function() {
        notification.setPosition({top: 100, left: 200});
        
        expect(notification.element.css.calls.length).toBe(1);
        expect(notification.element.css).toHaveBeenCalledWith({top: 100, left: 200});
      });
    
    });
    
    describe('height()', function() {
    
      var notification;
        
      beforeEach(function() {
        notification = new kiui.Notification(elem, {});
        
        spyOn(notification.element, 'outerHeight').andCallFake(function() {
          return 42;
        });
      });
    
      afterEach(function() {
        notification.destroy();
        notification = undefined;
      });
      
      it('should return notification DOM element outerHeight', function() {
        var height = notification.height();
      
        expect(notification.element.outerHeight.calls.length).toBe(1);
        expect(height).toBe(42);
      });
    
    });
    
    describe('width()', function() {
    
      var notification;
        
      beforeEach(function() {
        notification = new kiui.Notification(elem, {});
        
        spyOn(notification.element, 'outerWidth').andCallFake(function() {
          return 42;
        });
      });
    
      afterEach(function() {
        notification.destroy();
        notification = undefined;
      });
      
      it('should return notification DOM element outerWidth', function() {
        var width = notification.width();
      
        expect(notification.element.outerWidth.calls.length).toBe(1);
        expect(width).toBe(42);
      });
    
    });
  
  });

});
