const sideBarList = document.querySelector(".side-bar__list");
const sideBarCategory = document.querySelector(".side-bar__item");
const sideBarButtonNodeList = document.querySelectorAll(".side-bar__button");


function updateSideBar(list) {
    
    sideBarList.replaceChildren()
    
    list.forEach(item => {
        categoryName = document.createElement("li");
        categoryName.className = "side-bar__item";
        categoryName.textContent = item;
        
        categoryBtn = document.createElement("button");
        categoryBtn.className = "side-bar__button";
        
        categoryBtn.appendChild(categoryName);
        sideBarList.appendChild(categoryBtn);

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
        // * Fetch data from api website and store as json

        apiList = await fetch("https://api.publicapis.org/entries");
        apiJSON = await apiList.json();
    
        
        // ? Category list holds all the values of the the key="Category" in an array...
        // ? ... so that the value data can be accessed uniquely and can be made available outside the function block
        const categoryList = [];

        apiJSON.entries.forEach(list => {
            categoryList.push(list.Category);
        });
        
        categoryList.sort(); //? Just incase the list is not well sorted
        
        /*  
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

    
    
    // * FILTERING THROUGH THE SIDE-BAR
    const filterBox = document.querySelector(".filter__box");

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

        )
    
    
    
}
sideBar();



// ? We need a way to communicate the click event on the side-bar to other components interested in using the information
// ? Hence, a custom event is created so as to have a unique event that interested components can listen to

sideBarButtonNodeList.forEach(btn => {
    btn.onclick = function () {

        this.dispatchEvent (
            new CustomEvent("sideBarClick", {
                bubbles: true,
            })
        );
    }

    // ? This is how to test and use the custom event to get the value of the textContent or any other value you want to get
    // ! btn.addEventListener("sideBarClick", (e) => {console.log(e.target.textContent)})
});