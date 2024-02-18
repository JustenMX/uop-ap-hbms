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
    switch (patient.mdcategory) {
      case "general":
        generalWardAllocation(patient);
        break;
      case "intensive":
        intensiveWardAllocation(patient);
        break;
      case "infectious":
        infectiousWardAllocation(patient);
        break;
      default:
        continue;
    }
  }
};

const generalWardAllocation = (patient) => {
  console.log("generalWardAllocation() executed");
  console.log(patient);
  //
  if (generalWardBedNo <= 2 && generalWardBedNo > 0) {
    const insertWardAllocation = `
  <div class="col-span-full lg:col-span-1">
  <div
    class="flex flex-col p-4 rounded-lg dark:bg-emerald-900 dark:text-neutral-100 bg-emerald-100 shadow-xl text-center"
  >
  <div class="col-span-full lg:col-span-5 flex justify-center">
  <h1 class="mb-3 font-semibold dark:text-white mt-3">
    Bed ${generalWardBedNo++}
  </h1>
  <img
  src="./asset/image/dashboard/bed.svg"
  class="w-8 ml-2 "
/>
</div>
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
      console.error("General ward container not found.");
      return;
    }
  } else {
    const insertHoldingBay = `
  <div class="col-span-full lg:col-span-1">
  <div
    class="flex flex-col p-4 rounded-lg dark:bg-emerald-900 dark:text-neutral-100 bg-emerald-100 shadow-xl text-center"
  >
    <h1 class="mb-3 font-semibold dark:text-white">
      Pending General Ward
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

    const holdingBayContainer = document.getElementById("holding-bay");
    if (holdingBayContainer) {
      holdingBayContainer.insertAdjacentHTML("beforeend", insertHoldingBay);
    } else {
      console.error("Holding bay container not found.");
      return;
    }
  }
};

const intensiveWardAllocation = (patient) => {
  console.log("intensiveWardAllocation() executed");
  console.log(patient);
  //
  if (intensiveWardBedNo <= 3 && intensiveWardBedNo > 0) {
    const insertWardAllocation = `
    <div class="col-span-full lg:col-span-1">
    <div
      class="flex flex-col p-4 rounded-lg dark:bg-emerald-900 dark:text-neutral-100 bg-emerald-100 shadow-xl text-center"
    >
    <div class="col-span-full lg:col-span-5 flex justify-center">
    <h1 class="mb-3 font-semibold dark:text-white mt-3">
      Bed ${intensiveWardBedNo++}
    </h1>
    <img
    src="./asset/image/dashboard/bed.svg"
    class="w-8 ml-2 "
  />
</div>
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
    const intensiveWardContainer = document.getElementById("intensive-ward");
    if (intensiveWardContainer) {
      intensiveWardContainer.insertAdjacentHTML(
        "beforeend",
        insertWardAllocation
      );
    } else {
      console.error("intensive ward container not found.");
      return;
    }
  } else {
    const insertHoldingBay = `
    <div class="col-span-full lg:col-span-1">
    <div
      class="flex flex-col p-4 rounded-lg dark:bg-emerald-900 dark:text-neutral-100 bg-emerald-100 shadow-xl text-center"
    >
      <h1 class="mb-3 font-semibold dark:text-white">
        Pending Intensive Care Ward
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

    const holdingBayContainer = document.getElementById("holding-bay");
    if (holdingBayContainer) {
      holdingBayContainer.insertAdjacentHTML("beforeend", insertHoldingBay);
    } else {
      console.error("Holding bay container not found.");
      return;
    }
  }
};

const infectiousWardAllocation = (patient) => {
  console.log("infectiousWardAllocation() executed");
  console.log(patient);
  if (infectiousWardBedNo <= 3 && infectiousWardBedNo > 0) {
    const insertWardAllocation = `
    <div class="col-span-full lg:col-span-1">
    <div
      class="flex flex-col p-4 rounded-lg dark:bg-emerald-900 dark:text-neutral-100 bg-emerald-100 shadow-xl text-center"
    >
    <div class="col-span-full lg:col-span-5 flex justify-center">
    <h1 class="mb-3 font-semibold dark:text-white mt-3">
      Bed ${infectiousWardBedNo++}
    </h1>
    <img
    src="./asset/image/dashboard/bed.svg"
    class="w-8 ml-2 "
  />
</div>
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
    const infectiousWardContainer = document.getElementById("infectious-ward");
    if (infectiousWardContainer) {
      infectiousWardContainer.insertAdjacentHTML(
        "beforeend",
        insertWardAllocation
      );
    } else {
      console.error("intensive ward container not found.");
      return;
    }
  } else {
    const insertHoldingBay = `
    <div class="col-span-full lg:col-span-1">
    <div
      class="flex flex-col p-4 rounded-lg dark:bg-emerald-900 dark:text-neutral-100 bg-emerald-100 shadow-xl text-center"
    >
      <h1 class="mb-3 font-semibold dark:text-white">
        Pending Infectious Disease Ward
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

    const holdingBayContainer = document.getElementById("holding-bay");
    if (holdingBayContainer) {
      holdingBayContainer.insertAdjacentHTML("beforeend", insertHoldingBay);
    } else {
      console.error("Holding bay container not found.");
      return;
    }
  }
};
