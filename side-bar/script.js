const sideBarList = document.querySelector(".side-bar__list");
const sideBarCategory = document.querySelector(".side-bar__item");

async function getCategory() {
    // TODO: Fetch data from api website and store as json
    apiList = await fetch("https://api.publicapis.org/entries");
    apiJSON = await apiList.json();

    // * Category list holds all the values of the the key="Category" in an array
    // * so that the value data can be accessed uniquely and can be made available outside the function block
    categoryList = [];
    console.log(apiJSON);
    apiJSON.entries.forEach(list => {
        categoryList.push(list.Category);
    });

    categoryList.sort(); //Just incase the list is not well sorted
    //! console.log(categoryList);

    /* 
    *   create new array
    *   compare value of next item in categoryList if it's the same as the current value
    *   if true, skip to the next (continue)
    *   else, push value to new array
    * 
    ?   This helps strip off repetition of category names from the list, from which the categories names in the side-bar
    ?   would be updated.
    */
    
    compressedList = [];
    
    for (let i = 0; i < categoryList.length; i++) {
        
        if (categoryList[i] === categoryList[i+1]) {
            continue;
        }
        compressedList.push(categoryList[i]);
    }
    
    console.log(compressedList);


    compressedList.forEach(item => {
        categoryName = document.createElement("li");
        categoryName.className = "side-bar__item";

        categoryBtn = document.createElement("button");
        categoryBtn.className = "side-bar__button";
        categoryBtn.textContent = item;

        categoryName.appendChild(categoryBtn);
        sideBarList.appendChild(categoryName);
    })


    return compressedList;
}

getCategory();


// TODO: Handle the filter event

// TODO: Handle the click event