import { Component, OnInit, Inject, ChangeDetectionStrategy } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule, provideNativeDateAdapter } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { TasksService } from '../task.service';
import { UsersService } from '../users.service';
import { MatDialogActions } from '@angular/material/dialog';
import { MatDialogContent } from '@angular/material/dialog';

interface User {
  id: string;
  username: string;
}

@Component({
  selector: 'app-add-task',
  standalone: true,
  providers: [provideNativeDateAdapter()],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatInputModule,
    MatFormFieldModule,
    MatSelectModule,
    MatOptionModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatDialogActions,
    MatDialogContent
  ],
  templateUrl: './add-task.component.html',
  styleUrls: ['./add-task.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AddTaskComponent implements OnInit {
  addTaskForm: FormGroup;
  users: User[] = [];
  isSaving = false; // Ajout d'un indicateur pour éviter les doublons

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<AddTaskComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any, // Injecter les données passées
    private tasksService: TasksService,
    private usersService: UsersService
  ) {
    this.addTaskForm = this.fb.group({
      title: ['', Validators.required],
      description: ['', Validators.required],
      user_id: ['', Validators.required],
      deadline: [null, Validators.required] // Datepicker field
    });
  }

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.usersService.getUsers().subscribe({
      next: (users: User[]) => (this.users = users),
      error: (err) => console.error('Error fetching users:', err)
    });
  }

  onSave(): void {
    if (this.addTaskForm.valid && !this.isSaving) {
      console.log('Saving task...'); // Log pour vérifier l'appel
      this.isSaving = true; // Empêcher les doublons
      const newTask = {
        ...this.addTaskForm.value,
        deadline: this.formatDate(this.addTaskForm.value.deadline), // Formater la date correctement
        stage: this.data.stage, // Utiliser la valeur de stage passée en paramètre
        createdById: null // Ajouter l'ID de l'utilisateur créateur si nécessaire
      };
      this.tasksService.addTask(newTask).subscribe({
        next: (task) => {
          console.log('Task saved:', task); // Log pour vérifier la sauvegarde
          this.isSaving = false; // Réinitialiser l'indicateur
          this.dialogRef.close(task);
        },
        error: (err) => {
          this.isSaving = false; // Réinitialiser l'indicateur en cas d'erreur
          console.error('Error saving task:', err);
        }
      });
    }
  }

  formatDate(date: Date): string {
    const d = new Date(date);
    let month = '' + (d.getMonth() + 1);
    let day = '' + d.getDate();
    const year = d.getFullYear();

    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;

    return [year, month, day].join('-');
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}