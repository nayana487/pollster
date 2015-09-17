var allDataList= [];
var map;

function loadYear(year){
  $.ajax({
    url: "/yeardata/"+year,
    cache: false
  })
  .done(function( res ) {
    allDataList=res;
    drawMarkers(year);
  });
}

function drawMarkers(year){
  map.eachLayer(function (layer) {
    if(layer.feature){
      map.removeLayer(layer);
    }
  });

  for (i=0; i<allDataList.length; i++) {
    var markerSize = 'small';
    var markerColor = '#000000'

    if((allDataList[i].voters >= 100)&&(allDataList[i].voters <300)) {
      markerSize = 'medium';
    }
    else if (allDataList[i].voters <= 300){
      markerSize = 'large';
    }

    var turnout=allDataList[i].votes/allDataList[i].voters*100;

    if((turnout>= 25)&&(turnout <40)) {
      markerColor = '#EB3D3B';
    }
    else if (turnout >= 40){
      markerColor = '#FDD34B';
    }

    var precinctMarker = L.mapbox.featureLayer({
        type: 'Feature',
        geometry: {
            type: 'Point',
            coordinates: [
              allDataList[i].lng,
              allDataList[i].lat
            ]
        },
        properties: {
            title: allDataList[i].precinct,
            description: allDataList[i].address,
            'marker-size': markerSize,
            'marker-color': markerColor,
            dataid: allDataList[i]._id
        }
    }).addTo(map);

    precinctMarker.on('click', function(e) {
      var dataid=e.layer.feature.properties["dataid"];
      $.ajax({
        url: "/precinctdata/"+dataid,
        cache: false
      })
      .done(function( res ) {
        document.getElementById("precinctProfile").style.display = "block";

        document.getElementById('precinctLabel').innerHTML = res.precinct;
        document.getElementById('votersLabel').innerHTML = res.voters;
        document.getElementById('votesLabel').innerHTML = res.votes;
        document.getElementById('turnoutLabel').innerHTML = Math.round(res.votes/res.voters * 100 * 100) / 100+'%';
        document.getElementById('addressLabel').innerHTML = res.address;
        document.getElementById('yearLabel').innerHTML = res.year;
      });
    });
  }
}



$(document).ready(function() {
  L.mapbox.accessToken = 'pk.eyJ1IjoibWF0dGZpY2tlIiwiYSI6ImJkN2FkOTFjNDM4OGQzNWUyYzY3NjU4ODM4ZDYwNDJmIn0.FLniij4ORShXSqRe6pcw-A';
  map = L.mapbox.map('map', 'mapbox.streets')
    .setView([39.2833, -76.6167], 12);

  var link = document.createElement('a');
          link.href = '#';
          link.className = 'active';
          link.innerHTML = '2007';
          link.id = 'firstLink';
          link.onclick = function() {
            loadYear('2007');
            this.className = 'active';
            document.getElementById('secondLink').className='inactive';
          };
  var link2 = document.createElement('a');
          link2.href = '#';
          link2.className = 'inactive';
          link2.innerHTML = '2011';
          link2.id = 'secondLink';
          link2.onclick = function() {
            loadYear('2011');
            this.className = 'active';
            document.getElementById('firstLink').className='inactive';
          };
  var layers = document.getElementById('menu-ui');
  layers.appendChild(link);
  layers.appendChild(link2);

  loadYear('2007');
});
