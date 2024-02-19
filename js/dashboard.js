console.log("dashboard.js is running");

/**
 * ==============================================
 * * GLOBAL DATA / HIGH ORDER FUNCTIONS
 * ==============================================
 */

let generalWardBedNo = 1;
let intensiveWardBedNo = 1;
let infectiousWardBedNo = 1;

/**
 * ==============================================
 * * ACCESS INDEXDB (patientDatabase)
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
 * * FETCH THE PATIENT DATA FROM INDEXDB
 * ==============================================
 * Function: fetchDataFromPatientDatabase()
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
 * * UPDATE WARD STATUS IN PATIENTS OBJ
 * ==============================================
 * Function: updateWardStatus()
 * ==============================================
 * Description:
 * Triggered by Functions
 * - generalWardAllocation()
 * - intensiveWardAllocation()
 * - infectiousWardAllocation()
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

    // Handle the success event of the putRequest
    putRequest.onsuccess = (event) => {
      console.log(`Patient ${ward.id} ward status updated to ${newWardStatus}`);
      // push the changes to the HTML element
      document.getElementById("ward-status").innerHTML = newWardStatus;
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
 * * UPDATE PATIENT STATUS IN PATIENTS OBJ
 * ==============================================
 * Function: updatePatientStatus()
 * ==============================================
 * Description:
 * Triggered by Functions
 * - generalWardAllocation()
 * - intensiveWardAllocation()
 * - infectiousWardAllocation()
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

    // Handle the success event of the putRequest
    putRequest.onsuccess = (event) => {
      console.log(`Patient ${patient.id} status updated to ${newStatus}`);
      // conditional checks for patient.status === "PENDING"
      if (newStatus !== "PENDING") {
        document.getElementById("patient-status").innerHTML = newStatus;
      }
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
 * * HANDLE WARD SEGREGATION
 * ==============================================
 * Function: handleWardAllocation()
 * Description: Use switch statements to segregate function execution based on patients' medical category.
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
 * * TIMEOUT LOGIC
 * ==============================================
 * Function: applyTimeoutLogic()
 * ==============================================
 * Description: Applying the timeout logic based on the requirements. In the inital stages the timeout function was blocking the execution of codes inside other functions since the tineout was placed inside the function. Setting the timeout as a higher order function and using async allowed me to perform the exeuction without blocking other tasks.
 * ==============================================
 */

const applyTimeoutLogic = (db, patient) => {
  return new Promise((resolve, reject) => {
    // Timeout logic for updating patient status to "WARDED" and ward status to "OCCUPIED" after 1 minute delay
    setTimeout(() => {
      updatePatientStatus(db, patient, "WARDED");
      updateWardStatus(db, patient, "OCCUPIED");
    }, 60000); // 1 minute in milliseconds

    // Timeout logic for updating patient status to "DISCHARGED" and ward status to "DISCHARGED PENDING SANITIZING" after 2 minute delay
    setTimeout(() => {
      updatePatientStatus(db, patient, "DISCHARGED");
      updateWardStatus(db, patient, "DISCHARGED PENDING SANITIZING");
    }, 120000); // 2 minute in milliseconds

    // Timeout logic for updating ward status to "SANITIZING" after 1 minute delay
    setTimeout(() => {
      updateWardStatus(db, patient, "SANITIZING");
    }, 60000); // 1 minute in milliseconds

    // Timeout logic for updating ward status to "AVAILABLE" after 2 minute delay
    setTimeout(() => {
      updateWardStatus(db, patient, "AVAILABLE");
      resolve(); // Resolve the promise after all timeout logic is executed
    }, 120000); // 2 minute in milliseconds
  });
};

/**
 * ==============================================
 * * TIMER
 * ==============================================
 * Function: displayTimer()
 * ==============================================
 */

const displayTimer = (timerId) => {
  const dday = new Date();
  document.getElementById(timerId).innerHTML = dday.toLocaleTimeString();
};

/**
 * ==============================================
 * * INSERT GENERAL WARD BED
 * ==============================================
 * Function: insertGeneralWardBed()
 * ==============================================
 */

