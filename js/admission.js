console.log("admission.js is running");

/**
 * ==============================================
 * Get Address From Postal Code
 * ==============================================
 */

const getAddressFromPostalcode = async (event) => {
  event.preventDefault();
  const postalCode = document.getElementById("postalcode").value;
  // using axios.get to retrive the address from onemap
  try {
    const response = await axios.get(
      `https://www.onemap.gov.sg/api/common/elastic/search?searchVal=${postalCode}&returnGeom=N&getAddrDetails=Y&pageNum=1`
    );
    const addressInput = document.getElementById("address");
    console.log(response.data);
    if (response.data && response.data.results.length > 0) {
      const address = response.data.results[0].ADDRESS;
      addressInput.value = address;
      // addressInput.disabled = true;
    } else {
      console.error("No address found for the given postal code");
      alert("No address found for the given postal code");
    }
  } catch (error) {
    console.error("Error:", error);
    alert("Something went wrong, key in a valid postal code");
  }
};

/**
 * ==============================================
 * Handle Patient Registration Form Submission
 * ==============================================
 */

const handlePatientSubmission = () => {
  console.log("Patient Registration Submit button clicked");

  const firstName = document.getElementById("firstName").value;
  const lastName = document.getElementById("lastName").value;
  const email = document.getElementById("email").value;
  const mobile = document.getElementById("mobile").value;
  const dob = document.getElementById("dob").value;
  const gender = document.getElementById("gender").value;
  const identification = document.getElementById("identification").value;
  const address = document.getElementById("address").value;
  const adcategory = document.getElementById("adcategory").value;
  const mdcategory = document.getElementById("mdcategory").value;
  const remark = document.getElementById("remark").value;
  const joinDate = new Date().toISOString(); // ISO format timestamp
  const uuid = crypto.randomUUID(); // UUID

  // switch statement to handle null field validation
  switch (true) {
    case !firstName:
      alert("First Name required!");
      break;
    case !lastName:
      alert("Last Name required!");
      break;
    case !email:
      alert("Email required!");
      break;
    case !mobile:
      alert("Mobile required!");
      break;
    case !dob:
      alert("Date of Birth required!");
      break;
    case !gender:
      alert("Gender required!");
      break;
    case !identification:
      alert("Identification required!");
      break;
    case !address:
      alert("Address required!");
      break;
    case !adcategory:
      alert("Admission Category required!");
      break;
    case !mdcategory:
      alert("Medical Category required!");
      break;
    case !remark:
      alert("If there is no remarks, input 'no remarks' - do not leave blank!");
      break;
    default:
      // create patientData object
      const patientData = {
        uuid: uuid,
        firstName: firstName,
        lastName: lastName,
        email: email,
        mobile: mobile,
        dob: dob,
        gender: gender,
        identification: identification,
        address: address,
        adcategory: adcategory,
        mdcategory: mdcategory,
        remark: remark,
        joinDate: joinDate,
      };
      console.log(patientData);
      openIndexDB(patientData);
      break;
  }
};

/**
 * ==============================================
 * Open IndexDB (patientDatabase)
 * ==============================================
 * https://developer.mozilla.org/en-US/docs/Web/API/IndexedDB_API/Using_IndexedDB
 * https://medium.com/@kamresh485/indexeddb-tutorial-for-beginners-a-comprehensive-guide-with-coding-examples-74df2914d4d5
 * ==============================================
 */

const openIndexDB = (patientData) => {
  // Check if the patientData is passed
  if (!patientData) {
    console.error("Patient data is missing.");
    return;
  } else {
    console.log(patientData);
  }

  // Open database
  const request = indexedDB.open("patientDatabase", 1);
  console.log("stage 1");

  // Triggered when DB is first created / version changes
  request.onupgradeneeded = function (event) {
    const db = event.target.result;
    const objectStore = db.createObjectStore("patients", { keyPath: "uuid" });
    // objectStore.createIndex("uuid", "uuid", { unique: true });
    objectStore.createIndex("firstName", "firstName", { unique: false });
    objectStore.createIndex("lastName", "lastName", { unique: false });
    objectStore.createIndex("email", "email", { unique: false });
    // objectStore.createIndex("mobile", "mobile", { unique: false });
    // objectStore.createIndex("dob", "dob", { unique: false });
    // objectStore.createIndex("gender", "gender", { unique: false });
    // objectStore.createIndex("identification", "identification", {
    //   unique: false,
    // });
    // objectStore.createIndex("address", "address", { unique: false });
    // objectStore.createIndex("adcategory", "adcategory", { unique: false });
    // objectStore.createIndex("mdcategory", "mdcategory", { unique: false });
    // objectStore.createIndex("remark", "remark", { unique: false });
    // objectStore.createIndex("joinDate", "joinDate", { unique: false });
  };
  console.log("stage 2");
  // Handle successful opening of the database
  request.onsuccess = function (event) {
    const db = event.target.result;
    const transaction = db.transaction(["patients"], "readwrite");

    // Handle transaction completion
    transaction.oncomplete = function (event) {
      console.log("Transaction completed");
    };

    // Handle transaction error
    transaction.onerror = function (event) {
      console.error("Transaction error:", event.target.error);
    };

    const objectStore = transaction.objectStore("patients");
    const addRequest = objectStore.add(patientData);

    addRequest.onsuccess = function (event) {
      console.log("Patient data added successfully");
      alert("🟢 Patient data added successfully");
      window.location.href = "dashboard.html";
    };

    addRequest.onerror = function (event) {
      console.error("Error adding patient data: ", event.target.error);
      alert("⚠️ Error adding patient data, please try again.");
    };
  };

  // Handle errors when opening the database
  request.onerror = function (event) {
    console.error("Database error: " + event.target.errorCode);
  };
};
