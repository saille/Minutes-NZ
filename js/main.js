$(function () {
	
    var effectDelayms = 200;

	var d = new Date();
	
	var h = d.getHours() > 12 ? d.getHours() - 12 : d.getHours();
	var m = d.getMinutes() < 10 ? "0" + d.getMinutes() : d.getMinutes();
	var a = d.getHours() >= 12 ? "pm" : "am";

	// set current date
	$('.default-date-now').val(d.getDate() + "/" + (d.getMonth() + 1) + "/" + d.getFullYear() + " " + h + ":" + m + a);
	
	var chooserBehaviour = function () {
		
	    if (!Modernizr.touch) {
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
	    }
		
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
	
	var testareaAutoGrowBehaviour = function () {
	    // auto-grow a textarea element based on content size
	    function autoGrowTextArea(textarea) {
	        textarea.style.height = 'auto';
	        textarea.style.height = textarea.scrollHeight + 'px';
	    }

	    // auto-grow textareas on key up
	    $('.textarea').keyup(function (e) {
	        autoGrowTextArea(e.target);
	    });
	}();
	
	var allEmpty = function (elements) {
		
		for (var i = 0; i < elements.length; i++) {

		    // a yes/no questions with a 'no' answer is considered 'empty'
		    if ($('.btn-yes.selected', elements[i]).length > 0) {
		        return false;
		    }

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
	
	var dependsOn = function (elementToHide, textElements) {
		
		// set initial visibility of elements
		if (allEmpty(textElements)) {
			$(elementToHide).hide();
		} else {
			$(elementToHide).show();
		}
		
		// check visibility on key events
		$('input textarea', textElements).keyup(function (e) {
			if (allEmpty(textElements)) {
				$(elementToHide).hide(effectDelayms);
			} else {
				$(elementToHide).show(effectDelayms);
			}
		});

		$('button', textElements).click(function (e) {
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
		
		$('.agenda-item-number', agendaItem).text('Agenda item no. ' + thisAgendaItemNum);
		
	    // assign id's to elements
		$('.agenda-item-title', agendaItem).attr('id', 'agenda-item-title-' + thisAgendaItemNum);
		$('.agenda-item-description', agendaItem).attr('id', 'agenda-item-description-' + thisAgendaItemNum);
		$('.agenda-item-discussion', agendaItem).attr('id', 'agenda-item-discussion-' + thisAgendaItemNum);
		$('.agenda-item-discussion-text', agendaItem).attr('id', 'agenda-item-discussion-text-' + thisAgendaItemNum);
		$('.agenda-item-decision', agendaItem).attr('id', 'agenda-item-decision-' + thisAgendaItemNum);
		$('.agenda-item-decision-reached', agendaItem).attr('id', 'agenda-item-decision-reached-' + thisAgendaItemNum);
		$('.agenda-item-decision-reached-dependency', agendaItem).attr('id', 'agenda-item-decision-reached-dependency-' + thisAgendaItemNum);
		$('.agenda-item-motion', agendaItem).attr('id', 'agenda-item-motion-' + thisAgendaItemNum);
		$('.agenda-item-motion-notes', agendaItem).attr('id', 'agenda-item-motion-notes-' + thisAgendaItemNum);
		$('.agenda-item-motion-notes-text', agendaItem).attr('id', 'agenda-item-motion-notes-text-' + thisAgendaItemNum);

		agendaItem.hide(); // hide so it can be shown with transition effect
		agendaItem.appendTo('#agenda-items');
		
		return agendaItem;
		
	}
	
	var setupAgendaItemDependencies = function (idx, agendaItem) {
		var thisAgendaItemNum = idx + 1;
		//dependsOn($('#agenda-item-discussion-' + thisAgendaItemNum, agendaItem), $('#agenda-item-discussed-text-' + thisAgendaItemNum, agendaItem));
	    //dependsOn($('#agenda-item-motion-' + thisAgendaItemNum, agendaItem), $('#agenda-item-discussion-text-' + thisAgendaItemNum));// + ', #agenda-item-discussed-text-' + thisAgendaItemNum, agendaItem));

		dependsOn($('#agenda-item-decision-reached-dependency-' + thisAgendaItemNum, agendaItem), $('#agenda-item-decision-reached-' + thisAgendaItemNum));
		//dependsOn($('#agenda-item-motion-' + thisAgendaItemNum, agendaItem), $('#agenda-item-discussed-text-' + thisAgendaItemNum));
	};

	// dynamically add agenda items
	$('.btn-add-agenda-item').click(function (e) {
		var agendaItem = addAgendaItem(); // create agenda item elements
		agendaItem.show(effectDelayms); // show them
		
		var numAgendaItems = $('#agenda-items > *').length;
		setupAgendaItemDependencies(numAgendaItems-1, agendaItem);

		$('.input', agendaItem)[0].focus(); // focus on first input (Title)
	});
	
	var firstAgendaItem = addAgendaItem(); // add initial agenda item
	firstAgendaItem.show();
	setupAgendaItemDependencies(0, firstAgendaItem);
	
	// setup other dependencies
	dependsOn($('#correspondence-motion'), $('#correspondence-text'));
	dependsOn($('#financial-report-dependency'), $('#financial-report-presenter'));
	dependsOn($('#other-report-dependency'), $('#other-report-text'));
	dependsOn($('#other-discussion-dependency'), $('#other-discussion'));
	dependsOn($('#other-decision-dependency'), $('#other-decision'));

	//$('#help-content .help-group-get-started').show();

    // Setup context-sensitive help

	$('#organisation *').focus(function (e) {
	    $('#help-content .article').hide();
	    $('#help-content .help-group-get-started').show();
	    $('#help-content .help-group-organisation').show();
	});

	$('#meeting-date-article *').focus(function (e) {
	    $('#help-content .article').hide();
	    $('#help-content .help-group-organisation').show();
	});

	$('#meeting-date-and-location *').focus(function (e) {
	    $('#help-content .article').hide();
	    $('#help-content .help-group-meeting-date').show();
	    $('#help-content .help-group-meeting-location').show();
	});

	$('#attendees *').focus(function (e) {
	    $('#help-content .article').hide();
	    $('#help-content .help-group-attendees').show();
	});

	$('#apologies *').focus(function (e) {
	    $('#help-content .article').hide();
	    $('#help-content .help-group-apologies').show();
	});

	$('#previous-meeting *').focus(function (e) {
	    $('#help-content .article').hide();
	    $('#help-content .help-group-previous-meeting').show();
	});

	$('#previous-meeting-true-and-correct *').focus(function (e) {
	    $('#help-content .article').hide();
	    $('#help-content .help-group-previous-meeting-true-and-correct').show();
	});

	$('#previous-minutes-matters-arising *').focus(function (e) {
	    $('#help-content .article').hide();
	    $('#help-content .help-group-matters-arising-from-previous-meeting').show();
	});

	$('#correspondence *').focus(function (e) {
	    $('#help-content .article').hide();
	    $('#help-content .help-group-correspondence').show();
	});

	$('#financial-report *').focus(function (e) {
	    $('#help-content .article').hide();
	    $('#help-content .help-group-financial-report').show();
	});

	$('#other-reports *').focus(function (e) {
	    $('#help-content .article').hide();
	    $('#help-content .help-group-other-reports').show();
	});

	$('.motion *').focus(function (e) {
	    //$('#help-content .article').hide(); // hide all help articles
	    $('#help-content .help-group-motion').show();
	});

	$('.agenda-item *').focus(function (e) {
	    $('#help-content .article').hide();
	    $('#help-content .help-group-agenda-item').show();
	});


	$('#start-btn').click(function () {
	    window.location = '#page';
	    $('#orgnanisation-name').focus();
	    return false;
	});

	$('body').addClass('loaded');

	//$('#help-close-btn-container').click(function () {
	//    // expand/collapse help sidebar
	//    var help = $('#help-sidebar');
	//    if (help.hasClass('collapsed')) {
	//        help.removeClass('collapsed');
	//        help.addClass('expanded');
    //        $('#help-close-btn-container').attr('title', 'close help sidebar')
	//    } else {
	//        help.removeClass('expanded');
	//        help.addClass('collapsed');
	//        $('#help-close-btn-container').attr('title', 'show help sidebar')
	//    }
	//});

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

    
	var $help = $("#help-content");
	var $header = $("header");

	var positionHelpFixed = function () {
	    // on non-touch, we can use fixed positioning to keep the help
	    // visible, but only when the header has scrolled of screen.

	    var scrollTop = $(window).scrollTop();
	    var helpOffsetTop = $help.offset().top;

	    if (scrollTop > $header.height()) {
	        if (Math.abs(scrollTop - helpOffsetTop) > 1) {
	            $help.css('position', 'fixed');
	            $help.css('top', '0');
	        } else {
	            $help.css('position', 'relative');
	            $help.css('margin-top', '20px');
	        }
	    } else {
	        $help.css('position', 'relative');
	        $help.css('margin-top', '20px');
	    }
	};

	//var positionHelpWithMargin = function () {

	//    // Use top margin to position help so that it behaves like fixed positioning on touch devices
	//    // with keyboard open. Fixed positioning gets turned into absolute on iPads when on-screen
	//    // keyboard is open (and probably other tablets too).

	//    var scrollTop = $(window).scrollTop();
	//    var helpOffsetTop = $help.offset().top;

	//    if (scrollTop > $header.height()) {
	//        if (Math.abs(scrollTop - helpOffsetTop) > 1) {

	//            $help.css('margin-top', 20 + scrollTop - $header.height() + 'px');
	//        } else {
	//            $help.css('margin-top', '20px');
	//        }
	//    } else {
	//        $help.css('margin-top', '20px');
	//    }
	//};


	if (Modernizr.touch) {
	    $('*').focus(function () {
	        // move help to where user is focussed
	        $help.css('margin-top', 20 + $(this).offset().top - $header.height() - 100 + 'px');
	    });
    } else {
	    $(window).scroll(function () {
            // move help using css fixed psoitioning
	        positionHelpFixed();
	    });
    }

    // array of possible header background images (for prototype only)
	var headerImg = [
        {
            'background-image': 'url("../img/keyboard-full.jpg")'
        },
        {
            'background-image': 'url("../img/home-office-336373_1920.jpg")'
        },
        {
            'background-image': 'url("../img/keyboard-622456_1920.jpg")'
        },
        {
            'background-image': 'url("../img/mosaic-913658.jpg")'
        },
        {
            'background-image': 'url("../img/table-629772.jpg")'
        },
        {
            'background-image': 'url("../img/typing-690856.jpg")'
        },
	];

	var headerImgIdx = 1;

	$header.click(function (e) {

	    // swap image
	    for (var p in headerImg[headerImgIdx]) {
	        $header.css(p, headerImg[headerImgIdx][p]);
	        console.log(headerImg[headerImgIdx][p]);
	    }

	    headerImgIdx++;

	    if (headerImgIdx == headerImg.length) {
	        headerImgIdx = 0;
	    }
	});
});



