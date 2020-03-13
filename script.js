'use strict';

const googlePlacesApiKey = 'AIzaSyBAWWZXoXa8LBIDXAGvtABPKlqs9yGUJ3s';
const googlePlacesUrl = 'https://maps.googleapis.com/maps/api/place/textsearch/json?'
const nationalParkApiKey = 'zYh3yau6EMhATDK2Jf8mA8dC4MOhEvYX0W7asnHu';
const nationalParkUrl = 'https://developer.nps.gov/api/v1/parks';

function formatQueryParams(params) {
    const queryItems = Object.keys(params)
      .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`)
    return queryItems.join('&');
}

function displayResults(responseJson) {
    console.log(responseJson);
    $('#results-list').empty();
    if(responseJson.total === '0'){
      $('#js-error-message').text('No parks found'); 
    } else {
        for (let i = 0; i < responseJson.XXX.length; i++){
        $('#results-list').append(
            `<li><h3>${responseJson.XXX[i].YYY}</h3>
            <p>${responseJson.XXX[i].YYY}</p>
            <p><a href="${responseJson.XXX[i].YYY}">${responseJson.XXX[i].YYY}</a></p>
            </li>`
        )};
    }
    $('#results').removeClass('hidden');
  };

function getNearestPark(searchCity){
    const params = {
        key = googlePlacesApiKey,
        query = 'national park closest to ' + searchCity,
    };
    const queryString = formatQueryParams(params);
    const url = googlePlacesUrl + queryString;

    fetch(url)
    .then(response => {
      if (response.ok) {
        return response.json();
      }
    throw new Error(response.statusText);
    })
    .then(responseJson => displayResults(responseJson))
    .catch(err => {
      $('js-error-message').text(`Something went wrong: ${err.message}`)
    });
}

function watchForm(){
    $('#js-form').submit(event => {
        event.preventDefault();
        const searchCity = $('js-search-term').val();
        getNearestPark(searchCity);
        getParkPictures();
        getParkInfo();
        getHotelInfo();
    });
}

$(watchForm);