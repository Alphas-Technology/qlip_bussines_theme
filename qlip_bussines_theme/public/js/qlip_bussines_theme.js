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
			.attr("value", "")
			.addClass("floating-select")
	}

})


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