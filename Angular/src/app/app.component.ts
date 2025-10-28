import { Component, AfterViewInit, OnInit } from '@angular/core';
import { StorageService } from './auth/services/storage/storage.service';
import { Router, NavigationEnd } from '@angular/router';
import * as L from 'leaflet';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, AfterViewInit {
  title = 'rentacar-angular';
  isAdminLoggedIn: boolean = StorageService.isAdminLoggedIn();
  isCustomerLoggedIn: boolean = StorageService.isCustomerLoggedIn();

  constructor(private router: Router) {}

  ngOnInit(): void {
    // ✅ Update login status when navigation happens
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.isAdminLoggedIn = StorageService.isAdminLoggedIn();
        this.isCustomerLoggedIn = StorageService.isCustomerLoggedIn();
      }
    });
  }

  ngAfterViewInit(): void {
    // ✅ Initialize Leaflet Map (only once the DOM is ready)
    const mapContainer = document.getElementById('leaflet-map');
    if (mapContainer) {
      const map = L.map(mapContainer).setView([17.6649, 75.9262], 15);

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '&copy; OpenStreetMap contributors'
      }).addTo(map);

      const orangeIcon = L.icon({
        iconUrl: 'https://cdn-icons-png.flaticon.com/512/684/684908.png',
        iconSize: [32, 32],
        iconAnchor: [16, 32],
      });

      L.marker([17.6649, 75.9262], { icon: orangeIcon })
        .addTo(map)
        .bindPopup('<b>Ridebee HQ</b><br>Sakhar Peth, Solapur')
        .openPopup();
    }
  }

  logout(): void {
    StorageService.logout();
    this.router.navigateByUrl('/login');
  }
}
