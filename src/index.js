window.addEventListener('DOMContentLoaded', () => {
    const dogBar = document.querySelector('#dog-bar')
    const dogInfoContainer = document.querySelector('#dog-info')
    const goodDogFilterButton = document.querySelector('#good-dog-filter')
    
    //fetches dogs 
    fetch('http://localhost:3000/pups')
    .then(function(response){
        return response.json()
    })
    .then(function(dogArray){
        displayAllDogs(dogArray)
    });
    
    //create span to display dog name and appends to DOM
    const displayAllDogs = (dogArray) => {
        dogBar.innerHTML = ''
        dogArray.forEach(dog => {
            let span = document.createElement('span')
            span.innerText = `${dog.name}`
            span.dataset.id = `${dog.id}`
            dogBar.appendChild(span)
        })   
    };
    
    //fetches single dog
    dogBar.addEventListener('click', function(event){
        fetch(`http://localhost:3000/pups/${event.target.dataset.id}`)
        .then(function(response){
            return response.json()
        })
        .then(function(dog){
            addDogInfo(dog)
        })
    });
    
    //adds individual dog info to the DOM
    const addDogInfo = (dog) => {
        dogInfoContainer.innerHTML = ''
        const dogImage = document.createElement('img')
        dogImage.src = dog.image
        
        const dogName = document.createElement('h2')
        dogName.innerText = dog.name
        
        const button = document.createElement('button')
        button.innerText = dog.isGoodDog ? "Good Dog!" : "Bad Dog!"
        button.dataset.id = dog.id
        
        dogInfoContainer.appendChild(dogImage)
        dogInfoContainer.appendChild(dogName)
        dogInfoContainer.appendChild(button)
    };
    
    // toggles button text
    let goodDogStatus = ''
    dogInfoContainer.addEventListener('click', function(event){
        if (event.target.innerText === 'Bad Dog!'){
            event.target.innerText = 'Good Dog!'
            goodDogStatus = true
        } else {
            event.target.innerText = 'Bad Dog!'
            goodDogStatus = false   
        }
        fetch (`http://localhost:3000/pups/${event.target.dataset.id}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify({
                isGoodDog: goodDogStatus
            })
        })
    });

    //filters out Good dogs
    goodDogFilterButton.addEventListener('click', function(event){
        if (event.target.innerText === 'Filter good dogs: OFF'){
            event.target.innerText = 'Filter good dogs: ON'
            fetch('http://localhost:3000/pups')
            .then(function(response){
                return response.json()
            })
            .then(function(dogArray){
                displayGoodDogs(dogArray)
            })
        } else if (event.target.innerText === 'Filter good dogs: ON'){
            event.target.innerText = 'Filter good dogs: OFF'
            fetch('http://localhost:3000/pups')
            .then(function(response){
                return response.json()
            })
            .then(function(dogArray){
                displayAllDogs(dogArray)
            })
        }
    })

    //displays only Good Dogs
    const displayGoodDogs = (dogArray) => {
        dogBar.innerHTML = ''
        dogInfoContainer.innerHTML = ''
        dogArray.forEach(dog => {
            if (dog.isGoodDog === true) {
                let span = document.createElement('span')
                span.innerText = `${dog.name}`
                span.dataset.id = `${dog.id}`
                dogBar.appendChild(span)
            }
        })
    };



//this is the end of DOMContent Loaded
});