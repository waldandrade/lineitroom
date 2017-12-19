var _router = new VueRouter({
  routes: [
    // Home
    // {
    //   name: 'home',
    //   path: '/',
    //   component: {
    //     template: '<home ref="home" />'
    //   }
    // },

    // Activate
    {
      name: 'activate-box-medico',
      path: '/',
      component: {
        template: '<activate-box-medico ref="activate-box-medico" />'
      }
    },

    // Subsystem
    {
      name: 'box-medico',
      path: '/box-medico',
      component: {
        template: '<box-medico />'
      }
    },

    // Update
    {
      name: 'update-medico',
      path: '/update-medico',
      component: {
        template: '<update-medico />'
      }
    },

    // Sobre
    {
      name: 'sobre',
      path: '/sobre',
      component: {
        template: '<sobre />'
      }
    },
  ]
});

var app = new Vue({
  router: _router,

  mounted: function() {
    var self = this;
    console.log("App: mounted");
    var MDCSnackbar = mdc.snackbar.MDCSnackbar;
    self.snackbar = new MDCSnackbar(document.querySelector('.mdc-snackbar'));
    self.loading.page = false;

    window.mdc.autoInit( /* root */ document, () => {});
  },

  data: {
    loading: {
      page: true,
      user: true,
    },
    user: {
      local_ip: null,
      firebase: null,
      model: null,
      nome_medico: null,
    },
    snackbar: null,
    io_disconnected: true,
    io_connected: false,
    io_failed: false,
    internet_connected: false,
  },

  methods: {
    mostrar_msg: function(msg) {
      var self = this;
      self.snackbar.show({
        message: msg
      });
    },

    setCookie: function(cname, cvalue, exdays) {
      var d = new Date();
      d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
      var expires = "expires=" + d.toUTCString();
      document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
    },

    getCookie: function(cname) {
      var name = cname + "=";
      var decodedCookie = decodeURIComponent(document.cookie);
      var ca = decodedCookie.split(';');
      for (var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') {
          c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
          return c.substring(name.length, c.length);
        }
      }
      return "";
    },

    checkCookie: function(cname) {
      var cookie = this.getCookie(cname);
      if (cookie != "") {
        return true;
      } else {
        return false;
      }
    },

    deleteCookie: function(cname) {
      document.cookie = cname + '=; expires=Thu, 01 Jan 1970 00:00:01 GMT;path=/';
    },

  },

});

// // get the IP addresses associated with an account
// function getIPs(callback) {
//   var ip_dups = {};
//   //compatibility for firefox and chrome
//   var RTCPeerConnection = window.RTCPeerConnection ||
//     window.mozRTCPeerConnection ||
//     window.webkitRTCPeerConnection;
//   var useWebKit = !!window.webkitRTCPeerConnection;
//   //bypass naive webrtc blocking using an iframe
//   if (!RTCPeerConnection) {
//     var win = iframe.contentWindow;
//     RTCPeerConnection = win.RTCPeerConnection ||
//       win.mozRTCPeerConnection ||
//       win.webkitRTCPeerConnection;
//     useWebKit = !!win.webkitRTCPeerConnection;
//   }
//   //minimal requirements for data connection
//   var mediaConstraints = {
//     optional: [{
//       RtpDataChannels: true
//     }]
//   };
//   var servers = {
//     iceServers: [{
//       urls: "stun:stun.services.mozilla.com"
//     }]
//   };
//   //construct a new RTCPeerConnection
//   var pc = new RTCPeerConnection(servers, mediaConstraints);
//
//   function handleCandidate(candidate) {
//     //match just the IP address
//     var ip_regex = /([0-9]{1,3}(\.[0-9]{1,3}){3}|[a-f0-9]{1,4}(:[a-f0-9]{1,4}){7})/
//     var ip_addr = ip_regex.exec(candidate)[1];
//     //remove duplicates
//     if (ip_dups[ip_addr] === undefined)
//       callback(ip_addr);
//     ip_dups[ip_addr] = true;
//   }
//   //listen for candidate events
//   pc.onicecandidate = function(ice) {
//     //skip non-candidate events
//     if (ice.candidate) handleCandidate(ice.candidate.candidate);
//   };
//   //create a bogus data channel
//   pc.createDataChannel("");
//   //create an offer sdp
//   pc.createOffer(function(result) {
//     //trigger the stun server request
//     pc.setLocalDescription(result, function() {}, function() {});
//   }, function() {});
//   //wait for a while to let everything done
//   setTimeout(function() {
//     //read candidate info from local description
//     var lines = pc.localDescription.sdp.split('\n');
//     lines.forEach(function(line) {
//       if (line.indexOf('a=candidate:') === 0)
//         handleCandidate(line);
//     });
//   }, 100);
// }
// //Test: Print the IP addresses into the console
// getIPs(function(ip) {
//   if (app.user.local_ip) {
//     if (app.user.local_ip.indexOf('.') == -1) {
//       app.user.local_ip = ip;
//       console.log("Meu IP: " + app.user.local_ip);
//     } else {
//       console.log("Meu IP: " + app.user.local_ip + " - Outro: " + ip);
//     }
//   } else {
//     app.user.local_ip = ip;
//     console.log("Meu IP: " + app.user.local_ip);
//   }
// });

if (!app._isMounted) {
  app.$mount('#app');
}

var interval_mdc = setInterval(function() {
  window.mdc.autoInit(document, () => {});
  app.internet_connected = navigator.onLine;
}, 500);
