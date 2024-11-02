import { Component, OnInit, ViewChild } from '@angular/core';
import axios from 'axios';
import * as L from 'leaflet';
import { SearchbarComponent } from 'src/app/components/searchbar/searchbar.component';
import { StorageService } from 'src/app/services/storage.service'; // Servicio para obtener el radio guardado
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-map',
  templateUrl: './map.page.html',
  styleUrls: ['./map.page.scss'],
})
export class MapPage implements OnInit {
  @ViewChild(SearchbarComponent) searchbarComponent!: SearchbarComponent;
  map: any;
  marker: any;
  circle: any;
  radius: number = 500; // Valor por defecto del radio
  centerLatLng!: L.LatLng;

  constructor(private storageService: StorageService) {}

  ngOnInit() {
    this.loadMap();
    delete L.Icon.Default.prototype.options.iconRetinaUrl;
    delete L.Icon.Default.prototype.options.iconUrl;
    delete L.Icon.Default.prototype.options.shadowUrl;
    L.Icon.Default.mergeOptions({
      iconRetinaUrl: 'assets/images/marker-icon-2x.png',
      iconUrl: 'assets/images/marker-icon.png',
      shadowUrl: 'assets/images/marker-shadow.png',
    });
  }

  loadMap() {
    // Obtener el radio guardado en la configuración
    const savedRadius = this.storageService.get('radius');
    if (savedRadius) {
      this.radius = savedRadius;
    }

    // Obtener la ubicación del usuario
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;
        this.centerLatLng = L.latLng(lat, lng);

        // Inicializar el mapa en la ubicación actual
        this.map = L.map('mapId').setView([lat, lng], 13);

        // Cargar las tiles de OpenStreetMap
        L.tileLayer(`https://api.maptiler.com/maps/streets/{z}/{x}/{y}.png?key=${environment.osm_key}`, {
          attribution: '&copy; <a href="https://www.maptiler.com/copyright/" target="_blank">MapTiler</a> contributors',
          referrerPolicy: 'no-referrer'
        }).addTo(this.map);

        // Agregar un pin draggeable
        this.marker = L.marker([lat, lng], { draggable: true }).addTo(this.map);

        // Agregar un círculo para representar el radio de geofencing
        this.circle = L.circle([lat, lng], {
          color: 'blue',
          fillColor: '#f03',
          fillOpacity: 0.5,
          radius: this.radius // Usar el radio guardado o el por defecto
        }).addTo(this.map);

        // Listener para mover el pin al hacer clic en el mapa
        this.map?.on('click', (e: any) => {
          const newLatLng = e.latlng;
          this.moveMarker(newLatLng);
        });

        // Listener para cuando el pin se mueva manualmente
        this.marker.on('dragend', () => {
          const position = this.marker.getLatLng();
          this.updateCircle(position);
        });
      });
    }
  }

  // Función para centrar el pin en la ubicación actual
  centerOnCurrentLocation() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;
        const newLatLng = L.latLng(lat, lng);
        this.moveMarker(newLatLng);
        this.map.setView(newLatLng, 13); // Centrar el mapa en la nueva ubicación
      });
    }
  }

  // Función para mover el pin al hacer clic en el mapa o al obtener la ubicación actual
  moveMarker(latlng: L.LatLng) {
    this.marker.setLatLng(latlng);
    this.updateCircle(latlng);
    this.updateAddress(latlng); // Actualizar la dirección en la barra de búsqueda
  }

  // Función para actualizar el círculo y centrarlo en la nueva posición del pin
  updateCircle(latlng: L.LatLng) {
    this.circle.setLatLng(latlng);
    this.centerLatLng = latlng;
  }

  // Función para actualizar el radio del círculo cuando se modifica el slider
  updateCircleRadius() {
    if (this.circle) {
      this.circle.setRadius(this.radius); // Ajustar el radio del círculo en tiempo real
      this.storageService.set('radius', this.radius); // Guardar el nuevo radio
      console.log(`Nuevo radio: ${this.radius} metros`);
    }
  }

  async updateAddress(latlng: L.LatLng) {
    const response = await axios.get(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latlng.lat}&lon=${latlng.lng}`);
    const address = response.data.display_name;
    // Actualizá el valor en la barra de búsqueda
    this.searchbarComponent.query = address;
  }
}
