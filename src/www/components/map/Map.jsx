import "./Map.scss";
import "leaflet/dist/leaflet.css";

import { Map, Marker, TileLayer } from "react-leaflet";

import L from "leaflet";
import React from "react";

//https://github.com/PaulLeCam/react-leaflet/issues/453
delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl: require("leaflet/dist/images/marker-icon-2x.png"),
  iconUrl: require("leaflet/dist/images/marker-icon.png"),
  shadowUrl: require("leaflet/dist/images/marker-shadow.png"),
});

export default ({ className, position, zoom, onClick }) => {
  return (
    <Map className={className} center={position} zoom={zoom} onClick={onClick}>
      <TileLayer
        attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {position && <Marker position={position} draggable={false}></Marker>}
    </Map>
  );
};
