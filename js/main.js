function restrictInputToCertainCharacters(e) {
  var keynum;
  if (window.event) {
    keynum = e.keyCode;
  } else if (e.which) {
    keynum = e.which;
  }

  // 60 is <
  // 62 is >
  // 61 is =
  if (keynum == 62 || keynum == 60 || keynum == 61) {
    // do nothing
  } else {
    e.preventDefault();
  }

}

function fillWithRandomNumbers() {

  var allInputs = document.getElementById('numInputFields').getElementsByTagName('input')
  document.getElementById("sortingOutput").innerHTML = "";

  for (var i = 0; i < allInputs.length; i++) {

    var randomNumber = Math.floor(Math.random() * 100);
    allInputs[i].value = randomNumber;
  }
}

function populate() {
  var numInputFieldsContainer = document.getElementById("numInputFields");
  numInputFieldsContainer.innerHTML = "";
  document.getElementById("sortingOutput").innerHTML = "";

  for (var i = 0; i < 10; i++) {

    var container = document.createElement("DIV");

    // create label:
    var label = document.createElement("LABEL");
    label.innerHTML = "Input " + (i + 1) + ":";

    // craete input
    var input = document.createElement("INPUT");
    var randomNumber = Math.floor(Math.random() * 100);
    input.setAttribute("type", "number");

    container.appendChild(label);
    container.appendChild(input);
    numInputFieldsContainer.appendChild(container);
  }

  // enable sort button
  document.getElementById("sortButton").disabled = false;
}

function sort() {
  var allInputs = document.getElementById('numInputFields').getElementsByTagName('input');
  var isFilterEnabled = document.getElementById('filterStatus').checked;
  var sortingOutputContainer = document.getElementById("sortingOutput");
  var allInputValues = [];
  document.getElementById("sortingOutput").innerHTML = "";


  // store all input values into an array
  for (var i = 0; i < allInputs.length; i++) {

    if (allInputs[i].value.length > 0) {
      allInputValues.push(parseInt(allInputs[i].value));
    }
  }
  
  	// send to server. unsorted
  	sendRequest(allInputValues);

  // apply filter if enabled
  if (isFilterEnabled) {
    var filtercondition = document.getElementById('filterConditionInput').value;
    var filterValue = document.getElementById('filterValueInput').value;

    // if there are values in the input fields then apply filter
    if (filtercondition.length > 0 && filterValue.length > 0) {

      // convert it to integer
      filterValue = parseInt(filterValue);

      if (filtercondition == '<') {
        allInputValues = allInputValues.filter(element => element <= filterValue);
      } else if (filtercondition == '>') {
        allInputValues = allInputValues.filter(element => element >= filterValue);
      } else { // the equal case
        allInputValues = allInputValues.filter(element => element == filterValue);
      }
    }
  }

  allInputValues = allInputValues.sort(function(a, b) {
    return a - b
  });
  
  // add them to html
  for (var i = 0; i < allInputValues.length; i++) {
    var container = document.createElement("DIV");
    container.innerHTML = allInputValues[i];
    if (isPrime(allInputValues[i])) {
      container.style.color = "green";
    }
    sortingOutputContainer.appendChild(container);
  }

}

function isPrime(num) {
  for (var i = 2, s = Math.sqrt(num); i <= s; i++) {
    if (num % i === 0) return false;
  }
  return num > 1;
}

function sendRequest(arrayOfNums) {
  let xhr = new XMLHttpRequest();
  xhr.open("POST", "https://myAPI/sort");
  xhr.setRequestHeader("Accept", "application/json");
  xhr.setRequestHeader("Content-Type", "application/json");

  xhr.onreadystatechange = function() {
    if (xhr.readyState === 4) {
      console.log(xhr.status);
      console.log(xhr.responseText);
    }
  };

  let data = {
  numbers: [...arrayOfNums]
};

xhr.send(JSON.stringify(data));
}


function waitForElementToExist(selector) {
    return new Promise(resolve => {
      if (document.querySelector(selector)) {
        return resolve(document.querySelector(selector));
      }
  
      const observer = new MutationObserver(() => {
        if (document.querySelector(selector)) {
          resolve(document.querySelector(selector));
          observer.disconnect();
        }
      });
  
      observer.observe(document, {
        subtree: true,
        childList: true,
      });
    });
  }
  
  // 👇️ using the function
  waitForElementToExist('#numInputFields').then(element => {
    populate();
  });