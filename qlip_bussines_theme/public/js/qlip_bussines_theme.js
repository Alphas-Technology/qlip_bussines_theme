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
		$('<div class="link-field ui-front floating-label" style="position: relative; line-height: 1;">\
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
						<div class="control-input">\
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


