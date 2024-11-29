import { Component } from '@angular/core';
import { MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { TasksService } from '../task.service';

@Component({
  selector: 'app-add-task',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatInputModule,
    MatFormFieldModule,
    MatDialogModule
  ],
  templateUrl: './add-task.component.html',
  styleUrls: ['./add-task.component.css']
})
export class AddTaskComponent {
  addTaskForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<AddTaskComponent>,
    private tasksService: TasksService
  ) {
    this.addTaskForm = this.fb.group({
      title: [''],
      description: [''],
      stage: [0] // Par défaut, la tâche est ajoutée au backlog
    });
  }

  onSave(): void {
    if (this.addTaskForm.valid) {
      const newTask: any = this.addTaskForm.value;
      console.log(newTask);
      this.tasksService.addTask(newTask).subscribe((task: any) => {
        this.dialogRef.close(task);
      });
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}