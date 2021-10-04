/* API to search charity by state/city/zipcode:
Docs: http://charityapi.orghunter.com/content/charity-search-summary-api

API KEY: 47ee0338250fd0f2fde645b300727ded/

/* Plug in lat and lon of charity into Google Maps API to show the charity's exact location:
Great tutorial: https://www.youtube.com/watch?v=Zxf1mnP5zcw&ab_channel=TraversyMedia
Docs :https://developers.google.com/maps/documentation/javascript/overview?hl=en_US

API KEY: AIzaSyBGyCeq_y1j0ceJhDdpK7A8DDU-0wu-uSU */

const splashDiv = $('#splashDiv');
const mainDiv = $('#mainDiv');

/*flickity for carousel*/
$('#featuredCarousel').flickity({
  autoPlay: true,
  wrapAround: true,
  cellAlign: 'left',
  contain: true
});

function loadMain(){
  splashDiv.hide();
  mainDiv.show();
}

$('#initializeBtn').on('click', loadMain);