console.log("dashboard.js is running");

/**
 * ==============================================
 * Simulate a long-running function
 * ==============================================
 */

// setTimeout(() => {
//   console.log("Dashboard function completed");
// }, 5000); // Wait for 5 seconds

/**
 * ==============================================
 * Global Data
 * ==============================================
 */

const wardStatus = [
  "OCCUPIED",
  "DISCHARGED PENDING SANITIZING",
  "SANITIZING",
  "AVAILABLE",
];

let generalWardBedNo = 1;
let intensiveWardBedNo = 1;
let infectiousWardBedNo = 1;

/**
 * ==============================================
 * Access IndexDB
 * ==============================================
 */

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

/**
 * ==============================================
 * fetchDataFromPatientDatabase
 * ==============================================
 */

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
      handleWardAllocation(db, patientDataArray);
    }
  };
};

/**
 * ==============================================
 * updatePatientStatus
 * ==============================================
 */

const updateWardStatus = (db, patient, newWardStatus) => {
  console.log("To Update Patient Ward:", patient);
  const transaction = db.transaction(["patients"], "readwrite");
  const objectStore = transaction.objectStore("patients");
  const getRequest = objectStore.get(patient.id);

  getRequest.onsuccess = (event) => {
    const ward = event.target.result;
    ward.wardStatus = newWardStatus;

    const putRequest = objectStore.put(ward);
    console.log("Updated Patient Ward:", ward);

    putRequest.onsuccess = (event) => {
      console.log(`Patient ${ward.id} ward status updated to ${newWardStatus}`);
    };

    // Handle the error event of the putRequest
    putRequest.onerror = (event) => {
      console.error(`Error updating ward status for patient ${ward.id}`);
    };
  };

  // Handle the error event of the getRequest
  getRequest.onerror = (event) => {
    console.error(`Error retrieving patient ${patient.id} from IndexedDB`);
  };
};

/**
 * ==============================================
 * updatePatientStatus
 * ==============================================
 */

const updatePatientStatus = (db, patient, newStatus) => {
  console.log("Update Patient:", patient);
  const transaction = db.transaction(["patients"], "readwrite");
  const objectStore = transaction.objectStore("patients");
  const getRequest = objectStore.get(patient.id);

  getRequest.onsuccess = (event) => {
    const patient = event.target.result;
    patient.status = newStatus;
    const putRequest = objectStore.put(patient);

    putRequest.onsuccess = (event) => {
      console.log(`Patient ${patient.id} status updated to ${newStatus}`);
    };

    // Handle the error event of the putRequest
    putRequest.onerror = (event) => {
      console.error(`Error updating status for patient ${patient.id}`);
    };
  };

  // Handle the error event of the getRequest
  getRequest.onerror = (event) => {
    console.error(`Error retrieving patient ${patient.id} from IndexedDB`);
  };
};

/**
 * ==============================================
 * handleWardAllocation
 * ==============================================
 */

const handleWardAllocation = (db, patientDataArray) => {
  console.log("handleWardAllocation() executed, we are good to go");
  // console.log(patientDataArray);
  for (const patient of patientDataArray) {
    switch (patient.mdcategory) {
      case "general":
        generalWardAllocation(db, patient);
        break;
      case "intensive":
        intensiveWardAllocation(db, patient);
        break;
      case "infectious":
        infectiousWardAllocation(db, patient);
        break;
      default:
        continue;
    }
  }
};

/**
 * ==============================================
 * ==============================================
 * generalWardAllocation
 * ==============================================
 * ==============================================
 */

