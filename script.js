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

function displayHotelInfo(hotelInfo) {
    console.log(hotelInfo);
    $('#hotels').empty();
    $('#hotels').append(
        '<h3>Not a tent person? Check out these hotels:</h3>'
    )
    for (let i = 0; i < 3; i++){
        $('#hotels').append(
            `<h3>${hotelInfo.results[i].name}</h3>
             <h3>Rating ${hotelInfo.results[i].rating} stars</h3>`
        )
    }
    $('#hotels').removeClass('hidden');
}

//////////////////////////////////////////////////////////////////////////////////PlacesAPI

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

    return fetchUrl("https://cors-anywhere.herokuapp.com/"+fullPlacesUrl)
}

function getParkName(responseJson) {       
    let filteredResult = responseJson.results.filter(item => {
        return item.name.includes('National Park') && !item.name.includes('National Parks')
            })
    
    let parkName = filteredResult[0].name;
    console.log(parkName);

    if (parkName)
      return Promise.resolve(parkName);
    else 
      return Promise.reject(new Error("No park found"));
}

function formatHotelParams(hotelParams) {
    const hotelItems = Object.keys(hotelParams)
      .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(hotelParams[key])}`)
    return hotelItems.join('&');
}

function getHotelInfo(parkName, stateCode){
    const hotelParams = {
        key : googlePlacesApiKey,
        query : 'hotels closest to ' + parkName + ' ' + stateCode
    };
    const queryString = formatHotelParams(hotelParams);
    const fullHotelUrl = googlePlacesUrl + queryString;
    console.log("hotel url:", fullHotelUrl);

    return fetchUrl("https://cors-anywhere.herokuapp.com/"+fullHotelUrl)
}

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
    
    return fetchUrl(fullParkUrl);
  }

function fetchUrl(url) {
  return fetch(url).then(response => {
    if (response.ok) {
      return response.json();
    }
  throw new Error(response.statusText);
  });
}

function watchForm(){
    $('#js-form').submit(event => {
        event.preventDefault();

        let info = {
          parkName: null
        };

        const searchCity = $('#js-search-term').val();
        console.log(searchCity);

        getNearestPark(searchCity).then(
          getParkName
        ).then(
          parkName => {
            info.parkName = parkName;
            return getParkInfo(parkName);
          }
        ).then(
          parkInfo => {
            let stateCode = parkInfo.data[0].states;
            displayParkInfo(info.parkName, parkInfo);
            return getHotelInfo(info.parkName, stateCode);
          }
        ).then(
          hotelInfo => displayHotelInfo(hotelInfo)
        ).catch(
          e => console.log(e)
        );
    })
}

$(watchForm);

