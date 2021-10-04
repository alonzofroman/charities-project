//if URL has '?charityname' string, do getLocalCharity, else, do getGlobalCharity
function checkIfLocalOrGlobal(){
  let queryString = document.location.search;
  let urlToArray = queryString.split('=');
  if (urlToArray.includes('?charityname')) {
    getLocalCharity(urlToArray);
  } else {
    //then run the globalfunction with the urlToArray parameter
  }
}

var getLocalCharity = function (urlArray) {
  let charityName = urlArray[1];
  let charityUrl = 'https://api.data.charitynavigator.org/v2/Organizations?app_id=0a9ad98a&app_key=f5d879810f81ef14e848b61de031964f&search=' + charityName;
  fetch (charityUrl)
    .then(function(response){
      return response.json();
    })
    .then(function(data){
      console.log(data[0]);
    })
}

checkIfLocalOrGlobal();