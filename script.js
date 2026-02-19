const TOTAL_ATTENDEES = 50;
const STORAGE_KEY = "intelSummitCheckInData";

let attendeeCount = 0;

const teamMembers = {
  "Water Wise": [],
  "Net Zero": [],
  Renewables: [],
};

const checkInForm = document.getElementById("checkInForm");
const attendeeNameInput = document.getElementById("attendeeName");
const teamSelect = document.getElementById("teamSelect");
const greeting = document.getElementById("greeting");
const celebrationMessage = document.getElementById("celebrationMessage");

const attendeeCountElement = document.getElementById("attendeeCount");
const totalAttendeeCountElement = document.getElementById("totalAttendeeCount");
const progressBar = document.getElementById("progressBar");

const waterCountElement = document.getElementById("waterCount");
const zeroCountElement = document.getElementById("zeroCount");
const powerCountElement = document.getElementById("powerCount");

const waterListElement = document.getElementById("waterList");
const zeroListElement = document.getElementById("zeroList");
const powerListElement = document.getElementById("powerList");

function saveCheckInData() {
  const dataToSave = {
    teamMembers: {
      "Water Wise": teamMembers["Water Wise"],
      "Net Zero": teamMembers["Net Zero"],
      Renewables: teamMembers.Renewables,
    },
  };

  localStorage.setItem(STORAGE_KEY, JSON.stringify(dataToSave));
}

function getTotalTeamMembers() {
  return (
    teamMembers["Water Wise"].length +
    teamMembers["Net Zero"].length +
    teamMembers.Renewables.length
  );
}

function loadCheckInData() {
  const savedData = localStorage.getItem(STORAGE_KEY);

  if (!savedData) {
    return;
  }

  try {
    const parsedData = JSON.parse(savedData);

    if (
      parsedData.teamMembers &&
      Array.isArray(parsedData.teamMembers["Water Wise"]) &&
      Array.isArray(parsedData.teamMembers["Net Zero"]) &&
      Array.isArray(parsedData.teamMembers.Renewables)
    ) {
      teamMembers["Water Wise"] = parsedData.teamMembers["Water Wise"];
      teamMembers["Net Zero"] = parsedData.teamMembers["Net Zero"];
      teamMembers.Renewables = parsedData.teamMembers.Renewables;
      attendeeCount = getTotalTeamMembers();
    }
  } catch (error) {
    localStorage.removeItem(STORAGE_KEY);
  }
}

function setMessage(message, isError) {
  greeting.style.display = "block";
  greeting.textContent = message;

  if (isError) {
    greeting.className = "";
  } else {
    greeting.className = "success-message";
  }
}

function isAlreadyCheckedIn(name) {
  const allNames = teamMembers["Water Wise"]
    .concat(teamMembers["Net Zero"])
    .concat(teamMembers.Renewables);

  return allNames.includes(name);
}

function updateAttendanceDisplay() {
  attendeeCountElement.textContent = `${attendeeCount}`;
  totalAttendeeCountElement.textContent = `${TOTAL_ATTENDEES}`;

  const progress = (attendeeCount / TOTAL_ATTENDEES) * 100;
  progressBar.style.width = `${progress}%`;
}

function renderTeamList(listElement, members) {
  listElement.innerHTML = "";

  if (members.length === 0) {
    const emptyItem = document.createElement("li");
    emptyItem.textContent = "No attendees yet";
    listElement.appendChild(emptyItem);
    return;
  }

  for (let i = 0; i < members.length; i = i + 1) {
    const item = document.createElement("li");
    item.textContent = members[i];
    listElement.appendChild(item);
  }
}

function updateTeamDisplay() {
  waterCountElement.textContent = `${teamMembers["Water Wise"].length}`;
  zeroCountElement.textContent = `${teamMembers["Net Zero"].length}`;
  powerCountElement.textContent = `${teamMembers.Renewables.length}`;

  renderTeamList(waterListElement, teamMembers["Water Wise"]);
  renderTeamList(zeroListElement, teamMembers["Net Zero"]);
  renderTeamList(powerListElement, teamMembers.Renewables);
}

function showCelebrationMessage() {
  if (attendeeCount < TOTAL_ATTENDEES) {
    celebrationMessage.style.display = "none";
    celebrationMessage.textContent = "";
    return;
  }

  const waterCount = teamMembers["Water Wise"].length;
  const zeroCount = teamMembers["Net Zero"].length;
  const renewablesCount = teamMembers.Renewables.length;

  const highestCount = Math.max(waterCount, zeroCount, renewablesCount);
  const winningTeams = [];

  if (waterCount === highestCount) {
    winningTeams.push("Water Wise");
  }

  if (zeroCount === highestCount) {
    winningTeams.push("Net Zero");
  }

  if (renewablesCount === highestCount) {
    winningTeams.push("Renewables");
  }

  if (winningTeams.length === 1) {
    celebrationMessage.textContent = `🎉 Celebration! ${winningTeams[0]} wins with ${highestCount} attendees.`;
  } else {
    celebrationMessage.textContent = `🎉 Celebration! It's a tie between ${winningTeams.join(" and ")} with ${highestCount} attendees each.`;
  }

  celebrationMessage.style.display = "block";
}

function handleCheckIn(event) {
  event.preventDefault();

  const attendeeName = attendeeNameInput.value.trim();
  const selectedTeam = teamSelect.value;

  if (!attendeeName || !selectedTeam) {
    setMessage("Please enter a name and select a team.", true);
    return;
  }

  if (attendeeCount >= TOTAL_ATTENDEES) {
    setMessage("Check-in is full. All attendees have signed in.", true);
    return;
  }

  if (isAlreadyCheckedIn(attendeeName)) {
    setMessage(`${attendeeName} is already checked in.`, true);
    return;
  }

  teamMembers[selectedTeam].push(attendeeName);
  attendeeCount = attendeeCount + 1;

  updateAttendanceDisplay();
  updateTeamDisplay();
  showCelebrationMessage();
  saveCheckInData();
  setMessage(`${attendeeName} joined ${selectedTeam}.`, false);

  checkInForm.reset();
}

checkInForm.addEventListener("submit", handleCheckIn);

loadCheckInData();
updateAttendanceDisplay();
updateTeamDisplay();
showCelebrationMessage();
