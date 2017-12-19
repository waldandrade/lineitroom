Vue.component('box-medico', {
  template: $.readFile('templates/system/subsystem/box_medico/box_medico.html'),

  data: function() {
    var self = this;

    data = {
      con_ws: null,

      nome_medico: self.$root.user.nome_medico,

      list_filas: [],
      list_senhas: [],
      fila_escolhida: null,

      carregando: false,
      esperando_atender_senha: false,

      // Json to send
      json_to_send: {
        header:{action: null},
        body:{
          senha:{
            _id:null,
          },
          fila:{
            iniciais:null
          },
        },
      },

    };

    return data;
  },

  beforeMount: function() {
    var self = this;
    if (!settings.websocketPath) {
      this.$root.$router.push({name: "activate-box-medico"});
    } else {
      this.con_ws = io(settings.websocketPath+"box_sala");
    }
  },

  mounted: function () {
    var self = this;
    window.mdc.autoInit(/* root */ document, () => {});
    if (settings.websocketPath) {
      init_ws_box_medico(this);
      if (self.$root.checkCookie("nome_medico")) {
  			self.$root.user.nome_medico = self.$root.getCookie("nome_medico");
  		} else {
        self.$root.$router.push({name: 'update-medico'});
      }
    }
  },

  beforeDestroy: function () {
    var self = this;
    if (this.con_ws) {
      this.con_ws.disconnect();
      this.con_ws = null;
      self.$root.io_disconnected = true;
      self.$root.io_connected = false;
      self.$root.io_failed = false;
    }
  },

  methods: {
    atender_senha: function(senha, fila) {
      var self = this;
      console.log("atender_senha, vuejs");
      self.esperando_atender_senha = true;

      self.json_to_send.header.action = 'atender_senha';
      console.log(senha);
      self.json_to_send.body.senha = senha;
      self.json_to_send.body.fila.apelido = senha.fila_sala;
      this.json_to_send.body.fila.nome_medico = fila.medico;

      setTimeout(function() {
        self.con_ws.emit(self.json_to_send.header.action, JSON.stringify(self.json_to_send));
      }, 100);
    },

    desistir_atender_senha: function(senha) {
      var self = this;
      self.json_to_send.header.action = 'desistir_atender_senha';
      self.json_to_send.body.senha = senha;

      self.con_ws.emit(self.json_to_send.header.action, JSON.stringify(self.json_to_send));
    },

    select_all_filas: function() {
      var self = this;
      console.log("select_all_filas, vuejs");
      self.json_to_send.header.action = 'select_all_filas';
      setTimeout(function() {
        self.con_ws.emit(self.json_to_send.header.action, JSON.stringify(self.json_to_send));
      }, 100);
    },

    escolher_fila: function(fila) {
      var self = this;
      console.log(fila);
      self.fila_escolhida = fila;
      self.fila_escolhida.medico = self.nome_medico;
      self.json_to_send.header.action = 'edit_fila';
      self.json_to_send.body.sala = self.fila_escolhida;
      setTimeout(function() {
        self.con_ws.emit(self.json_to_send.header.action, JSON.stringify(self.json_to_send));
      }, 100);
    },

    sair_da_sala: function() {
      var self = this;
      console.log("sair_da_sala, vuejs");
      self.esperando_atender_senha = true;

      self.json_to_send.header.action = 'edit_fila';
      self.fila_escolhida.medico = "";
      self.json_to_send.body.sala = self.fila_escolhida;
      self.fila_escolhida = null;

      setTimeout(function() {
        self.con_ws.emit(self.json_to_send.header.action, JSON.stringify(self.json_to_send));
      }, 100);
    },

  },
});

var init_ws_box_medico = function(comp) {
  var self = comp;

  comp.con_ws.on('connect', function () {
    console.log('Connected');
    comp.select_all_filas();
    self.$root.io_disconnected = false;
    self.$root.io_connected = true;
    self.$root.io_failed = false;
  });

  comp.con_ws.on('disconnect', function(){
    console.log('Disconnect');
    self.$root.io_disconnected = true;
    self.$root.io_connected = false;
    self.$root.io_failed = false;
  });

  comp.con_ws.on('connect_error', function(){
    console.log('connect_error');
    self.$root.io_disconnected = false;
    self.$root.io_connected = false;
    self.$root.io_failed = true;
  });

  comp.con_ws.on('select_all_filas', function(data){
    console.log('select_all_filas event');
    for (var i = 0; i < data.body.fila_sala_list.length; i++) {
      data.body.fila_sala_list[i]['editar'] = false;
    }

    for (var i = 0; i < data.body.senhas_list.length; i++) {
      data.body.senhas_list[i]['editar'] = false;
    }

    comp.list_filas = data.body.fila_sala_list;
    comp.list_senhas = data.body.senhas_list;
  });

  comp.con_ws.on('atualizar_senhas', function(data){
    console.log("atualizar_senhas event");

    var senha = data.body.senha;
    for (var i = 0; i < comp.list_senhas.length; i++) {
      if (senha._id == comp.list_senhas[i]._id) {
        comp.list_senhas.splice(i, 1);
      }
    }

    if (comp.esperando_atender_senha) {
      comp.esperando_atender_senha = false;
      comp.$root.mostrar_msg("Senha atendida");
    }
  });

  comp.con_ws.on('nova_fila', function(data){
    console.log('nova_fila event');
    comp.list_filas.push(data.body.fila);
  });

  comp.con_ws.on('nova_senha', function(data){
    console.log("nova_senha event");
    console.log(data);
    comp.list_senhas.push(data.body.senha);
    if (data.body.senha.fila_sala == comp.fila_escolhida.apelido) {
      comp.$root.mostrar_msg("Existem novas senhas em espera!");
    }
  });

  comp.con_ws.on('edit_fila', function(data){
    console.log("edit_fila event");
    console.log(data);
    comp.select_all_filas();
    if (data.body.sucesso) {
      comp.$root.mostrar_msg("Sala editada com sucesso!");
    } else {
      comp.$root.mostrar_msg("Erro ao editar sala!");
    }
  });
}
