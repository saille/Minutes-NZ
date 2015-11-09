$(function () {
	
	var effectDelayms = 200;

	var d = new Date();
	
	var h = d.getHours() > 12 ? d.getHours() - 12 : d.getHours();
	var m = d.getMinutes() < 10 ? "0" + d.getMinutes() : d.getMinutes();
	var a = d.getHours() >= 12 ? "pm" : "am";

	// set current date
	$('.default-date-now').val(d.getDate() + "/" + (d.getMonth() + 1) + "/" + d.getFullYear() + " " + h + ":" + m + a);
	
	var chooserBehaviour = function () {
		
		// opens a select list without requiring user to click it
		function open(elem) {
			if (document.createEvent) {
				var e = document.createEvent("MouseEvents");
				e.initMouseEvent("mousedown", true, true, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
				elem[0].dispatchEvent(e);
			} else if (element.fireEvent) {
				elem[0].fireEvent("onmousedown");
			}
		}
		
		// open the select list
		$('.btn-chooser').click(function (e) {
			var s = $('.select-chooser', e.target.parentElement);
			s.show(effectDelayms, function () { open(s) });
		})
		
		// set the text based on the select item that was selected
		$('.select-chooser').change(function (e) {
			
			var t = $('.textarea', e.target.parentElement.parentElement);
			
			t.val(e.target.value);
			
			// auto-grow textarea since its content has been altered
			autoGrowTextArea(t[0]);

			$('.select-chooser').hide(effectDelayms);
			t.focus();
		});
		
		$('.select-chooser').blur(function (e) {
			$(this).hide(effectDelayms);
		});
	} ();
	
	// auto-grow a textarea element based on content size
	function autoGrowTextArea(textarea) {
		textarea.style.height = 'auto';
		textarea.style.height = textarea.scrollHeight + 'px';
	}

	// auto-grow textareas on key up
	$('.textarea').keyup(function (e) {
		autoGrowTextArea(e.target);
	});
	
	var allEmpty = function (elements) {
		
		for (var i = 0; i < elements.length; i++) {

			if ($(elements[i]).val() !== '') {
				return false;
			}
		}

		return true;
	};

	var yesNoButtonBehaviour = function() {
		$('.yesno button').click(function (e) {
			$('button', e.target.parentElement).removeClass('selected');
			$(this).addClass('selected');
		});
	} ();
	
	var dependsOn2 = function (elementToHide, textElements) {
		
		// set initial visibility of elements
		if (allEmpty(textElements)) {
			$(elementToHide).hide();
		} else {
			$(elementToHide).show();
		}
		
		// check visibility on key events
		$(textElements).keyup(function (e) {
			if (allEmpty(textElements)) {
				$(elementToHide).hide(effectDelayms);
			} else {
				$(elementToHide).show(effectDelayms);
			}
		});
	};
	
	// create a new agenda item, append it to the #agenda-items, and return it
	function addAgendaItem() {
		var numAgendaItems = $('#agenda-items > *').length;
		var thisAgendaItemNum = numAgendaItems + 1;
		
		// clone based on the template
		var agendaItem = $('#agenda-item-template').clone(true);
		
		$(agendaItem[0]).attr('id', 'agenda-item-' + thisAgendaItemNum);
		
		$('label', agendaItem).text('Agenda item no. ' + thisAgendaItemNum);
		
		// assign id's to elements
		$('.agenda-item-discussed-text', agendaItem).attr('id', 'agenda-item-discussed-text-' + thisAgendaItemNum);
		$('.agenda-item-decision', agendaItem).attr('id', 'agenda-item-decision-' + thisAgendaItemNum);
		$('.agenda-item-decision-text', agendaItem).attr('id', 'agenda-item-decision-text-' + thisAgendaItemNum);
		$('.agenda-item-motion', agendaItem).attr('id', 'agenda-item-motion-' + thisAgendaItemNum);

		agendaItem.hide(); // hide so it can be shown with transition effect
		agendaItem.appendTo('#agenda-items');
		
		return agendaItem;
		
	}
	
	var setupAgendaItemDependencies = function (idx, agendaItem) {
		var thisAgendaItemNum = idx + 1;
		dependsOn2($('#agenda-item-decision-' + thisAgendaItemNum, agendaItem), $('#agenda-item-discussed-text-' + thisAgendaItemNum, agendaItem));
		//dependsOn2($('#agenda-item-motion-' + thisAgendaItemNum, agendaItem), $('#agenda-item-decision-text-' + thisAgendaItemNum));// + ', #agenda-item-discussed-text-' + thisAgendaItemNum, agendaItem));
		dependsOn2($('#agenda-item-motion-' + thisAgendaItemNum, agendaItem), $('#agenda-item-discussed-text-' + thisAgendaItemNum));
	};

	// dynamically add agenda items
	$('.btn-add-agenda-item').click(function (e) {
		var agendaItem = addAgendaItem(); // create agenda item elements
		agendaItem.show(effectDelayms); // show them
		
		var numAgendaItems = $('#agenda-items > *').length;
		setupAgendaItemDependencies(numAgendaItems-1, agendaItem);

		$('.textarea', agendaItem)[0].focus(); // focus on first textarea
	});
	
	var firstAgendaItem = addAgendaItem(); // add initial agenda item
	firstAgendaItem.show();
	setupAgendaItemDependencies(0, firstAgendaItem);
	
	// setup other dependencies
	dependsOn2($('#correspondence-motion'), $('#correspondence'));
	dependsOn2($('#financial-report-dependency'), $('#financial-report-presenter'));
	dependsOn2($('#other-report-dependency'), $('#other-report'));
	dependsOn2($('#other-discussion-dependency'), $('#other-discussion'));
	dependsOn2($('#other-decision-dependency'), $('#other-decision'));



	function showHelpGroup01() {
	    $('#help-content .article').hide(); // hide all help articles
	    $('#help-content .help-group01').show();
	}

	function showHelpGroup02() {
	    $('#help-content .article').hide(); // hide all help articles
	    $('#help-content .help-group02').show();
	}

	showHelpGroup01();

	$('#orgnanisation-name').focus(function (e) {
	    showHelpGroup01();
	});

	$('#meeting-date').focus(function (e) {
	    showHelpGroup01();
	});

	$('#meeting-location').focus(function (e) {
	    showHelpGroup01();
	});

	$('#attendees').focus(function (e) {
	    showHelpGroup01();
	});

	$('#apologies-names').focus(function (e) {
	    showHelpGroup02();
	});

	$('#help-sidebar').click(function () {
	    // expand/collapse help sidebar
	    var help = $(this);
	    if (help.hasClass('collapsed')) {
	        help.removeClass('collapsed');
	        help.addClass('expanded');
	    } else {
	        help.removeClass('expanded');
	        help.addClass('collapsed');
	    }
	});

	// move carret to end when focussing on a textarea so user can start typing
	// http://stackoverflow.com/questions/6003300/how-to-place-cursor-at-end-of-text-in-textarea-when-tabbed-into
	function moveCaretToEnd(el) {
		if (typeof el.selectionStart == "number") {
			el.selectionStart = el.selectionEnd = el.value.length;
		} else if (typeof el.createTextRange != "undefined") {
			el.focus();
			var range = el.createTextRange();
			range.collapse(false);
			range.select();
		}
	}

	$(".textarea").focus(function (e) {
		
		moveCaretToEnd(e.target);
		
		// Work around Chrome's little problem
		window.setTimeout(function () {
			moveCaretToEnd(e.target);
		}, 1);
	});
	
	
	
	

	// names of all in the group will be accumulated based on user input.
	var allNames = [];

	var accumulateNames = function () {
		
		$('input.names').blur(function (b) {
			$('input.names').each(function (idx, e) {
				
				var names = $(e).val().split(',');
				
				for (var i = 0; i < names.length; i++) {
					
					var name = $.trim(names[i]);
					
					if ($.inArray(name, allNames) === -1 && name !== '') {
						allNames.push(name);
					}
				}
			});
		});
	}();

});

