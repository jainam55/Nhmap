var locations = [
      {title: 'by CHLOE', 
      location: {lat: 42.351114, lng: -71.045021}
  },
      {title: 'Tamazcal', 
      location: {lat: 42.348904, lng: -71.038292}
  },
      {title: 'Boston Kashmir', 
      location: {lat: 42.349317, lng: -71.083926}
  },
      {title: 'Max Brenner', 
      location: {lat: 42.349348, lng: -71.080829}
  },
      {title: 'Thai Basil', 
      location: {lat: 42.350925, lng: -71.076643}
  },
      {title: 'Boston Burger CO', 
      location: {lat: 42.34681, lng: -71.088473}
  }
    ];

var map;
var largeInfowindow;
function initMap() {
    // Constructor creates a new map - only center and zoom are required.
    var boston = {lat: 42.361145, lng: -71.057083}
    map = new google.maps.Map(document.getElementById('map'), {
      center: boston,
      zoom: 14
    });
    bindItAll();
}


var Model = function(data){
  

  var self = this;
  this.title = data.title;
  this.location = data.location;

  // Style the markers a bit. This will be our listing marker icon.
  var defaultIcon = makeMarkerIcon('0091ff');
        // Create a "highlighted location" marker color for when the user
        // mouses over the marker.
  var highlightedIcon = makeMarkerIcon('FFFF24');

  var myurl = "https://cors-anywhere.herokuapp.com/https://api.yelp.com/v3/businesses/search?term="+this.title+"&location=boston";

  $.ajax({
            url: myurl,
            headers: {
             'Authorization':'Bearer 7L2GRhxla6IMEohCe2-zlFJ8tTyWhWuV0K4RQUhWViCvWvDuO1bFRaGZPFKe1jxnmNL5QAbrjkbLCtzFHFxcSA-tREqKA4guphW_qJ7ASjYI7C3y83XefuyNsnFOW3Yx',

         },
            method: 'GET',
            dataType: 'json',
            success: function(response){

            self.rating = JSON.stringify(response.businesses[0]["rating"]);
            self.phone = JSON.stringify(response.businesses[0]["phone"]); 
            self.image = JSON.stringify(response.businesses[0]["image_url"]);

  }
  });

  this.marker = new google.maps.Marker({
    title: this.title,
    position: this.location,
    animation: google.maps.Animation.DROP,
    icon: defaultIcon
 });
  
  this.marker.setMap(map);
  var bounds = new google.maps.LatLngBounds();
  this.marker.addListener('click', function() {
        populateInfoWindow(this, largeInfowindow,self.rating, self.phone,self.image);

      });
  bounds.extend(this.marker.position);


   this.marker.addListener('mouseover', function() {
            this.setIcon(highlightedIcon);
          });
   this.marker.addListener('mouseout', function() {
            this.setIcon(defaultIcon);
          });
 function populateInfoWindow(marker, infowindow, rating, phone,image) {

    if (infowindow.marker != marker) {
      infowindow.marker = marker;
      infowindow.setContent('<h6>' + marker.title + '</h6>' 
        + '<p>Rating:' + rating + '<br>Phone:' + phone + '<br><img src=' + image + 'style ="width:80px;height:80px;"></p>' );
      infowindow.open(map, marker);
      // Make sure the marker property is cleared if the infowindow is closed.
      infowindow.addListener('closeclick',function(){
      infowindow.setMarker = null;
      });
    }
  }
 
}

var ViewModel = function(){

  var self = this;
  this.Locations = ko.observableArray();

  locations.forEach(function(data){
  self.Locations.push( new Model(data) );
 });
  }

function makeMarkerIcon(markerColor) {
        this.markerImage = new google.maps.MarkerImage(
          'http://chart.googleapis.com/chart?chst=d_map_spin&chld=1.15|0|'+ markerColor +
          '|40|_|%E2%80%A2',
          new google.maps.Size(21, 34),
          new google.maps.Point(0, 0),
          new google.maps.Point(10, 34),
          new google.maps.Size(21,34));
        return markerImage;
      }


function bindItAll() {
  largeInfowindow = new google.maps.InfoWindow();
  ko.applyBindings(new ViewModel());
}


