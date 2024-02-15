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
      console.log("All objects retrieved:", patientDataArray);
    }
  };
};

const tableBody = document.getElementById("patientTableBody");
const patientCategory = dummyPatientData.forEach((patient) => {
  const rowContent = `
  <tr class="border-b border-opacity-20 border-gray-700 bg-gray-100 dark:border-gray-700 dark:bg-gray-900">
  <td class="p-3">${patient.UID}</td>
  <td class="p-3">${patient.firstName}</td>
  <td class="p-3">${patient.lastName}</td>
  <td class="p-3">${patient.dob}</td>
  <td class="p-3">${patient.gender}</td>
  <td class="p-3">${patient.phoneNumber}</td>
  <td class="p-3">${patient.NRIC}</td>
  <td class="p-3">${patient.admissionDateTime}</td>
  <td class="p-3">
  <span class="px-3 py-1 font-semibold rounded-md dark:bg-violet-400 dark:text-gray-900">
          <span>${patient.patientCategory}</span>
      </span>
      <td class="p-3">
      <span class="px-3 py-1 font-semibold rounded-md dark:bg-violet-400 dark:text-gray-900">
          <span>${patient.priorityStatus}</span>
      </span>
  </td>
</tr>`;

  // Append the row to the table body
  tableBody.insertAdjacentHTML("beforeend", rowContent);
});
