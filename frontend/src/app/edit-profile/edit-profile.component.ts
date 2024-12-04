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
  editUserForm: FormGroup;
  errorMessage: string | null = null;
  currentUser: any;

  constructor(
    private fb: FormBuilder,
    private usersService: UsersService, 
    private router: Router
  ) {
    this.editUserForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      firstName: ['', Validators.required],
      lastName: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.loadCurrentUser();
  }

  loadCurrentUser(): void {
    this.usersService.getCurrentUser().subscribe(user => {
      this.currentUser = user;
      this.editUserForm.patchValue({
        username: user.username,
        password: user.password,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName
      });
    }, error => {
      this.errorMessage = 'Failed to load user data';
    });
  }

  onSave(): void {
    if (this.editUserForm.valid) {
      const updatedUser = {
        ...this.editUserForm.value,
        id: this.currentUser.id
      };
      this.usersService.updateUser(updatedUser.id, updatedUser).subscribe(() => {
        alert('User updated successfully');
      }, error => {
        this.errorMessage = 'Failed to update user data';
      });
    }

    this.router.navigate(['']);
  }

  onCancel(): void {
    console.log('Modification annulée');
    this.router.navigate(['']);
  }
}