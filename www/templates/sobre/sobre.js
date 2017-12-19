// $(document).ready(function() {

Vue.component('sobre', {
	template: $.readFile('templates/sobre/sobre.html'),

	data: function() {
		var self = this;
		var rc_data = {
		};
		return rc_data;
	},

	mounted: function() {
		var self = this;
		mdc.autoInit();
	},

	methods: {

	},
});
