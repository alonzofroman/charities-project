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
const featuredCarousel = document.querySelector("#featuredCarousel");

// Dynamically changing carousel
$(function loadCarousel(){
  let featuredUrl = 'https://api.globalgiving.org/api/public/projectservice/featured/projects?api_key=30898b94-9c49-4566-ae46-904bf7e12207';
  $.ajax({
    url: featuredUrl,
    method: 'GET',
    dataType: 'JSON',
  })
  .done(function (featuredData) {
    $('.caption').show();
    let featuredProject = featuredData.projects.project
    let featuredSpot = $(featuredCarousel).children(0).children(0).children("div")
    _(10).for((i)=>{
      featuredSpot[i].setAttribute("title",featuredProject[i].title)
      featuredSpot[i].childNodes[0].setAttribute("href",featuredProject[i].projectLink)
      featuredSpot[i].childNodes[0].childNodes[0].setAttribute("src",featuredProject[i].image.imagelink[3].url)  
    })
  });
});

// Flickity carousel stuff
const flickityOptions = {
  autoPlay: true,
  wrapAround: true,
  cellAlign: 'left',
  contain: true,
};

// Carousel method declaration
const carousel = $('#featuredCarousel').flickity(flickityOptions);
const caption = $('.caption');
const flkty = carousel.data('flickity');

// Change caption text based on current div slide title
carousel.on('select.flickity', function() {
  caption.text(flkty.selectedElement.title);
});

// Load in the main content, hide the splash content
function loadMain() {
  splashDiv.hide();
  e('#mainDiv').showFlex();
  e('#sidebar').showFlex();
  // loadCarousel(); BAD BAD BAD
};

// "Get Started" button
$('#initializeBtn').on('click', loadMain);

// Generate error dialog function
function generateErrorDiaolog() {
  let errorDialog = $('<div>').attr('title', 'Error').appendTo('body');
  errorDialog.append(errorText);
  $(function () {
    $(errorDialog).dialog();
  });
};

// Local charities API call and 
function pullLocalCharities(e) {
  e.preventDefault();
  $('.loading').show();
  let citySearch = $('#cityInput').val();
  // Force user's state input to uppercase so it is recognized by API
  let paramsObject = [citySearch];
  currentSearchParams = paramsObject;
  pushSearchToStorage();
  let localUrl;
  // If they left the city blank, just search by state
    localUrl = 'https://api.data.charitynavigator.org/v2/Organizations?app_id=0a9ad98a&app_key=f5d879810f81ef14e848b61de031964f&rated=true&state=' + citySearch.split(", ")[1] + '&city=' + citySearch.split(", ")[0];
  fetch(localUrl)
    .then(function (response) {
      console.log(response.status);
      if (response.status == 400) {
        errorText = document.createTextNode('There was an error with your request. Please ensure a proper city name and state code were entered.');
        generateErrorDiaolog();
      }
      else if (response.status == 404) {
        errorText = document.createTextNode('There are no rated charities in your city.');
        generateErrorDiaolog();
      }
      else {
      return response.json();
    }
  })
    .then(function (data) {
      $('.loading').hide();
      // Remove all previous elements
      resultsList.innerHTML = ''
      // Dynamically generate list items
      // for (let i = 0; i < data.length; i++) {
      //   // Save name of charity so it can be pulled later
        // let newListLink = $('<a>').addClass('listItem').attr('href', './single.html?charityname=' + data[i].charityName + '=' + data[i].mailingAddress.city).appendTo(resultsList);
        // let newListItem = $('<li>').addClass('listIgnore').appendTo(newListLink);
        // let listTitle = $('<h4>').addClass('listIgnore text-2xl').text(data[i].charityName);
        // newListItem.append(listTitle);
        // // If there is no city in the data, don't create location
        // if (data[i].mailingAddress.city != null) {
        //   let listLocation = $('<p>').addClass('listIgnore').text(`${data[i].mailingAddress.city}, ${data[i].mailingAddress.stateOrProvince}`);
        //   newListItem.append(listLocation);
        // }
      // };
      _(data).forEach((i)=>{
        let newListLink = $('<a>').addClass('listItem').attr('href', './single.html?charityname=' + data[i].charityName + '=' + data[i].mailingAddress.city).appendTo(resultsList);
        let newListItem = $('<li>').addClass('listIgnore').appendTo(newListLink);
        let listTitle = $('<h4>').addClass('listIgnore text-2xl').text(data[i].charityName);
        newListItem.append(listTitle);
        if (data[i].mailingAddress.city != null) {
          let listLocation = $('<p>').addClass('listIgnore').text(`${data[i].mailingAddress.city}, ${data[i].mailingAddress.stateOrProvince}`);
          newListItem.append(listLocation);
        }
      })
    });
};

$('#localSearchBtn').on('click', function(e) {
    pullLocalCharities(e);
});

//Render global charity list elements
function renderGlobalList(data) {
  console.log(data);
  $('.loading').hide();
  resultsList.innerHTML = '';
  let finalGlobalResults = data.projects.project;
 
  _(10).for((i)=>{
    let newListLink = $('<a>').addClass('listItem').attr('href', './single.html?globalcharityid=' + finalGlobalResults[i].id).appendTo(resultsList);
    let newListItem = $('<li>').addClass('listIgnore').appendTo(newListLink);
    let listTitle = $('<h4>').addClass('listIgnore text-2xl').text(finalGlobalResults[i].title);
    newListItem.append(listTitle);
    let listLocation = $('<p>').addClass('listIgnore').text(`${finalGlobalResults[i].contactCity}, ${finalGlobalResults[i].contactCountry}`);
    newListItem.append(listLocation);
  })
  if (data.projects.hasNext === true) {
    //Generate next page button
    nextPageId = data.projects.nextProjectId;
    nextBtn = $('<button>').attr('id', 'nextPageBtn').addClass('searchBtns').text('Next Page').appendTo(resultsList);
  }
};

