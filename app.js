/* ========================================
--> MENU
======================================== */

const menuBtn = document.querySelector(".menu__btn");
const menuList = document.querySelector(".menu__list");
const menuElements = document.querySelector(".menu").querySelectorAll("*");

menuBtn.addEventListener("click", checkMenuBtn);
window.addEventListener("click", e => {
  for (let i = 0; i < menuElements.length; i++) {
    if (e.target == menuElements[i]) {
      return false;
    }
  }
  openMenu(false);
});

// Checks the state of the menu btn and toggles menu accordingly
function checkMenuBtn() {
  if (menuBtn.classList.contains("open-menu")) {
    openMenu(true);
  } else {
    openMenu(false);
  }
}

// Toggles the visibility of the side menu
function openMenu(bool) {
  if (bool) {
    menuBtn.classList.remove("open-menu");
    menuList.style.display = "block";
  } else {
    menuBtn.classList.add("open-menu");
    menuList.style.display = "none";
  }
}

/* ========================================
--> SEARCH
======================================== */

const searchBtn = document.querySelector(".search__btn");
const searchBox = document.querySelector(".search__box");
const searchInput = document.querySelector(".search__input");
const searchElements = document.querySelector(".search").querySelectorAll("*");
let animals = ["bengal tiger", "giant panda", "gorilla", "sea otter", "snow leopard"];

searchBtn.addEventListener("click", chooseBtnFunc);
autocomplete(searchInput, animals);
window.addEventListener("click", e => {
  for (let i = 0; i < searchElements.length; i++) {
    if (e.target == searchElements[i] || e.target.classList.contains("search__item")) {
      return false;
    }
  }
  closeSearch();
});

// Decides whether the search btn opens up the search box or has a submitting functionality
function chooseBtnFunc() {
  if (searchBtn.classList.contains("open-search")) {
    openSearch();
  } else {
    submitSearch(searchInput, animals);
  }
}

// Reveals the hidden search box
function openSearch() {
  searchBtn.classList.remove("open-search");
  searchBox.style.display = "block";
  searchInput.focus();
}

// Hides the search box
function closeSearch() {
  searchBtn.classList.add("open-search");
  searchBox.style.display = "none";
}

// If search is successful, it opens up a new HTML page with the corresponding animal
// It also sets back the functionality of the search btn to open search
function submitSearch(inp, arr) {
  if (inp.value) {
    for (let i = 0; i < arr.length; i++) {
      if (arr[i].indexOf(inp.value.toLowerCase()) > -1) {
        window.open(`${arr[i].replace(/ /g, "_")}.html`, "_self");
        return;
      }
    }
    alert("No match found or invalid search term. Please try again!");
  } else if (inp.value == "") {
    closeSearch();
  }
}

// Shows searching suggestions
function autocomplete(inp, arr) {
  // Will allow us to highlight the suggestions on keydown events
  let currentFocus;
  inp.addEventListener("input", e => {
    // Update value, and clear the suggestion list
    let val = inp.value;
    closeLists();
    // If there's no value, don't do anything below
    if (!val) {
      return false;
    }
    currentFocus = -1;
    // Add .search__results div
    let a = document.createElement("DIV");
    a.setAttribute("id", "list");
    a.setAttribute("class", "search__results");
    inp.parentNode.appendChild(a);
    // Add .search__item div(s)
    for (let i = 0; i < arr.length; i++) {
      // This index will help us slice the strings later
      let index = arr[i].indexOf(val.toLowerCase());
      if (index > -1) {
        let b = document.createElement("DIV");
        b.setAttribute("class", "search__item");
        // Matching letters will be bold
        b.innerHTML = `${arr[i].slice(0, index)}`;
        b.innerHTML += `<strong>${arr[i].slice(index, index + val.length)}</strong>`;
        b.innerHTML += `${arr[i].slice(index + val.length)}`;
        // Hidden input stores the original arr item value
        b.innerHTML += `<input type="hidden" value="${arr[i]}" />`;
        // When a suggestion is clicked, the hidden value will be passed to the input, and the whole list will be closed
        b.addEventListener("click", e => {
          inp.value = e.target.tagName == "STRONG" ? e.target.nextElementSibling.value : e.target.lastElementChild.value;
          closeLists();
        });
        // Append the suggestion to the parent container
        a.appendChild(b);
      }
    }
  });

  inp.addEventListener("keydown", e => {
    let x = document.getElementsByClassName("search__item");
    // Highlight suggestions using the down and up arrow keys
    if (e.code == "ArrowDown") {
      currentFocus++;
      addActive(x);
    }
    if (e.code == "ArrowUp") {
      currentFocus--;
      addActive(x);
    }
    // Enter
    if (e.code == "Enter") {
      e.preventDefault();
      if (currentFocus > -1) {
        if (x) {
          x[currentFocus].click();
          currentFocus = -1;
        }
      } else {
        submitSearch(inp, arr);
      }
    }
  });

  function addActive(x) {
    if (!x) {
      return false;
    }
    removeActive(x);
    if (currentFocus >= x.length) {
      currentFocus = 0;
    }
    if (currentFocus < 0) {
      currentFocus = x.length - 1;
    }
    x[currentFocus].classList.add("search__item--active");
  }

  function removeActive(x) {
    for (let i = 0; i < x.length; i++) {
      x[i].classList.remove("search__item--active");
    }
  }

  function closeLists() {
    let x = document.getElementsByClassName("search__results");
    for (let i = 0; i < x.length; i++) {
      x[i].parentNode.removeChild(x[i]);
    }
  }

  document.addEventListener("click", e => {
    if (e.target != inp) {
      closeLists();
    }
  });
}
