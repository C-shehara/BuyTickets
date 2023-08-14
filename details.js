// Get references to interactive elements
const fullName = document.getElementById("fullName");
const fullNameError = document.getElementById("fullNameError");
const mobileNumber = document.getElementById("mobileNumber");
const mobileNumberError = document.getElementById("mobileNumberError");
const email = document.getElementById("email");
const emailError = document.getElementById("emailError");
const confirmEmail = document.getElementById("confirmEmail");
const confirmEmailError = document.getElementById("confirmEmailError");
const gender = document.getElementById("gender");
const continueBtn = document.getElementById("continueBtn");
const outTable = document.getElementById("summary");
const outTotal = document.getElementById("summaryTotal");
const outTime = document.getElementById("summaryTime");
const outDate = document.getElementById("summaryDate");
const outDuration = document.getElementById("summaryDuration");

var input = document.querySelector("#mobileNumber");
window.intlTelInput(input, {
  separateDialCode: true,
});

// Array with the relevant errors and validation functions
const details = [
  { input: fullName, error: fullNameError, validation: isLetters, errorMessage: "Invalid characters included" },
  { input: mobileNumber, error: mobileNumberError, validation: isNumbers, errorMessage: "Invalid mobile number" },
  { input: email, error: emailError, validation: isEmail, errorMessage: "Invalid email address" },
  { input: confirmEmail, error: confirmEmailError, validation: checkConfirmEmail, errorMessage: "Emails do not match" }
];

// Add event listeners
window.addEventListener("load", init);
details.forEach(detail => {
  detail.input.addEventListener("input", function() {
    checkValidity(detail);
    checkFormValidity();
  });
});
gender.addEventListener("change", checkFormValidity);
continueBtn.addEventListener("click", nextPage);



//Implement event listeners
function init() {
  const storedSummaryData = JSON.parse(localStorage.getItem('summaryData'));
    
  const summaryData = storedSummaryData[0];
  const inDate = summaryData.date;
  const inTime =summaryData.time;
  const inDuration=summaryData.duration;
  const inTotal=summaryData.total;

  const inGuests=summaryData.selectedCategories;
  for (let i = 0; i < inGuests.length; i++) {
    const guest = inGuests[i];
    const row = document.getElementById(guest.row);
    addRow(guest.label, guest.value, row, guest.charge);
  }

  console.log(inGuests);
  outDate.innerHTML=inDate;
  outTime.innerHTML=inTime;
  outDuration.innerHTML=inDuration;
  outTotal.innerHTML=inTotal;
}
function addRow(label,guestNum,row,charge){
     row.innerHTML=`<th>${guestNum} ${label}</th><td class="charges">$${charge}</td>`
 
}



function checkValidity(detail) {
  const value = detail.input.value;
  const maxLength = detail.input.maxLength;

  if (!detail.validation(value)) {
    detail.error.innerHTML = detail.errorMessage;
  } else if (value.length < maxLength) {
    detail.error.innerHTML = "Incomplete field";
  } else if (value.trim() === "") {
    detail.error.innerHTML = "Field is required"; // 
  } else {
    detail.error.innerHTML = "";
  }
}



// Validation functions
function isNumbers(input) {
  if (isNaN(input)|| input.length !== 10) {
    return false;
  } else {
    return true;
  }
}
function isLetters(input) {
  for (let i = 0; i < input.length; i++) {
    const char = input[i];
    if (!((char >= 'a' && char <= 'z') || (char >= 'A' && char <= 'Z') || char === ' '||char==='.')) {
      return false; // if not a letter or space
    }
  }
  return true;
}
function isEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}
function checkConfirmEmail() {
  return email.value === confirmEmail.value;
}


function checkFormValidity() {
  const allDetailsValid = details.every(detail => detail.error.textContent === "");
  const hasEmptyFields = details.some(detail => detail.input.value.trim() === "");
  
  if (allDetailsValid && !hasEmptyFields) {
    continueBtn.removeAttribute("disabled");
  } else {
    continueBtn.setAttribute("disabled", "disabled");
  }
}



function nextPage(event) {
  event.preventDefault();
  
  const detailsData = {
    name: fullName.value,
    mobile: mobileNumber.value,
    email: email.value,
    gender: gender.value
  };

  const response = [detailsData];
  localStorage.setItem('detailsData', JSON.stringify(response));

  window.location.href = "./payments.html";
}
