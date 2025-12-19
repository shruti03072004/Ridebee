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

  // ⭐ THIS CONTROLS FOOTER VISIBILITY
  showFooter: boolean = true;

  constructor(private router: Router) {}

  ngOnInit(): void {
    // Update login status + footer visibility on every route change
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.isAdminLoggedIn = StorageService.isAdminLoggedIn();
        this.isCustomerLoggedIn = StorageService.isCustomerLoggedIn();

        // ⭐ hide footer on these pages
        const pagesWithoutFooter = ['/login', '/register', '/signup'];

        this.showFooter = !pagesWithoutFooter.includes(event.url);
      }
    });
  }

  ngAfterViewInit(): void {
    const mapContainer = document.getElementById('leaflet-map');
    if (mapContainer) {
  const map = L.map('leaflet-map').setView([18.4682706, 73.7858897], 16);

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '&copy; OpenStreetMap contributors'
      }).addTo(map);

      const orangeIcon = L.icon({
        iconUrl: 'https://cdn-icons-png.flaticon.com/512/684/684908.png',
        iconSize: [32, 32],
        iconAnchor: [16, 32],
      });

      L.marker([18.4682706, 73.7858897], { icon: orangeIcon })
        .addTo(map)
        .bindPopup('<b>Ridebee HQ</b><br>Shinde pool, shivane , Pune')
        .openPopup();
    }
  }

  logout(): void {
    StorageService.logout();
    this.router.navigateByUrl('/login');
  }
}
