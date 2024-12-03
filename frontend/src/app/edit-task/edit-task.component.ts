import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatOptionModule, provideNativeDateAdapter } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { UsersService } from '../users.service';
import { TasksService } from '../task.service';

@Component({
  selector: 'app-edit-task',
  standalone: true,
  providers: [provideNativeDateAdapter()],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatButtonModule,
    MatInputModule, 
    MatFormFieldModule, 
    MatOptionModule, 
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule
  ],
  templateUrl: './edit-task.component.html',
  styleUrls: ['./edit-task.component.css'],
})
export class EditTaskComponent implements OnInit {
  editTaskForm: FormGroup;
  users: any[] = [];

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<EditTaskComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private usersService: UsersService,
    private tasksService: TasksService
  ) {
    this.editTaskForm = this.fb.group({
      title: [data.title],
      description: [data.description],
      stage: [data.stage],
      user_id: [data.user_id],
      deadline: [data.deadline]
    });
  }

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.usersService.getUsers().subscribe(users => {
      this.users = users;
    });
  }

  onSave(): void {
    if (this.editTaskForm.valid) {
      const updatedTask = {
        ...this.editTaskForm.value,
        id: this.data.id
      };
      this.tasksService.updateTask(updatedTask.id, updatedTask).subscribe(() => {
        this.dialogRef.close(updatedTask);
      });
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}