'use strict';

const googlePlacesApiKey = 'AIzaSyBAWWZXoXa8LBIDXAGvtABPKlqs9yGUJ3s';
const googlePlacesUrl = 'https://maps.googleapis.com/maps/api/place/textsearch/json?'
const nationalParkApiKey = 'zYh3yau6EMhATDK2Jf8mA8dC4MOhEvYX0W7asnHu';
const nationalParkUrl = 'https://developer.nps.gov/api/v1/parks';
const googleDistanceMatrixUrl ='http://maps.googleapis.com/maps/api/distancematrix/json?'

////////////////////////////////////////////////////////////////////////////////////Display
function displayParkInfo(parkName, responseJson) {
    let parkUrl = responseJson.data[0].url;
    $('#results').empty();
    $('#park-pic-box').empty();
    $('#deets').empty();
    
    $('#results').append(
        `<h3>Your nearest park is...</h3>
        <h3><a href="${parkUrl}">${parkName}</a><h3>`
    );
    
    const imgSize = Math.min(responseJson.data[0].images.length, 3);

    for (let i = 0; i<imgSize; i++) {
        $('#park-pic-box').append(
            `<img src="${responseJson.data[0].images[i].url}" class="parkPic" alt="park picture ${i}">`
        )};

    $('#deets').append(
        `<h3>Park deets...<h3>
        <p>${responseJson.data[0].description}</p>`
    );

    $('#results').removeClass('hidden');
    $('#park-pic-box').removeClass('hidden');
    $('#deets').removeClass('hidden');

    $.scrollTo($('#results'), 1000);

   }

function displayHotelInfo(hotelInfo) {
    let filteredResults = hotelInfo.results.filter(item => {
    return !item.name.includes('Campground')
        });
        
        console.log('fihi', filteredResults)

    $('#hotels').empty();
    $('#hotels').append(
        '<h3>Not a tent person?</h3>',
        '<div class="hotel-list-box" id="hotel-list-box"></div>'
    )


    const hotelSize = Math.min(filteredResults.length, 3);
    for (let i = 0; i < hotelSize; i++){
        $('#hotel-list-box').append(
            `<div class="hotel-grouping-box">
                <h4 class="hotel-name">${filteredResults[i].name}</h4>
                <h4 class="hotel-rating">Rating: ${filteredResults[i].rating} stars</h4>
            </div>`
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

    return fetchUrl("https://cors-anywhere.herokuapp.com/"+fullPlacesUrl)
}

function filterResults(responseJson) { 
    /*let filteredResults = responseJson.results.filter(item => {
        return item.name.includes('National Park') 
    });
*/
    /*if (filteredResults.length === 0) {
      throw new Error("No results found");
    }*/
    //for (const r of filteredResult) console.log('*', r.name)
    
    //let parkName = filteredResult[0].name;
  
   return Promise.resolve(responseJson.results);
}

function formatHotelParams(hotelParams) {
    const hotelItems = Object.keys(hotelParams)
      .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(hotelParams[key])}`)
    return hotelItems.join('&');
}

function getHotelInfo(parkName, stateCode){
    const hotelParams = {
        key : googlePlacesApiKey,
        query : 'hotels closest to ' + parkName + ' ' + stateCode,
    };
    const queryString = formatHotelParams(hotelParams);
    const fullHotelUrl = googlePlacesUrl + queryString;

    return fetchUrl("https://cors-anywhere.herokuapp.com/"+fullHotelUrl)
}

//////////////////////////////////////////////////////////////////////////////////ParkAPI

function formatParksParams(parksParams) {
    const parksItems = Object.keys(parksParams)
      .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(parksParams[key])}`)
    return parksItems.join('&');
}

function getParkInfo(parkName) {
    const parksParams = {
      api_key: nationalParkApiKey,
      q: parkName,
      limit: 1
    };
    const queryString = formatParksParams(parksParams);
    const fullParkUrl = nationalParkUrl + '?' + queryString;
    
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

////////////////////////////////////////////////////////////////////////////////////watchForm

function watchForm(){
  $('#js-form').submit(event => {
      event.preventDefault();

      $('.search-button').prop('disabled', true);
      $('.error-message').text('');
      

      let info = {
        parkName: null
      };

      const searchCity = $('#js-search-term').val();
      console.log(searchCity);

      getNearestPark(searchCity).then(
        filterResults
      ).then(
        filtered => new Promise(async (resolve, reject) => {
          console.log("$$$", filtered.length)
            let breakLoop = false;
            for (const res of filtered) {
              if(breakLoop) {
                break;
              }
              console.log(res)
              try {
                info.parkName = res.name;
                await getParkInfo(res.name).then(
                    parkInfo => {

                      if(parkInfo.data.length == 0) {
                        throw 'no result';
                      } else {
                        breakLoop = true;
                    
                        let stateCode = parkInfo.data[0].states;
                        displayParkInfo(info.parkName, parkInfo);
                        return getHotelInfo(info.parkName, stateCode);
                      }
                    }
                ).then(
                  displayHotelInfo
                ).then(
                  () => resolve()
                ).catch(
                  console.log
                );
              } catch (e) {
                console.log(e);
                continue;
              }
            }
         
            console.log("end of results")
            reject(Error("No results found"));
          })
      ).catch(
        e => {
          console.log(e)
          $('.error-message').text(e.message)
        }
      ).finally(
        () => {
          $('.search-button').prop('disabled', false);
        }
      );
  })
}

$(watchForm);