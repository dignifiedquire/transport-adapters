var sock = new window.SockJS('/sock');
var connection = new window.sharejs.Connection(sock);
var notes;

sock.onopen = function () {
  notes = connection.get('shared', 'notes')
  notes.subscribe(function(error, data){
    if (typeof notes.type === 'undefined')
      notes.create('text', '', function(){
        onready();
      });
    else
      onready();
  });
}
function onready() {
  var pad = document.getElementById('pad');
  window.shareTextarea(pad, notes.createContext());
};
