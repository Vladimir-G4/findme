import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { environment } from '../../../environments/environment';
import { FetchDataService } from '../../services/fetchData.service';
import { catchError, map, switchMap, finalize } from 'rxjs/operators';
import { of } from 'rxjs';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-admin-modal',
  templateUrl: './admin-modal.component.html',
  styleUrls: ['./admin-modal.component.css'],
  imports: [FormsModule, CommonModule],
})
export class AdminModalComponent {
  @Input() firstName: string = '';
  @Input() lastName: string = '';
  @Input() state: string = '';
  @Output() data = new EventEmitter<any>();
  adminPassword: string = '';
  passwordInvalid: boolean = false;
  isLoading: boolean = false;

  constructor(public activeModal: NgbActiveModal, private fetchDataService: FetchDataService) {}

  private validatePassword(): boolean {
    return this.adminPassword === environment.ADMIN_PASS;
  }

  private fetchData(): void {
    if (!this.validatePassword()) {
      this.handlePasswordError();
      return;
    }

    this.isLoading = true;

    this.fetchDataService
      .fetchPeopleSearch(this.firstName, this.lastName, this.state)
      .pipe(
        switchMap((peopleSearchData) =>
          this.fetchDataService.getVoterRecord(
            this.firstName,
            this.lastName,
            this.state
          ).pipe(map((voterData) => ({ peopleSearchData, voterData })))
        ),
        switchMap(({ peopleSearchData, voterData }) =>
          this.fetchDataService.getPredictions(this.firstName, this.lastName).pipe(
            map((predictions) => ({
              peopleSearchData,
              voterData,
              genderPrediction: predictions.gender,
              genderProbability: predictions.genderProbability,
              nationalityPredictions: predictions.nationality,
            }))
          )
        ),
        catchError((error) => {
          this.handleError(error);
          return of(null);
        }),
        finalize(() => {
          this.isLoading = false;
        })
      )
      .subscribe(
        (info) => {
          if (info) {
            console.log(info)
            this.data.emit(info);
            this.activeModal.close();
          }
        },
        (error) => {
          console.error('Subscription error:', error);
        }
      );
  }

  private handlePasswordError(): void {
    this.passwordInvalid = true;
    setTimeout(() => (this.passwordInvalid = false), 2000);
  }

  private handleError(error: any): void {
    console.error('Error during data fetching:', error);
    alert('Failed to fetch data. Please try again later.');
  }

  runSearch(): void {
    if (this.isLoading) return;
    this.fetchData();
  }
}