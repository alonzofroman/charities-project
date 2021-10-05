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

/*flickity for carousel*/
$('#featuredCarousel').flickity({
  autoPlay: true,
  wrapAround: true,
  cellAlign: 'left',
  contain: true
});

/*global search selector*/
$(function() {
  $('#selector').selectmenu();
});

function loadMain(){
  splashDiv.hide();
  mainDiv.show();
}

$('#initializeBtn').on('click', loadMain);

//If there was an error, generate an error dialog
function generateErrorDiaolog(){
  let errorDialog = $('<div>').attr('title', 'Error').appendTo('body');
  let errorText = document.createTextNode('There was an error with your request. Please try again.');
  errorDialog.append(errorText);
  $(function() {
    $(errorDialog).dialog();
  });
}

//Local charities display
function pullLocalCharities(e){
  e.preventDefault();
  $('#loading').show()
  let citySearch = $('#cityInput').val();
  //Force user's state input to uppercase so it is recognized by API
  let stateSearch = $('#stateInput').val().toUpperCase();
  let localUrl;
  //If they left the city blank, just search by state
  if (citySearch == '') {
    localUrl = 'https://api.data.charitynavigator.org/v2/Organizations?app_id=0a9ad98a&app_key=f5d879810f81ef14e848b61de031964f&state=' + stateSearch
  } else {
    localUrl = 'https://api.data.charitynavigator.org/v2/Organizations?app_id=0a9ad98a&app_key=f5d879810f81ef14e848b61de031964f&state=' + stateSearch + '&city=' + citySearch
  }
  fetch (localUrl)
    .then(function (response){
      if (response.status != 200) {
        generateErrorDiaolog();
      }
      return response.json();
    })
    .then(function(data){
      $('#loading').hide()
      //Remove all previous elements
      resultsList.innerHTML = '';
      //console.log(data)
      //Dynamically generate list items
      for (let i = 0; i < data.length; i++) {
        //save name of charity so it can be pulled later
        let newListLink = $('<a>').attr('href', './single.html?charityname=' + data[i].charityName).appendTo(resultsList)
        let newListItem = $('<li>').addClass('listItem').appendTo(newListLink)
        let listTitle = $('<h4>').addClass('text-2xl').text(data[i].charityName)
        newListItem.append(listTitle);
        //if there is no city in the data, don't create location
        if (data[i].mailingAddress.city != null){
          let listLocation = $('<p>').text(`${data[i].mailingAddress.city}, ${data[i].mailingAddress.stateOrProvince}`)
          newListItem.append(listLocation);
        };
      };
    });
};

$('#localSearchBtn').on('click', function(e){
  if ($('#stateInput').val() == ''){
    generateErrorDiaolog();
  } else {
    pullLocalCharities(e);
  }
})

//GLOBAL search
function pullGlobalCharities(e) {
  e.preventDefault();
  $('#loading').show()
  let globalSelected = $('#selector option:selected').attr('data-id');
  //console.log(globalSelected);
  let globalUrl = 'https://api.globalgiving.org/api/public/projectservice/themes/' + globalSelected + '/projects?api_key=30898b94-9c49-4566-ae46-904bf7e12207'
  $.ajax({
    url: globalUrl,
    method: 'GET',
    dataType: 'JSON',
  })
  .fail(function(){
    generateErrorDiaolog();
  })
  .done(function(data){
    $('#loading').hide()
    resultsList.innerHTML = '';
    let finalGlobalResults = data.projects.project;
    //console.log(finalGlobalResults);
    for (let i = 0; i < 10; i++){
      let newListLink = $('<a>').attr('href', './single.html?globalcharityid=' + finalGlobalResults[i].id).appendTo(resultsList)
      let newListItem = $('<li>').addClass('listItem').appendTo(newListLink)
      let listTitle = $('<h4>').addClass('text-2xl').text(finalGlobalResults[i].title)
      newListItem.append(listTitle);
      let listLocation = $('<p>').text(`${finalGlobalResults[i].contactCity}, ${finalGlobalResults[i].contactCountry}`)
      newListItem.append(listLocation);
    }
  })
  }

$('#globalSearchBtn').on('click', pullGlobalCharities)

// whenever user clicks on an item, that item is saved to history and pushed into localstorage

// in order to save to history, just grab the href we assigned to the list item earlier and attach
// an li to history ul with an a href linking to that page
// then save those to an object which can be loaded once loadMain() function is called

// for back button, save last link called by user, then run load it up from localstorage (maybe could work)