const insertGeneralWardBed = (patient) => {
  // Generate a unique ID for the timer
  const timerId = `timer-${generalWardBedNo}`;
  // insertWardAllocationHTML contains the entire HTML markup using template literals.
  const insertWardAllocationHTML = `
  <div class="col-span-full lg:col-span-1">
    <div class="flex flex-col p-4 rounded-lg dark:bg-emerald-900 dark:text-neutral-100 bg-emerald-100 shadow-xl text-center">
      <div class="col-span-full lg:col-span-5 flex justify-center">
        <h1 class="mb-3 font-semibold dark:text-white mt-3">
          Bed ${generalWardBedNo++}
        </h1>
        <img src="./asset/image/dashboard/bed.svg" class="w-8 ml-2 " />
      </div>
      <p class="border-2 bg-white border-gray-200 rounded-md px-2 py-1 mb-2 flex justify-between">
        <span class="bg-black text-white px-2 py-1 rounded-md ml-3 w-3">Patient Name:</span>
        ${patient.firstName} ${patient.lastName}
      </p>
      <p class="border-2 bg-white border-gray-200 rounded-md px-2 py-1 mb-2 flex justify-between">
        <span class="bg-black text-white px-2 py-1 rounded-md w-3">Identification:</span>
        ${patient.identification}
      </p>
      <p class="border-2 bg-white border-gray-200 rounded-md px-2 py-1 mb-2 flex justify-between">
        <span class="bg-black text-white px-2 py-1 rounded-md">Ward Status:</span><span
          id="ward-status">${patient.wardStatus}</span>
      </p>
      <p class="border-2 bg-white border-gray-200 rounded-md px-2 py-1 mb-2 flex justify-between">
        <span class="bg-black text-white px-2 py-1 rounded-md">Patient Status:</span><span id="patient-status">${
          patient.status
        }</span>
      </p>
      <p class="border-2 bg-white border-gray-200 rounded-md px-2 py-1 mb-2 flex justify-between">
        <span class="bg-black text-white px-2 py-1 rounded-md">Timer:</span>
        <span id="${timerId}">00.00.00</span>
      </p>
    </div>
  </div>
`;
  // insert insertWardAllocationHTML to DOM
  const generalWardCard = document.getElementById("general-ward");
  if (generalWardCard) {
    generalWardCard.insertAdjacentHTML("beforeend", insertWardAllocationHTML);
    // Start the timer and run it every second
    setInterval(() => displayTimer(timerId), 1000);
  } else {
    // error handling
    console.error("General Ward bed not found.");
    return;
  }
};

/**
 * ==============================================
 * * HANDLE GENERAL WARD ALLOCATION
 * ==============================================
 * Function: generalWardAllocation()
 * ==============================================
 * Description:
 * After numerous refactoring, this function handles the allocation of patients to the general ward. It first checks if the patient is already discharged and if the ward is available. If so, it logs a message and returns without further action.
 *
 * Otherwise, it checks if there are available beds in the general ward. If there are, it checks if the patient's status is "PENDING". If so, it updates the patient's status to "AVAILABLE" and inserts the Card Div using the insertWardAllocation function. This also makes sure that it piroritizes patients that are in Waiting List (Holding Bay).
 *
 * (Post PENDING status are cleared) If the patient's status is not "PENDING", it directly inserts the Card Div.
 *
 * Finally, it awaits the completion of the timeout logic using the applyTimeoutLogic function. If there are no available beds, it updates the patient's status to "PENDING".
 *
 * ==============================================
 */

const generalWardAllocation = async (db, patient) => {
  console.log("generalWardAllocation() executed");
  console.log(patient);

  // Conditional statement to omit out patients that fufill the criteria

  if (patient.status === "DISCHARGED" && patient.wardStatus === "AVAILABLE") {
    console.log(
      `Patient ${patient.id}: ${patient.firstName} is already discharged.`
    );
    return;
  }

  // Additional checks to check the Wards bed quota, patient status pirority and error handling

  if (generalWardBedNo <= 10 && generalWardBedNo > 0) {
    if (patient.status === "PENDING") {
      // If Patient Status is "PENDING", means that they are in the waiting list, and their status will be updated to "AVAILABLE"
      updatePatientStatus(db, patient, "AVAILABLE");
      // execute the function and pass the patient object
      insertGeneralWardBed(patient);
    } else {
      // Once "PENDING" status are priortised, the remaining patients are handled
      insertGeneralWardBed(patient);
    }
    await applyTimeoutLogic(db, patient);
  } else {
    // If the patients do not fufill any criteria above, they are placed in Waiting List (Holding Bay), and Patient Status updated to "PENDING"
    updatePatientStatus(db, patient, "PENDING");
  }
  holdingBayAllocation(patient);
};

