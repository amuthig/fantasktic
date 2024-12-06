import { Component, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';

@Component({
  selector: 'app-filter-tasks', // Component selector used to reference the component in the template
  standalone: true, // This component is standalone, so it doesn't need a parent module
  imports: [
    CommonModule, // Imports common Angular modules like NgIf, NgFor
    ReactiveFormsModule, // For reactive forms
    MatButtonModule, // Material button
    MatInputModule, // Material input field
    MatFormFieldModule, // Material form field wrapper
    MatSelectModule, // Material select input (dropdown)
    MatOptionModule // Material options for the select
  ],
  templateUrl: './filter-tasks.component.html', // Path to the HTML template
  styleUrls: ['./filter-tasks.component.css'] // Path to the component's CSS
})
export class FilterTasksComponent {
  @Output() filtersChanged = new EventEmitter<any>(); // Emits filter changes to the parent component

  filterForm: FormGroup; // Holds the form group for the filters

  constructor(private fb: FormBuilder) {
    // Initialize the form with two fields: assignee (optional) and daysUntilDeadline (numeric with a minimum value of 0)
    this.filterForm = this.fb.group({
      assignee: [''], // Assignee field, initially empty
      daysUntilDeadline: ['', [Validators.min(0)]] // Deadline filter, must be a positive number or zero
    });
  }

  /**
   * Emits the current form values to the parent component whenever filters are applied.
   */
  applyFilters(): void {
    if (this.filterForm.valid) {
      this.filtersChanged.emit(this.filterForm.value); // Emit the current filter values if form is valid
    }
  }

  /**
   * Lifecycle hook that is triggered when the component is initialized.
   * It applies the default filters when the component is loaded.
   */
  ngOnInit(): void {
    this.resetFilters(); // Apply default filters when the page loads
  }

  /**
   * Resets the filter form to its default state and emits the reset filter values.
   */
  resetFilters(): void {
    this.filterForm.reset(); // Reset the form to default values
    this.filtersChanged.emit(this.filterForm.value); // Emit the reset filter values to the parent component
  }
}
