import "./Map.scss";
import 'leaflet/dist/leaflet.css';

import { Map, Marker, Popup, TileLayer } from "react-leaflet";

import L from 'leaflet';
import React from "react";

//https://github.com/PaulLeCam/react-leaflet/issues/453
delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
    iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
    iconUrl: require('leaflet/dist/images/marker-icon.png'),
    shadowUrl: require('leaflet/dist/images/marker-shadow.png')
});

export default class Mapp extends React.Component {
  constructor() {
    super();
    this.state = {
      center: {
        lat: 40.63666412,
        lng: 22.942162898,
      },
      marker: {
        lat: 40.63666412,
        lng: 22.942162898,
      },
      zoom: 13,
      draggable: true,
    };
  }

  refmarker = React.createRef(Marker)

  toggleDraggable = () => {
    this.setState({ draggable: !this.state.draggable })
  }

  updatePosition = () => {
    const marker = this.refmarker.current
    if (marker != null) {
      this.setState({
        marker: marker.leafletElement.getLatLng(),
      })
      console.log(this.state.marker)
    }
  }

  render() {
    const position = [this.state.center.lat, this.state.center.lng]
    const markerPosition = [this.state.marker.lat, this.state.marker.lng]
    return (
      <Map className="Map" center={position} zoom={this.state.zoom}>
      <TileLayer
        attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <Marker className="Marker"
        draggable={this.state.draggable}
        onDragend={this.updatePosition}
        position={markerPosition}
        ref={this.refmarker}>
        <Popup minWidth={90}>
          <span onClick={this.toggleDraggable}>
            {this.state.draggable ? 'DRAG MARKER' : 'MARKER FIXED'}
          </span>
        </Popup>
      </Marker>
    </Map>
    );
  }
}
