import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ChildActivationStart } from '@angular/router';
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
      width: 400px;
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

export class ZoomRangeComponent implements AfterViewInit, OnDestroy {
//lo hacemos con el viewchild para no tener que depender de un ID.
  @ViewChild('map') divMap!: ElementRef;
  
map!: mapboxgl.Map;
zoomLevel: number = 10;
mapCenter: [number, number] = [-3.6808139465217944, 40.421142056673936]

  constructor() { }

  ngOnDestroy(): void {
    this.map.off('zoom', () => {});
    this.map.off('zoomend', () => {});
    this.map.off('move', () => {});
  }

  ngAfterViewInit(): void {
    this.map = new mapboxgl.Map({
      container: this.divMap.nativeElement,
      style: 'mapbox://styles/mapbox/streets-v11',
      /* Satellite-v9 es para poner el mapa tipo google earth, 
        pero no se ve tan claro
       style: 'mapbox://styles/mapbox/satellite-v9'*/
      center: this.mapCenter,
      zoom: this.zoomLevel
    });

    this.map.on('zoom', (ev) => {
      console.log(ev);
      this.zoomLevel   = this.map.getZoom()
    })

    this.map.on('zoomend', () => {
      if( this.map.getZoom() > 18 ) {
        this.map.zoomTo(18)
      }
    })
//movimiento del mapa
    this.map.on('move', (ev) => {
      const target = ev.target;
      const {lng, lat} = target.getCenter()
      this.mapCenter = [lng, lat]
    })
  }

zoomIn() {
this.map.zoomIn();
}

zoomOut() {
  this.map.zoomOut();
}

zoomChange(valor: string) {
  this.map.zoomTo(Number(valor))
}
}
