console.log("admission.js is running");

// Get the current time in milliseconds
const currentTime = new Date().getTime();
console.log(currentTime);

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

  /**
   * declaring variables to form fields
   */

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
  const timestamp = new Date().toISOString(); // ISO format timestamp
  const uuid = crypto.randomUUID(); // UUID

  /**
   *
   * custom validations
   * https://html.form.guide/snippets/javascript-form-validation-using-regular-expression/
   * https://confluence.atlassian.com/jirakb/using-forms-regex-validation-1255454685.html
   *
   */

  // Regex for first name: Allows only alphabetic characters, min length 2
  const firstNameRegex = /^[a-zA-Z]{2,}$/;

  // Regex for last name: Allows only alphabetic characters, min length 2
  const lastNameRegex = /^[a-zA-Z]{2,}$/;

  // Regex for email: Covers most email syntaxes
  const emailRegex = /^([a-zA-Z0-9_\.]+)@([a-zA-Z0-9_\.]+)\.([a-zA-Z]{2,5})$/;

  // Regex for mobile: allows only numeric values, min length 6
  const mobileRegex = /^[0-9]{8,}$/;

  // Regex for identification: allows alphanumeric values, min length 5
  const identificationRegex = /^.{5,}$/;

  /**
   * switch statement to handle null field and custom validation
   */

  switch (true) {
    case !firstName:
      alert("First Name required!");
      break;
    case !firstNameRegex.test(firstName):
      alert(
        "Please insert a valid first name, no numbers and symbols are allowed."
      );
      break;
    case !lastName:
      alert("Last Name required!");
      break;
    case !lastNameRegex.test(lastName):
      alert(
        "Please insert a valid last name, no numbers and symbols are allowed."
      );
      break;
    case !email:
      alert("Email required!");
      break;
    case !emailRegex.test(email):
      alert("Please insert a valid email address.");
      break;
    case !mobile:
      alert("Mobile required!");
      break;
    case !mobileRegex.test(mobile):
      alert("Please insert a valid mobile number.");
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
    case !identificationRegex.test(identification):
      alert("Please isnert a valid identification number");
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
    // case !remark:
    //   alert("If there is no remarks, input 'no remarks' - do not leave blank!");
    //   break;
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
        timestamp: timestamp,
      };
      // console.log(patientData);
      openPatientDatabase(patientData);
      break;
  }
};

/**
 *
 * ==============================================
 * Open IndexDB (patientDatabase)
 * ==============================================
 * https://medium.com/@kamresh485/indexeddb-tutorial-for-beginners-a-comprehensive-guide-with-coding-examples-74df2914d4d5
 *
 */

const openPatientDatabase = (patientData) => {
  // Error handling - check if the patientData object is passed

  if (!patientData) {
    console.error("Patient data is missing.");
    alert("❌ Error adding patient data, please try again.");
    return;
  } else {
    console.log(patientData);
  }

  // open connection to patientDatabase
  const request = indexedDB.open("patientDatabase", 1);

  // Triggered when DB is first created / version changes
  request.onupgradeneeded = (event) => {
    const db = event.target.result;
    // create search index
    const objectStore = db.createObjectStore("patients", { keyPath: "uuid" });
    objectStore.createIndex("firstName", "firstName", { unique: false });
    objectStore.createIndex("lastName", "lastName", { unique: false });
    objectStore.createIndex("email", "email", { unique: true });
    objectStore.createIndex("mobile", "mobile", { unique: false });
    // objectStore.createIndex("dob", "dob", { unique: false });
    objectStore.createIndex("gender", "gender", { unique: false });
    objectStore.createIndex("identification", "identification", {
      unique: true,
    });
    // objectStore.createIndex("address", "address", { unique: false });
    objectStore.createIndex("adcategory", "adcategory", { unique: false });
    objectStore.createIndex("mdcategory", "mdcategory", { unique: false });
    // objectStore.createIndex("remark", "remark", { unique: false });
    // objectStore.createIndex("timestamp", "timestamp", { unique: false });
  };

  // Handle successful opening of the database
  request.onsuccess = (event) => {
    const db = event.target.result;
    const transaction = db.transaction(["patients"], "readwrite");

    // Handle transaction completion
    transaction.oncomplete = (event) => {
      console.log("Transaction completed");
    };

    // Handle transaction error
    transaction.onerror = (event) => {
      console.error("Transaction error:", event.target.error);
    };

    const objectStore = transaction.objectStore("patients");
    const addRequest = objectStore.add(patientData);

    addRequest.onsuccess = (event) => {
      console.log("Patient data added successfully");
      alert("✅ Patient data added successfully");
      window.location.href = "dashboard.html";
    };

    addRequest.onerror = (event) => {
      console.error("Error adding patient data: ", event.target.error);
      alert(
        "❌ Error adding patient data, please try again. Email and Identification field values should be unique, please do check against Patient Records."
      );
    };
  };

  // Handle errors when opening the database
  request.onerror = (event) => {
    console.error("Database error: " + event.target.errorCode);
  };
};
