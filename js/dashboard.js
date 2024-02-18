console.log("dashboard.js is running");

// Simulate a long-running function
// To test if function in Dashboard.js still executes when navigatign other html paths
// setTimeout(() => {
//   console.log("Dashboard function completed");
// }, 5000); // Wait for 5 seconds

const wardStatus = [
  "OCCUPIED",
  "DISCHARGED PENDING SANITIZING",
  "SANITIZING",
  "AVAILABLE",
];

let generalWardBedNo = 1;
let intensiveWardBedNo = 1;
let infectiousWardBedNo = 1;

// open connection to patientDatabase
const request = indexedDB.open("patientDatabase", 1);

// Handle errors when connecting to database
request.onerror = (event) => {
  console.error("Error connecting to database:", event.target.errorCode);
  alert("❌ Error connecting to database.");
};

// Handle successful DB connection
request.onsuccess = (event) => {
  const db = event.target.result;
  fetchDataFromPatientDatabase(db);
};

const fetchDataFromPatientDatabase = (db) => {
  const transaction = db.transaction(["patients"], "readonly");
  const objectStore = transaction.objectStore("patients");
  const patientDataArray = [];
  objectStore.openCursor().onsuccess = function (event) {
    let cursor = event.target.result;
    if (cursor) {
      patientDataArray.push(cursor.value);
      cursor.continue();
    } else {
      console.log("Retrieved data from patientDatabase");
      console.log(patientDataArray);
      handleWardAllocation(patientDataArray);
    }
  };
};

const handleWardAllocation = (patientDataArray) => {
  console.log("handleWardAllocation() executed, we are good to go");
  // console.log(patientDataArray);
  for (const patient of patientDataArray) {
    if (patient.mdcategory === "general") {
      generalWardAllocation(patient);
    } else if (patient.mdcategory === "intensive") {
      intensiveWardAllocation(patient);
    } else if (patient.mdcategory === "infectious") {
      infectiousWardAllocation(patient);
    } else {
      continue;
    }
  }
};

const generalWardAllocation = (patient) => {
  console.log("generalWardAllocation() executed");
  console.log(patient);
  //
  if (generalWardBedNo <= 3 && generalWardBedNo > 0) {
    const insertWardAllocation = `
  <div class="col-span-full lg:col-span-1">
  <div
    class="flex flex-col p-4 rounded-lg dark:bg-emerald-900 dark:text-neutral-100 bg-emerald-100 shadow-xl text-center"
  >
    <h1 class="mb-3 font-semibold dark:text-white">
      Bed ${generalWardBedNo++}
    </h1>
    <p
      class="border-2 bg-white border-gray-200 rounded-md px-2 py-1 mb-2 flex justify-between"
    >
      <span class="bg-black text-white px-2 py-1 rounded-md ml-3 w-3"
        >Patient Name:</span
      >
      ${patient.firstName} ${patient.lastName}
    </p>
    <p
      class="border-2 bg-white border-gray-200 rounded-md px-2 py-1 mb-2 flex justify-between"
    >
      <span class="bg-black text-white px-2 py-1 rounded-md w-3"
        >Identification:</span
      >
      ${patient.identification}
    </p>
    <p
      class="border-2 bg-white border-gray-200 rounded-md px-2 py-1 mb-2 flex justify-between"
    >
      <span class="bg-black text-white px-2 py-1 rounded-md">Ward Status:</span
      >${wardStatus[0]}
    </p>
    <p id="basicUsage"
      class="border-2 bg-white border-gray-200 rounded-md px-2 py-1 mb-2 flex justify-between"
    >
      <span class="bg-black text-white px-2 py-1 rounded-md">Timer:</span> 00:00:00
    </p>
  </div>
</div>
  `;
    const generalWardContainer = document.getElementById("general-ward");
    if (generalWardContainer) {
      generalWardContainer.insertAdjacentHTML(
        "beforeend",
        insertWardAllocation
      );
    } else {
      return;
    }
  } else {
    alert(
      "Maximum wards available for General Ward is 10, patient will be allocated to Holding Bay"
    );
  }
};

const intensiveWardAllocation = (patient) => {
  console.log("intensiveWardAllocation() executed");
  console.log(patient);
};

const infectiousWardAllocation = (patient) => {
  console.log("infectiousWardAllocation() executed");
  console.log(patient);
};
