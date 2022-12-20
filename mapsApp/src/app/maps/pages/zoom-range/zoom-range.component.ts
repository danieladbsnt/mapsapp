import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import * as mapboxgl from 'mapbox-gl';

@Component({
  selector: 'app-zoom-range',
  templateUrl: './zoom-range.component.html',
  styles: [
    `
    .map-container{
      width: 100vw;
      height: 100%;
    }
    .row {
      background-color: white;
      border-radius: 5px;
      position: fixed;
      bottom: 50px;
      left: 50px;
      padding: 10px;
      z-index: 999;
    }
    `
  ]
})

export class ZoomRangeComponent implements AfterViewInit {
//lo hacemos con el viewchild para no tener que depender de un ID.
  @ViewChild('map') divMap!: ElementRef;
  
map!: mapboxgl.Map;
zoomLevel: number = 10;
  constructor() { }

  ngAfterViewInit(): void {
    this.map = new mapboxgl.Map({
      container: this.divMap.nativeElement,
      style: 'mapbox://styles/mapbox/streets-v11',
      /* Satellite-v9 es para poner el mapa tipo google earth, 
        pero no se ve tan claro
       style: 'mapbox://styles/mapbox/satellite-v9'*/
      center: [-3.6808139465217944, 40.421142056673936],
      zoom: this.zoomLevel
    });
  }

zoomIn() {
this.map.zoomIn();
this.zoomLevel = this.map.getZoom();
}

zoomOut() {
  this.map.zoomOut();
  this.zoomLevel = this.map.getZoom();
}

}
