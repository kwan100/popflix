// JS for moviedb.html 

// Define endpoint for movies that are currently in theaters
let endpoint = "https://api.themoviedb.org/3/movie/now_playing?api_key=e0c1dae5dfd59788df0d25403e08623e&language=en-US&page=1";

// Call AJAX function
ajax(endpoint, displayResults);

// When user submits search form
document.querySelector("#search-form").onsubmit = function() {
	// Prevent form submission
	event.preventDefault();

	// Grab what user typed in
	let searchInput = document.querySelector("#search-id").value.trim();

    console.log(searchInput);

	let endpoint = "https://api.themoviedb.org/3/search/movie?api_key=e0c1dae5dfd59788df0d25403e08623e&language=en-US&query=" + searchInput + "&page=1&include_adult=false";

	// Call AJAX function
	ajax(endpoint, displayResults);
}

// Displays data from TMDB
function displayResults(results) {
    // Movies div 
	let movies = document.querySelector("#movies");

	// Delete previous results
	while (movies.hasChildNodes()) {
	    movies.removeChild(movies.lastChild);
	}

    // None-found div
    let none = document.querySelector("#none-found");

    // Delete previous none-found messages
    while (none.hasChildNodes()) {
        none.removeChild(none.lastChild);
    }

	// Convert JSON string to JS object
	let convResults = JSON.parse(results);
	console.log(convResults);

    // Reset search results
    document.querySelector("#results").innerHTML = convResults.results.length;
    document.querySelector("#results-total").innerHTML = convResults.total_results;

    // If the search has no results
    if (convResults.results.length == 0) {
        // Create div that contains a message
        let noneFound = document.createElement("div");
        noneFound.classList.add("col-12", "font-weight-bold")
        noneFound.innerHTML = "No Results Found!";

        none.appendChild(noneFound);
    }

    // Iterate through results and add movies
    for (let i = 0; i < convResults.results.length; i++) {
        // Create column div for movie
        let column = document.createElement("div");
        column.classList.add("col-6", "col-md-4", "col-lg-3", "mb-4");

        // Create div for poster
        let poster = document.createElement("div");
        poster.classList.add("poster");

        // Create img for poster
        let img = document.createElement("img");
        if (convResults.results[i].poster_path == null) {
            img.src = "images/unavailable-image.jpg";
            img.alt = "Not Available";
        }
        else {
            img.src = "https://image.tmdb.org/t/p/original" + convResults.results[i].poster_path;
            img.alt = convResults.results[i].title;
        }

        // Create div for overlay
        let overlay = document.createElement("div");
        overlay.classList.add("overlay");
        
        // Create div for overlay text
        let overlayText = document.createElement("div");
        overlayText.classList.add("overlay-text");

        // Create p for rating
        let rating = document.createElement("p");
        rating.classList.add("mt-3");
        rating.innerHTML = "Rating: " + convResults.results[i].vote_average;

        // Create p for number of voters
        let voters = document.createElement("p");
        voters.innerHTML = "Voters: " + convResults.results[i].vote_count;

        // Create p for synopsis 
        let synopsis = document.createElement("p");
        if (convResults.results[i].overview.length > 200) {
            for (let j = 0; j < 200; j++) {
                synopsis.innerHTML += convResults.results[i].overview[j];
            }
            synopsis.innerHTML += "...";
        }
        else {
            synopsis.innerHTML = convResults.results[i].overview;
        }

        // Create div for movie name and release date
        let info = document.createElement("div");
        info.classList.add("text-center");

        // Create p for movie name
        let name = document.createElement("p");
        name.classList.add("mx-0", "mb-0", "mt-2", "font-weight-bold");
        name.innerHTML = convResults.results[i].title;

        // Create p for release date
        let date = document.createElement("p");
        date.innerHTML = convResults.results[i].release_date;

        // Append appropriate child nodes to info
        info.appendChild(name);
        info.appendChild(date);

        // Append appropriate child nodes to overlayText
        overlayText.appendChild(rating);
        overlayText.appendChild(voters);
        overlayText.appendChild(synopsis);

        // Append appropriate child node to overlay
        overlay.appendChild(overlayText);

        // Append appropriate child nodes to poster
        poster.appendChild(img);
        poster.appendChild(overlay);

        // Append appropriate child nodes to column
        column.appendChild(poster);
        column.appendChild(info);

        // Append appropriate child nodes to movies
        document.querySelector("#movies").appendChild(column);
    }
}

// AJAX function
function ajax(endpoint, returnFunction) {
	// Make AJAX request using XMLHttpRequest object
	let httpRequest = new XMLHttpRequest();

	// Open new http request
	httpRequest.open("GET", endpoint);
	// Send request to specified endpoint
	httpRequest.send();

	// Run when TMDB responds
	httpRequest.onreadystatechange = function() {
		// If we get a full response from TMDB
		if (httpRequest.readyState == 4) {
			// Check if the request was successful
			if (httpRequest.status == 200) {
                // If successful, display appropriate data
				returnFunction(httpRequest.responseText);
			}
            // Else, there is an error
			else {
				console.log("error");
				console.log(httpRequest.status);
			}
		}
	} 
}