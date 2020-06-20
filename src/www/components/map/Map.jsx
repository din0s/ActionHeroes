import "./Map.scss";
import "leaflet/dist/leaflet.css";
import "leaflet-control-geocoder";

import { Map, Marker, TileLayer } from "react-leaflet";
import React, { Component } from "react";

import L from "leaflet";
import { template } from "leaflet-control-geocoder/src/util";

const height = { height: "18rem" };

//https://github.com/PaulLeCam/react-leaflet/issues/453
delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl: require("leaflet/dist/images/marker-icon-2x.png"),
  iconUrl: require("leaflet/dist/images/marker-icon.png"),
  shadowUrl: require("leaflet/dist/images/marker-shadow.png"),
});
export default class MapComponent extends Component {
  componentDidMount = () => {
    const map = this.leafletMap.leafletElement;

    const geocoder = L.Control.Geocoder.nominatim({
      htmlTemplate: function(r) {
        var a = r.address,
          className,
          parts = [];
        if (a.road || a.building) {
          parts.push("{building} {road} {house_number} {leisure} {amenity}");
        }
        if (a.city || a.town || a.village || a.hamlet) {
          className =
            parts.length > 0 ? "leaflet-control-geocoder-address-detail" : "";
          parts.push(
            '<span class="' +
              className +
              '">{postcode} {city} {town} {village} {hamlet}</span>'
          );
        }
        return template(parts.join("<br/>"), a, true);
      },
    });
    let marker;

    map.on("click", (e) => {
      geocoder.reverse(e.latlng, map.options.crs.scale(18), (results) => {
        var r = results[0];
        if (r) {
          // let address = "";
          // r.properties.address.forEach((e) => {
          //   if (e !== undefined) {
          //     address += e + " ";
          //   }
          // });
          var address = "",
            address1 = "",
            address2 = "",
            address3 = "",
            address4 = "";
          Object.keys(r.properties.address).map((e) => {
            if (e === "building" || e === "leisure" || e === "amenity") {
              let k = r.properties.address[e];
              if (k !== undefined) {
                address1 += k + " ";
              }
            } else if (e === "road") {
              let k = r.properties.address[e];
              if (k !== undefined) {
                address2 += k + " ";
              }
            } else if (e === "house_number") {
              let k = r.properties.address[e];
              if (k !== undefined) {
                address3 += k + " ";
              }
            } else if (
              e === "city" ||
              e === "town" ||
              e === "village" ||
              e === "hamlet"
            ) {
              let k = r.properties.address[e];
              if (k !== undefined) {
                address4 += k + " ";
              }
            }
            return 0;
          });
          address = address1 + address2 + address3 + address4;
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
