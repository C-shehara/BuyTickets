// Define pricing data
const prices = {
  "SL Adult": { normal: 4, peak: 6 },
  "SL Child": { normal: 2, peak: 3 },
  "Foreigner Adult": { normal: 10, peak: 13 },
  "Foreigner Child": { normal: 5, peak: 8 },
};

const selectedCategories = [];

let chargeSlAdult;
let chargeSlChild;
let chargeFAdult;
let chargeFChild;
let chargeInfant;

const inDate = document.getElementById("date");
const inDuration = document.getElementById("durationSelect");

const outTable = document.getElementById("summary");
const outTotal = document.getElementById("summaryTotal");
const outTime = document.getElementById("summaryTime");
const outDate = document.getElementById("summaryDate");
const dateError = document.getElementById("dateError");
const outDuration = document.getElementById("summaryDuration");
const inputs = document.querySelectorAll("input[type='number']");
const errors = document.querySelectorAll(".guestErrorMsg");
const btnContinue = document.getElementById("continueBtn");

let response = [];

window.addEventListener("load", init);
window.addEventListener("load", updateTable);
inDate.addEventListener("change", updateTable);
inDuration.addEventListener("change", updateTable);
inputs.forEach((input) => {
  input.addEventListener("change", updateTable);
});
btnContinue.addEventListener("click", nextPage);



function init() {
  const currentDate = new Date();
  const year = currentDate.getFullYear();
  const month = String(currentDate.getMonth() + 1).padStart(2, "0");
  const day = String(currentDate.getDate()).padStart(2, "0");
  const formattedDate = `${year}-${month}-${day}`;
  inDate.value = formattedDate;

  outDate.innerHTML = inDate.value;
  outTime.innerHTML = inDuration.value;
}




function updateTable() {
  //Error handling
  const selectedDate = new Date(inDate.value);
  const currentDate = new Date();
  currentDate.setHours(0, 0, 0, 0);
  if (selectedDate < currentDate) {
    dateError.innerHTML = "Date must not be in the past";
  } else {
    dateError.innerHTML = "";
  }

  let hasErrors;
  inputs.forEach((input, index) => {
    if (input.value < 0 || input.value == "") {
      errors[index].innerHTML = "Invalid Number";
      hasErrors = true;
    } else {
      errors[index].innerHTML = "";
    }
  });

  //Multiple time slots
  let timeSlots = inDuration.selectedOptions;

  if (timeSlots.length > 1) {
    let dArray = []
    for (let i = 0; i < timeSlots.length; i++) {
      const selectedDuration = timeSlots[i].value;

      dArray.push(selectedDuration.split("to"));
    }

    let start = dArray[0]
    let end = dArray[timeSlots.length - 1]

    outTime.innerHTML = `${start[0]} to ${end[1]}`

  } else {
    outTime.innerHTML = inDuration.value;
  }

  //Peak hours and normal hours calculation
  let peak = 0;
  let normal = 0;

  for (let i = 0; i < timeSlots.length; i++) {
    const option = timeSlots[i];
    if (option.classList.contains("peak")) {
      peak++;
    } else {
      normal++;
    }
  }
  const outDuration = peak + normal;
  summaryDuration.innerHTML = `${outDuration} hrs ( 0${normal} Normal : 0${peak} Peak )`

  //Guest calculation
  const inSlAdult = parseInt(document.getElementById("slAdult").value);
  const inSlChild = parseInt(document.getElementById("slChild").value);
  const inFAdult = parseInt(document.getElementById("foreignerAdult").value);
  const inFChild = parseInt(document.getElementById("foreignerChild").value);
  const inInfant = parseInt(document.getElementById("infant").value);


  chargeSlAdult = (inSlAdult * prices["SL Adult"].peak * peak) + (inSlAdult * prices["SL Adult"].normal * normal);
  chargeSlChild = (inSlChild * prices["SL Child"].peak * peak) + (inSlChild * prices["SL Child"].normal * normal);
  chargeFAdult = (inFAdult * prices["Foreigner Adult"].peak * peak) + (inFAdult * prices["Foreigner Adult"].normal * normal);
  chargeFChild = (inFChild * prices["Foreigner Child"].peak * peak) + (inFChild * prices["Foreigner Child"].normal * normal);
  chargeInfant = "Free";

  const totalPay = chargeSlAdult + chargeSlChild + chargeFAdult + chargeFChild;


  addRow("SL Adult", inSlAdult, slARow, chargeSlAdult);
  addRow("SL Child", inSlChild, slCRow, chargeSlChild);
  addRow("Foreigner Adult", inFAdult, fARow, chargeFAdult);
  addRow("Foreigner Child", inFChild, fCRow, chargeFChild);
  addRow("Infant", inInfant, iRow, chargeInfant);

  outDate.innerHTML = inDate.value;
  outTotal.innerHTML = `$${totalPay}`;

  const totalGuests = inSlAdult + inSlChild + inFAdult + inFChild + inInfant;

  //Error handling
  if (hasErrors || totalGuests === 0 || dateError.innerHTML !== "") {
    btnContinue.setAttribute("disabled", "disabled");
  } else {
    btnContinue.removeAttribute("disabled");
  }

}


function addRow(label, guestNum, row, charge) {
  if (guestNum > 0) {
    row.innerHTML = `<th>${guestNum} ${label}</th><td class="charges">$${charge}</td>`
  } else {
    row.innerHTML = ""
  }
}


function nextPage(event) {
  // Redirect to the "Payments" page
  event.preventDefault(); // Prevent form submission

  const inSlAdult = parseInt(document.getElementById("slAdult").value);
  const inSlChild = parseInt(document.getElementById("slChild").value);
  const inFAdult = parseInt(document.getElementById("foreignerAdult").value);
  const inFChild = parseInt(document.getElementById("foreignerChild").value);
  const inInfant = parseInt(document.getElementById("infant").value);

  // Create an array to store the selected categories with input > 0
  if (inSlAdult > 0) selectedCategories.push({ label: "SL Adult", value: inSlAdult, row: "slARow", charge: chargeSlAdult });
  if (inSlChild > 0) selectedCategories.push({ label: "SL Child", value: inSlChild, row: "slCRow", charge: chargeSlChild });
  if (inFAdult > 0) selectedCategories.push({ label: "Foreigner Adult", value: inFAdult, row: "fARow", charge: chargeFAdult });
  if (inFChild > 0) selectedCategories.push({ label: "Foreigner Child", value: inFChild, row: "fCRow", charge: chargeFChild });
  if (inInfant > 0) selectedCategories.push({ label: "Infant", value: inInfant, row: "iRow", charge: chargeInfant });


  // Create the summaryData object
  const summaryData = {
    date: outDate.innerHTML,
    time: outTime.innerHTML,
    duration: outDuration.innerHTML,
    total: outTotal.innerHTML,
    selectedCategories: selectedCategories // Include selectedCategories in the object
  };

  response.push(summaryData)
  localStorage.setItem('summaryData', JSON.stringify(response));

  window.location.href = "details.html";
}

