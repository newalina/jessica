const url = "https://fedskillstest.coalitiontechnologies.workers.dev";
const username = "coalition";
const password = "skills-test";
const credentials = btoa(`${username}:${password}`);

document.addEventListener("DOMContentLoaded", () => {
  fetch(url, {
    method: "GET",
    headers: {
      Authorization: `Basic ${credentials}`,
    },
  })
    .then((response) => response.json())
    .then((data) => {
      populatePatientsList(data);
      const jessicaTaylor = data.find(
        (patient) => patient.name === "Jessica Taylor"
      );
      if (jessicaTaylor) {
        populateDiagnosisHistory(jessicaTaylor);
        populateDiagnosticList(jessicaTaylor);
        populatePatientInformation(jessicaTaylor);
        populateLabResults(jessicaTaylor);
      }
    })
    .catch((error) => console.error("Error fetching data:", error));
});

// Function to populate patients list
function populatePatientsList(data) {
  const container = document.querySelector("#patients-list .section-content");

  data.forEach((patient) => {
    const patientCard = document.createElement("div");
    patientCard.classList.add("patient-card");

    if (patient.name === "Jessica Taylor") {
      patientCard.classList.add("active");
    }

    patientCard.innerHTML = `
      <img src="${patient.profile_picture}" alt="${patient.name}" class="patient-thumbnail">
      <div class="patient-summary">
        <strong>${patient.name}</strong>
        <p>${patient.gender}, ${patient.age}</p>
      </div>
      <img src="/assets/more_horiz_FILL0_wght300_GRAD0_opsz24.svg" alt="horizontal dots" class="smaller-icon">
      
    `;

    container.appendChild(patientCard);
  });
}

// Function to populate diagnosis history for Jessica Taylor
function populateDiagnosisHistory(patient) {
  const container = document.querySelector(
    "#diagnosis-history .section-content"
  );

  // Filter data for October 2023 to March 2024
  const filteredData = patient.diagnosis_history.filter((diagnosis) => {
    // Assuming diagnosis has month and year properties
    // Adjust logic to fit your data structure
    // Example: Filter for months October 2023 to March 2024
    return (
      (diagnosis.year === 2023 && diagnosis.month >= "October") ||
      (diagnosis.year === 2024 && diagnosis.month <= "March")
    );
  });

  // Prepare data for the blood pressure line chart
  const chartData = {
    labels: filteredData.map(
      (diagnosis) => `${diagnosis.month} ${diagnosis.year}`
    ),
    datasets: [
      {
        label: "Systolic Blood Pressure",
        data: filteredData.map(
          (diagnosis) => diagnosis.blood_pressure.systolic.value
        ),
        borderColor: "rgba(75, 192, 192, 1)",
        backgroundColor: "rgba(75, 192, 192, 0.2)",
        fill: false,
      },
      {
        label: "Diastolic Blood Pressure",
        data: filteredData.map(
          (diagnosis) => diagnosis.blood_pressure.diastolic.value
        ),
        borderColor: "rgba(255, 99, 132, 1)",
        backgroundColor: "rgba(255, 99, 132, 0.2)",
        fill: false,
      },
    ],
  };

  // Render the chart
  const ctx = document.getElementById("acquisitions").getContext("2d");
  new Chart(ctx, {
    type: "line",
    data: chartData,
  });

  const recentDiagnosis = patient.diagnosis_history.filter(
    (diagnosis) => diagnosis.month === "March" && diagnosis.year === 2024
  );

  container.innerHTML = recentDiagnosis
    .map(
      (diagnosis) => `
        <div class="recent-diagnosis">
          <div class="diagnosis-card" style="background-color: #e0f3fa">
            <img src="/assets/respiratory rate.svg" alt="diagnosis icon" class="diagnosis-icon">
            <p>Respiratory Rate</p>
            <h2>${diagnosis.respiratory_rate.value} bpm</h2>
            <br/>
            <p>${diagnosis.respiratory_rate.levels}</p>
          </div>
          <div class="diagnosis-card" style="background-color: #ffe6e9">
            <img src="/assets/temperature.svg" alt="diagnosis icon" class="diagnosis-icon">
            <p>Temperature</p>
            <h2>${diagnosis.temperature.value}°F</h2>
            <br/>
            <p>${diagnosis.temperature.levels}</p>
            </div>
            <div class="diagnosis-card" style="background-color: #ffe6f1">
            <img src="/assets/HeartBPM.svg" alt="diagnosis icon" class="diagnosis-icon">
            <p>Heart Rate</p>
            <h2>${diagnosis.heart_rate.value} bpm</h2>
            <br/>
            <p>
              <img src="/assets/ArrowDown.svg" alt="arrow down icon" class="smallest-icon">
              ${diagnosis.heart_rate.levels}
            </p>
          </div>
        </div>
      `
    )
    .join("");
}

