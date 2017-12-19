// $(document).ready(function() {

Vue.component('home', {
	template: $.readFile('templates/home/home.html'),

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
