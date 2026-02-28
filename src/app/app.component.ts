import { Component } from '@angular/core';
import { AvatarPageComponent } from './avatar-page/avatar-page.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [AvatarPageComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'frontend';
}
