// $(document).ready(function() {

Vue.component('menu-vertical', {
	template: $.readFile('templates/menu/menu.html'),

	data: function() {
		var self = this;
		var rc_data = {
			drawer: null,
			nome_medico: "",
		};
		return rc_data;
	},

	mounted: function() {
		var self = this;
		mdc.autoInit()
		var drawerEl = document.querySelector('.mdc-temporary-drawer');
		var MDCTemporaryDrawer = mdc.drawer.MDCTemporaryDrawer;
		self.drawer = new MDCTemporaryDrawer(drawerEl);
		document.querySelector('.demo-menu').addEventListener('click', function() {
			self.drawer.open = true;
		});
		drawerEl.addEventListener('MDCTemporaryDrawer:open', function() {
			// console.log('Received MDCTemporaryDrawer:open');
		});
		drawerEl.addEventListener('MDCTemporaryDrawer:close', function() {
			// console.log('Received MDCTemporaryDrawer:close');
		});

		setInterval(function() {
			if (self.$root.checkCookie("nome_medico")) {
				self.nome_medico = self.$root.getCookie("nome_medico")
			}
		}, 1000);
	},

	methods: {
		delete_cookies: function() {
			var self = this;
			this.$root.deleteCookie('email');
			this.$root.deleteCookie('nome_filter');
			this.$root.deleteCookie('clinica');
			this.$root.deleteCookie('chave');
			settings.websocketPath = null;
			setTimeout(function() {
				self.$root.$router.push({name: "activate-box-medico"});
			}, 500);
		},
	},
});
