import "./Map.scss";
import "leaflet/dist/leaflet.css";

import { Map, Marker, Popup, TileLayer } from "react-leaflet";

import L from "leaflet";
import React from "react";

//https://github.com/PaulLeCam/react-leaflet/issues/453
delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl: require("leaflet/dist/images/marker-icon-2x.png"),
  iconUrl: require("leaflet/dist/images/marker-icon.png"),
  shadowUrl: require("leaflet/dist/images/marker-shadow.png"),
});

export default class Mapp extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      currentPos: null,
    };
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick(e) {
    this.setState({ currentPos: e.latlng });
    console.log(this.state.currentPos);
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
              {/*<Popup position={this.state.currentPos}>
                Current location:{" "}
                <pre>{JSON.stringify(this.state.currentPos, null, 2)}</pre>
          </Popup>*/}
            </Marker>
          )}
        </Map>
      </div>
    );
  }
}
