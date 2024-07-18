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
      const jessica = data.find((patient) => patient.name === "Jessica Taylor");
      if (jessica) {
        populateDiagnosisHistory(jessica);
        populateDiagnosticList(jessica);
        populatePatientInformation(jessica);
        populateLabResults(jessica);
      }
    })
    .catch((error) => console.error("Error fetching data:", error));
});

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

function populateDiagnosisHistory(patient) {
  const container = document.querySelector(
    "#diagnosis-history .section-content"
  );
  const chartContainer = document.querySelector(
    "#diagnosis-history .chart-card"
  );

  const filteredData = patient.diagnosis_history.filter((diagnosis) => {
    return (
      (diagnosis.year === 2023 && diagnosis.month >= "October") ||
      (diagnosis.year === 2024 && diagnosis.month <= "March")
    );
  });

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
        borderColor: "rgba(230, 111, 210, 1)",
        backgroundColor: "rgba(230, 111, 210, 1)",
        fill: false,
      },
      {
        label: "Diastolic Blood Pressure",
        data: filteredData.map(
          (diagnosis) => diagnosis.blood_pressure.diastolic.value
        ),
        borderColor: "rgba(140, 111, 230, 1)",
        backgroundColor: "rgba(140, 111, 230, 1)",
        fill: false,
      },
    ],
  };

  const ctx = document.getElementById("acquisitions");
  new Chart(ctx, {
    type: "line",
    data: chartData,
    options: {
      plugins: {
        legend: {
          display: false,
        },
      },
      responsive: false,
    },
  });

  const recentDiagnosis = patient.diagnosis_history.filter(
    (diagnosis) => diagnosis.month === "March" && diagnosis.year === 2024
  );

  const chartLengend = document.createElement("div");
  chartLengend.classList.add("chart-legend");

  chartLengend.innerHTML = recentDiagnosis.map(
    (diagnosis) => `
    <span class="legend-item">
      <span class="legend-dot systolic-dot"></span>
      <strong>Systolic</strong>
    </span>
    <h3>${diagnosis.blood_pressure.systolic.value}</h3>
    <p>
      <img src="/assets/ArrowUp.svg" alt="arrow up icon" class="smallest-icon">
      ${diagnosis.blood_pressure.systolic.levels}
    </p>
    <br />
    <span class="legend-item">
      <span class="legend-dot diastolic-dot"></span>
      <strong>Diastolic</strong>
    </span>
    <h3>${diagnosis.blood_pressure.diastolic.value}</h3>
    <p>
      <img src="/assets/ArrowDown.svg" alt="arrow down icon" class="smallest-icon">
      ${diagnosis.blood_pressure.diastolic.levels}
    </p>
  `
  );

  chartContainer.appendChild(chartLengend);

  container.innerHTML = recentDiagnosis
    .map(
      (diagnosis) => `
        <div class="recent-diagnosis">
          <div class="diagnosis-card" style="background-color: #e0f3fa">
            <img src="/assets/respiratory rate.svg" alt="diagnosis icon" class="diagnosis-icon">
            <p>Respiratory Rate</p>
            <h2>${diagnosis.respiratory_rate.value} bpm</h2>
            <br />
            <p>${diagnosis.respiratory_rate.levels}</p>
          </div>
          <div class="diagnosis-card" style="background-color: #ffe6e9">
            <img src="/assets/temperature.svg" alt="diagnosis icon" class="diagnosis-icon">
            <p>Temperature</p>
            <h2>${diagnosis.temperature.value}°F</h2>
            <br />
            <p>${diagnosis.temperature.levels}</p>
            </div>
            <div class="diagnosis-card" style="background-color: #ffe6f1">
            <img src="/assets/HeartBPM.svg" alt="diagnosis icon" class="diagnosis-icon">
            <p>Heart Rate</p>
            <h2>${diagnosis.heart_rate.value} bpm</h2>
            <br />
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

function populateDiagnosticList(patient) {
  const container = document.querySelector("#diagnostic-list .section-content");

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
