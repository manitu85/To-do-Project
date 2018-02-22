window.onload = init;
function init() {
// GLOBALE SCOPE 
  time();
  clock();
  addTaskItem();
  addButtonItem();
  effectHover();
  crossListItem();
  editListItem();
  deleteTaskItem();
  clearCompletedTaskItems() 
  showHideTaskItems();
  checkAndTransferItem();
}

// Methods:

// createTask - put together components inside LI for task items and append
function createTaskItem(string) {
  // select elements
  var undone = document.getElementById("incomplete");   //ul class""incomplete"
  var listEl = document.createElement("li");
  var inputTask = document.getElementById("input");

  // create input value and append
  var textNode = document.createTextNode(string);
  inputTask.value = string;

  // create checkbox input and append
  var checkBox = document.createElement("input");
  checkBox.type = "checkbox";
  checkBox.className = "undone";

  // create span, delete fa-icon and append
  var spanDel = document.createElement("span");
  spanDel.innerHTML = "<i class='fa fa-trash'></i>";
  spanDel.setAttribute("class", "delete");

  // create span, edit fa-icon and append
  var spanEdit = document.createElement("span");
  spanEdit.innerHTML = "<i class='fa fa-pencil'></i>";
  spanEdit.setAttribute("class", "edit");

  // first all LI elements we group into fragment, than append..
  var docFrag = document.createDocumentFragment(); 
  docFrag.appendChild(listEl);
  listEl.appendChild(textNode);
  listEl.appendChild(checkBox);
  listEl.appendChild(spanDel);
  listEl.appendChild(spanEdit);
  undone.appendChild(docFrag);
  
  // callback all appended elements to LI
  return listEl; 
}


// add task and string value with keypress
function addTaskItem() {
    var inputTask = document.getElementById("input");
    inputTask.addEventListener("keypress", function(el) {
      var code = el.which || el.keyCode;
      if (code === 13) {
        // when hit enter
        if (inputTask.value !== "null" && inputTask.value !== "") {
          createTaskItem(input.value); 
          inputTask.value = ""; 
          } else {
            alert("You must write something in the field!!!");
          }
        }
      });
  }


// add task and string value with add button - ponavlja se deo koda, jel mogu obe funkcije da budu jedna
  function addButtonItem() {
      document.getElementById("add-btn").addEventListener('click', function (el) {
        var inputTask = document.getElementById("input");
        var checkInput= inputTask.value !== "null" && inputTask.value !== ""; // ili je bolje ovako da stavim proveru u varijablu
          if (checkInput) {
            createTaskItem(input.value);
            inputTask.value = "";
          } else {
            alert("Man you are seriously damaged!!!");
          }
      });
  }


  // Hover efekat over list item (mouseover, mouseout events) - kako da skratim kod kada ima dve razlicita eventa   
  function effectHover() {
      var ul = document.getElementById("incomplete");  
      ul.addEventListener("mouseover", function (el) {
        checkHover = el.target.tagName.toLowerCase() == "li"; 
        if (checkHover) {
          el.target.classList.add("selected");
          }
      });
      ul.addEventListener("mouseout", function (el) {
        checkHover = el.target.tagName.toLowerCase() == "li";
        if (checkHover) {
          el.target.classList.remove("selected");
        }
      });
  }


// crossing the list item 
  function crossListItem() {
      document.getElementById("incomplete").addEventListener('click', function (el) {
        var checkCross = el.target.tagName.toLowerCase() == 'li';
        if (checkCross) {
          el.target.classList.toggle("cross");
          }
      });
  }


// function EditListItem () 
  function editListItem() {
      document.getElementById("incomplete").addEventListener('click', function (el) {
        var target = el.target;
        if (target.tagName.toLowerCase() == 'i') {
          target = el.target.parentElement;
        }
        var containsClass = target.tagName.toLowerCase() == 'span' && target.classList.contains('edit');
        if (containsClass) {
          promptForItem(target);
          el.stopImmediatePropagation();
        }
        function promptForItem(target) {
          target = target.parentNode;
          console.log(target.childNodes);
          var newText = prompt("change your item");
          if (!newText || newText == "" || newText == " ") {
            return false;
          }
          target.childNodes[2].textContent = newText;
        }
      });
  }


// delete the list item 
  function deleteTaskItem() {
      document.getElementById("incomplete").addEventListener('click', function (el) {
          var target = el.target;
          if (target.tagName.toLowerCase() == 'i') {
            target = el.target.parentElement;
          }
          var containsClass = target.tagName.toLowerCase() == 'span' && target.classList.contains('delete');
          if (containsClass) {
            fadeOutEffect(target.parentElement, function () {
              target.parentElement.remove();
            });
            el.stopImmediatePropagation();
          }
  });
  // function FadeOutEffect
  function fadeOutEffect(el,callback) {
      var fadeTarget = el;
      var fadeEffect = setInterval(function () {
             if (!fadeTarget.style.opacity) {
                  fadeTarget.style.opacity = 1;
            }
            if (fadeTarget.style.opacity < 0.1) {
                  clearInterval(fadeEffect);
            } else {
                  fadeTarget.style.opacity -= 0.1;
            }
      }, 100);
      setTimeout(callback, 1000);
    }
  }


//  clear all completed items
function clearCompletedTaskItems() {
    document.getElementById("clear-btn").addEventListener('click', clearAll);
      function clearAll() {
          var ul = document.getElementById('completed');
          return ul.innerHTML = "";
      } 
}


// show|Hide Task Items
function showHideTaskItems() {
    document.getElementById("plus").addEventListener("click", function () {
      var el = document.getElementById("incomplete");
      if (el.style.display != "none") {
        el.style.display = "none";
      }
      else {
        el.style.display = '';
      }
    });
    document.getElementById("plus-plus").addEventListener("click", function () {
      var el = document.getElementById("completed");
      if (el.style.display != "none") {
        el.style.display = "none";
      }
      else {
        el.style.display = '';
      }
    });
  }


// Move finished list item to completed ul
  function checkAndTransferItem(){
      document.getElementById("incomplete").addEventListener("click", function (event) {
          var target = event.target;
          if (target.tagName.toLowerCase() == "input") {
            var deda = target.parentNode;
            target.className = "completed";
            if (target.checked) {
              document.getElementById("completed").appendChild(deda);
            }
          }
        });
      document.getElementById("completed").addEventListener("click", function (event) {
          var target = event.target;
          if (target.tagName.toLowerCase() == "input") {
            var deda = target.parentNode;
            target.className = "undone";
            if (!target.checked) {
              document.getElementById("incomplete").appendChild(deda);
            }
          }
        });
  }


// date input
  function time() {
      var date = new Date();
      return (document.getElementById("date-display").innerHTML = date.toDateString());
  }


// create a new Date object 
  function clock() {
    var time = new Date(),
      hours = time.getHours(),
      minutes = time.getMinutes(),
      seconds = time.getSeconds();

    document.querySelectorAll(".clock")[0].innerHTML =
      zero(hours) + ":" + zero(minutes) + ":" + zero(seconds);

    function zero(standIn) {
      if (standIn < 10) {
        standIn = "0" + standIn;
      }
      return standIn;
    }
  }
  setInterval(clock, 1000);