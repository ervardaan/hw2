/*
function buildStudents(studs) {
	// TODO This function is just a suggestion! I would suggest calling it after
	//      fetching the data or performing a search. It should populate the
	//      index.html with student data by using createElement and appendChild.
}

function handleSearch(e) {
	e?.preventDefault(); // You can ignore this; prevents the default form submission!

	// TODO Implement the search
}

document.getElementById("search-btn").addEventListener("click", handleSearch);
*/

// =======================
// app.js
// =======================

// 1. GLOBAL VARIABLES
// -------------------
// We'll store the fetched array of students here:
let allStudents = [];

// Grab references to the actual DOM elements (matching YOUR index.html IDs):
const nameInput         = document.getElementById("search-name");
const majorInput        = document.getElementById("search-major");
const interestInput     = document.getElementById("search-interest");
const searchButton      = document.getElementById("search-btn");
const numResultsElement = document.getElementById("num-results");
const studentsContainer = document.getElementById("students");



// 2. fetchStudents()
// ------------------
// Fetch from the CS571 API, console.log the array, set allStudents,
// update the “num-results” count, and display all students on‐load.
function fetchStudents() {
  // 2a. Get your Badger ID (provided by badgerguard.js)
  const myBadgerId = CS571.getBadgerId();

  // 2b. Fetch the students array
  fetch("https://cs571api.cs.wisc.edu/rest/s25/hw2/students", {
    headers: { "X-CS571-ID": myBadgerId }
  })
    .then(response => {
      if (!response.ok) {
        throw new Error("Network response was not OK");
      }
      return response.json();
    })
    .then(data => {
      // 2c. Store globally and console.log (requirement #1)
      allStudents = data;
      console.log(allStudents);

      // 2d. Update the “num-results” span
      numResultsElement.innerText = allStudents.length;

      // 2e. Display all students initially
      displayStudents(allStudents);
    })
    .catch(error => {
      console.error("Fetch error:", error);
      // (Optionally show a user‐friendly error in the page)
    });
}



// 3. displayStudents(arr)
// -----------------------
// Given an array of student objects, clear #students and append a “card” for each.
function displayStudents(arr) {
  // 3a. Remove any existing children
  while (studentsContainer.firstChild) {
    studentsContainer.removeChild(studentsContainer.firstChild);
  }

  // 3b. Create and append a Bootstrap‐grid wrapper for each student
  arr.forEach(student => {
    const studentCol = createStudentElement(student);
    studentsContainer.appendChild(studentCol);
  });
}



// 4. createStudentElement(student)
// --------------------------------
// Builds a <div class="col-12 col-md-6 col-lg-4 col-xl-3">…</div> for one student.
function createStudentElement(student) {
  // 4a. Outer wrapper with Bootstrap grid classes:
  const wrapper = document.createElement("div");
  wrapper.className = "col-12 col-md-6 col-lg-4 col-xl-3";

  // 4b. Inner “card” container (Bootstrap styling optional)
  const card = document.createElement("div");
  card.className = "card p-3 mb-3";

  // 4c. Name (First + Last)
  const nameEl = document.createElement("h5");
  nameEl.className = "card-title";
  nameEl.innerText = `${student.name.first} ${student.name.last}`;
  card.appendChild(nameEl);

  // 4d. Major
  const majorEl = document.createElement("p");
  majorEl.innerHTML = `<strong>Major:</strong> ${student.major}`;
  card.appendChild(majorEl);

  // 4e. Number of Credits
  const creditsEl = document.createElement("p");
  creditsEl.innerHTML = `<strong>Credits:</strong> ${student.numCredits}`;
  card.appendChild(creditsEl);

  // 4f. From Wisconsin?
  const fromWisconsinEl = document.createElement("p");
  fromWisconsinEl.innerHTML = `<strong>From WI:</strong> ${student.fromWisconsin ? "Yes" : "No"}`;
  card.appendChild(fromWisconsinEl);

  // 4g. Interests (an unordered list, each interest is a clickable <a>)
  const interestsHeading = document.createElement("p");
  interestsHeading.innerHTML = "<strong>Interests:</strong>";
  card.appendChild(interestsHeading);

  const ul = document.createElement("ul");
  ul.style.paddingLeft = "1rem"; // indent the list slightly

  student.interests.forEach(interestText => {
    const li = document.createElement("li");
    const anchor = document.createElement("a");
    anchor.href = "#";
    anchor.innerText = interestText;
    anchor.style.cursor = "pointer";

    // 4g.i. When an interest is clicked, clear name/major inputs,
    // set interest‐input to this exact text, and re‐run handleSearch().
    anchor.addEventListener("click", e => {
      e.preventDefault();
      nameInput.value = "";
      majorInput.value = "";
      interestInput.value = interestText;
      handleSearch();
    });

    li.appendChild(anchor);
    ul.appendChild(li);
  });

  card.appendChild(ul);

  // 4h. Append card into the grid wrapper
  wrapper.appendChild(card);
  return wrapper;
}



// 5. handleSearch()
// -----------------
// Read the three search inputs, filter allStudents (AND logic), update count, and re‐render.
function handleSearch() {
  // 5a. Read and normalize search terms:
  const nameTerm     = nameInput.value.trim().toLowerCase();
  const majorTerm    = majorInput.value.trim().toLowerCase();
  const interestTerm = interestInput.value.trim().toLowerCase();

  // 5b. Filter:
  const filtered = allStudents.filter(student => {
    // 5b.1. Name check (if nameTerm is non‐empty)
    if (nameTerm !== "") {
      const fullName = (student.name.first + " " + student.name.last).toLowerCase();
      if (!fullName.includes(nameTerm)) {
        return false;
      }
    }

    // 5b.2. Major check (if majorTerm is non‐empty)
    if (majorTerm !== "") {
      if (!student.major.toLowerCase().includes(majorTerm)) {
        return false;
      }
    }

    // 5b.3. Interest check (if interestTerm is non‐empty)
    if (interestTerm !== "") {
      // At least one of their interests must include interestTerm
      const matchesInterest = student.interests.some(i =>
        i.toLowerCase().includes(interestTerm)
      );
      if (!matchesInterest) {
        return false;
      }
    }

    // Passed all non‐empty filters
    return true;
  });

  // 5c. Update the “num-results” span
  numResultsElement.innerText = filtered.length;

  // 5d. Re‐display only the filtered students
  displayStudents(filtered);
}



// 6. setUpEventListeners()
// -----------------------
// Wire the Search button’s click to handleSearch().
function setUpEventListeners() {
  if (searchButton) {
    searchButton.addEventListener("click", e => {
      e.preventDefault(); // prevent the form‐submit default
      handleSearch();
    });
  }
}



// 7. INITIALIZATION on DOMContentLoaded
// -------------------------------------
document.addEventListener("DOMContentLoaded", () => {
  setUpEventListeners();
  fetchStudents();
});
