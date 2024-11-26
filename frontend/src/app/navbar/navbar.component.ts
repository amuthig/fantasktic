import { Component } from '@angular/core';
import {MatMenuModule} from '@angular/material/menu';
import {MatToolbarModule} from '@angular/material/toolbar';


@Component({
  selector: 'app-navbar',
  imports: [MatMenuModule, MatToolbarModule],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'] // Corrigez 'styleUrl' en 'styleUrls'
})
export class NavbarComponent {
  isLoggedIn: boolean = false;

  onLoginLogout(): void {
    this.isLoggedIn = !this.isLoggedIn;
    console.log(this.isLoggedIn ? 'User logged in' : 'User logged out');
  }
  
}