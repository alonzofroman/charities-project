/* API to search charity by state/city/zipcode: CHARITYNAVIGATOR

 https://api.data.charitynavigator.org/v2

API KEY: */

/* Global Giving: https://www.globalgiving.org/api/methods/get-all-projects-for-a-theme/

API KEY: 30898b94-9c49-4566-ae46-904bf7e12207 */


/* Plug in lat and lon of charity into Google Maps API to show the charity's exact location:
Great tutorial: https://www.youtube.com/watch?v=Zxf1mnP5zcw&ab_channel=TraversyMedia
Docs :https://developers.google.com/maps/documentation/javascript/overview?hl=en_US

API KEY: AIzaSyBGyCeq_y1j0ceJhDdpK7A8DDU-0wu-uSU */

/* get lon lat https://api.openweathermap.org/geo/1.0/direct?q=' + cityToSearch + '&limit=5&appid=

API KEY: 6f7fcdfd5baf071bea56c4dc9633ff39 */

const splashDiv = $('#splashDiv');
const mainDiv = $('#mainDiv');

/*flickity for carousel*/
$('#featuredCarousel').flickity({
  autoPlay: true,
  wrapAround: true,
  cellAlign: 'left',
  contain: true
});

/*global search selector*/
$(function() {
  $( "#selector" ).selectmenu();
});

function loadMain(){
  splashDiv.hide();
  mainDiv.show();
}

$('#initializeBtn').on('click', loadMain);



/*local Charities button*/
function pullLocalCharities(e){
  e.preventDefault();
  let citySearch = $('#cityInput').val();
  let stateSearch = $('#stateInput').val();
  //console.log(citySearch, stateSearch);
  let localUrl = 'https://data.orghunter.com/v1/charitysearch?user_key=47ee0338250fd0f2fde645b300727ded&city=' + citySearch + '&state=' + stateSearch
  //console.log(localUrl);
  fetch (localUrl, {mode: 'cors'})
    .then(function (response){
      console.log(response);
      return response.json();
    })

}

$('#localSearchBtn').on('click', pullLocalCharities)


//GLOBAL search

function pullGlobalCharities() {
  let globalSelected = $('#selector option:selected').attr('data-id');
  //console.log(globalSelected);
  let globalUrl = 'https://api.globalgiving.org/api/public/projectservice/themes/' + globalSelected + '/projects?api_key=30898b94-9c49-4566-ae46-904bf7e12207'
  $.ajax({
    url: globalUrl,
    method: 'GET',
    dataType: 'JSON',
  })
  .done(function(response){
    let finalGlobalResults = response.projects.project
    for (let i = 0; i < 10; i++){
      let newItem = 
    }
  })

  }

$('#globalSearchBtn').on('click', pullGlobalCharities)


