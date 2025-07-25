//send a test to the API using a basic fetch
/*fetch('https://qxplcd.ca/monster/monster.php?test=test')
    .then(response => response.json())
    .then(json => document.write(JSON.stringify(json)));*/


//basic fetch is no longer the best way to do things
//instead, we use an asynchronous function

fetchData();

async function fetchData(){
    //get the data from the API and put it in a variable
    //use await to tell it to wait for the information
    const response = await fetch('https://qxplcd.ca/monster/monster.php?monsters=all');

    //the data comes back as a promise, which we have to convert to a usable object
    //using JSON
    const json = await response.json();

    //call the function to create a gallery of images
    //send it the json response object
    createGallery(json);
}

//this function creates a gallery based on the response from the async request
function createGallery(json){
    //get the element we want to put the gallery inside of
    const imgGal = document.querySelector(".images");
    //clear the HTML that's already in there
    imgGal.innerHTML = "";

    //use the Object library and a loop to iterate through the json object
    Object.values(json).forEach(monster => {
        //use a template literal to build each monster image
        //with information from the object
        const imgTemplate = 
            `<figure class="monster">
                <img src="${monster.thumb}" data-large="${monster.large}" class="galimg">
                <figcaption>${monster.species}</figcaption>
            </figure>`;

        //add the template to the images element
        imgGal.innerHTML += imgTemplate;
    });
}

//add an event listener to the images section
//and use event delegation to check if we clicked on one of the monster thumbnails
document.querySelector(".images").addEventListener("click", function(event){
    //event stores information about the click event
    //so we can figure out which thing inside .images we clicked on
    if(event.target.src){
        //create an overlay
        const overlay = document.createElement("div");
        overlay.className = "overlay";

        //build a template literal to put inside the overlay
        const overTemplate = `<img src="${event.target.dataset.large}">`;

        //add the template to the overlay
        overlay.innerHTML = overTemplate;

        //add an event listener to the overlay to destroy the overlay
        //(a custom function we'll write)
        overlay.addEventListener("click", destroyOverlay);

        //add the overlay to the page
        document.querySelector("body").appendChild(overlay);
    }
});

//this function destroys the overlay
function destroyOverlay(){
    //ask the element's parent to destroy it
    this.parentNode.removeChild(this);
}

//build filters using the list of traits requested from the API
fetchFilters();

async function fetchFilters(){
    //send the query to the API and turn the data into json
    const response = await fetch('https://qxplcd.ca/monster/monster.php?traits=list');
    const json = await response.json();

    //loop through the json object, looking at both the keys and the values
    //the keys in this case are the categories of traits (ie. species)
    //the values are which traits are available
    //Object.entries gives you both the key and the value
    for(const [key, value] of Object.entries(json.traits)){
        //build a template literal using the key as a header for lists of filters
        //and each value as a radio button option the user can filter by
        let filterTemplate = `<article class="filter"><h3>${key}</h3><ul>`;

        //loop through the arrays of values and create list items with radio buttons
        for(let i=0; i<value.length; i++){
            filterTemplate += `<li>
                <label><input type="radio" name="${key}" id="${key}${i}">${value[i]}</label>
                </li>`;
        }
        
        //now close the ul and the article to complete our template
        filterTemplate += `</ul></article>`;

        //and add the template to the filter section
        document.querySelector(".filters").innerHTML += filterTemplate;
    }
}

//add an event listener to the .filters section
//use event delegation to see if we've clicked on a radio button
document.querySelector(".filters").addEventListener("click", async function(event){
    //check to see if we've clicked on a radio button (if the element has a name)
    if(event.target.name){
        //use a template literal to build the request
        const response = await fetch(`https://qxplcd.ca/monster/monster.php?${event.target.name}=${event.target.parentNode.textContent}`);
        const json = await response.json();

        //use the create gallery function to build a gallery with only the matching monsters
        createGallery(json);
    }
})