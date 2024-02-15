console.log("records.js is running");

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
      // console.log("patientData Obj retrieved:", patientDataArray);
      const tableBody = document.getElementById("recordsTableBody");
      console.log(patientDataArray);
      const patientInsertTableRow = patientDataArray.map(
        (patient) =>
          `<tr
          class="border-b border-opacity-20 border-neutral-700 bg-stone-100 dark:border-neutral-700 dark:bg-neutral-800"
        >
          <td class="p-3">${patient.id}</td>
          <td class="p-3">${patient.firstName}</td>
          <td class="p-3">${patient.lastName}</td>
          <td class="p-3">${patient.email}</td>
          <td class="p-3">${patient.mobile}</td>
          <td class="p-3">${patient.dob}</td>
          <td class="p-3">${patient.gender}</td>
          <td class="p-3">${patient.identification}</td>
          <td class="p-3">${patient.address}</td>
          <td class="p-3">${patient.adcategory}</td>
          <td class="p-3">${patient.mdcategory}</td>
          <td class="p-3">${patient.remark}</td>
          <td class="p-3">${patient.timestamp}</td>
          <td class="p-3">
            <button
              onclick="handlePatientUpdate()"
              class="text-white bg-blue-800 hover:bg-blue-600 rounded-lg text-sm text-center w-full font-medium shadow-md p-2"
            >
              Update
            </button>
          </td>
          <td class="p-3">
            <button
              onclick="handlePatientDelete()"
              class="text-white bg-red-800 hover:bg-red-600 rounded-lg text-sm text-center w-full font-medium shadow-md p-2"
            >
              Delete
            </button>
          </td>
          <td class="p-3">
            <button
              onclick="handleWardNow()"
              class="text-white bg-emerald-800 hover:bg-emerald-600 rounded-lg text-sm text-center w-full font-medium shadow-md p-2"
            >
              Ward
            </button>
          </td>
        </tr>`
      );
      // Join the HTML strings and set as innerHTML of the table body
      tableBody.innerHTML = patientInsertTableRow.join("");
    }
  };
};

const handlePatientUpdate = () => {
  console.log("handlePatientUpdate triggered");
};

const handlePatientDelete = () => {
  console.log("handlePatientDelete triggered");
};

const handleWardNow = () => {
  console.log("handleWardNow triggered");
};
