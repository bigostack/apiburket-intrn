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
    *   check value of last value in new array if it is the same as the value of the current value of old array
    *   if true, skip to the next (continue)
    *   else, push value to new array
    */
    
    compressedList = [];
    
    for (let i = 0; i < categoryList.length; i++) {
        
        if (categoryList[i] === categoryList[i+1]) {
            continue;
        }
        compressedList.push(categoryList[i]);
    }
    
    console.log(compressedList);

    return compressedList;
}

getCategory();