//Global giving API call
function pullGlobalCharities(e) {
  e.preventDefault();
  $('.loading').show();
  globalSelected = $('#selector option:selected').attr('data-id');
  let paramsObject = [globalSelected];
  currentSearchParams = paramsObject;
  pushSearchToStorage()
  let globalUrl = 'https://api.globalgiving.org/api/public/projectservice/themes/' + globalSelected + '/projects/active?api_key=30898b94-9c49-4566-ae46-904bf7e12207';
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
};

$('#globalSearchBtn').on('click', pullGlobalCharities);

function pushSearchToStorage(){
  _(currentSearchParams).toLocalStorage('pageState');
}

// Render history items
function renderHistory() {
  if (history.length > 0) {
    _(history).forEach((i)=>{
      let newHistoryBtn = $('<a>').addClass('historyBtn').text(history[i].title).appendTo(historyBox);
      newHistoryBtn.attr('href', history[i].url);
    })
  }
};

// Add item to history on click
function addToHistory(e) {
  historyBox.html('');
  // Clear all and rerender on click
  let elemUrl = e.target.getAttribute('href');
  let elemTitle = $(e.target).children().children('h4').text();
  let newHistoryObject = { url: elemUrl, title: elemTitle };
  history.unshift(newHistoryObject);
  if (history.length > 6) {
    history.pop();
  }
  // localStorage.setItem('clickHistory', JSON.stringify(history));
  _(history).toLocalStorage('clickHistory');
  renderHistory();
};

$('#displayResults').on('click', 'a', addToHistory);

// Load and render history on page load
$(function loadHistory() {
  if (localStorage.getItem('clickHistory') !== null) {
    // let pulledHistory = JSON.parse(localStorage.getItem('clickHistory'));
    let pulledHistory = _().getLocalStorage('clickHistory');
    history = pulledHistory;
    renderHistory();
  }
});

// Render next page on "Next" button click
$('#displayResults').on('click', '#nextPageBtn', function () {
  $('.loading').show();
  let GlobalUrlNext = 'https://api.globalgiving.org/api/public/projectservice/themes/' + globalSelected + '/projects/active?api_key=30898b94-9c49-4566-ae46-904bf7e12207&nextProjectId=' + nextPageId;
  $.ajax({
    url: GlobalUrlNext,
    method: 'GET',
    dataType: 'JSON',
  }).done(function (data) {
    renderGlobalList(data);
  });
});

// Back to home button
function backToHome() {
  mainDiv.hide();
  $('#sidebar').hide();
  e('#splashDiv').showFlex();
  loadCarousel();
};

$('#backBtn').on('click', backToHome);


//Get user location
$('#getLocationBtn').on('click', function() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(generatePosition, showError);
  } else {
    let errorDialog = $('<div>').attr('title', 'Error').appendTo('body');
    let errorText = document.createTextNode('This browser does not support geolocation. Please check broser privacy settings.');
    errorDialog.append(errorText);
    $(function () {
      $(errorDialog).dialog();
    });
  }
});

// Get latitude and longitude of user, then input them as city and state
function generatePosition(position) {
  let userLat = position.coords.latitude;
  let userLon = position.coords.longitude;
  $.ajax({
    url: 'https://api.openweathermap.org/geo/1.0/reverse?lat=' + userLat + '&lon=' + userLon + '&appid=f4fa96020f2282301cd8312fc675da98',
    method: 'GET',
    dataType: 'JSON',
  }).done(function (userData) {
    $('#cityInput').val(`${userData[0].name}, ${userData[0].state}, USA`);
  });
}

// Display error if user denies permission for location
function showError(error) {
  if (error.PERMISSION_DENIED) {
    let errorDialog = $('<div>').attr('title', 'Error').appendTo('body');
    let errorText = document.createTextNode('The user has denied request for Geolocation. Please check security settings.');
    errorDialog.append(errorText);
    $(function () {
      $(errorDialog).dialog();
    });
  }
};

// Load previous search state if link data signifies that back button was clicked on single.html
$(function(){
  var queryLink = document.location.search;
  if (queryLink.includes('state')){
    loadMain();
    let splitForState = queryLink.split('=');
    let splitForCity = splitForState[1].split('&')
    let city = splitForCity[0];
    let state = splitForState[2].toUpperCase();
    $('#cityInput').val(`${city}, ${state}, USA`);
    $('#localSearchBtn').click();
  } else if (queryLink.includes('type')) {
    loadMain();
    let firstSplit = queryLink.split('=');
    let type = firstSplit[1];
    let toBeSelected;
    for (let i = 0; i < $('#selector').children().length; i++){
      if (document.getElementById('selector')[i].getAttribute('data-id') == type){
        toBeSelected = document.getElementById('selector')[i];
      }
    }
    toBeSelected.selected = 'true';
    $('#globalSearchBtn').click();
  } else {
    console.log('wudup');
  }
});

// Autocomplete from Google Places
var input = document.getElementById('cityInput');
var autocomplete = new google.maps.places.Autocomplete(input, {
  types: ['(cities)'],
  componentRestrictions: {country: "us"}
});

