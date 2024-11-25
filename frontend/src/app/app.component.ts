import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from "./components/navbar/navbar.component";
import { FooterComponent } from "./components/footer/footer.component";
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, NavbarComponent, FooterComponent, CommonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'Find Me';
  showDisclaimer: boolean = true;

  ngOnInit(): void {
    setTimeout(() => {
      this.showDisclaimer = false;
    }, 15000);
  }

  dismissDisclaimer(): void {
    this.showDisclaimer = false;
  }
}
