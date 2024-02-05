console.log("records.js is running");
// console.log(dummyPatientData);

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
