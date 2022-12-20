import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import * as mapboxgl from 'mapbox-gl';

interface colorMarker {
  color: string;
  marker?: mapboxgl.Marker;
  center?: [number, number];
}

@Component({
  selector: 'app-markers',
  templateUrl: './markers.component.html',
  styles: [
    `
    .map-container{
      width: 100vw;
      height: 100%;
    }

    .list-group {
      position: fixed;
      top: 20px;
      right: 20px;
      z-index: 99;
    }
    li {
      cursor: pointer;
    }
    `
  ]
})
export class MarkersComponent implements AfterViewInit {
  @ViewChild('map') divMap!: ElementRef;
  
  map!: mapboxgl.Map;
  zoomLevel: number = 15;
  mapCenter: [number, number] = [-3.6808139465217944, 40.421142056673936];
  //array de markers
  markers: colorMarker[] = [];

  constructor() { }

  ngAfterViewInit(): void {
    this.map = new mapboxgl.Map({
      container: this.divMap.nativeElement,
      style: 'mapbox://styles/mapbox/streets-v11',
      center: this.mapCenter,
      zoom: this.zoomLevel
    });
//una forma de personalizar los marcadores es agregándolos con HTML, pudiendose agregar img...etc..
    /*const markerHtml: HTMLElement = document.createElement('div');
    markerHtml.innerHTML = 'Hola Mundo';*/

//Esto es para crear los marcadores y que al cargarse el mapa estén ahí, pero en este caso queremos crearlos de manera dinámica.
    /*const marker = new mapboxgl.Marker()
    .setLngLat(this.mapCenter)
    .addTo(this.map)*/
    this.readLocalStorage();
  }

  addMarker() {
    const color = "#xxxxxx".replace(/x/g, y=>(Math.random()*16|0).toString(16));
    const newMarker = new mapboxgl.Marker({
      draggable:true,
      color
    })
      .setLngLat(this.mapCenter)
      .addTo(this.map);

    this.markers.push({
      color,
      marker: newMarker
    });
    this.saveMarkersLocalStorage();

    newMarker.on('dragend', () => {
      this.saveMarkersLocalStorage();
    });

  }

  goMarker(marker: mapboxgl.Marker) {
    this.map.flyTo({
      center: marker.getLngLat()
    })
  }

  saveMarkersLocalStorage() {
    const lngLatArr: colorMarker[] = [];

    this.markers.forEach(m => {
      const color = m.color;
      const {lng, lat} = m.marker!.getLngLat();
      
      lngLatArr.push({
        color: color,
        center: [lng, lat]
      });
    })
    localStorage.setItem('marcadores', JSON.stringify(lngLatArr));
  }

  readLocalStorage() {
    if (!localStorage.getItem('marcadores')) {
      return
    } 
    const lngLatArr: colorMarker[] = JSON.parse(localStorage.getItem('marcadores')!);

    lngLatArr.forEach( m => {
      const newMarker = new mapboxgl.Marker({
        color: m.color,
        draggable: true
      })
        .setLngLat(m.center!)
        .addTo(this.map);
//para que al salir de la pagina de marcadores no se sobreescriban los datos de los marcadores por el array de markers [] vacío que tenemos más arriba.        
      this.markers.push({
        marker: newMarker,
        color: m.color
      });

      newMarker.on('dragend', () => {
        this.saveMarkersLocalStorage();
      });

    });
    
  }

  deleteMarker(i: number) {
    console.log('borrando i');
    this.markers[i].marker?.remove();
    this.markers.splice(i, 1);
    this.saveMarkersLocalStorage();
  }
}
