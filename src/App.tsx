import React, { Component } from 'react';
import './App.css';
import * as markerjs2 from 'markerjs2';

class App extends Component {
  imgRef = React.createRef<HTMLImageElement>();

  showMarkerArea() {
    if (this.imgRef.current !== null) {
      // create a marker.js MarkerArea
      const markerArea = new markerjs2.MarkerArea(this.imgRef.current);
      // attach an event handler to assign annotated image back to our image element
      markerArea.addRenderEventListener(dataUrl => {
        if (this.imgRef.current) {
          this.imgRef.current.src = dataUrl;
        }
      });
      // launch marker.js
      markerArea.show();
    }
  }

  render() {
    return (
      <div className="App">
        <h1>marker.js 2 Demo.</h1>
        <img ref={this.imgRef} 
          src="sample.jpg" 
          alt="sample" 
          style={{ maxWidth: '50%' }} 
          onClick={() => this.showMarkerArea()}
          />
      </div>
    );
  }
}

export default App;
