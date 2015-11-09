(function(root, factory) {
	if (typeof define === 'function' && define.amd) {
		// AMD. Register as an anonymous module.
		define(["knockout", "jquery"], factory);
	} else {
		// Browser globals
		factory(ko, jQuery);
	}
}(this, function (ko, $) {
	ko.bindingHandlers.slideToggle = {
		init: function (element, valueAccessor) {
			// Initially set the element to be instantly visible/hidden depending on the value
			var value = valueAccessor();
			$(element)
				.toggle(ko.utils.unwrapObservable(value))
				.attr({
					'aria-expanded': !!ko.utils.unwrapObservable(value),
					'aria-hidden': !ko.utils.unwrapObservable(value)
				})
				.css({
					position: 'relative' // hey IE10, since you don't know what's in your viewport and actually try drawing it until I start waggling the mouse, scroll it out of view and back in, or resize the window, here is a clue!
				});
		},
		update: function (element, valueAccessor) {
			// Whenever the value subsequently changes, slide the element up or down
			var
				value = valueAccessor(),
				$el = $(element),
				isShown = ko.utils.unwrapObservable(value);

			$el.stop(true, true);

			if (isShown) {
				$el.slideDown(120);
			} else {
				$el.slideUp(120);
			}

			$(element)
				.promise()
				.done(function () {
					$(element).attr({
						'aria-expanded': !!isShown,
						'aria-hidden': !isShown
					}).css({'overflow': isShown ? 'visible' : 'hidden'});
				});
		}
	};

	ko.bindingHandlers.fadeToggle = {
		init: function (element, valueAccessor) {
			// Initially set the element to be instantly visible/hidden depending on the value
			var value = valueAccessor();
			$(element).toggle(ko.utils.unwrapObservable(value));
		},
		update: function (element, valueAccessor) {
			// Whenever the value subsequently changes, slide the element up or down
			var value = valueAccessor();
			$(element).stop(true, true);

			if (ko.utils.unwrapObservable(value)) {
				$(element).fadeIn(60);
			} else {
				$(element).fadeOut(180);
			}
		}
	};

	ko.extenders.transitions = function (target, type) {
		target.slideUp = function (el) {
			$(el).slideUp(function () { $(el).remove(); });
		};

		target.slideDown = function (el) {
			$(el).hide().slideDown();
		};

		return target;
	};
}));
