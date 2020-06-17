import "./Map.scss";
import "leaflet/dist/leaflet.css";

import { Map, Marker, TileLayer } from "react-leaflet";
import React, { Component } from "react";

import L from "leaflet";
import LCG from "leaflet-control-geocoder";

const height = { height: "18rem" };

//https://github.com/PaulLeCam/react-leaflet/issues/453
delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl: require("leaflet/dist/images/marker-icon-2x.png"),
  iconUrl: require("leaflet/dist/images/marker-icon.png"),
  shadowUrl: require("leaflet/dist/images/marker-shadow.png"),
});
export default class MapComponent extends Component {
  componentDidMount() {
    const map = this.leafletMap.leafletElement;
    const geocoder = L.Control.Geocoder.nominatim();
    let marker;

    map.on("click", (e) => {
      geocoder.reverse(
        e.latlng,
        map.options.crs.scale(18),
        (results) => {
          var r = results[0];
          if (r) {
            if (marker) {
              marker
                .setLatLng(r.center)
                .setPopupContent(r.html || r.name)
                .openPopup();
            } else {
              marker = L.marker(r.center)
                .bindPopup(r.name)
                .addTo(map)
                .openPopup();
            }
          }
        }
      );
    });
  }

  render() {
    return (
      <Map
        style={height}
        className={this.props.className}
        onClick={this.props.onClick}
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
