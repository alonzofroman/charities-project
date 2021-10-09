function initMap() {
  const mainDiv = $('#singleContainer');
  let theMap;
  //if URL has '?charityname' string, do getLocalCharity, else, do getGlobalCharity. just name global charities hrefs smth different
  $(function checkIfLocalOrGlobal() {
    $('.loading').show()
    let queryString = document.location.search;
    let urlToArray = queryString.split('=');
    if (urlToArray.includes('?charityname')) {
      getLocalCharity(urlToArray);
    } else {
      getGlobalCharity(urlToArray)
    }
  })

  // If localcharity,load its info
  var getLocalCharity = function (urlArray) {
    let nameOfCharity = urlArray[1];
    let charityUrl = 'https://api.data.charitynavigator.org/v2/Organizations?app_id=0a9ad98a&app_key=f5d879810f81ef14e848b61de031964f&search=' + nameOfCharity + '&city=' + urlArray[2];
    quickFetch(charityUrl, (function (data) {
        const localCity = data[0].mailingAddress.city
        const localState = data[0].mailingAddress.stateOrProvince
        $('.loading').hide()
        $('<h1>').addClass('text-4xl').text(data[0].charityName).appendTo(mainDiv);
        $('<p>').text(`Location: ${localCity}, ${localState}`).appendTo(mainDiv);
        $('<div>').attr('id', 'textDiv').appendTo(mainDiv);
        $('<p>').addClass('text-center rounded-md').text(data[0].irsClassification.nteeType).appendTo($("#textDiv"));
        $('<p>').addClass('text-center rounded-md bg-yellow-100').html(data[0].mission).appendTo(mainDiv);
        $('<a>').addClass('singleLinks').text('Link to Charity').attr('href', data[0].charityNavigatorURL).appendTo(mainDiv);
        
        // Generate map
        theMap = $('<div>').attr('id', 'map').appendTo(mainDiv);
        getLonLat(localCity, localState);
      }))
  }

  // If GlobalCharity, load its info
  var getGlobalCharity = function (urlArray) {
    let idOfCharity = urlArray[1];
    let charityUrl = 'https://api.globalgiving.org/api/public/projectservice/projects/' + idOfCharity + '?api_key=30898b94-9c49-4566-ae46-904bf7e12207';
    $.ajax({
      url: charityUrl,
      method: 'GET',
      dataType: 'JSON',
    })
      .done(function (data) {
        const globalCity = data.project.contactCity
        $('.loading').hide();
        $('<h1>').addClass('text-4xl').text(data.project.title).appendTo(mainDiv);
        $('<p>').text(`Location: ${globalCity}, ${data.project.contactCountry}`).appendTo(mainDiv);
        $('<img>').addClass('singleImg').attr('src', data.project.image.imagelink[4].url).appendTo(mainDiv);
        $('<a>').addClass('singleLinks').text('Link to Charity').attr('href', data.project.projectLink).appendTo(mainDiv);
        $('<div>').attr('id', 'fundingSection').appendTo(mainDiv);
        $('<p>').text('Current funding: $' + data.project.funding).appendTo($("#fundingSection"));
        $('<p>').text(`⠀/ ⠀Goal: $${data.project.goal}`).appendTo($("#fundingSection"));
        $('<div>').attr('id', 'textDiv').appendTo(mainDiv);
        $('<p>').addClass('text-center rounded-md').text(data.project.activities).appendTo($("#textDiv"));
        $('<p>').addClass('text-center rounded-md').text(data.project.need).appendTo("#textDiv");
        // Generate map
        theMap = $('<div>').attr('id', 'map').appendTo(mainDiv);
        getLonLat(globalCity);
      });
  };

  // Get lon and lat of location either from global charity or local charity
  function getLonLat(city, state) {
    let getLonLatUrl;
    if (state == undefined || state == null) {r
      getLonLatUrl = `https://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=5&appid=6f7fcdfd5baf071bea56c4dc9633ff39`
    } else if (city == undefined || city == null) {
      getLonLatUrl = `https://api.openweathermap.org/geo/1.0/direct?q=${state},US&limit=5&appid=6f7fcdfd5baf071bea56c4dc9633ff39`
    } else {
      getLonLatUrl = `https://api.openweathermap.org/geo/1.0/direct?q=${city},${state},US&limit=5&appid=6f7fcdfd5baf071bea56c4dc9633ff39`
    }
    $.ajax({
      url: getLonLatUrl,
      method: 'GET',
      dataType: 'JSON',
    })
      .done(function (data) {
        locationLon = data[0].lon;
        locationLat = data[0].lat;
        // initMap(locationLon, locationLat);
        map = new google.maps.Map(document.getElementById("map"), {
          center: { lat: locationLat, lng: locationLon },
          zoom: 8,
        });
        // To add markers to map
        let marker = new google.maps.Marker({
          position: { lat: locationLat, lng: locationLon },
          map: map
        })
      });
  };
};

// Set back to main button href
$(function () {
  // var pulledState = JSON.parse(localStorage.getItem('pageState'))
  var pulledState = _().getLocalStorage('pageState');
  let splitState = pulledState[0].split(', ')
  if (splitState.length === 3) {
    $('#backToMain').attr('href', `./index.html?city=${splitState[0]}&state=${splitState[1]}`)
  } else {
    $('#backToMain').attr('href', `./index.html?type=${splitState[0]}`)
  }
});
