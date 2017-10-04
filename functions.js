document.getElementById("note").addEventListener("click", saveNote);
document.getElementById("clearing").addEventListener("click", clearNotes);

$('#confirm-delete').on('show.bs.modal', function(e) {
      $(this).find('.btn-ok').attr('href', $(e.relatedTarget).data('href'));
});
function loadNotes(){
  $("#user_notes").html('');
  var notes = localStorage.getItem("notes");
  if(notes){
    notes = notes.split("{break}");
    var count = 0;
    notes.forEach(function(element){
      if(element !== null){
        $('#user_notes').append('<button value="' + count + '" id="' + count + 'button' + '" class="material-icons note_close">close</button><pre><code><xmp>' + element + '</xmp></code></pre>');
        document.getElementById(count + 'button').addEventListener("click", removeNote);
        count += 1;
      }
    });
  }
}

function removeNote(){
  var count = this.value;
  var stored = localStorage.getItem("notes");
  if(stored !== null){
    stored = stored.split("{break}");
    stored.splice(count, 1);
    if(stored.length > 0){
      stored = stored.join("{break}");
      localStorage.setItem("notes", stored);
    }else{
      localStorage.removeItem("notes");
    }
    loadNotes();
  }
}

function saveNote(note){
  var entered = document.getElementById('code').value;
  document.getElementById('code').value = "";
  var stored = localStorage.getItem("notes");
  if(entered.length > 0){
    if(stored !== null){
      localStorage.setItem("notes", entered + "{break}" + stored);
    }else{
      localStorage.setItem("notes", entered);
    }
  }
  loadNotes();
}

function clearNotes(){
  localStorage.removeItem("notes");
  loadNotes();
}

document.addEventListener('DOMContentLoaded', function() {
  loadNotes();
}, false);