// Function to populate diagnostic list for Jessica Taylor
function populateDiagnosticList(patient) {
  const container = document.querySelector("#diagnostic-list .section-content");

  // Populate diagnostic items
  patient.diagnostic_list.forEach((diagnostic) => {
    const diagnosticItem = document.createElement("tr");
    diagnosticItem.classList.add("diagnostic-item");

    diagnosticItem.innerHTML = `
      <td>${diagnostic.name}</td>
      <td>${diagnostic.description}</td>
      <td>${diagnostic.status}</td>
    `;

    container.appendChild(diagnosticItem);
  });
}

// Function to populate patient information for Jessica Taylor
function populatePatientInformation(patient) {
  const container = document.querySelector(
    "#patient-information .section-content"
  );

  const patientInfo = document.createElement("div");
  patientInfo.classList.add("patient-profile");

  patientInfo.innerHTML = `
    <img src="${patient.profile_picture}" alt="${patient.name}" class="patient-picture">
    <h2>${patient.name}</h2>
    <div class="patient-details">
      <div class="detail-card">
        <img src="/assets/BirthIcon.svg" alt="icon thumbnail" class="icon-thumbnail">
        <div>
          <p>Date of Birth</p>
          <strong>${patient.date_of_birth}</strong>
        </div>
      </div>
      <div class="detail-card">
        <img src="/assets/FemaleIcon.svg" alt="icon thumbnail" class="icon-thumbnail">
        <div>
          <p>Gender</p>
          <strong>${patient.gender}</strong>
        </div>
      </div>
      <div class="detail-card">
        <img src="/assets/PhoneIcon.svg" alt="icon thumbnail" class="icon-thumbnail">
        <div>
          <p>Contact Information</p>
          <strong>${patient.phone_number}</strong>
        </div>
      </div>
      <div class="detail-card">
        <img src="/assets/PhoneIcon.svg" alt="icon thumbnail" class="icon-thumbnail">
        <div>
          <p>Emergency Contacts</p>
          <strong>${patient.emergency_contact}</strong>
        </div>
      </div>
      <div class="detail-card">
        <img src="/assets/InsuranceIcon.svg" alt="icon thumbnail" class="icon-thumbnail">
        <div>
          <p>Insurance Provider</p>
          <strong>${patient.insurance_type}</strong>
        </div>
      </div>
    </div>
  `;

  container.appendChild(patientInfo);
}

// Function to populate lab results for Jessica Taylor
function populateLabResults(patient) {
  const container = document.querySelector("#lab-results .section-content");

  patient.lab_results.forEach((result) => {
    const labResultItem = document.createElement("div");
    labResultItem.classList.add("lab-result-item");

    labResultItem.innerHTML = `
      <p>${result}</p>
      <img src="/assets/download_FILL0_wght300_GRAD0_opsz24 (1).svg" alt="download icon" class="small-icon">

    `;

    container.appendChild(labResultItem);
  });
}
