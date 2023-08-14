const outName=document.getElementById("summaryName");
const outDate=document.getElementById("summaryDate");
const outTime=document.getElementById("summaryTime");
const outDuration=document.getElementById("summaryDuration");
const outMobile=document.getElementById("summaryMobile");
const outEmail=document.getElementById("summaryEmail");
const outGender=document.getElementById("summaryGender");
const outTotal=document.getElementById("summaryTotal")





// Add event listeners for each input
window.addEventListener("load",init);

function init() {
  const storedSummaryData = JSON.parse(localStorage.getItem('summaryData'));
  const storedDetailsData=JSON.parse(localStorage.getItem('detailsData'));
    
  const summaryData = storedSummaryData[0];
  const inDate = summaryData.date;
  const inTime =summaryData.time;
  const inDuration=summaryData.duration;
  const inTotal=summaryData.total;

  const detailsData=storedDetailsData[0];
  const inName=detailsData.name;
  const inMobile=detailsData.mobile;
  const inEmail=detailsData.email;
  const inGender=detailsData.gender;

  const inGuests=summaryData.selectedCategories;
  for (let i = 0; i < inGuests.length; i++) {
    const guest = inGuests[i];
    const row = document.getElementById(guest.row);
    addRow(guest.label, guest.value, row, guest.charge);
  }

  console.log(inGuests);
  outName.innerHTML=inName;
  outDate.innerHTML=inDate;
  outTime.innerHTML=inTime;
  outDuration.innerHTML=inDuration;
  outMobile.innerHTML=inMobile;
  outEmail.innerHTML=inEmail;
  outGender.innerHTML=inGender;
  outTotal.innerHTML=inTotal;

}
function addRow(label,guestNum,row,charge){
     row.innerHTML=`<th>${guestNum} ${label}</th><td class="charges">$${charge}</td>`
 
}