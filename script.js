'use strict';

const googlePlacesApiKey = 'AIzaSyBAWWZXoXa8LBIDXAGvtABPKlqs9yGUJ3s';
const googlePlacesUrl = 'https://maps.googleapis.com/maps/api/place/textsearch/json?'
const nationalParkApiKey = 'zYh3yau6EMhATDK2Jf8mA8dC4MOhEvYX0W7asnHu';
const nationalParkUrl = 'https://developer.nps.gov/api/v1/parks';
const googleDistanceMatrixUrl ='http://maps.googleapis.com/maps/api/distancematrix/json?'

function displayParkInfo(parkName, responseJson) {
    console.log(parkName, responseJson)
    let parkUrl = responseJson.data[0].url;
    console.log(parkUrl);
    $('#results').empty();
    $('#results').append(
        `<h3><a href="${parkUrl}">${parkName}</a><h3>`
    );
    
    for (let i = 0; i<3; i++){
        $('#results').append(
            `<img src="${responseJson.data[0].images[i].url}" class="parkPic" alt="park picture ${i}">`
        )};

    $('#results').append(
        `<p>${responseJson.data[0].description}</p>`
    );

    $('#results').removeClass('hidden');

   }

/*function displayHotelInfo(responseJson) {
    console.log(responseJson);
    $('#hotels').empty();
    for (let i = 0; i <= 3; i++){
        $('#hotels').append(

        )
    }
    $('#hotels').removeClass('hidden');
}*/

//////////////////////////////////////////////////////////////////////////////////PlacesAPI

/*function formatCityParams(cityParams) {
    const cityItems = Object.keys(cityParams)
      .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(cityParams[key])}`)
    return cityItems.join('&');
}

function getSearchCityId(searchCity){
    const cityParams = {
        key : googlePlacesApiKey,
        query : searchCity
    };
    const queryString = formatCityParams(cityParams);
    const fullCityUrl = googlePlacesUrl + queryString;
    console.log(fullCityUrl);

    return fetch("https://cors-anywhere.herokuapp.com/"+fullCityUrl)
}*/

function formatPlacesParams(placesParams) {
    const placesItems = Object.keys(placesParams)
      .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(placesParams[key])}`)
    return placesItems.join('&');
}

function getNearestPark(searchCity){
    const placesParams = {
        key : googlePlacesApiKey,
        query : 'national park closest to ' + searchCity + ' -forest -monument -recreation'
    };
    const queryString = formatPlacesParams(placesParams);
    const fullPlacesUrl = googlePlacesUrl + queryString;
    console.log(fullPlacesUrl);

    return fetch("https://cors-anywhere.herokuapp.com/"+fullPlacesUrl)
}

function formatHotelParams(hotelParams) {
    const hotelItems = Object.keys(hotelParams)
      .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(hotelParams[key])}`)
    return hotelItems.join('&');
}

/*function getHotelInfo(parkName){
    const hotelParams = {
        key : googlePlacesApiKey,
        query : 'hotels closest to ' + searchCity
    };
    const queryString = formatHotelParams(hotelParams);
    const fullHotelUrl = googlePlacesUrl + queryString;
    console.log(fullHotelUrl);

    return fetch("https://cors-anywhere.herokuapp.com/"+fullHotelUrl)
}*/

//////////////////////////////////////////////////////////////////////////////////ParkAPI

function formatParksParams(parksParams) {
    const parksItems = Object.keys(parksParams)
      .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(parksParams[key])}`)
    return parksItems.join('&');
}

function getParkInfo(parkName) {
    console.log(parkName);
    const parksParams = {
      api_key: nationalParkApiKey,
      q: parkName,
    };
    const queryString = formatParksParams(parksParams);
    const fullParkUrl = nationalParkUrl + '?' + queryString;
    console.log(fullParkUrl);
    
    return fetch(fullParkUrl);
  }

///////////////////////////////////////////////////////////////////////////////DistanceAPI

/*function formatCityToParkParams(cityToParkParams) {
    const cityToParkItems = Object.keys(cityToParkParams)
      .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(cityToParkParams[key])}`)
    return cityToParkItems.join('&');
}

function cityToParkDistance(cityId, parkId) {
    console.log(cityId, parkId);
    const cityToParkParams = {
        origins: cityId,
        destinations: parkId,
        api_key: googlePlacesApiKey,
    };
    const queryString = formatCityToParkParams(cityToParkParams);
    const fullCityToParkUrl = googleDistanceMatrixUrl + queryString;
    console.log(fullCityToParkUrl);
    
    return fetch(fullCityToParkUrl);
};

function formatParkToHotelParams(parkToHotelParams) {
    const parkToHotelItems = Object.keys(parkToHotelParams)
      .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(parkToHotelParams[key])}`)
    return parkToHotelItems.join('&');
}

function parktoHotelDistance(parkId, hotelId1) {
    console.log(parkId, hotelId1);
    const parkToHotelParams = {
        origins: parkId,
        destinations: hotelId1,
        api_key: googlePlacesApiKey,
    };
    const queryString = formatParkToHotelParams(parkToHotelParams);
    const fullParkToHotelUrl = googleDistanceMatrixUrl + queryString;
    console.log(fullParkToHotelUrl);
    
    return fetch(fullParkToHotelUrl);
};*/

///write separate functions for other two hotels?//

//////////////////////////////////////////////////////////////////////////////////All

function watchForm(){
    $('#js-form').submit(event => {
        event.preventDefault();
        const searchCity = $('#js-search-term').val();
        console.log(searchCity);
        /*getSearchCityId(searchCity).then(response => {
            if (response.ok) {
                return reponse.json();
            }
            throw new Error(response.statusText);
        }).then((responseJson) => {
            console.log(responseJson);
            let cityId = responseJson.results[0].place_id;
            console.log(cityId);
        })*/
        getNearestPark(searchCity).then(response => {
            if (response.ok) {
              return response.json();
            }
          throw new Error(response.statusText);
          }).then((responseJson) => {
            console.log(responseJson);
            let filteredResult = responseJson.results.filter(item => {
              return item.name.includes('National Park');
            })
            console.log(filteredResult);
            let parkName = filteredResult[0].name;
            console.log(parkName);
            getParkInfo(parkName).then(response => {
                if (response.ok) {
                    return response.json();
                  }
                throw new Error(response.statusText);
                }).then((responseJson) => {
                  console.log(parkName, responseJson);   
                  displayParkInfo(parkName, responseJson);
            })
            getHotelInfo(parkName).then(response => {
                if (response.ok) {
                  return response.json();
                }
              throw new Error(response.statusText);
              }).then((responseJson) => {
                  console.log(responseJson);
                  displayHotelInfo(responseJson);
              })
        })
    })
}

$(watchForm);