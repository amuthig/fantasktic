import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { MatMenuModule } from '@angular/material/menu';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatDialog } from '@angular/material/dialog';
import { AddTaskComponent } from '../add-task/add-task.component';
import { AuthService } from '../auth/auth.service';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common'; // Import CommonModule for NgIf

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [MatMenuModule, MatToolbarModule, RouterModule, CommonModule],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
})
export class NavbarComponent implements OnInit {
  isLoggedIn: boolean = false;  // Stores the login status
  showNavbar: boolean = true;   // Controls the visibility of the navbar

  constructor(
    private router: Router,  // Router instance for navigation
    private route: ActivatedRoute,  // ActivatedRoute instance for route handling
    private authService: AuthService,  // AuthService instance for authentication handling
    private dialog: MatDialog  // MatDialog instance for opening dialogs
  ) {}

  /**
   * ngOnInit - Initializes the component
   * Subscribes to login status and checks for the current route to determine navbar visibility
   */
  ngOnInit(): void {
    // Subscribe to the login status to update isLoggedIn
    this.authService.isLoggedIn.subscribe((loggedIn) => {
      this.isLoggedIn = loggedIn;
    });

    // Listen for navigation events to manage navbar visibility
    this.router.events.pipe(filter(event => event instanceof NavigationEnd)).subscribe(() => {
      const currentRoute = this.router.url;
      // Hide navbar on login or signup routes
      this.showNavbar = !(currentRoute.includes('/login') || currentRoute.includes('/signup'));
    });
  }

  /**
   * onLoginLogout - Handles login and logout actions
   * Navigates to the login page and performs logout if logged in, or navigates to login otherwise
   */
  onLoginLogout(): void {
    if (this.isLoggedIn) {
      this.authService.logout();  // Logs the user out
      this.router.navigate(['/login']);  // Redirect to login page
    } else {
      this.router.navigate(['/login']);  // Navigate to login page if not logged in
    }
  }

  /**
   * openAddTaskDialog - Opens the dialog to add a new task
   * Launches the AddTaskComponent in a dialog window
   */
  openAddTaskDialog(): void {
    const dialogRef = this.dialog.open(AddTaskComponent, {
      width: '400px'  // Set the dialog width
    });
  }
}
