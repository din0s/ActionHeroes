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

const coordinates = { lat: 40.63666412, lng: 22.942162898 };

export default class Mapp extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      currentPos: coordinates, // This should get the user's backend coordinates, now it is hardcoded.
    };
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick(e) {
    this.setState({ currentPos: e.latlng });
  }

  render() {
    return (
      <div>
        <Map
          className={this.props.className}
          center={this.props.center}
          zoom={this.props.zoom}
          onClick={this.handleClick}
        >
          <TileLayer
            attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          {this.state.currentPos && (
            <Marker position={this.state.currentPos} draggable={false}>
            </Marker>
          )}
        </Map>
      </div>
    );
  }
}