/**
 * ==============================================
 * * INSERT INTENSIVE CARE WARD BED
 * ==============================================
 * Function: insertintensiveWardBed()
 * ==============================================
 */

const insertIntensiveWardBed = (patient) => {
  // Generate a unique ID for the timer
  const timerId = `timer-${intensiveWardBedNo}`;
  // insertWardAllocationHTML contains the entire HTML markup using template literals.
  const insertWardAllocationHTML = `
    <div class="col-span-full lg:col-span-1">
      <div class="flex flex-col p-4 rounded-lg dark:bg-emerald-900 dark:text-neutral-100 bg-emerald-100 shadow-xl text-center">
        <div class="col-span-full lg:col-span-5 flex justify-center">
          <h1 class="mb-3 font-semibold dark:text-white mt-3">
            Bed ${intensiveWardBedNo++}
          </h1>
          <img src="./asset/image/dashboard/bed.svg" class="w-8 ml-2 " />
        </div>
        <p class="border-2 bg-white border-gray-200 rounded-md px-2 py-1 mb-2 flex justify-between">
          <span class="bg-black text-white px-2 py-1 rounded-md ml-3 w-3">Patient Name:</span>
          ${patient.firstName} ${patient.lastName}
        </p>
        <p class="border-2 bg-white border-gray-200 rounded-md px-2 py-1 mb-2 flex justify-between">
          <span class="bg-black text-white px-2 py-1 rounded-md w-3">Identification:</span>
          ${patient.identification}
        </p>
        <p class="border-2 bg-white border-gray-200 rounded-md px-2 py-1 mb-2 flex justify-between">
          <span class="bg-black text-white px-2 py-1 rounded-md">Ward Status:</span><span
            id="ward-status">${patient.wardStatus}</span>
        </p>
        <p class="border-2 bg-white border-gray-200 rounded-md px-2 py-1 mb-2 flex justify-between">
          <span class="bg-black text-white px-2 py-1 rounded-md">Patient Status:</span><span id="patient-status">${
            patient.status
          }</span>
        </p>
        <p class="border-2 bg-white border-gray-200 rounded-md px-2 py-1 mb-2 flex justify-between">
          <span class="bg-black text-white px-2 py-1 rounded-md">Timer:</span>
          <span id="${timerId}">00.00.00</span>
        </p>
      </div>
    </div>
  `;
  // insert insertWardAllocationHTML to DOM
  const intensivelWardCard = document.getElementById("intensive-ward");
  if (intensivelWardCard) {
    intensivelWardCard.insertAdjacentHTML(
      "beforeend",
      insertWardAllocationHTML
    );
    // Start the timer and run it every second
    setInterval(() => displayTimer(timerId), 1000);
  } else {
    // error handling
    console.error("Intensive Ward bed not found.");
    return;
  }
};

/**
 * ==============================================
 * * HANDLE INTENSIVE WARD ALLOCATION
 * ==============================================
 * Function: intensiveWardAllocation()
 * ==============================================
 * Description:
 * After numerous refactoring, this function handles the allocation of patients to the intensive care ward. It first checks if the patient is already discharged and if the ward is available. If so, it logs a message and returns without further action.
 *
 * Otherwise, it checks if there are available beds in the intensive care ward. If there are, it checks if the patient's status is "PENDING". If so, it updates the patient's status to "AVAILABLE" and inserts the Card Div using the insertWardAllocation function. This also makes sure that it piroritizes patients that are in Waiting List (Holding Bay).
 *
 * (Post PENDING status are cleared) If the patient's status is not "PENDING", it directly inserts the Card Div.
 *
 * Finally, it awaits the completion of the timeout logic using the applyTimeoutLogic function. If there are no available beds, it updates the patient's status to "PENDING".
 *
 * ==============================================
 */

