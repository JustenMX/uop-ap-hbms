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
      sayHello();
      break;
  }
};

const sayHello = () => {
  console.log("hello");
};
