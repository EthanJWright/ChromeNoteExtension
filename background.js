searchUrbanDict = function(word){
    var query = word.selectionText;
    copyText(query);
};

chrome.contextMenus.create({
    title: "Add As Note",
    id: "note",
    contexts:["selection"],
    onclick: searchUrbanDict
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
