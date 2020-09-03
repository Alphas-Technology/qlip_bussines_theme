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


		// $('.page-switcher').click(() => {
		// 	console.log("HOLA MUNDO");
		// 	// $('.mobile-list').toggle();
		// 	this.mobile_list.toggle();
		// });
		// this.page_switcher.on('click', () => {
		// 	console.log("HOLA MUNDO");
		// 	this.mobile_list.toggle();
		// });
		console.log("POR AQUI PASo");
		this.fetch_desktop_settings().then(() => {
			this.route();
			this.make_sidebar();
			// this.sidebar_item.on('click', () => {
			// 	// this.mobile_list.hide();
			// 	// this.mobile_list.detach();
			// 	console.log("Ingresó al OnClick");
			// 	this.sidebar_group_title.detach();
			// 	this.sidebar_item.detach();
			// 	// $('<div class="mobile-list"></div>').appendTo('#navbar-page-switcher');
			// 	this.route();
			// 	this.remake_sidebar();
			// 	// console.log("SIDEBAR_ITEM");
			// 	// this.fetch_desktop_settings().then(() => {
			// 	// 	// this.mobile_list.detach();
			// 	// 	this.sidebar_item.detach();
			// 	// 	// $('<div class="mobile-list"></div>').appendTo('#navbar-page-switcher');
			// 	// 	console.log("this.mobile_list.detach(): %o", this.mobile_list);
			// 	// 	this.route();
			// 	// 	this.remake_sidebar();
			// 	// });
			// });
		});
	},

	route: function() {
		let page = this.get_page_to_show();
		this.show_page(page);
	},

	remake_sidebar: function() {
		console.log("REMAKE_SIDEBAR");
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
				console.log("Ingresó al OnClick");
				this.sidebar_group_title.detach();
				this.sidebar_item.detach();
				this.route();
				this.remake_sidebar();
			});
		});
	},

	make_sidebar: function() {
		console.log("MAKE_SIDEBAR");
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
			// console.log("Mobile List desde make: %o", this.mobile_list.html());
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
				console.log("Ingresó al OnClick");
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
		console.log("Debería esconder mobile_list");
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