const loadGoogleMapsApi = require('load-google-maps-api');

// https://snazzymaps.com/style/2/midnight-commander
// adjustments: hide all pois
const mapStyle = [
  {
      "featureType": "all",
      "elementType": "labels.text.fill",
      "stylers": [
          {
              "color": "#ffffff"
          }
      ]
  },
  {
      "featureType": "all",
      "elementType": "labels.text.stroke",
      "stylers": [
          {
              "color": "#000000"
          },
          {
              "lightness": 13
          }
      ]
  },
  {
      "featureType": "administrative",
      "elementType": "geometry.fill",
      "stylers": [
          {
              "color": "#000000"
          }
      ]
  },
  {
      "featureType": "administrative",
      "elementType": "geometry.stroke",
      "stylers": [
          {
              "color": "#144b53"
          },
          {
              "lightness": 14
          },
          {
              "weight": 1.4
          }
      ]
  },
  {
      "featureType": "landscape",
      "elementType": "all",
      "stylers": [
          {
              "color": "#08304b"
          }
      ]
  },
  {
      "featureType": "poi",
      "stylers": [
          {
              "visibility": "off"
          }
      ]
  },
  {
      "featureType": "road.highway",
      "elementType": "geometry.fill",
      "stylers": [
          {
              "color": "#000000"
          }
      ]
  },
  {
      "featureType": "road.highway",
      "elementType": "geometry.stroke",
      "stylers": [
          {
              "color": "#0b434f"
          },
          {
              "lightness": 25
          }
      ]
  },
  {
      "featureType": "road.arterial",
      "elementType": "geometry.fill",
      "stylers": [
          {
              "color": "#000000"
          }
      ]
  },
  {
      "featureType": "road.arterial",
      "elementType": "geometry.stroke",
      "stylers": [
          {
              "color": "#0b3d51"
          },
          {
              "lightness": 16
          }
      ]
  },
  {
      "featureType": "road.local",
      "elementType": "geometry",
      "stylers": [
          {
              "color": "#000000"
          }
      ]
  },
  {
      "featureType": "transit",
      "elementType": "all",
      "stylers": [
          {
              "color": "#146474"
          }
      ]
  },
  {
      "featureType": "water",
      "elementType": "all",
      "stylers": [
          {
              "color": "#021019"
          }
      ]
  }
];

export class CustomMap {

  constructor(private _element: HTMLElement) { }

  show() {
    // TODO: replace API key with company-owned one
    // this one is registered to felix.hamann@satellytes.com
    loadGoogleMapsApi({ key: 'AIzaSyDSqmyLzPHyuBDlN7d0ZajXN-W7fRPOGMc' }).then(googleMaps => {
      const styledMapType = new googleMaps.StyledMapType(mapStyle, {name: 'midnight-commander'});
      const werk1Location = { lat: 48.12399503, lng: 11.60832447 };

      const map = new googleMaps.Map(this._element, {
        center: werk1Location,
        zoom: 14,
        disableDefaultUI: true,
        mapTypeControlOptions: {
          mapTypeIds: ['midnight-commander']
        }
      });
      const marker = new googleMaps.Marker({
        position: werk1Location,
        title: 'Satellytes Digital Consulting GmbH'
      });

      map.mapTypes.set('midnight-commander', styledMapType);
      map.setMapTypeId('midnight-commander');

      marker.setMap(map);

    }).catch(function (error) {
      console.error(error)
    });
  }
}