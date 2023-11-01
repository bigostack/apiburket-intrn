const sideBarList = document.querySelector(".side-bar__list");
const sideBarCategory = document.querySelector(".side-bar__item");


function updateSideBar(list) {
    
    sideBarList.replaceChildren()
    
    list.forEach(item => {
        categoryName = document.createElement("li");
        categoryName.className = "side-bar__item";
        
        categoryBtn = document.createElement("button");
        categoryBtn.className = "side-bar__button";
        categoryBtn.textContent = item;
        
        categoryName.appendChild(categoryBtn);
        sideBarList.appendChild(categoryName);

    })
    
    if (sideBarList.childElementCount === 0) {
        defaultChild = document.createElement("li");
        defaultChild.className = "side-bar__default-text";
        defaultChild.textContent = "Cannot be found";
        sideBarList.appendChild(defaultChild);
    }
}

function filterSearch(text, list) {
    console.log(text);
    return list.filter((item) => item.toLowerCase().includes(text));
}


async function sideBar() {

    const getCategory = async function () {
        // TODO: Fetch data from api website and store as json
        apiList = await fetch("https://api.publicapis.org/entries");
        apiJSON = await apiList.json();
    
        // * Category list holds all the values of the the key="Category" in an array...
        // * ... so that the value data can be accessed uniquely and can be made available outside the function block
        const categoryList = [];

        apiJSON.entries.forEach(list => {
            categoryList.push(list.Category);
        });
        
        categoryList.sort(); //? Just incase the list is not well sorted
        
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

        

        updateSideBar(compressedList);
        
        return compressedList;
    }
    
    category = getCategory();

    
    
    // TODO: Handle the filter event
    // * Get input from search bar and convert to lowerCase
    const filterBox = document.querySelector(".filter__box");
    const filterBtn = document.querySelector(".filter__btn");

    category
        .then(

            // ? This is a better way for filtering the category list. User might not know the exact 
            // ? ... keywords to search but with an updating list by every key pressed, they get a better...
            // ? ... chance at finding what they want before completing the entire keyword.
            filterBox.onkeyup = () => {

                const filterText = filterBox.value.toLowerCase();
                
                // Compare with the list
                updatedList = filterSearch(filterText, compressedList);
                
                // Update side-bar list to show only categories that match the comparison
                updateSideBar(updatedList);

            }

            //! This is for the filter button. In this case the filter is triggered only once the button is clicked.
            //! ... This is not the best model as not everyone know the entire keyword to search but might come in handy
            //! ... when trying to minimize data consumption (I presume), as the list updates only once and not every 
            //! ... single time a key is pressed.

            // filterBtn.onclick = () => {
                
            //     const filterText = filterBox.value.toLowerCase();
                
            //     // Compare with the list
            //     updatedList = filterSearch(filterText, compressedList);
                
            //     // Update side-bar list to show only categories that match the comparison
            //     updateSideBar(updatedList);
            // }

        )
    
    
    
    
    // TODO: Handle the click event
}
sideBar()