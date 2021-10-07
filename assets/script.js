/* API to search charity by state/city/zipcode: CHARITYNAVIGATOR
https://api.data.charitynavigator.org/v2
1 month free trial
API KEY: f5d879810f81ef14e848b61de031964f */

/* Global Giving: https://www.globalgiving.org/api/methods/get-all-projects-for-a-theme/
API KEY: 30898b94-9c49-4566-ae46-904bf7e12207 */

/* get lon lat https://api.openweathermap.org/geo/1.0/direct?q=' + cityToSearch + '&limit=5&appid=
API KEY: 6f7fcdfd5baf071bea56c4dc9633ff39 */

/* Plug in lat and lon of charity into Google Maps API to show the charity's exact location:
Great tutorial: https://www.youtube.com/watch?v=Zxf1mnP5zcw&ab_channel=TraversyMedia
Docs :https://developers.google.com/maps/documentation/javascript/overview?hl=en_US
API KEY: AIzaSyBGyCeq_y1j0ceJhDdpK7A8DDU-0wu-uSU */

const splashDiv = $('#splashDiv');
const mainDiv = $('#mainDiv');
const resultsList = document.querySelector('#displayResults');
const historyBox = $('#historyWrapper');
let history = [];
let currentSearchParams;
var nextBtn;
let nextPageId;
let globalSelected;
let errorText;

/*flickity for carousel*/
var carousel = $('#featuredCarousel').flickity({
  autoPlay: true,
  wrapAround: true,
  cellAlign: 'left',
  contain: true,
});

var caption = $('.caption');
var flkty = carousel.data('flickity');

carousel.on('select.flickity', function () {
  caption.text(flkty.selectedElement.title);
});

/*global search selector*/
// $(function() {
//   $('#selector').selectmenu({
//     width: 'auto'
//   });
// });

function loadMain() {
  splashDiv.hide();
  mainDiv.css('display', 'flex');
  $('#sidebar').css('display', 'flex');
}

$('#initializeBtn').on('click', loadMain);

//If there was an error, generate an error dialog
function generateErrorDiaolog() {
  let errorDialog = $('<div>').attr('title', 'Error').appendTo('body');
  errorDialog.append(errorText);
  $(function () {
    $(errorDialog).dialog();
  });
}



//Local charities display
function pullLocalCharities(e) {
  e.preventDefault();
  $('.loading').show();
  let citySearch = $('#cityInput').val();
  // console.log(citySearch)
  // console.log(citySearch.split(", "))
  //Force user's state input to uppercase so it is recognized by API

  let paramsObject = [citySearch]
  currentSearchParams = paramsObject;
  pushSearchToStorage()
  let localUrl;
  //If they left the city blank, just search by state
  
    localUrl =
      'https://api.data.charitynavigator.org/v2/Organizations?app_id=0a9ad98a&app_key=f5d879810f81ef14e848b61de031964f&rated=true&state=' +
      citySearch.split(", ")[1] +
      '&city=' +
      citySearch.split(", ")[0];

  fetch(localUrl)
    .then(function (response) {
      console.log(response.status);
      if (response.status == 400) {
        errorText = document.createTextNode(
          'There was an error with your request. Please ensure a proper city name and state code were entered.'
        );
        generateErrorDiaolog();
      }
      else if (response.status == 404) {
        errorText = document.createTextNode(
          'There are no rated charities in your city.'
        );
        generateErrorDiaolog();
      }
      else {
      return response.json();
    }
  })
    .then(function (data) {
      $('.loading').hide();
      // console.log(data);
      //Remove all previous elements
      resultsList.innerHTML = '';
      //console.log(data)
      //Dynamically generate list items
      for (let i = 0; i < data.length; i++) {
        //save name of charity so it can be pulled later
        let newListLink = $('<a>')
          .addClass('listItem')
          .attr('href', './single.html?charityname=' + data[i].charityName + '=' + data[i].mailingAddress.city)
          .appendTo(resultsList);
        let newListItem = $('<li>')
          .addClass('listIgnore')
          .appendTo(newListLink);
        let listTitle = $('<h4>')
          .addClass('listIgnore text-2xl')
          .text(data[i].charityName);
        newListItem.append(listTitle);
        //if there is no city in the data, don't create location
        if (data[i].mailingAddress.city != null) {
          let listLocation = $('<p>')
            .addClass('listIgnore')
            .text(
              `${data[i].mailingAddress.city}, ${data[i].mailingAddress.stateOrProvince}`
            );
          newListItem.append(listLocation);
        }
      }
    });
}

