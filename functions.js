if(localStorage.getItem('saved')){
  document.getElementById('code').value = localStorage.getItem('saved');
  localStorage.removeItem("saved");
}
// add our keyamp from github
var vimBinding = document.createElement('script');
vimBinding.setAttribute('src', 'vim.js');
 
 
// browser support for onload may be iffy ...
vimBinding.onload = function () {
  var vim = new VIM();

  Array.prototype.forEach.call(document.querySelectorAll('textarea'), function (instance){
      vim.attach_to(instance);
  });
};

if(localStorage.getItem('vim') == 'true'){
  document.body.appendChild(vimBinding);
}

var num_notes = 0;
var is_darkmode = false;

window.addEventListener("unload", saveCurrent);
document.getElementById("vim").addEventListener("click", toggleVim);
document.getElementById("darkmode").addEventListener("click", toggleDarkmode);
document.getElementById("note").addEventListener("click", saveNote);
document.getElementById("clearing").addEventListener("click", clearNotes);

function saveCurrent(){
  localStorage.setItem('saved', document.getElementById('code').value);
}

if(localStorage.getItem('vim') == 'true'){
  $('#vim').attr('checked', true);
}

if(localStorage.getItem('darkmode') == 'true'){
  $('#darkmode').attr('checked', true);
}

searchUrbanDict = function(word){
    var query = word.selectionText;
    copyText(query);
};

function darkmodeOn() {
		is_darkmode = true;
		$('body').addClass('darkmode-main');
		$('#dm-enable-text').addClass('darkmode-contrast');
		$('#vim-enable-text').addClass('darkmode-contrast');
		$('#code').addClass('darkmode-second');

		for ( var i = 0; i <= num_notes; i++ ) {
				$(`#${i}done`).addClass('darkmode-contrast');
				$(`#${i}button`).addClass('darkmode-contrast');
				$(`#${i}edit`).addClass('darkmode-contrast');
				$(`#${i}contentscode`).addClass('darkmode-contrast');
				$(`#${i}contentspre`).addClass('darkmode-third');
		}
}

function darkmodeOff() {
		is_darkmode = false;
		$('body').removeClass('darkmode-main');
		$('#dm-enable-text').removeClass('darkmode-contrast');
		$('#vim-enable-text').removeClass('darkmode-contrast');
		$('#code').removeClass('darkmode-second');

		for ( var i = 0; i < num_notes; i++ ) {
				$(`#${i}done`).removeClass('darkmode-contrast');
				$(`#${i}button`).removeClass('darkmode-contrast');
				$(`#${i}edit`).removeClass('darkmode-contrast');
				$(`#${i}contentscode`).removeClass('darkmode-contrast');
				$(`#${i}contentspre`).removeClass('darkmode-third');
		}

}

if(localStorage.getItem('darkmode') == 'true'){
		darkmodeOn();
}

function toggleDarkmode() {
		console.log(`in toggle darkmode`);
		if(localStorage.getItem('darkmode')){
				if(localStorage.getItem('darkmode') === 'true') {
						localStorage.setItem('darkmode', 'false');
						saveCurrent();
						// turn off darkmode
						darkmodeOff();
				} else {
						localStorage.setItem('darkmode', 'true');
						darkmodeOn();
				}
		}else {
				localStorage.setItem('darkmode', 'true');
				darkmodeOn();
		}
}


function toggleVim(){
  if(localStorage.getItem('vim')){
    if(localStorage.getItem('vim') === 'true'){
      localStorage.setItem('vim', 'false');
      saveCurrent();
      location.reload();
    }else{
      localStorage.setItem('vim', 'true');
      document.body.appendChild(vimBinding);
    }
  }else{
    localStorage.setItem('vim', 'true');
    document.body.appendChild(vimBinding);
  }
}


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
        done_button = '<button value="' + count + '" id="' + count + 'done' + '" class="material-icons note_close">done</button>';
        close_button = '<button value="' + count + '" id="' + count + 'button' + '" class="material-icons note_close">close</button>';
        edit_button = '<button value="' + count + '" id="' + count + 'edit' + '" class="material-icons note_close">mode_edit</button>';
        if(element.includes("{completed}")){
          element = element.replace("{completed}", "");
          note_content = '<pre class="completed"><code><xmp class="breaker">' + element + '</xmp></code></pre>';
        }else{
						note_content = '<pre id="' + count + 'contentspre" ><code id="' + count + 'contentscode"><xmp class="breaker">' + element + '</xmp></code></pre>'
        }
        note_structure = done_button + close_button + edit_button + note_content;

        $('#user_notes').append(note_structure);
        document.getElementById(count + 'done').addEventListener("click", completedNote);
        document.getElementById(count + 'button').addEventListener("click", removeNote);
        document.getElementById(count + 'edit').addEventListener("click", editNote);
        count += 1;
      }
    });
			num_notes = count;
		  if ( is_darkmode ) { darkmodeOn(); }
  }
}

function completedNote(){
  var count = this.value;
  var stored = localStorage.getItem("notes");
  if(stored !== null){
    stored = stored.split("{break}");
    if(!stored[count].includes("{completed}")){
      stored[count] += "{completed}";
      stored = stored.join("{break}");
      localStorage.setItem("notes", stored);
      loadNotes();
    }else{
      stored[count] = stored[count].replace("{completed}", "");
      stored = stored.join("{break}");
      localStorage.setItem("notes", stored);
      loadNotes();
      }
    }
}

function editNote(){
  var count = this.value;
  var stored = localStorage.getItem("notes");
  if(stored !== null){
    stored = stored.split("{break}");
    var note = stored[count];
    note = note.replace("{completed}", "");
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
