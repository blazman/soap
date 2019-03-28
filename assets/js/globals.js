// this holds the questions and selected answers
// each entry requires the question id, the answer id
var policyRefs = [];

// question currently shown
var currentQuestion = 0;

// // this should be built and changed as the user progresses
var questionQueue = [];

// these are arrays of text pieces
// this one is compiled on the fly when Preview button is clicked and at end
var policyText = [];

// this one is compiled at the end of the process
var appendixText;

// loop through currentQuestion-[i]-answer
// all of this should be split up
function handleSubmit(id) {
  // get question identifier
  var identifier = "q" + id;
  // get question container
  var qRef = document.getElementById(identifier);
  console.log(qRef);
  // if there is valid input - but how do I access the answer storage?
  var answers = getInput(qRef);
  var removeQ = [];
  var includeQ = [];

  if (answers.length > 0) {
    // for each of the answers
    for (var j = 0; j < answers.length; j++) {
      // first get the question id
      temp = answers[j].split("-");
      temp[0] = temp[0].split("q");
      qId = temp[0][1];
      // then get the answer number
      aId = temp[1];
      // store answer in array
      policyRefs.push({
          "q": qId,
          "a": aId,
      });
      // if there are exclusions
      if (questions[qId].answers[aId].excludes[0]) {
        // get the excluded question refs
        removeQ.push(questions[qId].answers[aId].excludes);
      }
      // if there are inclusions
      if (questions[qId].answers[aId].includes[0]) {
        // get included questions based on answers
        includeQ.push(questions[qId].answers[aId].includes);
      }
    }

    // remove all the exclusions from the queue
    if (removeQ != "") {
      // for each question to be removed
      for (var k = 0; k < removeQ.length; k++) {
        // is the number in the queue?
        // update questionQueue
        var index = questionQueue.indexOf("q"+removeQ[k]);
        // if it's in the queue, remove it
        if(index != -1) {
        	questionQueue.splice(index, 1);
        }
      }
    }
    // add all the inclusions to the queue, if they aren't already there
    if (includeQ != "") {
      // for each question to be removed
      for (var m = 0; m < includeQ.length; m++) {
        // is the number in the queue?
        // update questionQueue
        var index = questionQueue.indexOf(includeQ[m][0]);
        // if it's not in the queue, add it
        if(index === -1) {
        	questionQueue.splice(includeQ[m][0], 0, includeQ[m][0]);
        } else {
          console.log('element already in queue');
        }
      }
    }

    // sort queue to ensure continuity
    questionQueue.sort();

    // hide current question
    // remove class of current
    qRef.classList.remove("current");

    // change currentQuestion
    currentQuestion++;
    // show new currentQuestion
    // apply new class of current
    var nextQ = document.getElementById(questionQueue[currentQuestion]);
    console.log(questionQueue[currentQuestion]);

    nextQ.classList.add("current");

  } else {
    // display error to user
  }
}

function getInput(el) {
  var answerStore = [];
  // get input fields from the element
  // for each of the elements in that question group
  for (var i = 0; i < el.childNodes.length; i++) {
    // if the element is an input
    if (el.childNodes[i].tagName === "INPUT") {
      // and if the checkboxes or radio buttons are checked
      if (el.childNodes[i].checked) {
        // make a note of which ones
        answerStore.push(el.childNodes[i].id);
      // or if the textbox has contents
      // FIX: currently this isn't working
      } else if (el.childNodes[i].innerText != "") {
        // check those contents for validity
        answerStore.push(el.childNodes[i].id);
      }
    } else {
      console.log(el.childNodes[i].tagName + " is not an input field");
    }
  }
  // if there are answers in storage then return them
  if (answerStore.length > 0) {
    return answerStore;
  } else {
    // if none of that is true then return false
    return true; // for testing purposes
    //return false;
  }
}
