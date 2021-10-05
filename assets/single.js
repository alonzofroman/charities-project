const mainDiv = $('#singleContainer');

//if URL has '?charityname' string, do getLocalCharity, else, do getGlobalCharity. just name global charities hrefs smth different
$(function checkIfLocalOrGlobal(){
  $('.loading').show()
  let queryString = document.location.search;
  let urlToArray = queryString.split('=');
  if (urlToArray.includes('?charityname')) {
    getLocalCharity(urlToArray);
  } else {
    getGlobalCharity(urlToArray)
  }
})

//if localcharity,load its info
var getLocalCharity = function (urlArray) {
  let nameOfCharity = urlArray[1];
  let charityUrl = 'https://api.data.charitynavigator.org/v2/Organizations?app_id=0a9ad98a&app_key=f5d879810f81ef14e848b61de031964f&search=' + nameOfCharity;
  fetch (charityUrl)
    .then(function(response){
      return response.json();
    })
    .then(function(data){
      //console.log(data[0]);
      const localCity = data[0].mailingAddress.city
      const localState = data[0].mailingAddress.stateOrProvince
      $('.loading').hide()
      $('<h1>').addClass('text-3xl').text(data[0].charityName).appendTo(mainDiv);
      $('<p>').text(`Location: ${localCity}, ${localState}`).appendTo(mainDiv);
      $('<a>').addClass('singleLinks').text('Link to Charity').attr('href', data[0].charityNavigatorURL).appendTo(mainDiv);
      //console.log(localState);
      getLonLat(localCity, localState);
    })
}

//if globalcharity, load its info
var getGlobalCharity = function (urlArray) {
  let idOfCharity = urlArray[1];
  let charityUrl = 'https://api.globalgiving.org/api/public/projectservice/projects/' + idOfCharity + '?api_key=30898b94-9c49-4566-ae46-904bf7e12207';
  $.ajax({
    url: charityUrl,
    method: 'GET',
    dataType: 'JSON',
  })
  .done(function(data){
    //console.log(data.project);
    const globalCity = data.project.contactCity
    $('.loading').hide()
    $('<h1>').addClass('text-3xl').text(data.project.title).appendTo(mainDiv);
    $('<p>').text(`Location: ${globalCity}, ${data.project.contactCountry}`).appendTo(mainDiv);
    $('<a>').addClass('singleLinks').text('Link to Charity').attr('href', data.project.projectLink).appendTo(mainDiv);
    getLonLat(globalCity);
  })
};

//get lon and lat of location
function getLonLat(city, state){
  let getLonLatUrl;
  if (state == undefined || state == null) {
    getLonLatUrl = `http://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=5&appid=6f7fcdfd5baf071bea56c4dc9633ff39`
  } else if (city == undefined) {
    getLonLatUrl = `http://api.openweathermap.org/geo/1.0/direct?q=${state},US&limit=5&appid=6f7fcdfd5baf071bea56c4dc9633ff39`
  } else {
    getLonLatUrl = `http://api.openweathermap.org/geo/1.0/direct?q=${city},${state},US&limit=5&appid=6f7fcdfd5baf071bea56c4dc9633ff39`
  }
  $.ajax({
    url: getLonLatUrl,
    method: 'GET',
    dataType: 'JSON',
  })
  .done(function(data){
    locationLon = data[0].lon;
    locationLat = data[0].lat;
  })
}
