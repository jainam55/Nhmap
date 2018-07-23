var locations = [
      {title: "by CHLOE",
      location: {lat: 42.351114, lng: -71.045021}
  },
      {title: "Tamazcal Tequila Cantina",
      location: {lat: 42.348904, lng: -71.038292}
  },
      {title: "Boston Kashmir",
      location: {lat: 42.349317, lng: -71.083926}
  },
      {title: "Max Brenner",
      location: {lat: 42.349348, lng: -71.080829}
  },
      {title: "Thai Basil",
      location: {lat: 42.350925, lng: -71.076643}
  }
    ];

var map;
var largeInfowindow;
function initMap() {
    // Constructor creates a new map - only center and zoom are required.
    var boston = {lat: 42.361145, lng: -71.057083};
    map = new google.maps.Map(document.getElementById("map"), {
      center: boston,
      zoom: 13
    });
    bindItAll();
}


var Model = function(data){
  

  var self = this;
  this.title = data.title;
  this.location = data.location;

  // Style the markers a bit. This will be our listing marker icon.
  var defaultIcon = makeMarkerIcon("0091ff");
        // Create a "highlighted location" marker color for when the user
        // mouses over the marker.
  var highlightedIcon = makeMarkerIcon("FFFF24");

  var myurl = "https://cors-anywhere.herokuapp.com/https://api.yelp.com/v3/businesses/search?term="+this.title+"&location=Boston";

  $.ajax({
    url: myurl,
    headers: {
             "Authorization":"Bearer 8jobhBUjSBRFpvBD37OoZFuuNyw2DRnKLU3t_paQ2lbz7CK3_cfJHWMkPXJLSchWhuFlP1VI4IOcee7b9Fm-X_rEA0cO0KdqWruTBqhOxmYdSNIq8ruEGomf7fpVW3Yx"
    },
    crossDomain: "true",
    method: "GET",
    dataType: "json",
    success: function(response){
      self.rating = JSON.stringify(response.businesses[0]["rating"]);
      self.phone = JSON.stringify(response.businesses[0]["phone"]);
      self.image = JSON.stringify(response.businesses[0]["image_url"]);},
    error: function(error){
      alert("Yelp Didnt retrieve it'");
       console.log("problem!!!!");
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
  this.marker.addListener("click", function() {
        toggleBounce(this);
      });
  bounds.extend(this.marker.position);

   this.marker.addListener("mouseover", function() {
            this.setIcon(highlightedIcon);
          });
   this.marker.addListener("mouseout", function() {
            this.setIcon(defaultIcon);
          });
  
// Triggers DOM event when a list option is clicked.
   this.popup = function(data) {
        google.maps.event.trigger(self.marker, "click");
    };
  
function toggleBounce(marker) {
  if (marker.getAnimation() !== null) {
    marker.setAnimation(null);
  } else {
    marker.setAnimation(google.maps.Animation.BOUNCE);
  }
}



 function populateInfoWindow(marker, infowindow, rating, phone,image) {

    if (infowindow.marker != marker) {
      infowindow.marker = marker;
      infowindow.setContent('<h6>' + marker.title + '</h6>' + '<p><strong>Rating: </strong>' + rating + '<br><strong>Phone: </strong>' + phone + '<br><img src=' + image + 'style ="width:80px;height:80px;"></p>' );
      infowindow.open(map, marker);
      // Make sure the marker property is cleared if the infowindow is closed.
      infowindow.addListener('closeclick',function(){
      infowindow.setMarker = null;
      });
    }
  }
 
};

var ViewModel = function(){

  var self = this;
  self.Locations = ko.observableArray();
  self.userInput = ko.observable('');

  locations.forEach(function(data){
  self.Locations.push( new Model(data) );


  self.filteredLocation = ko.computed(function() {
    var filter = self.userInput().toLowerCase();
    if (!filter) {
      return self.Locations();
    }else {
      return ko.utils.arrayFilter(self.Locations(), function(item) {
        var result = (item.title.toLowerCase().search(filter) >= 0);
        return result;
      });
    }
  });


 });
  };


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
function cantLoad() {
    alert('The map could not be loaded.');
}