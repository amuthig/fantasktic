import { Component } from '@angular/core';
import { KanbanComponent } from '../kanban/kanban.component';

@Component({
  selector: 'app-home',
  imports: [KanbanComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {

}
