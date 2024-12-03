import { Component, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';

@Component({
  selector: 'app-filter-tasks',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatInputModule,
    MatFormFieldModule,
    MatSelectModule,
    MatOptionModule
  ],
  templateUrl: './filter-tasks.component.html',
  styleUrls: ['./filter-tasks.component.css']
})
export class FilterTasksComponent {
  @Output() filtersChanged = new EventEmitter<any>();

  filterForm: FormGroup;

  constructor(private fb: FormBuilder) {
    this.filterForm = this.fb.group({
      assignee: [''],
      daysUntilDeadline: ['']
    });
  }

  applyFilters(): void {
    this.filtersChanged.emit(this.filterForm.value);
  }

  resetFilters(): void {
    this.filterForm.reset();
    this.filtersChanged.emit(this.filterForm.value);
  }
}