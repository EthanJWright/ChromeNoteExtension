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



/* https://stackoverflow.com/questions/5743916/how-to-add-autoindent-to-html-textarea  */
$("textarea").keydown(function(e)
{
    if (e.which == 9) //ASCII tab
    {
        e.preventDefault();
        var start = this.selectionStart;
        var end = this.selectionEnd;
        var v = $(this).val();
        if (start == end)
        {
            $(this).val(v.slice(0, start) + "    " + v.slice(start));
            this.selectionStart = start+4;
            this.selectionEnd = start+4;
            return;
        }

        var selectedLines = [];
        var inSelection = false;
        var lineNumber = 0;
        for (var i = 0; i < v.length; i++)
        {
            if (i == start)
            {
                inSelection = true;
                selectedLines.push(lineNumber);
            }
            if (i >= end)
                inSelection = false;

            if (v[i] == "\n")
            {
                lineNumber++;
                if (inSelection)
                    selectedLines.push(lineNumber);
            }
        }
        var lines = v.split("\n");
        for (var i = 0; i < selectedLines.length; i++)
        {
            lines[selectedLines[i]] = "    " + lines[selectedLines[i]];
        }

        $(this).val(lines.join("\n"));
    }
});
$("textarea").keypress(function(e)
{
    if (e.which == 13) // ASCII newline
    {
        setTimeout(function(that)
        {
            var start = that.selectionStart;
            var v = $(that).val();
            var thisLine = "";
            var indentation = 0;
            for (var i = start-2; i >= 0 && v[i] != "\n"; i--)
            {
                thisLine = v[i] + thisLine;
            }
            for (var i = 0; i < thisLine.length && thisLine[i] == " "; i++)
            {

                indentation++;
             }
             $(that).val(v.slice(0, start) + " ".repeat(indentation) + v.slice(start));
             that.selectionStart = start+indentation;
             that.selectionEnd = start+indentation;  
}, 0.01, this);
     }
});