const intensiveWardAllocation = async (db, patient) => {
  console.log("intensiveWardAllocation() executed");
  console.log(patient);

  // Conditional statement to omit out patients that fufill the criteria

  if (patient.status === "DISCHARGED" && patient.wardStatus === "AVAILABLE") {
    console.log(
      `Patient ${patient.id}: ${patient.firstName} is already discharged.`
    );
    return;
  }

  // Additional checks to check the Wards bed quota, patient status pirority and error handling

  if (intensiveWardBedNo <= 10 && intensiveWardBedNo > 0) {
    if (patient.status === "PENDING") {
      // If Patient Status is "PENDING", means that they are in the waiting list, and their status will be updated to "AVAILABLE"
      updatePatientStatus(db, patient, "AVAILABLE");
      // execute the function and pass the patient object
      insertIntensiveWardBed(patient);
    } else {
      // Once "PENDING" status are prioritized, the remaining patients are handled
      insertIntensiveWardBed(patient);
    }
    await applyTimeoutLogic(db, patient);
  } else {
    // If the patients do not fulfill any criteria above, they are placed in Waiting List (Holding Bay), and Patient Status updated to "PENDING"
    updatePatientStatus(db, patient, "PENDING");
  }
  holdingBayAllocation(patient);
};

/**
 * ==============================================
 * * INSERT INFECTIOUS DISEASE WARD BED
 * ==============================================
 * Function: insertInfectiousWardBed()
 * ==============================================
 */

const insertInfectiousWardBed = (patient) => {
  // Generate a unique ID for the timer
  const timerId = `timer-${infectiousWardBedNo}`;
  // insertWardAllocationHTML contains the entire HTML markup using template literals.
  const insertWardAllocationHTML = `
    <div class="col-span-full lg:col-span-1">
      <div class="flex flex-col p-4 rounded-lg dark:bg-emerald-900 dark:text-neutral-100 bg-emerald-100 shadow-xl text-center">
        <div class="col-span-full lg:col-span-5 flex justify-center">
          <h1 class="mb-3 font-semibold dark:text-white mt-3">
            Bed ${infectiousWardBedNo++}
          </h1>
          <img src="./asset/image/dashboard/bed.svg" class="w-8 ml-2 " />
        </div>
        <p class="border-2 bg-white border-gray-200 rounded-md px-2 py-1 mb-2 flex justify-between">
          <span class="bg-black text-white px-2 py-1 rounded-md ml-3 w-3">Patient Name:</span>
          ${patient.firstName} ${patient.lastName}
        </p>
        <p class="border-2 bg-white border-gray-200 rounded-md px-2 py-1 mb-2 flex justify-between">
          <span class="bg-black text-white px-2 py-1 rounded-md w-3">Identification:</span>
          ${patient.identification}
        </p>
        <p class="border-2 bg-white border-gray-200 rounded-md px-2 py-1 mb-2 flex justify-between">
          <span class="bg-black text-white px-2 py-1 rounded-md">Ward Status:</span><span
            id="ward-status">${patient.wardStatus}</span>
        </p>
        <p class="border-2 bg-white border-gray-200 rounded-md px-2 py-1 mb-2 flex justify-between">
          <span class="bg-black text-white px-2 py-1 rounded-md">Patient Status:</span><span id="patient-status">${
            patient.status
          }</span>
        </p>
        <p class="border-2 bg-white border-gray-200 rounded-md px-2 py-1 mb-2 flex justify-between">
          <span class="bg-black text-white px-2 py-1 rounded-md">Timer:</span>
          <span id="${timerId}">00.00.00</span>
        </p>
      </div>
    </div>
  `;
  // insert insertWardAllocationHTML to DOM
  const infectiousWardCard = document.getElementById("infectious-ward");
  if (infectiousWardCard) {
    infectiousWardCard.insertAdjacentHTML(
      "beforeend",
      insertWardAllocationHTML
    );
    // Start the timer and run it every second
    displayTimer();
    setInterval(() => displayTimer(timerId), 1000);
  } else {
    // error handling
    console.error("Infectious Disease Ward bed not found.");
    return;
  }
};

/**
 * ==============================================
 * * HANDLE INFECTIOUS DISEASE WARD ALLOCATION
 * ==============================================
 * Function: infectiousWardAllocationn()
 * ==============================================
 * Description:
 * After numerous refactoring, this function handles the allocation of patients to the infectious disease ward. It first checks if the patient is already discharged and if the ward is available. If so, it logs a message and returns without further action.
 *
 * Otherwise, it checks if there are available beds in the infectious disease ward. If there are, it checks if the patient's status is "PENDING". If so, it updates the patient's status to "AVAILABLE" and inserts the Card Div using the insertWardAllocation function. This also makes sure that it piroritizes patients that are in Waiting List (Holding Bay).
 *
 * (Post PENDING status are cleared) If the patient's status is not "PENDING", it directly inserts the Card Div.
 *
 * Finally, it awaits the completion of the timeout logic using the applyTimeoutLogic function. If there are no available beds, it updates the patient's status to "PENDING".
 *
 * ==============================================
 */

