//SEARCH BAR FUNCTIONALITY

const searchBar = document.querySelector(".search-bar");
const searchBtn = document.querySelector(".search-btn");

async function getData() {
  const response = await fetch("https://api.publicapis.org/entries");
  if (!response.ok) {
    throw new Error(`HTTP Error: ${response.status}`);
  }

  const data = await response.json();

  //? Custom element that holds a data from the global store(API), that will be an input for the search bar which can then be listened to by anyone that needs the data.

  const dataInputEvent = new CustomEvent("build", {
    detail: data.entries,
  });

  //* Fires the customEvent on clicking the search button

  searchBtn.addEventListener("click", (e) => {
    searchBar.dispatchEvent(dataInputEvent);
    pagination();
  });
}

getData();

// LISTENING TO THE CUSTOM EVENT

searchBar.addEventListener("build", (e) => {
  let searchValue = searchBar.value;

  //* This must be done to change the first letter of the input value to upperCase as the APIs name and Categories have their first letters in uppperCase

  searchValue = searchValue.toLowerCase();

  //* sets the criteria and push the items that matches the criteria into an array

  let resultsList = [];
  if (searchValue === "") {
    console.log("No results match an empty search-string!");
    return;
  } else {
    e.detail.forEach((elem) => {
      if (elem.API.toLowerCase().includes(searchValue)) resultsList.push(elem);
      else if (
        elem.Category.toLowerCase().includes(searchValue) &&
        searchValue.length >= 3
      )
        resultsList.push(elem);
    });
  }

  displayAPIs(resultsList);
  console.log(resultsList);

  //? To display the items, create a function that will go through the each items in the array(resultsList) and use the values insides it to diplay the content needed -> displayAPIs(arr).
});

function displayAPIs(results) {
  let html = "";
  for (let i = 0; i < results.length; i++) {
    html =
      html +
      `
    <div class="api-card">
    <h1 class="api-name">${results[i].API}</h1>
    <p class="api-category">${results[i].Category}</p>
    <a href="${results[i].Link}" class="api-link">click here</a>
  </div>
    `;
    document.querySelector(".page").innerHTML = html;
  }
}

//PAGINATION FUNCTIONALITY

function pagination() {
  const itemList = document.querySelectorAll(".api-card");
  const previousPageBtn = document.querySelector(".btn--left");
  const nextPageBtn = document.querySelector(".btn--right");
  const paginationNumber = document.querySelector(".pagination-number");

  //* Setting the global variables

  const paginationLimit = 10;
  const pageCount = Math.ceil(itemList.length / paginationLimit);
  let currentPage;

  //* function to display the page number

  const displayPageNumber = () => {
    let html = "";

    for (let i = 1; i <= pageCount; i++) {
      html =
        html +
        `
      <button class = "pagination-page" page-index = ${i} >${i}</button>
      `;
      paginationNumber.innerHTML = html;
    }
  };

  //* this will handle the numbers if items to display in each page and the ones to hide, and also the active state and the page buttom status

  const displayCurrentPage = (page) => {
    currentPage = page;

    handleActiveBtn();
    handlePageButtonsStatus();

    previousRange = (page - 1) * paginationLimit;
    currRange = page * paginationLimit;

    itemList.forEach((item, index) => {
      if (index >= previousRange && index < currRange) {
        item.classList.remove("hidden");
      } else {
        item.classList.add("hidden");
      }
    });
  };

  //* funtiom to handle the active button(How it should look like to know a particular button/page is active)

  const handleActiveBtn = () => {
    document.querySelectorAll(".pagination-page").forEach((button) => {
      button.classList.remove("active");

      pageIndex = Number(button.getAttribute("page-index"));

      if (pageIndex === currentPage) {
        button.classList.add("active");
      }
    });
  };

  const disableButton = (button) => {
    button.classList.add("disabled");
    button.setAttribute("disabled", true);
  };
  const enableButton = (button) => {
    button.classList.remove("disabled");
    button.removeAttribute("disabled");
  };

  //* function to handle the page button status (when the buttons should be disbled and when not to)

  const handlePageButtonsStatus = () => {
    if (currentPage === 1) {
      disableButton(previousPageBtn);
    } else {
      enableButton(previousPageBtn);
    }
    if (pageCount === currentPage) {
      disableButton(nextPageBtn);
    } else {
      enableButton(nextPageBtn);
    }
  };

  displayPageNumber();
  displayCurrentPage(1);

  previousPageBtn.addEventListener("click", () => {
    displayCurrentPage(currentPage - 1);
  });

  nextPageBtn.addEventListener("click", () => {
    displayCurrentPage(currentPage + 1);
  });

  document.querySelectorAll(".pagination-page").forEach((button) => {
    const pageIndex = Number(button.getAttribute("page-index"));

    if (pageIndex) {
      button.addEventListener("click", () => {
        displayCurrentPage(pageIndex);
      });
    }
  });
}
