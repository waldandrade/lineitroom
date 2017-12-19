Vue.component('activate-box-medico', {
	template: $.readFile('templates/system/activate/box_medico/activate_box_medico.html'),

	props: {
		exemplo: {
			default: function() {},
		}
	},

	beforeMount: function() {
		var self = this;
		console.log("activate-box-medico: beforeMount");
		if (!self.$root.checkCookie("nome_medico")) {
			self.$root.$router.push({name: "update-medico"});
		} else {
			self.$root.user.nome_medico = self.$root.getCookie("nome_medico");
		}
	},

	mounted: function() {
		var self = this;
		window.mdc.autoInit(/* root */ document, () => {});
		console.log("activate-box-medico: mounted");
		if (self.$root.checkCookie("email") && self.$root.checkCookie("nome_filter") &&
				self.$root.checkCookie("chave")) {
			self.email = self.$root.getCookie("email");
			self.nome_filter = self.$root.getCookie("nome_filter");
			self.chave = self.$root.getCookie("chave");
			var clinica = {fields: {email: self.email}}
			setTimeout(function() {
				self.check(null, clinica);
			}, 500);
		} else {
			self.carregando = false;
			// self.filter();
		}
	},

	data: function() {
		var self = this;
		var data = {};
		data['chave'] = null;
		data['tem_acesso'] = true;
		data['list_clinicas'] = [];
		data['nome_filter'] = "";
		data['email'] = null;
		data['carregando'] = true;

		return data;
	},

	methods: {
		check: function(event, clinica) {
			if (event) event.preventDefault();
			var self = this;
			self.email = clinica.fields.email;
			new daoclient.DaoBox().check({ip:self.$root.user.local_ip, email:self.email, chave:self.chave}, this.$root.user.token)
			.done(function(data) {
				console.log(data);
				self.$root.user.firebase = {};
				self.$root.user.firebase['email'] = self.email;
				self.$root.setCookie("chave", self.chave, 31);
				self.$root.setCookie("email", self.email, 31);
				self.$root.setCookie("nome_filter", clinica.fields.nome, 31);

				self.$root.user.model = data[0].fields.clinica;
				settings.websocketPath = "http://"+self.$root.user.model.ip_central+":3000/";

				console.log("done");
				self.$root.$router.push({name: "box-medico"});
			})
			.fail(function(data) {
				console.log(data.responseText);

				if (data.responseText.indexOf("Box") !== -1) {
					self.$root.mostrar_msg("Esta máquina ainda não tem acesso ao Box");
					self.tem_acesso = false;
					self.carregando = false;
					self.nome_filter = clinica.fields.nome;
					setTimeout(function() {
						window.mdc.autoInit(/* root */ document, () => {});
					}, 100);
				} else {
					self.$root.mostrar_msg(data.responseText);
				}
			});
		},

		activate: function(event) {
			if (event) event.preventDefault();

			var self = this;
			new daoclient.DaoBox().activate({ip:self.$root.user.local_ip, email:self.email, chave:self.chave}, this.$root.user.token)
			.done(function(data) {
				console.log("done");

				self.$root.user.firebase = {};
				self.$root.user.firebase['email'] = self.email;
				self.$root.setCookie("chave", self.chave, 31);
				self.$root.setCookie("email", self.email, 31);
				self.$root.setCookie("nome_filter", self.nome_filter, 31);

				self.$root.user.model = data[0].fields.clinica;
				settings.websocketPath = "http://"+self.$root.user.model.ip_central+":3000/";

				self.$root.mostrar_msg("Box ativado com sucesso!");
				self.$root.$router.push({name: "box-medico"});
			})
			.fail(function(data) {
				console.log(data.responseText);
				self.$root.mostrar_msg(data.responseText);
			});
		},

		filter: _.debounce(function(event) {
			if (event) event.preventDefault();
			var self = this;
			if (self.nome_filter.length > 0) {
				new daoclient.DaoClinica().filter({nome:self.nome_filter})
				.done(function(data) {
					console.log("done");
					self.list_clinicas = data;
				})
				.fail(function(data) {
					console.log(data.responseText);
					self.$root.mostrar_msg(data.responseText);
				});
			} else {
				self.list_clinicas = [];
			}

		}, 400),

	},

});
