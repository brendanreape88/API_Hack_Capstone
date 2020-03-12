'use strict';

const googlePlacesApiKey = 'AIzaSyBAWWZXoXa8LBIDXAGvtABPKlqs9yGUJ3s';
const googlePlacesBaseUrl = 'https://maps.googleapis.com/maps/api/place/findplacefromtext/output?parameters'
const nationalParkApiKey = 'zYh3yau6EMhATDK2Jf8mA8dC4MOhEvYX0W7asnHu';
const nationalParkBaseUrl = 'https://developer.nps.gov/api/v1/parks';

function getNearestPark(searchCity){
    const params = {
        key = googlePlacesApiKey,
        input = searchCity,
        inputtype = textquery
    };
    const queryString = formatQueryParams(params);
    const url = searchURL + '?' + queryString;
}

function watchForm(){
    $('#js-form').submit(event => {
        event.preventDefault();
        const searchTerm = $('js-search-term').val();
        getNearestPark(searchCity);
        getParkPictures();
        getParkInfo();
        getHotelInfo();
    });
}

$(watchForm);