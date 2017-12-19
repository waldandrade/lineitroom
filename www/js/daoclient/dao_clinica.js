daoclient.DaoClinica = function () {

    this.url = settings.contextPath + "api/clinica/";

    this.filter = function (obj) {
        return $.post({
		    url: this.url + "filter_no_auth/",
		    data: {
		    	nome: obj.nome,
		    },
		    contentType: "application/json",
		    dataType: 'json',
		    headers: {
			    "content-type": "application/x-www-form-urlencoded",
			    "cache-control": "no-cache",
			}
		});

    };

};
