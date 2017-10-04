document.getElementById("note").addEventListener("click", saveNote);

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
}

document.addEventListener('DOMContentLoaded', function() {
  loadNotes();
}, false);
