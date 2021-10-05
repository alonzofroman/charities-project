const mainDiv = $('#singleContainer');

//if URL has '?charityname' string, do getLocalCharity, else, do getGlobalCharity. just name global charities hrefs smth different
$(function checkIfLocalOrGlobal(){
  let queryString = document.location.search;
  let urlToArray = queryString.split('=');
  if (urlToArray.includes('?charityname')) {
    getLocalCharity(urlToArray);
  } else {
    getGlobalCharity(urlToArray)
  }
})

var getLocalCharity = function (urlArray) {
  let nameOfCharity = urlArray[1];
  let charityUrl = 'https://api.data.charitynavigator.org/v2/Organizations?app_id=0a9ad98a&app_key=f5d879810f81ef14e848b61de031964f&search=' + nameOfCharity;
  fetch (charityUrl)
    .then(function(response){
      return response.json();
    })
    .then(function(data){
      $('<h1>').addClass('text-3xl').text(data[0].charityName).appendTo(mainDiv);
      $('<p>').text(`Location: ${data[0].mailingAddress.city}, ${data[0].mailingAddress.stateOrProvince}`).appendTo(mainDiv);
      $('<a>').addClass('singleLinks').text('Link to Charity').attr('href', data[0].charityNavigatorURL).appendTo(mainDiv);
    })
}

var getGlobalCharity = function (urlArray) {
  let idOfCharity = urlArray[1];
  let charityUrl = 'https://api.globalgiving.org/api/public/projectservice/projects/' + idOfCharity + '?api_key=30898b94-9c49-4566-ae46-904bf7e12207';
  $.ajax({
    url: charityUrl,
    method: 'GET',
    dataType: 'JSON', //when we comment this out, the XML is returned in console log, if we keep it in, nothing ever shows up??
  })
  .done(function(data){
    //console.log(data.project);
    $('<h1>').addClass('text-3xl').text(data.project.title).appendTo(mainDiv);
    $('<p>').text(`Location: ${data.project.contactCity}, ${data.project.contactCountry}`).appendTo(mainDiv);
    $('<a>').addClass('singleLinks').text('Link to Charity').attr('href', data.project.projectLink).appendTo(mainDiv);
  })
};