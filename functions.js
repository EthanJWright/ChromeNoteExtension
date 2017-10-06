document.getElementById("note").addEventListener("click", saveNote);
document.getElementById("clearing").addEventListener("click", clearNotes);

searchUrbanDict = function(word){
    var query = word.selectionText;
    copyText(query);
};

$('#confirm-delete').on('show.bs.modal', function(e) {
      $(this).find('.btn-ok').attr('href', $(e.relatedTarget).data('href'));
});

function copyText(entered){
  var stored = localStorage.getItem("notes");
  if(entered.length > 0){
    if(stored !== null){
      localStorage.setItem("notes", entered + "{break}" + stored);
    }else{
      localStorage.setItem("notes", entered);
    }
  }
}

function loadNotes(){
  $("#user_notes").html('');
  var notes = localStorage.getItem("notes");
  if(notes){
    notes = notes.split("{break}");
    var count = 0;
    notes.forEach(function(element){
      if(element !== null){
        $('#user_notes').append('<button value="' + count + '" id="' + count + 'button' + '" class="material-icons note_close">close</button><button value="' + count + '" id="' + count + 'edit' + '" class="material-icons note_close">mode_edit</button><pre><code><xmp class="breaker">' + element + '</xmp></code></pre>');
        document.getElementById(count + 'button').addEventListener("click", removeNote);
        document.getElementById(count + 'edit').addEventListener("click", editNote);
        count += 1;
      }
    });
  }
}

function editNote(){
  var count = this.value;
  var stored = localStorage.getItem("notes");
  if(stored !== null){
    stored = stored.split("{break}");
    var note = stored[count];
    if(document.getElementById('code').value.length > 0){
      document.getElementById('code').value = document.getElementById('code').value + "\n" + note;
    }else{
      document.getElementById('code').value = note;
    }
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
