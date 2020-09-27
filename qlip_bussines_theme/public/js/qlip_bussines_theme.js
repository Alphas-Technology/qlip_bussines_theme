// const { $ } = require("../../../../../sites/assets/js/form.min");

// Control Data (textbox)
frappe.provide('frappe.phone_call');

frappe.ui.form.ControlData = frappe.ui.form.ControlData.extend({
    make_input: function() {
		if(this.$input) return;

		this.$input = $("<"+ this.html_element +">")
			.attr("type", this.input_type)
			.attr("autocomplete", "off")
			.addClass("input-with-feedback form-control floating-input")
			.prependTo(this.input_area);

		if (in_list(['Data', 'Link', 'Dynamic Link', 'Password', 'Select', 'Read Only', 'Attach', 'Attach Image'],
			this.df.fieldtype)) {
			this.$input.attr("maxlength", this.df.length || 140);
		}

		this.set_input_attributes();
		this.input = this.$input.get(0);
		this.has_input = true;
		this.bind_change_event();
		this.bind_focusout();
		this.setup_autoname_check();
		if (this.df.options == 'Phone') {
			this.setup_phone();
		}
		// somehow this event does not bubble up to document
		// after v7, if you can debug, remove this
    },
    
    make_wrapper: function() {
		if(this.only_input) {
			this.$wrapper = $('<div class="form-group frappe-control">').appendTo(this.parent);
		} else {
			this.$wrapper = $('<div class="frappe-control">\
				<div class="form-group">\
					<div class="control-input-wrapper">\
                        <div class="control-input floating-label ">\
                        <label class="control-label" style="padding-right: 0px;"></label>\
                        </div>\
						<div class="control-value like-disabled-input" style="display: none;"></div>\
						<p class="help-box small text-muted hidden-xs"></p>\
					</div>\
				</div>\
			</div>').appendTo(this.parent);
		}
	},
    
    set_input_attributes: function() {
		this.$input
			.attr("data-fieldtype", this.df.fieldtype)
			.attr("data-fieldname", this.df.fieldname)
			.attr("placeholder", this.df.placeholder || " ");
		if(this.doctype) {
			this.$input.attr("data-doctype", this.doctype);
		}
		if(this.df.input_css) {
			this.$input.css(this.df.input_css);
		}
		if(this.df.input_class) {
			this.$input.addClass(this.df.input_class);
		}
	},

	refresh_input: function() {
		this._super();
		if (!this.can_write() && !this.only_input && this.disp_area) {
			$(this.label_span).insertAfter(this.disp_area);
		}
	}
})

// Control Link (textbox)
frappe.ui.form.ControlLink = frappe.ui.form.ControlLink.extend({
	make_input: function() {
		var me = this;
		// line-height: 1 is for Mozilla 51, shows extra padding otherwise
		$('<div class="link-field ui-front" style="position: relative; line-height: 1;">\
			<input type="text" class="input-with-feedback form-control floating-input">\
			<span class="link-btn">\
				<a class="btn-open no-decoration" title="' + __("Open Link") + '">\
					<i class="octicon octicon-arrow-right"></i></a>\
			</span>\
		</div>').prependTo(this.input_area);
		this.$input_area = $(this.input_area);
		this.$input = this.$input_area.find('input');
		this.$link = this.$input_area.find('.link-btn');
		this.$link_open = this.$link.find('.btn-open');
		this.set_input_attributes();
		this.$input.on("focus", function() {
			setTimeout(function() {
				if(me.$input.val() && me.get_options()) {
					let doctype = me.get_options();
					let name = me.$input.val();
					me.$link.toggle(true);
					me.$link_open.attr('href', frappe.utils.get_form_link(doctype, name));
				}

				if(!me.$input.val()) {
					me.$input.val("").trigger("input");
				}
			}, 500);
		});
		this.$input.on("blur", function() {
			// if this disappears immediately, the user's click
			// does not register, hence timeout
			setTimeout(function() {
				me.$link.toggle(false);
			}, 500);
		});
		this.$input.attr('data-target', this.df.options);
		this.input = this.$input.get(0);
		this.has_input = true;
		this.translate_values = true;
		this.setup_buttons();
		this.setup_awesomeplete();
		this.$label = this.$input_area.find('label');
		this.$input.after(this.$label);
	},

	make_wrapper: function() {
		if(this.only_input) {
			this.$wrapper = $('<div class="form-group frappe-control">').appendTo(this.parent);
		} else {
			this.$wrapper = $('<div class="frappe-control">\
				<div class="form-group">\
					<div class="control-input-wrapper">\
						<div class="control-input floating-label">\
						<label class="control-label" style="padding-right: 0px;"></label>\
                        </div>\
						<div class="control-value like-disabled-input" style="display: none;"></div>\
						<p class="help-box small text-muted hidden-xs"></p>\
					</div>\
				</div>\
			</div>').appendTo(this.parent);
		}
	},
    
    set_input_attributes: function() {
		this.$input
			.attr("data-fieldtype", this.df.fieldtype)
			.attr("data-fieldname", this.df.fieldname)
			.attr("placeholder", this.df.placeholder || " ");
		if(this.doctype) {
			this.$input.attr("data-doctype", this.doctype);
		}
		if(this.df.input_css) {
			this.$input.css(this.df.input_css);
		}
		if(this.df.input_class) {
			this.$input.addClass(this.df.input_class);
		}
	}
})
// End Control Link (textbox)


