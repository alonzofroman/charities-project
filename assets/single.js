const mainDiv = $('#singleContainer');

//if URL has '?charityname' string, do getLocalCharity, else, do getGlobalCharity. just name global charities hrefs smth different
$(function checkIfLocalOrGlobal(){
  let queryString = document.location.search;
  let urlToArray = queryString.split('=');
  if (urlToArray.includes('?charityname')) {
    getLocalCharity(urlToArray);
  } else {
    //then run the globalfunction with the urlToArray parameter
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
      $('<h1>').text(data[0].charityName).appendTo(mainDiv);
      $('<p>').text(`Location: ${data[0].mailingAddress.city}, ${data[0].mailingAddress.stateOrProvince}`).appendTo(mainDiv);
      $('<a>').text('Link to Charity').attr('href', data[0].charityNavigatorURL).appendTo(mainDiv);
    })
}