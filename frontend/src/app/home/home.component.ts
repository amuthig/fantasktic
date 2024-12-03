import { Component } from '@angular/core';
import { FilterTasksComponent } from '../filter-tasks/filter-tasks.component';
import { KanbanComponent } from '../kanban/kanban.component';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  standalone: true,
  imports: [FilterTasksComponent, KanbanComponent]
})
export class HomeComponent {
  filters: any = {};

  onFiltersChanged(filters: any): void {
    this.filters = filters;
  }
}