$('#localSearchBtn').on('click', function (e) {
  // if ($('#stateInput').val() == '') {
  //   generateErrorDiaolog();
  // } else {
    pullLocalCharities(e);
  // }
});

//Render Global list elements
function renderGlobalList(data) {
  console.log(data);
  $('.loading').hide();
  resultsList.innerHTML = '';
  let finalGlobalResults = data.projects.project;
  //console.log(finalGlobalResults);
  for (let i = 0; i < 10; i++) {
    let newListLink = $('<a>')
      .addClass('listItem')
      .attr('href', './single.html?globalcharityid=' + finalGlobalResults[i].id)
      .appendTo(resultsList);
    let newListItem = $('<li>').addClass('listIgnore').appendTo(newListLink);
    let listTitle = $('<h4>')
      .addClass('listIgnore text-2xl')
      .text(finalGlobalResults[i].title);
    newListItem.append(listTitle);
    let listLocation = $('<p>')
      .addClass('listIgnore')
      .text(
        `${finalGlobalResults[i].contactCity}, ${finalGlobalResults[i].contactCountry}`
      );
    newListItem.append(listLocation);
  }
  if (data.projects.hasNext === true) {
    //Generate next page button
    nextPageId = data.projects.nextProjectId;
    nextBtn = $('<button>')
      .attr('id', 'nextPageBtn')
      .addClass('searchBtns')
      .text('Next Page')
      .appendTo(resultsList);
  }
}

//Global Giving search
function pullGlobalCharities(e) {
  e.preventDefault();
  $('.loading').show();
  globalSelected = $('#selector option:selected').attr('data-id');
  let paramsObject = [globalSelected];
  currentSearchParams = paramsObject;
  pushSearchToStorage()
  //console.log(globalSelected);
  let globalUrl =
    'https://api.globalgiving.org/api/public/projectservice/themes/' + globalSelected + '/projects/active?api_key=30898b94-9c49-4566-ae46-904bf7e12207';
  $.ajax({
    url: globalUrl,
    method: 'GET',
    dataType: 'JSON',
  })
    .fail(function () {
      generateErrorDiaolog();
    })
    .done(function (data) {
      renderGlobalList(data);
    });
}

$('#globalSearchBtn').on('click', pullGlobalCharities);

function pushSearchToStorage(){
  localStorage.setItem('pageState', JSON.stringify(currentSearchParams));
}

//HISTORY
function renderHistory() {
  if (history.length > 0) {
    for (let i = 0; i < history.length; i++) {
      let newHistoryBtn = $('<a>')
        .addClass('historyBtn')
        .text(history[i].title)
        .appendTo(historyBox);
      newHistoryBtn.attr('href', history[i].url);
      //console.log(newHistoryBtn.attr('href'));
    }
  }
}

function addToHistory(e) {
  historyBox.html('');
  //clear all and rerender on click
  let elemUrl = e.target.getAttribute('href');
  let elemTitle = $(e.target).children().children('h4').text();
  let newHistoryObject = { url: elemUrl, title: elemTitle };
  // console.log(history);
  history.unshift(newHistoryObject);
  if (history.length > 6) {
    history.pop();
  }
  localStorage.setItem('clickHistory', JSON.stringify(history));
  renderHistory();
}

$('#displayResults').on('click', 'a', addToHistory);

