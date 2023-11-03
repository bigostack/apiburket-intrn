//SEARCH BAR FUNCTIONALITY

const searchBar = document.querySelector(".search-bar");
const searchBtn = document.querySelector(".search-btn");

async function getData() {
  const response = await fetch("");
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

  console.log(resultsList);

  //? To display the items, create a function that will go through the each items in the array(resultsList) and use the values insides it to diplay the content needed -> displayAPIs(arr).
});
