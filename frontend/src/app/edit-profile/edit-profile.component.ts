import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { UsersService } from '../users.service';
import { MatCardTitle } from '@angular/material/card';
import { MatCard } from '@angular/material/card';
import { Router } from '@angular/router';

@Component({
  selector: 'app-edit-profile',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatInputModule, 
    MatFormFieldModule,
    MatCardTitle, 
    MatCard
  ],
  templateUrl: './edit-profile.component.html',
  styleUrls: ['./edit-profile.component.css'],
})
export class EditProfileComponent implements OnInit {
  editUserForm: FormGroup; // Form group for user profile editing
  errorMessage: string | null = null; // Holds error messages
  currentUser: any; // Holds current user data

  // Constructor to initialize form and inject dependencies
  constructor(
    private fb: FormBuilder, // FormBuilder to create the form
    private usersService: UsersService, // Service to handle user data
    private router: Router // Router to navigate between pages
  ) {
    // Initialize form with fields and validations
    this.editUserForm = this.fb.group({
      username: ['', Validators.required], // Username is required
      password: ['', Validators.required], // Password is required
      email: ['', [Validators.required, Validators.email]], // Email is required and must be valid
      firstName: ['', Validators.required], // First name is required
      lastName: ['', Validators.required] // Last name is required
    });
  }

  /**
   * Lifecycle hook called on component initialization.
   * Loads current user data to populate the form.
   */
  ngOnInit(): void {
    this.loadCurrentUser(); // Load current user details on initialization
  }

  /**
   * Fetches the current user from the server and populates the form.
   */
  loadCurrentUser(): void {
    this.usersService.getCurrentUser().subscribe(user => {
      this.currentUser = user; // Store the current user data
      // Populate form with current user values
      this.editUserForm.patchValue({
        username: user.username,
        password: user.password,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName
      });
    }, error => {
      // Handle error if unable to load user data
      this.errorMessage = 'Failed to load user data';
    });
  }

  /**
   * Handles the form submission to update the user's profile.
   * Makes an API call to update the user data on the server.
   */
  onSave(): void {
    // Check if the form is valid before submitting
    if (this.editUserForm.valid) {
      const updatedUser = {
        ...this.editUserForm.value, // Get the form values
        id: this.currentUser.id // Include the current user ID
      };
      
      // Call the service to update the user data
      this.usersService.updateUser(updatedUser.id, updatedUser).subscribe(() => {
        alert('User updated successfully'); // Show success message
      }, error => {
        // Handle error if unable to update user data
        this.errorMessage = 'Failed to update user data';
      });
    }

    // Navigate back to the home page after saving
    this.router.navigate(['']);
  }

  /**
   * Cancels the profile edit and navigates back to the home page.
   */
  onCancel(): void {
    console.log('Modification cancelled'); // Log cancellation action
    this.router.navigate(['']); // Redirect to the home page
  }
}
