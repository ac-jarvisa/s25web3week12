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
        console.log(monster.large);
    });
}