// Control Select
frappe.ui.form.ControlSelect = frappe.ui.form.ControlSelect.extend({
	make_wrapper: function() {
		if(this.only_input) {
			this.$wrapper = $('<div class="form-group frappe-control">').appendTo(this.parent);
		} else {
			this.$wrapper = $('<div class="frappe-control">\
				<div class="form-group">\
					<div class="control-input-wrapper">\
                        <div class="control-input floating-label ">\
                        <label class="control-label" style="padding-right: 0px;"></label>\
                        </div>\
						<div class="control-value like-disabled-input" style="display: none;"></div>\
						<p class="help-box small text-muted hidden-xs"></p>\
					</div>\
				</div>\
			</div>').appendTo(this.parent);
		}
	},

	make_input: function() {
		this._super();
		this.$input.attr("onclick", "this.setAttribute('value', this.value);")
			.attr("value", this.value)
			.addClass("floating-select")
	}

})
// End Control Select

// Control Int
frappe.ui.form.ControlInt = frappe.ui.form.ControlData.extend({
	make: function() {
		this._super();
		// $(this.label_area).addClass('pull-right');
		// $(this.disp_area).addClass('text-right');
	},
	make_input: function() {
		var me = this;
		this._super();
		this.$input
			// .addClass("text-right")
			.on("focus", function() {
				setTimeout(function() {
					if(!document.activeElement) return;
					document.activeElement.value
						= me.validate(document.activeElement.value);
					document.activeElement.select();
				}, 100);
				return false;
			});
	},
	eval_expression: function(value) {
		if (typeof value === 'string') {
			if (value.match(/^[0-9+\-/* ]+$/)) {
				// If it is a string containing operators
				try {
					return eval(value);
				} catch (e) {
					// bad expression
					return value;
				}
			}
		}
		return value;
	},
	parse: function(value) {
		return cint(this.eval_expression(value), null);
	}
});
// End Control Int

// Control Float
frappe.ui.form.ControlFloat = frappe.ui.form.ControlInt.extend({
	parse: function(value) {
		value = this.eval_expression(value);
		return isNaN(parseFloat(value)) ? null : flt(value, this.get_precision());
	},

	format_for_input: function(value) {
		var number_format;
		if (this.df.fieldtype==="Float" && this.df.options && this.df.options.trim()) {
			number_format = this.get_number_format();
		}
		var formatted_value = format_number(value, number_format, this.get_precision());
		return isNaN(parseFloat(value)) ? "" : formatted_value;
	},

	get_number_format: function() {
		var currency = frappe.meta.get_field_currency(this.df, this.get_doc());
		return get_number_format(currency);
	},

	get_precision: function() {
		// round based on field precision or float precision, else don't round
		return this.df.precision || cint(frappe.boot.sysdefaults.float_precision, null);
	}
});

frappe.ui.form.ControlPercent = frappe.ui.form.ControlFloat;

// End Control Float

// Control Currency
frappe.ui.form.ControlCurrency = frappe.ui.form.ControlFloat.extend({
	format_for_input: function(value) {
		var formatted_value = format_number(value, this.get_number_format(), this.get_precision());
		return isNaN(parseFloat(value)) ? "" : formatted_value;
	},

	get_precision: function() {
		// always round based on field precision or currency's precision
		// this method is also called in this.parse()
		if (!this.df.precision) {
			if(frappe.boot.sysdefaults.currency_precision) {
				this.df.precision = frappe.boot.sysdefaults.currency_precision;
			} else {
				this.df.precision = get_number_format_info(this.get_number_format()).precision;
			}
		}

		return this.df.precision;
	}
});
// End Control Currency

// Control Read Only
frappe.ui.form.ControlReadOnly = frappe.ui.form.ControlData.extend({
	get_status: function(explain) {
		var status = this._super(explain);
		if(status==="Write")
			status = "Read";
		return;
	},

	make_wrapper: function() {
		if(this.only_input) {
			this.$wrapper = $('<div class="form-group frappe-control">').appendTo(this.parent);
		} else {
			this.$wrapper = $('<div class="frappe-control">\
				<div class="form-group">\
					<div class="control-input-wrapper">\
                        <div class="control-input floating-label ">\
                        </div>\
						<div class="control-value like-disabled-input" style="display: none;"></div>\
						<label class="control-label" style="padding-right: 0px;"></label>\
						<p class="help-box small text-muted hidden-xs"></p>\
					</div>\
				</div>\
			</div>').appendTo(this.parent);
		}
	},
})
// End Control Read Only

// Control Date
frappe.ui.form.ControlDate = frappe.ui.form.ControlData.extend({
	make_input: function() {
		this._super();
		this.make_picker();
	},
	make_picker: function() {
		this.set_date_options();
		this.set_datepicker();
		this.set_t_for_today();
	},
	set_formatted_input: function(value) {
		this._super(value);
		if (this.timepicker_only) return;
		if (!this.datepicker) return;
		if(!value) {
			this.datepicker.clear();
			return;
		}

		let should_refresh = this.last_value && this.last_value !== value;

		if (!should_refresh) {
			if(this.datepicker.selectedDates.length > 0) {
				// if date is selected but different from value, refresh
				const selected_date =
					moment(this.datepicker.selectedDates[0])
						.format(this.date_format);

				should_refresh = selected_date !== value;
			} else {
				// if datepicker has no selected date, refresh
				should_refresh = true;
			}
		}

		if(should_refresh) {
			this.datepicker.selectDate(frappe.datetime.str_to_obj(value));
		}
	},
	set_date_options: function() {
		// webformTODO:
		let sysdefaults = frappe.boot.sysdefaults;

		let lang = 'en';
		frappe.boot.user && (lang = frappe.boot.user.language);
		if(!$.fn.datepicker.language[lang]) {
			lang = 'en';
		}

		let date_format = sysdefaults && sysdefaults.date_format
			? sysdefaults.date_format : 'yyyy-mm-dd';

		let now_date = new Date();

		this.today_text = __("Today");
		this.date_format = frappe.defaultDateFormat;
		this.datepicker_options = {
			language: lang,
			autoClose: true,
			todayButton: true,
			dateFormat: date_format,
			startDate: now_date,
			keyboardNav: false,
			onSelect: () => {
				this.$input.trigger('change');
			},
			onShow: () => {
				this.datepicker.$datepicker
					.find('.datepicker--button:visible')
					.text(this.today_text);

				this.update_datepicker_position();
			}
		};
	},
	set_datepicker: function() {
		this.$input.datepicker(this.datepicker_options);
		this.datepicker = this.$input.data('datepicker');

		// today button didn't work as expected,
		// so explicitly bind the event
		this.datepicker.$datepicker
			.find('[data-action="today"]')
			.click(() => {
				this.datepicker.selectDate(this.get_now_date());
			});
	},
	update_datepicker_position: function() {
		if(!this.frm) return;
		// show datepicker above or below the input
		// based on scroll position
		// We have to bodge around the timepicker getting its position
		// wrong by 42px when opening upwards.
		const $header = $('.page-head');
		const header_bottom = $header.position().top + $header.outerHeight();
		const picker_height = this.datepicker.$datepicker.outerHeight() + 12;
		const picker_top = this.$input.offset().top - $(window).scrollTop() - picker_height;

		var position = 'top left';
		// 12 is the default datepicker.opts[offset]
		if (picker_top <= header_bottom) {
			position = 'bottom left';
			if (this.timepicker_only) this.datepicker.opts['offset'] = 12;
		} else {
			// To account for 42px incorrect positioning
			if (this.timepicker_only) this.datepicker.opts['offset'] = -30;
		}

		this.datepicker.update('position', position);
	},
	get_now_date: function() {
		return frappe.datetime.now_date(true);
	},
	set_t_for_today: function() {
		var me = this;
		this.$input.on("keydown", function(e) {
			if(e.which===84) { // 84 === t
				if(me.df.fieldtype=='Date') {
					me.set_value(frappe.datetime.nowdate());
				} if(me.df.fieldtype=='Datetime') {
					me.set_value(frappe.datetime.now_datetime());
				} if(me.df.fieldtype=='Time') {
					me.set_value(frappe.datetime.now_time());
				}
				return false;
			}
		});
	},
	parse: function(value) {
		if(value) {
			return frappe.datetime.user_to_str(value);
		}
	},
	format_for_input: function(value) {
		if(value) {
			return frappe.datetime.str_to_user(value);
		}
		return "";
	},
	validate: function(value) {
		if(value && !frappe.datetime.validate(value)) {
			let sysdefaults = frappe.sys_defaults;
			let date_format = sysdefaults && sysdefaults.date_format
				? sysdefaults.date_format : 'yyyy-mm-dd';
			frappe.msgprint(__("Date {0} must be in format: {1}", [value, date_format]));
			return '';
		}
		return value;
	}
});

// End Control Date

// Control Time
frappe.ui.form.ControlTime = frappe.ui.form.ControlDate.extend({
	set_formatted_input: function(value) {
		this._super(value);
	},
	make_input: function() {
		this.timepicker_only = true;
		this._super();
	},
	make_picker: function() {
		this.set_time_options();
		this.set_datepicker();
		this.refresh();
	},
	set_time_options: function() {
		let sysdefaults = frappe.boot.sysdefaults;

		let time_format = sysdefaults && sysdefaults.time_format
			? sysdefaults.time_format : 'HH:mm:ss';

		this.time_format = frappe.defaultTimeFormat;
		this.datepicker_options = {
			language: "en",
			timepicker: true,
			onlyTimepicker: true,
			timeFormat: time_format.toLowerCase().replace("mm", "ii"),
			startDate: frappe.datetime.now_time(true),
			onSelect: () => {
				// ignore micro seconds
				if (moment(this.get_value(), time_format).format('HH:mm:ss') != moment(this.value, time_format).format('HH:mm:ss')) {
					this.$input.trigger('change');
				}
			},
			onShow: () => {
				$('.datepicker--button:visible').text(__('Now'));

				this.update_datepicker_position();
			},
			keyboardNav: false,
			todayButton: true
		};
	},
	set_input: function(value) {
		this._super(value);
		if (value
			&& ((this.last_value && this.last_value !== this.value)
				|| (!this.datepicker.selectedDates.length))) {

			let time_format = frappe.sys_defaults.time_format || 'HH:mm:ss';
			var date_obj = frappe.datetime.moment_to_date_obj(moment(value, time_format));
			this.datepicker.selectDate(date_obj);
		}
	},
	set_datepicker: function() {
		this.$input.datepicker(this.datepicker_options);
		this.datepicker = this.$input.data('datepicker');

		this.datepicker.$datepicker
			.find('[data-action="today"]')
			.click(() => {
				this.datepicker.selectDate(frappe.datetime.now_time(true));
				this.datepicker.hide();
			});
		if (this.datepicker.opts.timeFormat.indexOf('s') == -1) {
			// No seconds in time format
			const $tp = this.datepicker.timepicker;
			$tp.$seconds.parent().css('display', 'none');
			$tp.$secondsText.css('display', 'none');
			$tp.$secondsText.prev().css('display', 'none');
		}
	},
	set_description: function() {
		const { description } = this.df;
		const { time_zone } = frappe.sys_defaults;
		if (!frappe.datetime.is_timezone_same()) {
			if (!description) {
				this.df.description = time_zone;
			} else if (!description.includes(time_zone)) {
				this.df.description += '<br>' + time_zone;
			}
		}
		this._super();
	},
	parse: function(value) {
		if (value) {
			return frappe.datetime.user_to_str(value, true);
		}
	},
	format_for_input: function(value) {
		if (value) {
			return frappe.datetime.str_to_user(value, true);
		}
		return "";
	},
	validate: function(value) {
		if (value && !frappe.datetime.validate(value)) {
			let sysdefaults = frappe.sys_defaults;
			let time_format = sysdefaults && sysdefaults.time_format
				? sysdefaults.time_format : 'HH:mm:ss';
			frappe.msgprint(__("Time {0} must be in format: {1}", [value, time_format]));
			return '';
		}
		return value;
	}
});
//End Control Time

// Control Popup
frappe.msgprint = function(msg, title, is_minimizable) {
	if(!msg) return;

	if($.isPlainObject(msg)) {
		var data = msg;
	} else {
		// passed as JSON
		if(typeof msg==='string' && msg.substr(0,1)==='{') {
			var data = JSON.parse(msg);
		} else {
			var data = {'message': msg, 'title': title};
		}
	}

	if(!data.indicator) {
		data.indicator = 'blue';
	}

	if(data.message instanceof Array) {
		data.message.forEach(function(m) {
			frappe.msgprint(m);
		});
		return;
	}

	if(data.alert) {
		frappe.show_alert(data);
		return;
	}

	if(!frappe.msg_dialog) {
		frappe.msg_dialog = new frappe.ui.Dialog({
			title: __("Message"),
			onhide: function() {
				if(frappe.msg_dialog.custom_onhide) {
					frappe.msg_dialog.custom_onhide();
				}
				frappe.msg_dialog.msg_area.empty();
			},
			minimizable: data.is_minimizable || is_minimizable
		});

		// class "msgprint" is used in tests
		frappe.msg_dialog.msg_area = $('<div class="msgprint">')
			.appendTo(frappe.msg_dialog.body);

		frappe.msg_dialog.clear = function() {
			frappe.msg_dialog.msg_area.empty();
		}

		frappe.msg_dialog.indicator = frappe.msg_dialog.header.find('.indicator');
	}

	// setup and bind an action to the primary button
	if (data.primary_action) {
		if (data.primary_action.server_action && typeof data.primary_action.server_action === 'string') {
			data.primary_action.action = () => {
				frappe.call({
					method: data.primary_action.server_action,
					args: {
						args: data.primary_action.args
					},
					callback() {
						if (data.primary_action.hide_on_success) {
							frappe.hide_msgprint();
						}
					}
				});
			}
		}

		if (data.primary_action.client_action && typeof data.primary_action.client_action === 'string') {
			let parts = data.primary_action.client_action.split('.');
			let obj = window;
			for (let part of parts) {
				obj = obj[part];
			}
			data.primary_action.action = () => {
				if (typeof obj === 'function') {
					obj(data.primary_action.args);
				}
			}
		}

		frappe.msg_dialog.set_primary_action(
			__(data.primary_action.label || "Done"),
			data.primary_action.action
		);
	} else {
		if (frappe.msg_dialog.has_primary_action) {
			frappe.msg_dialog.get_primary_btn().addClass('hide');
			frappe.msg_dialog.has_primary_action = false;
		}
	}

	if (data.secondary_action) {
		frappe.msg_dialog.set_secondary_action(data.secondary_action.action);
		frappe.msg_dialog.set_secondary_action_label(__(data.secondary_action.label || "Close"));
	}

	if(data.message==null) {
		data.message = '';
	}

	if(data.message.search(/<br>|<p>|<li>/)==-1) {
		msg = frappe.utils.replace_newlines(data.message);
	}

	var msg_exists = false;
	if(data.clear) {
		frappe.msg_dialog.msg_area.empty();
	} else {
		msg_exists = frappe.msg_dialog.msg_area.html();
	}

	if(data.title || !msg_exists) {
		// set title only if it is explicitly given
		// and no existing title exists
		frappe.msg_dialog.set_title(data.title || __('Message'));
	}

	// show / hide indicator
	if(data.indicator) {
		frappe.msg_dialog.indicator.removeClass().addClass('msgprint-dialog-icon');
		frappe.msg_dialog.header.find('.modal-title').removeClass().addClass('modal-title title-'+data.indicator);
		frappe.msg_dialog.header.addClass('modal-header-'+data.indicator);
	} else {
		frappe.msg_dialog.indicator.removeClass().addClass('hidden');
	}

	// width
	if (data.wide) {
		// msgprint should be narrower than the usual dialog
		if (frappe.msg_dialog.wrapper.classList.contains('msgprint-dialog')) {
			frappe.msg_dialog.wrapper.classList.remove('msgprint-dialog');
		}
	} else {
		// msgprint should be narrower than the usual dialog
		frappe.msg_dialog.wrapper.classList.add('msgprint-dialog');
	}

	if (data.scroll) {
		// limit modal height and allow scrolling instead
		frappe.msg_dialog.body.classList.add('msgprint-scroll');
	} else {
		if (frappe.msg_dialog.body.classList.contains('msgprint-scroll')) {
			frappe.msg_dialog.body.classList.remove('msgprint-scroll');
		}
	}


	if(msg_exists) {
		frappe.msg_dialog.msg_area.append("<hr>");
	// append a <hr> if another msg already exists
	}

	frappe.msg_dialog.msg_area.append(data.message);

	// make msgprint always appear on top
	frappe.msg_dialog.$wrapper.css("z-index", 2000);
	frappe.msg_dialog.show();

	return frappe.msg_dialog;
}

window.msgprint = frappe.msgprint;


// Floating Message
frappe.show_alert = function(message, seconds=7, actions={}) {
	if(typeof message==='string') {
		message = {
			message: message
		};
	}
	if(!$('#dialog-container').length) {
		$('<div id="dialog-container"><div id="alert-container"></div></div>').appendTo('body');
	}

	let body_html;

	if (message.body) {
		body_html = message.body;
	}

	const div = $(`
		<div class="alert desk-alert">
			<div class="alert-message small"><a class="close">${__("Close")}</a></div>
			<div class="alert-body" style="display: none"></div>
		</div>`);

	if(message.indicator) {
		div.find('.alert-message').prepend(`<span class="alert-message-dialog-icon ${message.indicator}">&nbsp;</span><span class="message">${message.message}</span>`);
		div.find('.alert-message').removeClass().addClass('alert-message color-' + message.indicator);
	} else {
		div.find('.alert-message').append(message.message);
	}

	if (body_html) {
		div.find('.alert-body').show().html(body_html);
	}

	div.hide().appendTo("#alert-container").show()
		.css('transform', 'translateX(0)');

	div.find('.close, button').click(function() {
		div.remove();
		return false;
	});

	Object.keys(actions).map(key => {
		div.find(`[data-action=${key}]`).on('click', actions[key]);
	});

	div.delay(seconds * 1000).fadeOut(300);
	return div;
}


// Toolbar, Header
frappe.ui.toolbar.Toolbar = frappe.ui.toolbar.Toolbar.extend({
	init: function() {
		this.pages = {};
		// this.sidebar_items = {};
		this.mobile_sidebar_items = {};
		this.sidebar_categories = [
			"Modules",
			"Domains",
			"Places",
			"Administration"
		];
		this._super();
		// this.make_sidebar();
	},

	make: function() {
		this._super();

		this.page_switcher = $('.navbar-page-switcher').find('.page-switcher'); 
		this.mobile_list = $('.navbar-page-switcher').find('.mobile-list');
		this.current_title = $('.navbar-page-switcher').find(".current-title");

		this.fetch_desktop_settings().then(() => {
			this.route();
			this.make_sidebar();
		});
	},

	route: function() {
		let page = this.get_page_to_show();
		this.show_page(page);
	},

	remake_sidebar: function() {
		const get_sidebar_item = function(item) {
			return $(`<a href="${"desk#workspace/" +
				item.name}" class="sidebar-item ${
				item.selected ? "selected" : ""
			}">
					<span>${item.label || item.name}</span>
				</div>`);
		};

		const make_sidebar_category_item = item => {
			if (item.name == this.get_page_to_show()) {
				item.selected = true;
				this.current_page = item.name;
			}
			let $item = get_sidebar_item(item);
			let $mobile_item = $item.clone();

			// Se comenta porque no se quiere crear el sidebar
			// solo se quiere crear mobile_list que nos servirá para
			// el desktop
			// $item.appendTo(this.sidebar);
			// this.sidebar_items[item.name] = $item;
			
			$mobile_item.appendTo(this.mobile_list);
			this.mobile_sidebar_items[item.name] = $mobile_item;
		};

		const make_category_title = name => {
			// DO NOT REMOVE: Comment to load translation
			// __("Modules") __("Domains") __("Places") __("Administration")
			let $title = $(
				`<div class="sidebar-group-title h6 uppercase">${__(name)}</div>`
			);
			$title.appendTo(this.sidebar);
			$title.clone().appendTo(this.mobile_list);
		};

		this.sidebar_categories.forEach(category => {
			if (this.desktop_settings.hasOwnProperty(category)) {
				make_category_title(category);
				this.desktop_settings[category].forEach(item => {
					make_sidebar_category_item(item);
				});
			}
		});

		this.sidebar_item = $('.navbar-page-switcher').find(".sidebar-item");
		this.sidebar_group_title = $('.navbar-page-switcher').find(".sidebar-group-title");
		this.sidebar_item.on('click', () => {
			this.fetch_desktop_settings().then(() => {
				this.sidebar_group_title.detach();
				this.sidebar_item.detach();
				this.route();
				this.remake_sidebar();
			});
		});
	},

	make_sidebar: function() {
		const get_sidebar_item = function(item) {
			return $(`<a href="${"desk#workspace/" +
				item.name}" class="sidebar-item ${
				item.selected ? "selected" : ""
			}">
					<span>${item.label || item.name}</span>
				</div>`);
		};

		const make_sidebar_category_item = item => {
			if (item.name == this.get_page_to_show()) {
				item.selected = true;
				this.current_page = item.name;
			}
			let $item = get_sidebar_item(item);
			let $mobile_item = $item.clone();

			$mobile_item.appendTo(this.mobile_list);
			this.mobile_sidebar_items[item.name] = $mobile_item;
		};

		const make_category_title = name => {
			// DO NOT REMOVE: Comment to load translation
			// __("Modules") __("Domains") __("Places") __("Administration")
			let $title = $(
				`<div class="sidebar-group-title h6 uppercase">${__(name)}</div>`
			);
			$title.appendTo(this.sidebar);
			$title.clone().appendTo(this.mobile_list);
		};

		this.sidebar_categories.forEach(category => {
			if (this.desktop_settings.hasOwnProperty(category)) {
				make_category_title(category);
				this.desktop_settings[category].forEach(item => {
					make_sidebar_category_item(item);
				});
			}
		});
		this.sidebar_item = $('.navbar-page-switcher').find(".sidebar-item");
		this.sidebar_group_title = $('.navbar-page-switcher').find(".sidebar-group-title");
		this.sidebar_item.on('click', () => {
			this.fetch_desktop_settings().then(() => {
				this.sidebar_group_title.detach();
				this.sidebar_item.detach();
				this.route();
				this.remake_sidebar();
			});
		});

		if (frappe.is_mobile) {
			this.page_switcher.on('click', () => {
				this.mobile_list.toggle();
			});
		}
	},

	show_page: function(page) {
		// Se agrega workaround para evitar mensaje de documento extraviado
		const default_page = this.desktop_settings
			? this.desktop_settings["Modules"][0].name
			: frappe.boot.allowed_workspaces[0].name;

		route_page = this.desktop_settings && this.desktop_settings["Modules"].find((page) => {page.name === frappe.get_route()[1] ? page.name : false });
		page = this.mobile_sidebar_items[page] ? page : false || this.mobile_sidebar_items[frappe.get_route()[1]] || localStorage.current_desk_page || default_page;

		if (this.current_page && this.pages[this.current_page]) {
			this.pages[this.current_page].hide();
		}
		// end

		if (this.current_page && this.pages[this.current_page]) {
			this.pages[this.current_page].hide();
		}

		if (this.sidebar_items && this.sidebar_items[this.current_page]) {
			this.sidebar_items[this.current_page].removeClass("selected");
			this.mobile_sidebar_items[this.current_page].removeClass("selected");
			
			this.sidebar_items[page].addClass("selected");
			this.mobile_sidebar_items[page].addClass("selected");
		}
		this.current_page = page;
		this.mobile_list.hide();
		this.current_title.empty().append(__(this.current_page));
		localStorage.current_desk_page = page;
		this.pages[page] ? this.pages[page].show() : this.make_page(page);
	},

	get_page_to_show: function() {
		const default_page = this.desktop_settings
			? this.desktop_settings["Modules"][0].name
			: frappe.boot.allowed_workspaces[0].name;

		let page =
			frappe.get_route()[1] ||
			localStorage.current_desk_page ||
			default_page;

		return page;
	},

	fetch_desktop_settings: function() {
		return frappe
			.call("frappe.desk.desktop.get_desk_sidebar_items")
			.then(response => {
				if (response.message) {
					this.desktop_settings = response.message;
				} else {
					frappe.throw({
						title: __("Couldn't Load Desk"),
						message:
							__("Something went wrong while loading Desk. <b>Please relaod the page</b>. If the problem persists, contact the Administrator"),
						indicator: "red",
						primary_action: {
							label: __("Reload"),
							action: () => location.reload()
						}
					});
				}
			});
	},

	make_page(page) {
		const $page = new DesktopPage({
			container: this.body,
			page_name: page
		});

		this.pages[page] = $page;
		return $page;
	}
})


class DesktopPage {
	constructor({ container, page_name }) {
		frappe.desk_page = this;
		this.container = container;
		this.page_name = page_name;
		this.sections = {};
		this.allow_customization = false;
		this.reload();
	}

	show() {
		frappe.desk_page = this;
		this.page.show();
		if (this.sections.shortcuts) {
			this.sections.shortcuts.widgets_list.forEach(wid => {
				wid.set_actions();
			});
		}
	}

	hide() {
		this.page.hide();
	}

	reload() {
		this.in_customize_mode = false;
		this.page && this.page.remove();
		this.make();
		this.setup_events();
	}

	make_customization_link() {
		this.customize_link = $(`<div class="small customize-options" style="cursor: pointer;">${__('Customize Workspace')}</div>`);
		this.customize_link.appendTo(this.page);
		this.customize_link.on('click', () => {
			this.customize();
		});

		this.save_or_discard_link = $(`<div class="small customize-options small-bounce">
			<span class="save-customization">${__('Save')}</span> / <span class="discard-customization">${__('Discard')}</span>
			</div>`).hide();

		this.save_or_discard_link.appendTo(this.page);
		this.save_or_discard_link.find(".save-customization").on("click", () => this.save_customization());
		this.save_or_discard_link.find(".discard-customization").on("click", () => this.reload());
		this.page.addClass('allow-customization');
	}

	make() {
		this.page = $(`<div class="desk-page" data-page-name=${this.page_name}></div>`);
		this.page.appendTo(this.container);

		this.get_data().then(res => {
			this.data = res.message;
			if (!this.data) {
				delete localStorage.current_desk_page;
				frappe.set_route("workspace");
				return;
			}

			this.refresh();
		});
	}

	refresh() {
		this.page.empty();
		this.allow_customization = this.data.allow_customization || false;

		if (frappe.is_mobile()) {
			this.allow_customization = false;
		}

		this.allow_customization && this.make_customization_link();
		this.data.onboarding && this.data.onboarding.items.length && this.make_onboarding();
		this.make_charts().then(() => {
			this.make_shortcuts();
			this.make_cards();

			if (this.allow_customization) {
				// Move the widget group up to align with labels if customization is allowed
				$('.desk-page .widget-group:visible:first').css('margin-top', '-25px');
			}
		});
	}

	get_data() {
		return frappe.call("frappe.desk.desktop.get_desktop_page", {
			page: this.page_name
		});
	}

	setup_events() {
		$(document.body).on('toggleFullWidth', () => this.refresh());
	}

	customize() {
		if (this.in_customize_mode) {
			return;
		}

		// It may be possible the chart area is hidden since it has no widgets
		// So the margin-top: -25px would be applied to the shortcut group
		// We need to remove this as the  chart group will be visible during customization
		$('.widget.onboarding-widget-box').hide();
		$('.desk-page .widget-group:visible:first').css('margin-top', '0px');

		this.customize_link.hide();
		this.save_or_discard_link.show();

		Object.keys(this.sections).forEach(section => {
			this.sections[section].customize();
		});
		this.in_customize_mode = true;

		// Move the widget group up to align with labels if customization is allowed
		$('.desk-page .widget-group:visible:first').css('margin-top', '-25px');
	}

	save_customization() {
		const config = {};

		if (this.sections.charts) config.charts = this.sections.charts.get_widget_config();
		if (this.sections.shortcuts) config.shortcuts = this.sections.shortcuts.get_widget_config();
		if (this.sections.cards) config.cards = this.sections.cards.get_widget_config();

		frappe.call('frappe.desk.desktop.save_customization', {
			page: this.page_name,
			config: config
		}).then(res => {
			if (res.message) {
				frappe.msgprint({ message: __("Customizations Saved Successfully"), title: __("Success")});
				this.reload();
			} else {
				frappe.throw({message: __("Something went wrong while saving customizations"), title: __("Failed")});
				this.reload();
			}
		});
	}

	make_onboarding() {
		this.onboarding_widget = frappe.widget.make_widget({
			label: this.data.onboarding.label || __(`Let's Get Started`),
			subtitle: this.data.onboarding.subtitle,
			steps: this.data.onboarding.items,
			success: this.data.onboarding.success,
			docs_url: this.data.onboarding.docs_url,
			widget_type: 'onboarding',
			container: this.page,
			options: {
				allow_sorting: false,
				allow_create: false,
				allow_delete: false,
				allow_hiding: false,
				allow_edit: false,
				max_widget_count: 2,
			}
		});
	}

	make_charts() {
		return frappe.dashboard_utils.get_dashboard_settings().then(settings => {
			let chart_config = settings.chart_config ? JSON.parse(settings.chart_config): {};
			if (this.data.charts.items) {
				this.data.charts.items.map(chart => {
					chart.chart_settings = chart_config[chart.chart_name] || {};
				});
			}

			this.sections["charts"] = new frappe.widget.WidgetGroup({
				title: this.data.charts.label || __('{} Dashboard', [__(this.page_name)]),
				container: this.page,
				type: "chart",
				columns: 1,
				hidden: Boolean(this.onboarding_widget),
				options: {
					allow_sorting: this.allow_customization,
					allow_create: this.allow_customization,
					allow_delete: this.allow_customization,
					allow_hiding: false,
					allow_edit: true,
					max_widget_count: 2,
				},
				widgets: this.data.charts.items
			});
		});
	}

	make_shortcuts() {
		this.sections["shortcuts"] = new frappe.widget.WidgetGroup({
			title: this.data.shortcuts.label || __('Your Shortcuts'),
			container: this.page,
			type: "shortcut",
			columns: 3,
			options: {
				allow_sorting: this.allow_customization,
				allow_create: this.allow_customization,
				allow_delete: this.allow_customization,
				allow_hiding: false,
				allow_edit: true,
			},
			widgets: this.data.shortcuts.items
		});
	}

	make_cards() {
		let cards = new frappe.widget.WidgetGroup({
			title: this.data.cards.label || __(`Reports & Masters`),
			container: this.page,
			type: "links",
			columns: 3,
			options: {
				allow_sorting: this.allow_customization,
				allow_create: false,
				allow_delete: false,
				allow_hiding: this.allow_customization,
				allow_edit: false,
			},
			widgets: this.data.cards.items
		});

		this.sections["cards"] = cards;

		const legend = [
			{
				color: "blue",
				description: __("Important")
			},
			{
				color: "orange",
				description: __("No Records Created")
			}
		].map(item => {
			return `<div class="legend-item small text-muted justify-flex-start">
				<span class="indicator ${item.color}"></span>
				<span class="link-content ellipsis" draggable="false">${item.description}</span>
			</div>`;
		});

		$(`<div class="legend">
			${legend.join("\n")}
		</div>`).insertAfter(cards.body);
	}
}

// End Toolbar, Header