import { Component } from '@angular/core';
import { NgbModal, NgbModalModule } from '@ng-bootstrap/ng-bootstrap';
import { AdminModalComponent } from '../components/admin-modal/admin-modal.component';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  imports: [FormsModule, CommonModule, NgbModalModule],
  styleUrls: ['./home.component.css']
})
export class HomeComponent {

  stateCodes: string[] = [
    "AL", "AK", "AZ", "AR", "CA", "CO", "CT", "DE", "FL", "GA",
    "HI", "ID", "IL", "IN", "IA", "KS", "KY", "LA", "ME", "MD",
    "MA", "MI", "MN", "MS", "MO", "MT", "NE", "NV", "NH", "NJ",
    "NM", "NY", "NC", "ND", "OH", "OK", "OR", "PA", "RI", "SC",
    "SD", "TN", "TX", "UT", "VT", "VA", "WA", "WV", "WI", "WY"
  ];

  quotes = [
    { text: "Privacy is not an option, and it shouldn't be the price we accept for just getting on the Internet.", author: "Gary Kovacs" },
    { text: "Arguing that you don't care about the right to privacy because you have nothing to hide is no different than saying you don't care about free speech because you have nothing to say.", author: "Edward Snowden" },
    { text: "If you don't protect your personal privacy, who will?", author: "Unknown" },
    { text: "We are rapidly entering the age of no privacy, where everyone is open to surveillance at all times.", author: "William O. Douglas" },
    { text: "Our own information is being weaponized against us with military efficiency.", author: "Tim Cook" },
    { text: "Once you've lost your privacy, you realize you've lost an extremely valuable thing.", author: "Billy Graham" }
  ];
  
  firstName: string = '';
  lastName: string = '';
  state: string = '';
  receivedData: any;
  currentQuoteIndex = 0;

  constructor(private modalService: NgbModal) {
    setInterval(() => {
      this.currentQuoteIndex = (this.currentQuoteIndex + 1) % this.quotes.length;
    }, 6500);
  }

  getPercentageColor(probability: number): string {
    const percentage = probability * 100;
  
    if (percentage < 40) {
      return 'text-danger';
    } else if (percentage >= 40 && percentage <= 70) {
      return 'text-warning';
    } else {
      return 'text-success';
    }
  }

  onSubmit() {
    if (this.firstName && this.lastName && this.state) {
      this.openAdminModal();
    } else {
      console.log('Form is invalid. Please correct the errors.');
    }
  }

  openAdminModal() {
    const modalRef = this.modalService.open(AdminModalComponent, { centered: true });

    modalRef.componentInstance.firstName = this.firstName;
    modalRef.componentInstance.lastName = this.lastName;
    modalRef.componentInstance.state = this.state;

    modalRef.componentInstance.data.subscribe((data: any) => {
      this.receivedData = data;
    });
  }
  
}