const infectiousWardAllocation = async (db, patient) => {
  console.log("infectiousWardAllocation() executed");
  console.log(patient);

  // Conditional statement to omit out patients that fufill the criteria

  if (patient.status === "DISCHARGED" && patient.wardStatus === "AVAILABLE") {
    console.log(
      `Patient ${patient.id}: ${patient.firstName} is already discharged.`
    );
    return;
  }

  // Additional checks to check the Wards bed quota, patient status pirority and error handling

  if (infectiousWardBedNo <= 10 && infectiousWardBedNo > 0) {
    if (patient.status === "PENDING") {
      // If Patient Status is "PENDING", means that they are in the waiting list, and their status will be updated to "AVAILABLE"
      updatePatientStatus(db, patient, "AVAILABLE");
      // execute the function and pass the patient object
      infectiousWardAllocation(patient);
    } else {
      // Once "PENDING" status are prioritized, the remaining patients are handled
      infectiousWardAllocation(patient);
    }
    await applyTimeoutLogic(db, patient);
  } else {
    // If the patients do not fulfill any criteria above, they are placed in Waiting List (Holding Bay), and Patient Status updated to "PENDING"
    updatePatientStatus(db, patient, "PENDING");
  }
  holdingBayAllocation(patient);
};

/**
 * ==============================================
 * * INSERT HOLDING BAY
 * ==============================================
 * Function: insertHoldingBay()
 * ==============================================
 */

const insertHoldingBay = (patient) => {
  // insertWardAllocationHTML contains the entire HTML markup using template literals.
  const insertWardAllocationHTML = `
    <div class="col-span-full lg:col-span-1">
      <div class="flex flex-col p-4 rounded-lg dark:bg-emerald-900 dark:text-neutral-100 bg-emerald-100 shadow-xl text-center">
        <div class="col-span-full lg:col-span-5 flex justify-center">
          <h1 class="mb-3 font-semibold dark:text-white mt-3">
            PENDING WARD ALLOCATION
          </h1>
          <img src="./asset/image/dashboard/bed.svg" class="w-8 ml-2 " />
        </div>
        <p class="border-2 bg-white border-gray-200 rounded-md px-2 py-1 mb-2 flex justify-between">
          <span class="bg-black text-white px-2 py-1 rounded-md ml-3 w-3">Patient Name:</span>
          ${patient.firstName} ${patient.lastName}
        </p>
        <p class="border-2 bg-white border-gray-200 rounded-md px-2 py-1 mb-2 flex justify-between">
          <span class="bg-black text-white px-2 py-1 rounded-md w-3">Identification:</span>
          ${patient.identification}
        </p>
        <p class="border-2 bg-white border-gray-200 rounded-md px-2 py-1 mb-2 flex justify-between">
          <span class="bg-black text-white px-2 py-1 rounded-md">Ward Status:</span><span
            id="ward-status">${patient.wardStatus}</span>
        </p>
        <p class="border-2 bg-white border-gray-200 rounded-md px-2 py-1 mb-2 flex justify-between">
          <span class="bg-black text-white px-2 py-1 rounded-md">Patient Status:</span><span id="patient-status">${patient.status}</span>
        </p>
        <p class="border-2 bg-white border-gray-200 rounded-md px-2 py-1 mb-2 flex justify-between">
          <span class="bg-black text-white px-2 py-1 rounded-md">Timer:</span>
          <span id="${timerId}">00.00.00</span>
        </p>
      </div>
    </div>
  `;
  // insert insertWardAllocationHTML to DOM
  const holdingBayCard = document.getElementById("holding-bay");
  if (holdingBayCard) {
    holdingBayCard.insertAdjacentHTML("beforeend", insertWardAllocationHTML);
  } else {
    // error handling
    console.error("Holding Bay Ward bed not found.");
    return;
  }
};

/**
 * ==============================================
 * * HANDLE HOLDING BAY WARD ALLOCATION
 * ==============================================
 * Function: infectiousWardAllocationn()
 * ==============================================
 * Description:
 *
 * ==============================================
 */

const holdingBayAllocation = async (patient) => {
  if (patient.status === "DISCHARGED" && patient.wardStatus === "AVAILABLE") {
    insertHoldingBay(patient);
  } else {
    return;
  }
};
