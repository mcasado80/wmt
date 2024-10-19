import { Component, EventEmitter, Output } from '@angular/core';
import axios from 'axios';
import * as L from 'leaflet';

@Component({
  selector: 'app-searchbar',
  templateUrl: './searchbar.component.html',
  styleUrls: ['./searchbar.component.scss']
})
export class SearchbarComponent {
  query: string = '';
  suggestions: any[] = [];

  @Output() locationSelected = new EventEmitter<L.LatLng>();

  constructor() {}

  // Función para buscar direcciones usando una API de geocodificación
  async searchLocation() {
    if (this.query.length > 2) {
      const response = await axios.get(`https://nominatim.openstreetmap.org/search?format=json&q=${this.query}`);
      this.suggestions = response.data;
    }
  }

  // Función para seleccionar una dirección
  selectSuggestion(suggestion: any) {
    const latlng = L.latLng(suggestion.lat, suggestion.lon);
    this.query = suggestion.display_name;
    this.locationSelected.emit(latlng);
    this.suggestions = []; // Limpiar las sugerencias
  }
}