$(function loadHistory() {
  if (localStorage.getItem('clickHistory') !== null) {
    let pulledHistory = JSON.parse(localStorage.getItem('clickHistory'));
    history = pulledHistory;
    renderHistory();
  }
});

//Render next page on button click
$('#displayResults').on('click', '#nextPageBtn', function () {
  // console.log('button is clicked');
  $('.loading').show();
  let GlobalUrlNext =
    'https://api.globalgiving.org/api/public/projectservice/themes/' + globalSelected + '/projects/active?api_key=30898b94-9c49-4566-ae46-904bf7e12207&nextProjectId=' +
    nextPageId;
  // console.log(GlobalUrlNext);
  $.ajax({
    url: GlobalUrlNext,
    method: 'GET',
    dataType: 'JSON',
  }).done(function (data) {
    renderGlobalList(data);
  });
});

function backToHome() {
  mainDiv.hide();
  $('#sidebar').hide();
  splashDiv.css('display', 'flex');
}

$('#backBtn').on('click', backToHome);

//http://api.openweathermap.org/geo/1.0/reverse?lat={lat}&lon={lon}&limit={limit}&appid={API key}
//Function to get user location

$('#getLocationBtn').on('click', function() {
  // console.log('button is clicked');
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(generatePosition, showError);
  } else {
    let errorDialog = $('<div>').attr('title', 'Error').appendTo('body');
    let errorText = document.createTextNode(
      'This browser does not support geolocation. Please check broser privacy settings.'
    );
    errorDialog.append(errorText);
    $(function () {
      $(errorDialog).dialog();
    });
  }
});

function generatePosition(position) {
  // console.log(position.coords.latitude);
  // console.log(position.coords.longitude);
  let userLat = position.coords.latitude;
  let userLon = position.coords.longitude;
  //console.log('ayeeeee');
  $.ajax({
    url:
      'https://api.openweathermap.org/geo/1.0/reverse?lat=' + userLat + '&lon=' + userLon + '&appid=f4fa96020f2282301cd8312fc675da98',
    method: 'GET',
    dataType: 'JSON',
  }).done(function (userData) {
    // console.log(userData);
    // console.log(userData[0].name);
    // console.log(userData[0].country);
    $('#cityInput').val(`${userData[0].name}, ${userData[0].state}, USA`);
  });
}

function showError(error) {
  if (error.PERMISSION_DENIED) {
    let errorDialog = $('<div>').attr('title', 'Error').appendTo('body');
    let errorText = document.createTextNode(
      'The user has denied request for Geolocation. Please check security settings.'
    );
    errorDialog.append(errorText);
    $(function () {
      $(errorDialog).dialog();
    });
  }
}

$(function(){
  var queryLink = document.location.search;
  if (queryLink.includes('state')){
    loadMain();
    let splitForState = queryLink.split('=');
    let splitForCity = splitForState[1].split('&')
    let city = splitForCity[0]
    let state = splitForState[2].toUpperCase();
    //console.log(city, state);
    $('#cityInput').val(`${city}, ${state}, USA`);
    $('#localSearchBtn').click();
  } else if (queryLink.includes('type')) {
    loadMain();
    let firstSplit = queryLink.split('=')
    let type = firstSplit[1]
    //console.log(type);
    let toBeSelected;
    for (let i = 0; i < $('#selector').children().length; i++){
      if (document.getElementById('selector')[i].getAttribute('data-id') == type){
        toBeSelected = document.getElementById('selector')[i];
      }
    }
    //console.log(toBeSelected)
    toBeSelected.selected = 'true';
    $('#globalSearchBtn').click();
  } else {
    console.log('wudup');
  }
})

// places apikey: AIzaSyAbu8a2163MJhjkvN3MQwWmamvYJE_jKx8

var options = {
  types: ['(cities)'],
  componentRestrictions: {country: "us"}
 };

var input = document.getElementById('cityInput');
var autocomplete = new google.maps.places.Autocomplete(input,options)


