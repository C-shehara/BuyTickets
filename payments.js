//Get references to interactive elements
const cardNumber = document.getElementById("cardNumber");
const cardNumberError = document.getElementById("cardNumberError");
const expiryDate = document.getElementById("expiryDate");
const expiryDateError = document.getElementById("expiryDateError");
const cvc = document.getElementById("cvc");
const cvcError = document.getElementById("cvcError");
const nameOnCard = document.getElementById("nameOnCard");
const nameOnCardError = document.getElementById("nameOnCardError");
const payBtn = document.getElementById("payBtn");
const total=document.getElementById("total")
const outTable=document.getElementById("summary");
const outTotal=document.getElementById("summaryTotal");
const outTime=document.getElementById("summaryTime");
const outDate=document.getElementById("summaryDate");
const outDuration=document.getElementById("summaryDuration");

// Array with the relevant errors
const details = [
  { input: cardNumber, error: cardNumberError, validation: isNumbers, errorMessage: "Invalid card number" },
  { input: expiryDate, error: expiryDateError, validation: isNumbers, errorMessage: "Invalid expiry date (MM/YYYY)" },
  { input: cvc, error: cvcError, validation: isNumbers, errorMessage: "Invalid characters included" },
  { input: nameOnCard, error: nameOnCardError, validation: isLetters, errorMessage: "Invalid characters included" }
];



// Add event listeners
window.addEventListener("load",init);
details.forEach(detail => {
  detail.input.addEventListener("input", function() {
    checkValidity(detail);
    checkFormValidity();
  });
});
expiryDate.addEventListener("input",checkDate);
payBtn.addEventListener("click", nextPage);



//Implement event Listeners
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
  total.innerHTML=inTotal;
}

function addRow(label,guestNum,row,charge){
     row.innerHTML=`<th>${guestNum} ${label}</th><td class="charges">$${charge}</td>`
}



function checkDate() {
  const inputValue = this.value.trim();

  const parts = inputValue.split("/");
  const month = parseInt(parts[0]);
  const year = parseInt(parts[1]);

  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth() + 1;
  const inputYear = year + 2000; //assuming years from 2000 to 2099

  if (parts.length !== 2 || isNaN(month) || isNaN(year) || month < 1 || month > 12 || year < 0 || year > 99 || inputValue.length !== 5) 
  {
    expiryDateError.textContent = "Please enter a valid date in MM/YY format.";
  } 
  else if (inputYear < currentYear || (inputYear === currentYear && month < currentMonth)||(inputYear === currentYear && month === currentMonth))
  {
    console.log(month, year);
    expiryDateError.textContent = "Card is too old.";
  } 
  else 
  {
    expiryDateError.textContent = "";
  }
};




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


//Functions to check if invalid characters are included
function isNumbers(input) {
  if(isNaN(input)){
  return false;}
  else{
    return true
  }
}
function isLetters(input){
  for (let i = 0; i < input.length; i++) {
    const char = input[i];
    if (!((char >= 'a' && char <= 'z') || (char >= 'A' && char <= 'Z') || char === ' ')){
      return false;//if not a letter or space
    }
  }
  return true;
}



function checkFormValidity() {
  const hasErrors = details.some((detail => detail.error.innerHTML !== "")|| details.input.value=="");
  const hasEmptyFields = details.some(detail => detail.input.value.trim() === "");

  if (hasErrors||hasEmptyFields) {
    payBtn.setAttribute("disabled", "disabled");
  } else {
    payBtn.removeAttribute("disabled");
  }
  
}


function nextPage(event){
  event.preventDefault(); 
  window.location.href = "./confirmation.html";
}

