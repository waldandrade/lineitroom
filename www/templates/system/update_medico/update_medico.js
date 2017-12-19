Vue.component('update-medico', {
	template: $.readFile('templates/system/update_medico/update_medico.html'),

	props: {
		exemplo: {
			default: function() {},
		}
	},

	beforeMount: function() {
		var self = this;
		console.log("update-medico: beforeMount");
	},

	mounted: function() {
		var self = this;
		window.mdc.autoInit(/* root */ document, () => {});
		console.log("update-medico: mounted");
		if (self.$root.checkCookie("nome_medico")) {
			self.nome = self.$root.getCookie("nome_medico");
			self.$root.user.nome_medico = self.nome;
		}
	},

	data: function() {
		var self = this;
		var data = {};
		data['nome'] = "";

		return data;
	},

	methods: {
		update_nome: function(event) {
			if (event) event.preventDefault();
			var self = this;
			if (self.nome.length > 0) {
				self.$root.setCookie("nome_medico", self.nome, 31);
				self.$root.user.nome_medico = self.nome;
				self.$root.mostrar_msg("Nome atualizado!");
				self.$root.$router.push({name: "activate-box-medico"});
			} else {
				self.$root.mostrar_msg("Não deixe o nome em branco!");
			}
		},

	},

});
