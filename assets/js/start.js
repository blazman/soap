function addChangeListeners() {
  var notice = document.querySelectorAll('.q0-only');
  for  (var n = 0; n <notice.length; n++){
    notice[n].remove();
  }
  // add listener for edit button
  var editBtn = document.getElementById("editBtn");
  editBtn.addEventListener('click', editAnswers, false);

  // TODO: get skip/next fully working
  // grab all the form inputs
  var elements = Array.from(document.querySelectorAll('.form-el > input'));
  var boxes = Array.from(document.querySelectorAll('.form-el > textarea'));
  elements = elements.concat(boxes);
  // TODO: add these event listeners back in when required questions are reimplemented
  // for (var e = 0; e < elements.length; e++) {
  //   // if it's a radio or checkbox
  //   if ((elements[e].type === "radio") || (elements[e].type === "checkbox")){
  //     elements[e].addEventListener('change', toggleSkip);
  //   } else {
  //     elements[e].oninput = toggleSkip;
  //   }
  // }
}


function updateValue(e) {
  log.textContent = e.target.value;
}

function toggleSkip(e){
  var button =  document.getElementById('submitAnswers');
  // if the box contains text and the button is currently "Skip"
  if ((e.data !== null) && (button.innerText === "Skip")){
    // change button text
    button.innerText = "Next";
    button.disabled = false;
  } else if ((e.data === null) && (button.innerText === "Next")){
    button.innerText = "Skip";
    button.disabled = true;
  }
}

function moveForward(id) {
  // this increases the counter
  currentState.questionC++;
  // start looking at the next question
  // increase the question id number
  id++;
  currentState.questionQ = 'q' + id;
  // increase position in the array
  currentState.questionP++;
  var el = document.querySelector('progress');
  el.value++;
  return id;
}


function isExcludedQ(id) {
  // start looking at the next question
  id = moveForward(id);
  // for each of the questions remaining
  for (var q = id; q < questionsList.length; q++) {
    // if the question isn't on the list
    if (currentState.exclusions.indexOf(parseInt(id)) === -1) {
      // if the question is not excluded
      // break the loop
      return false;
    } else {
      // update everything to the next question
      id = moveForward(id);
    }
  }
}

// this updates the progress bar
function updateProgressBar(){
  var el = document.querySelector('progress');
  el.value++;
}

// this is the function that's called when a user submits an answer
function handleSubmit() {
  // search for the currently shown element - question and answer
  var match = document.querySelector('.current');
  // this gets the current question id number e.g. q0
  var id = currentState.questionQ.split('q')[1];
  // currently lets everything through, will change when required Qs are back
  canProceed = true;
  // before doing anything else, check if this is a required question
  // isRequired = match[0] ? match[0].required : false;
  // compare the size of answers array to find out if answers have been provided for this question
  if (id > 0){
    // if it's required and there are no answers provided
    // if (isRequired && noAnswers){
    //   canProceed = false;
    // }
    // if there's at least one answer returned and the button is disabled
    // enable the preview button
    prev = document.querySelector('#previewPolicy');
    if (prev.disabled && (currentState.answers.length === 0 || dict.length === 0)){
      prev.removeAttribute('disabled');
    }
  }

  if (canProceed){

      setUpPage(id);

      // if we're past the intro
      if (parseInt(id) > 0){
        // show the edit button
        document.getElementById('editBtn').classList.remove('disabled');
        // mark the current question as editable
        match.classList.add("editable");
        collectAnswers(false);
      }

      if(parseInt(id) === questionsList.length-1){
        document.getElementById('editBtn').classList.add('disabled');
      }

      // this hides the current question,
      match.classList.remove("current");
      // go to next question
      id = isExcludedQ(id);
      // TODO change to Skip when skip/next is working
      document.getElementById('submitAnswers').innerText = "Next";
      nextQuestion();
      window.scrollTo(0,0);
  }
}


// not sure this needs to be a function as it's only done once
function setUpPage(id){
  // add the additional stuff after everything else has loaded
  if (parseInt(id) === 0) {
    injectOverlay();
    // sneaking this in here so it's done when textboxes exist
    resizingBoxes();
    addChangeListeners();
    checkForName();
  }
}


function nextQuestion(){
  // if the position is not beyond the total number of questions for the current section
  if (currentState.questionP < currentState.sectionQ.length) {
    // grab the next question's element and add class of current
    var nextQ = document.getElementById(currentState.questionQ);
    nextQ.classList.add("current");
  }
  // if the sections have not run out (using the counter because it isn't changed)
  // consider whether I want this to happen here, before the last q, or after it
  else if (currentState.sectionC < sections.length-1) {
    // increase the section counter
    currentState.sectionC++;
    // reset the position counter
    currentState.questionP = 0;
    // get the next section
    currentState.sectionQ = sections[currentState.sectionC];
    // as before, grab the next question's element and add class of current
    var nextQ = document.getElementById(currentState.questionQ);
    nextQ.classList.add("current");
  }
  // if we're out of sections then show the policy
  else {
    // if there are answers
    if (currentState.answers.length > 0) {
      var policyContainer = templates.policyTemplate();
      utils.render('page', policyContainer);
    } else {
      if (window.confirm("Oh no! It seems you haven't answered enough questions to build a policy. Start again?")) {
        location.reload(false);
      } else {
        window.location.href = "/";
      }
    }
  }
  // if (nextQ){
  //   // if there's a next question and it's required
  //   if (nextQ[0] && nextQ[0].required){
  //     // get and set the submit button to disabled
  //     submit = document.querySelector('#submitAnswers');
  //     submit.setAttribute("disabled", "");
  //   }
  // }
}

// function to add formatting to array
function formatArray(arr, storage) {
  if (Array.isArray([arr])) {
    for (var i=0; i<arr.length; i++) {
      storage += '<p>'+arr[i] + '</p>';
    }
    return storage;
  }
}

function stripCode(t){
  t = t.replace(/</g, "&lt;").replace(/>/g, "&gt;");
  return t;
}
