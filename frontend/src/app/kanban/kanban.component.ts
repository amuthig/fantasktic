import { Component } from '@angular/core';
import { NgFor } from '@angular/common';
import { DragDropModule } from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-kanban',
  standalone: true,
  imports: [NgFor, DragDropModule],
  templateUrl: './kanban.component.html',
  styleUrls: ['./kanban.component.css'],
})
export class KanbanComponent {
  columns = [
    { title: 'Backlog', tasks: ['Task 1', 'Task 2', 'Task 3'] },
    { title: 'In Progress', tasks: ['Task 4', 'Task 5'] },
    { title: 'Review', tasks: ['Task 6'] },
    { title: 'Done', tasks: ['Task 7', 'Task 8'] },
  ];

  get columnTitles(): string[] {
    return this.columns.map((c) => c.title);
  }

  onDrop(event: any, column: any): void {
    // Cette ligne détermine si la tâche est déplacée d'une autre colonne
    const previousColumn = event.previousContainer.data;
    const currentColumn = column.tasks;

    // Si la tâche est déplacée d'une colonne à une autre
    if (event.previousContainer !== event.container) {
      // Retirer la tâche de la colonne d'origine
      const task = previousColumn.splice(event.previousIndex, 1)[0];
      // Ajouter la tâche dans la nouvelle colonne
      currentColumn.splice(event.currentIndex, 0, task);
    }
  }
}