const generalWardAllocation = (db, patient) => {
  console.log("generalWardAllocation() executed");
  console.log(patient);

  if (patient.status === "DISCHARGED" && patient.wardStatus === "AVAILABLE") {
    console.log(
      `Patient ${patient.id}: ${patient.firstName} is already discharged.`
    );
    return;
  }

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
      >${patient.wardStatus}
    </p>
    <p
    class="border-2 bg-white border-gray-200 rounded-md px-2 py-1 mb-2 flex justify-between"
  >
    <span class="bg-black text-white px-2 py-1 rounded-md">Patient Status:</span> ${
      patient.status
    }
  </p>
    <p id="timer"
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

    /**
     * ==============================================
     * TIMEOUT LOGIC
     * ==============================================
     * update ward status to "OCCUPIED"
     * update patient status to 'WARDED"
     */

    setTimeout(() => {
      updateWardStatus(db, patient, "OCCUPIED");
      updatePatientStatus(db, patient, "WARDED");
      // reload here
    }, 60000); // 1 minute in milliseconds

    /**
     * ==============================================
     * TIMEOUT LOGIC
     * ==============================================
     * update patient's status to "DISCHARGED"
     * update ward status to "DISCHARGED PENDING SANITIZING"
     */
    setTimeout(() => {
      updatePatientStatus(db, patient, "DISCHARGED");
      updateWardStatus(db, patient, "DISCHARGED PENDING SANITIZING");
    }, 120000); // 2 minute in milliseconds

    /**
     * ==============================================
     * TIMEOUT LOGIC
     * ==============================================
     * update ward status to "SANITIZING"
     */
    setTimeout(() => {
      updateWardStatus(db, patient, "SANITIZING");
    }, 60000); // 1 minute in milliseconds

    /**
     * ==============================================
     * TIMEOUT LOGIC
     * ==============================================
     * update ward status to "AVAILABLE"
     */
    setTimeout(() => {
      updateWardStatus(db, patient, "AVAILABLE");
    }, 120000); // 2 minute in milliseconds

    /**
     * ==============================================
     * ==============================================
     */
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
      >${patient.wardStatus}
    </p>
    <p
    class="border-2 bg-white border-gray-200 rounded-md px-2 py-1 mb-2 flex justify-between"
  >
    <span class="bg-black text-white px-2 py-1 rounded-md">Patient Status:</span> ${patient.status}
  </p>
    <p id="timer"
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

/**
 * ==============================================
 * intensiveWardAllocation
 * ==============================================
 */

const intensiveWardAllocation = (db, patient) => {
  console.log("intensiveWardAllocation() executed");
  console.log(patient);
  //
  if (patient.status === "DISCHARGED" && patient.wardStatus === "AVAILABLE") {
    console.log(
      `Patient ${patient.id}: ${patient.firstName} is already discharged.`
    );
    return;
  }
  //
  if (intensiveWardBedNo <= 2 && intensiveWardBedNo > 0) {
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
      >${patient.wardStatus}
    </p>
    <p
    class="border-2 bg-white border-gray-200 rounded-md px-2 py-1 mb-2 flex justify-between"
  >
    <span class="bg-black text-white px-2 py-1 rounded-md">Patient Status:</span> ${
      patient.status
    }
  </p>
      <p id="timer"
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

    /**
     * ==============================================
     * TIMEOUT LOGIC
     * ==============================================
     * update ward status to "OCCUPIED"
     * update patient status to 'WARDED"
     */

    setTimeout(() => {
      updateWardStatus(db, patient, "OCCUPIED");
      updatePatientStatus(db, patient, "WARDED");
      // reload here
    }, 60000); // 1 minute in milliseconds

    /**
     * ==============================================
     * TIMEOUT LOGIC
     * ==============================================
     * update patient's status to "DISCHARGED"
     * update ward status to "DISCHARGED PENDING SANITIZING"
     */
    setTimeout(() => {
      updatePatientStatus(db, patient, "DISCHARGED");
      updateWardStatus(db, patient, "DISCHARGED PENDING SANITIZING");
    }, 120000); // 2 minute in milliseconds

    /**
     * ==============================================
     * TIMEOUT LOGIC
     * ==============================================
     * update ward status to "SANITIZING"
     */
    setTimeout(() => {
      updateWardStatus(db, patient, "SANITIZING");
    }, 60000); // 1 minute in milliseconds

    /**
     * ==============================================
     * TIMEOUT LOGIC
     * ==============================================
     * update ward status to "AVAILABLE"
     */
    setTimeout(() => {
      updateWardStatus(db, patient, "AVAILABLE");
    }, 120000); // 2 minute in milliseconds

    /**
     * ==============================================
     * ==============================================
     */
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
      >${patient.wardStatus}
    </p>
    <p
    class="border-2 bg-white border-gray-200 rounded-md px-2 py-1 mb-2 flex justify-between"
  >
    <span class="bg-black text-white px-2 py-1 rounded-md">Patient Status:</span> ${patient.status}
  </p>
      <p id="timer"
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

/**
 * ==============================================
 * infectiousWardAllocation
 * ==============================================
 */

const infectiousWardAllocation = (db, patient) => {
  console.log("infectiousWardAllocation() executed");
  console.log(patient);
  //
  if (patient.status === "DISCHARGED" && patient.wardStatus === "AVAILABLE") {
    console.log(
      `Patient ${patient.id}: ${patient.firstName} is already discharged.`
    );
    return;
  }
  //
  if (infectiousWardBedNo <= 2 && infectiousWardBedNo > 0) {
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
      >${patient.wardStatus}
    </p>
    <p
    class="border-2 bg-white border-gray-200 rounded-md px-2 py-1 mb-2 flex justify-between"
  >
    <span class="bg-black text-white px-2 py-1 rounded-md">Patient Status:</span> ${
      patient.status
    }
  </p>
      <p id="timer"
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

    /**
     * ==============================================
     * TIMEOUT LOGIC
     * ==============================================
     * update ward status to "OCCUPIED"
     * update patient status to 'WARDED"
     */

    setTimeout(() => {
      updateWardStatus(db, patient, "OCCUPIED");
      updatePatientStatus(db, patient, "WARDED");
      // reload here
    }, 60000); // 1 minute in milliseconds

    /**
     * ==============================================
     * TIMEOUT LOGIC
     * ==============================================
     * update patient's status to "DISCHARGED"
     * update ward status to "DISCHARGED PENDING SANITIZING"
     */
    setTimeout(() => {
      updatePatientStatus(db, patient, "DISCHARGED");
      updateWardStatus(db, patient, "DISCHARGED PENDING SANITIZING");
    }, 120000); // 2 minute in milliseconds

    /**
     * ==============================================
     * TIMEOUT LOGIC
     * ==============================================
     * update ward status to "SANITIZING"
     */
    setTimeout(() => {
      updateWardStatus(db, patient, "SANITIZING");
    }, 60000); // 1 minute in milliseconds

    /**
     * ==============================================
     * TIMEOUT LOGIC
     * ==============================================
     * update ward status to "AVAILABLE"
     */
    setTimeout(() => {
      updateWardStatus(db, patient, "AVAILABLE");
    }, 120000); // 2 minute in milliseconds

    /**
     * ==============================================
     * ==============================================
     */
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
      >${patient.wardStatus}
    </p>
    <p
    class="border-2 bg-white border-gray-200 rounded-md px-2 py-1 mb-2 flex justify-between"
  >
    <span class="bg-black text-white px-2 py-1 rounded-md">Patient Status:</span> ${patient.status}
  </p>
      <p id="timer"
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
