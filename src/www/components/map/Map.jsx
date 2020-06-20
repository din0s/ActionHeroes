import "./Map.scss";
import "leaflet/dist/leaflet.css";
import "leaflet-control-geocoder";

import { Map, Marker, TileLayer } from "react-leaflet";
import React, { Component } from "react";

import L from "leaflet";

const height = { height: "18rem" };

//https://github.com/PaulLeCam/react-leaflet/issues/453
delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl: require("leaflet/dist/images/marker-icon-2x.png"),
  iconUrl: require("leaflet/dist/images/marker-icon.png"),
  shadowUrl: require("leaflet/dist/images/marker-shadow.png"),
});
export default class MapComponent extends Component {
  extractAddress = (a, delim) => {
    const { tourism, amenity, building, leisure } = a;
    const { road, residential, house_number } = a;
    const { city, town, village, hamlet, postcode } = a;

    var topLine = "";
    if (tourism) {
      topLine = tourism;
    } else if (amenity) {
      topLine = amenity;
    } else if (building) {
      topLine = building;
    } else if (leisure) {
      topLine = leisure;
    }
    if (topLine !== "") {
      topLine += delim;
    }

    var midLine = "";
    if (road) {
      midLine = road;
    } else if (residential) {
      midLine = residential;
    }
    if (house_number) {
      midLine += ` ${house_number}`;
    }
    if (midLine !== "") {
      midLine += delim;
    }

    var botLine = "";
    if (city) {
      botLine += city;
    } else if (town) {
      botLine += town;
    } else if (village) {
      botLine += village;
    } else if (hamlet) {
      botLine += hamlet;
    }
    if (postcode) {
      botLine += `, ${postcode}`;
    }

    return `${topLine}${midLine}${botLine}`;
  };

  componentDidMount = () => {
    const map = this.leafletMap.leafletElement;

    const geocoder = L.Control.Geocoder.nominatim({
      htmlTemplate: (r) => {
        return this.extractAddress(r.address, "<br/>");
      },
    });
    let marker;

    map.on("click", (e) => {
      geocoder.reverse(e.latlng, map.options.crs.scale(18), (results) => {
        var r = results[0];
        if (r) {
          const address = this.extractAddress(r.properties.address, "\n");
          this.props.onClick(r.center, address);
          if (marker) {
            marker
              .setLatLng(r.center)
              .setPopupContent(r.html)
              .openPopup();
          } else {
            marker = L.marker(r.center)
              .bindPopup(r.html)
              .addTo(map)
              .openPopup();
          }
        }
      });
    });
  };

  render() {
    return (
      <Map
        style={height}
        className={this.props.className}
        center={this.props.center}
        zoom={this.props.zoom}
        ref={(m) => {
          this.leafletMap = m;
        }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
        />
        {this.props.center && (
          <Marker position={this.props.center} draggable={false}></Marker>
        )}
      </Map>
    );
  }
}
