daoclient.DaoYoutube = function () {

  this.url = settings.contextPath + "api/youtube/";

  this.insert = function (obj, email) {
    return $.post({
      url: this.url + "insert/",
      data: {
        email: email,
        nome: obj.fields.nome,
        link: obj.fields.link,
        is_playlist: obj.fields.is_playlist,
      },
      contentType: "application/json",
      dataType: 'json',
      headers: {
        "content-type": "application/x-www-form-urlencoded",
        "cache-control": "no-cache",
      }
    });
  };

  this.select_all = function (email) {
    return $.post({
      url: this.url + "select_all/",
      data: {
        email: email,
      },
      contentType: "application/json",
      dataType: 'json',
      headers: {
        "content-type": "application/x-www-form-urlencoded",
        "cache-control": "no-cache",
      }
    });
  };

  this.delete = function (obj, token) {
    return $.post({
      url: this.url + "delete/",
      data: {
        pk: obj.pk,
      },
      contentType: "application/json",
      dataType: 'json',
      headers: {
        "content-type": "application/x-www-form-urlencoded",
        "cache-control": "no-cache",
        "Authorization":  'Bearer ' + token
      }
    });
  };

};
