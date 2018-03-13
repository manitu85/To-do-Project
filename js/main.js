var toDoListApp = (function() {  
  
  window.onload = checkCompletedItemsOnLoad;
  localStorageAvailability(); 
  loadStorage("incompleted", "incomplete");
  loadStorage("completed", "complete");
  showDate();
  showClock();
  setInterval(showClock, 1000);

  // add task - text value with enter keypress and save to storage
  document.getElementById("input").addEventListener("keypress", addTaskItem);

  // add task - text value with add button and save to storage
  document.getElementById("add-btn").addEventListener("click", addButtonItem);

  // main control options
  document.getElementById("incomplete").addEventListener("click", function(event) {
      editListItem(event);
      deleteListItem(event);
      moveIncompletedItems(event);
    });

  document.getElementById("complete").addEventListener("click", function(event) {
      editListItem(event);
      deleteListItem(event);
      moveBackCompletedItems(event);
    });

  var ul = document.getElementById("incomplete");
  // hover effect over the list items
  ul.addEventListener("mouseover", hoverOver);
  ul.addEventListener("mouseout", hoverOut);

  // crossing-off the list item
  ul.addEventListener("click", crossOff);

  // clear all list items and wipe-out completed storage
  document.getElementById("clear-btn").addEventListener("click", clearAllItems);

  // show-hide list items
  document.getElementById("headOne").addEventListener("click", function() {
    headingsClick("incomplete");
  });
  document.getElementById("headTwo").addEventListener("click", function() {
    headingsClick("complete");
  });

// ############################## FUNCTIONS ##############################

// ********************** REGION LOCAL STORAGE ***************************

  // check localStorgae availability
  function localStorageAvailability() {
      if (typeof Storage !== "undefined") {
        console.log("*****************************");
        console.log(" local storage is accessible ");
        console.log("*****************************");
      } else if (typeof Storage == "undefined") {
          alert(
            "Sorry, your browser doesn\'t support the web storage !!! \n Try another browser Google Chrome or Mozzila Firefox."
          );
      }
  }

  // get data from localStorge
  function getItemsFromStorage(storageKey) {
      return localStorage.getItem(storageKey);
  }

  // save data to localStorage
  function saveToStorage(storageKey, item) {
      var storage = getItemsFromStorage(storageKey);
      if (storage === null) {
        storage = "[]";
      }
    var storageParsed = JSON.parse(storage);
    storageParsed.push(item);
    localStorage.setItem(storageKey, JSON.stringify(storageParsed));
  }

  // remove data from localStorage
  function removeItemFromStorage(storageKey, itemToRemove) {
      var items = JSON.parse(getItemsFromStorage(storageKey));
      for (var item = 0; item < items.length; item++) {
        if (items[item] === itemToRemove) {
          items.splice(item, 1);
        }
      }
    localStorage.setItem(storageKey, JSON.stringify(items));
  }

  // clear data from localStorage
  function clearStorage(key) {
      return localStorage.removeItem(key);
  }

  // load data from localStorage
  function loadStorage(storageName, id) {
      var database = getItemsFromStorage(storageName);
      if (database === null) {
        database = "[]";
      }
      var parsed = JSON.parse(database);
      for (var element = 0; element < parsed.length; element++) {
        createTaskItem(parsed[element], id);
      }
    document.getElementById("input").value = "";
  }

  // Check completed list items onload
  function checkCompletedItemsOnLoad() {
      var completedItems = document.querySelectorAll("#complete input");
      for (var item in completedItems) {
        completedItems[item].checked = true;
        var grandpa = completedItems[item].parentNode;
        if (grandpa) {
          grandpa.style.textDecoration = "line-through";
          grandpa.style.color = "#5db65d";
        }
      }
  }

// ***************** REGION INPUT CONTROL ********************

  // create list item
  function createTaskItem(text, id) {
      var undone = document.getElementById(id);
      var tagLi = document.createElement("li");
      tagLi.className = "elTask";
      var inputTask = document.getElementById("input");
      var textNode = document.createTextNode(text);
      inputTask.value = text;
      var checkBox = document.createElement("input");
      checkBox.type = "checkbox";
      checkBox.className = "undone";
      var spanDelete = document.createElement("span");
      spanDelete.innerHTML = "<i class='fa fa-trash'></i>";
      spanDelete.setAttribute("class", "delete");
      var spanEdit = document.createElement("span");
      spanEdit.innerHTML = "<i class='fa fa-pencil'></i>";
      spanEdit.setAttribute("class", "edit");
      // group together LI elements into document fragment and modify all
      var docFrag = document.createDocumentFragment();
      docFrag.appendChild(tagLi);
      tagLi.appendChild(textNode);
      tagLi.appendChild(checkBox);
      tagLi.appendChild(spanDelete);
      tagLi.appendChild(spanEdit);
      undone.appendChild(docFrag);
    return tagLi;
  }

  function addTaskItem(event) {
      var input = document.getElementById("input");
      var code = event.which || event.keyCode;
      if (code === 13) {
        var checkInput = input.value !== "null" && input.value !== "";
        if (checkInput) {
          createTaskItem(input.value, "incomplete");
          saveToStorage("incompleted", input.value);
          input.value = "";
        } else {
          alert("You must write something in the field !!!");
        }
      }
  }

  function addButtonItem() {
      var input = document.getElementById("input");
      var checkInput = input.value !== "null" && input.value !== "";
      if (checkInput) {
        createTaskItem(input.value, "incomplete");
        saveToStorage("incompleted", input.value);
        input.value = "";
      } else {
        alert("You must write something in the field !!!");
      }
  }

// ********************* REGION MAIN CONTROLS **********************

  function editListItem(event) {
      var target = event.target;
      if (target.tagName.toLowerCase() == "i") {
        target = event.target.parentElement;
      }
      var containsClass = target.tagName.toLowerCase() == "span" && target.classList.contains("edit");
      if (containsClass) {
        var liItem = target.parentElement.textContent;
        removeItemFromStorage(target.parentElement.parentElement.id + "d", liItem);
        promptForItem(target, liItem);
        refresh();
        event.stopImmediatePropagation();
      }
  }

  function promptForItem(target, currentValue) {
      target = target.parentNode;
      var newText = prompt("Shift your list item", currentValue);
      if (!newText || newText == "" || newText == " ") {
        return false;
      }
    target.childNodes[0].textContent = newText;
    saveToStorage(target.parentElement.id + "d", newText);
  }

  function refresh() {
      setTimeout(function() {
        location.reload();
      }, 100);
  }

  function deleteListItem(event) {
      var target = event.target;
      if (target.tagName.toLowerCase() == "i") {
        target = event.target.parentElement;
      }
      var containsClass = target.tagName.toLowerCase() == "span" && target.classList.contains("delete");
      if (containsClass) {
        fadeOutEffect(target.parentElement, function() {
          target.parentElement.remove();
      });
      var lisItem = target.parentElement.textContent;
      removeItemFromStorage(target.parentElement.parentElement.id + "d", lisItem);
      event.stopImmediatePropagation();
    }
  }

  function fadeOutEffect(element, callback) {
      var fadeTarget = element;
      var fadeEffect = setInterval(function() {
        if (!fadeTarget.style.opacity) {
          fadeTarget.style.opacity = 1;
        } else if (fadeTarget.style.opacity < 0.1) {
          clearInterval(fadeEffect);
        } else {
          fadeTarget.style.opacity -= 0.1;
        }
    }, 100);
    setTimeout(callback, 1000);
  }

  function clearAllItems() {
      document.getElementById("complete").innerHTML = "";
      clearStorage("completed");
  }

  function moveIncompletedItems(event) {
      var target = event.target;
      if (target.tagName.toLowerCase() == "input") {
        var grandpa = target.parentNode;
        target.className = "completed";
        if (target.checked) {
          grandpa.style.textDecoration = "line-through";
          grandpa.style.color = "#5db65d";
          document.getElementById("complete").appendChild(grandpa);
        }
        var listItem = grandpa.textContent;
        removeItemFromStorage("incompleted", listItem);
        saveToStorage("completed", listItem);
      }
  }

  function moveBackCompletedItems(event) {
      var target = event.target;
      if (target.tagName.toLowerCase() == "input") {
        var grandpa = target.parentNode;
        target.className = "undone";
        if (!target.checked) {
          grandpa.style.textDecoration = "none";
          grandpa.style.color = "#666";
          document.getElementById("incomplete").appendChild(grandpa);
        }
        var listItem = grandpa.textContent;
        removeItemFromStorage("completed", listItem);
        saveToStorage("incompleted", listItem);
      }
  }

  function headingsClick(headingsId) {
      var elementStyle = document.getElementById(headingsId).style;
      if (elementStyle.display != "none") {
        elementStyle.display = "none";
      } else {
        elementStyle.display = "";
      }
  }

  function hoverOver(event) {
      var checkHover = event.target.tagName.toLowerCase() == "li";
      if (checkHover) {
        event.target.classList.add("selected");
      }
  }

  function hoverOut(event) {
      var checkHover = event.target.tagName.toLowerCase() == "li";
      if (checkHover) {
        event.target.classList.remove("selected");
      }
  }

  function crossOff(event) {
      var checkCross = event.target.tagName.toLowerCase() == "li";
      if (checkCross) {
        event.target.classList.toggle("cross");
      }
  }

// ********************* REGION DATE AND TIME **********************

  // create date input
  function showDate() {
      var date = new Date();
      document.getElementById("date-display").innerHTML = date.toDateString();
  }

  // create clock
  function showClock() {
      var time = new Date(),
        hours = time.getHours(),
        minutes = time.getMinutes(),
        seconds = time.getSeconds();

      document.getElementById("clock").innerHTML = zero(hours) + ":" + zero(minutes) + ":" + zero(seconds);

      function zero(unit) {
        if (unit < 10) {
          unit = "0" + unit;
        }
        return unit;
      }
  }

})();