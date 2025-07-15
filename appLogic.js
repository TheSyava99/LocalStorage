const userData = document.getElementById("userData")
const userContainer = document.querySelector(".users")
const firstNameInput = userData['firstname']
const lastNameInput = userData['lastname']
const ageInput = userData['age']
const clearBtn = document.getElementById("clearUsersBtn");

const users = JSON.parse(localStorage.getItem("users")) || []

const addUser = (firstname, lastname, age, education, position) => {
  users.push({ firstname, lastname, age, education, position });
  localStorage.setItem("users", JSON.stringify(users));
  return { firstname, lastname, age, education, position };
}

const createUserElement = ({ firstname, lastname, age, education, position }) => {
  const userDiv = document.createElement('div')
  const userFirstName = document.createElement('h2')
  const userLastName = document.createElement('h2')
  const userAge = document.createElement('p')
  const userEducation = document.createElement('p')
  const userPosition = document.createElement('p')

  userFirstName.innerText = "First name: " + firstname
  userLastName.innerText = "Last name: " + lastname
  userAge.innerText = "Age: " + age
  userEducation.innerText = "Completed courses: " + education.join(", ")
  userPosition.innerText = "Selected vacancies: " + position.join(", ")

  userDiv.append(userFirstName, userLastName, userAge, userEducation, userPosition)
  userContainer.appendChild(userDiv)
  userContainer.style.display = users.length === 0 ? "none" : "flex";
}

userContainer.style.display = users.length === 0 ? "none" : "flex"
users.forEach(createUserElement)

userData.onsubmit = e => {
  e.preventDefault()

  const selectedEducation = getCheckedValues("educationDropdown");
  const selectedPositions = getCheckedValues("roleDropdown");

  const newUser = addUser(
    firstNameInput.value,
    lastNameInput.value,
    ageInput.value,
    selectedEducation,
    selectedPositions
  );

  createUserElement(newUser);
  updateClearBtnText();

  firstNameInput.value = "";
  lastNameInput.value = "";
  ageInput.value = "";
  document.querySelectorAll("#educationDropdown input[type='checkbox']").forEach(cb => cb.checked = false);
  document.querySelectorAll("#roleDropdown input[type='checkbox']").forEach(cb => cb.checked = false);
}

function getCheckedValues(containerId) {
  const checkboxes = document.querySelectorAll(`#${containerId} input[type="checkbox"]:checked`);
  return Array.from(checkboxes).map(cb => cb.value);
}

function updateClearBtnText() {
  const btn = document.getElementById("clearUsersBtn");
  if (users.length === 1) {
    btn.textContent = "Clear User";
    btn.disabled = false;
  } else if (users.length > 1) {
    btn.textContent = "Clear Users";
    btn.disabled = false;
  } else {
    btn.textContent = "No Users to Clear";
    btn.disabled = true;
  }
}

clearBtn.onclick = () => {
  localStorage.removeItem("users");
  users.length = 0;
  userContainer.innerHTML = "";
  userContainer.style.display = "none";
  updateClearBtnText();
  console.log("Усі користувачі видалені.");
};

window.addEventListener("online", () => {
  const savedUsers = JSON.parse(localStorage.getItem("users")) || [];

  if (savedUsers.length > 0) {
    console.log("Відправляємо дані на сервер після повернення мережі...");
    savedUsers.forEach((user) => {
      console.log("Надіслано:", user);
      createUserElement(user);
    });
    localStorage.removeItem("users");
  }
});

// Дропдауни: відкриття / закриття
document.querySelectorAll('.dropdown').forEach(dropdown => {
  dropdown.addEventListener('click', () => {
    dropdown.classList.toggle('active');
  });

  document.addEventListener('click', (e) => {
    if (!dropdown.contains(e.target)) {
      dropdown.classList.remove('active');
    }
  });
});
