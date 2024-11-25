import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, forkJoin, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class FetchDataService {
  private apiUrl = 'http://localhost:3000/api';

  constructor(private http: HttpClient) {}

  private buildFullName(firstName: string, lastName: string): string {
    return encodeURIComponent(`${firstName} ${lastName}`);
  }

  private fetchFromApi<T>(url: string): Observable<T> {
    return this.http.get<T>(url);
  }

  private fetchGender(firstName: string, lastName: string): Observable<{ gender: string | null; probability: number | null }> {
    const fullName = this.buildFullName(firstName, lastName);
    const url = `https://api.genderize.io/?name=${fullName}&country_id=US`;
    return this.fetchFromApi<any>(url).pipe(
      map((response) => ({
        gender: response?.gender ?? null,
        probability: response?.probability ?? null,
      }))
    );
  }

  private fetchNationality(firstName: string, lastName: string): Observable<{ country: string | null; probability: number | null }> {
    const fullName = this.buildFullName(firstName, lastName);
    const url = `https://api.nationalize.io/?name=${fullName}`;
    return this.fetchFromApi<any>(url).pipe(
      map((response) => {
        if (!response?.country) return { country: null, probability: null };

        const highestProbability = response.country.reduce(
          (highest: { country_id: string | null; probability: number }, current: { country_id: string; probability: number }) =>
            current.probability > highest.probability ? current : highest,
          { country_id: null, probability: 0 }
        );

        return {
          country: highestProbability.country_id ?? null,
          probability: highestProbability.probability ?? null,
        };
      })
    );
  }

  getPredictions(firstName: string, lastName: string): Observable<any> {
    return forkJoin({
      genderData: this.fetchGender(firstName, lastName),
      nationalityData: this.fetchNationality(firstName, lastName),
    }).pipe(
      map(({ genderData, nationalityData }) => ({
        gender: genderData.gender,
        genderProbability: genderData.probability,
        nationality: nationalityData ? [{ country: nationalityData.country, probability: nationalityData.probability }] : [],
      }))
    );
  }

  getVoterRecord(firstName: string, lastName: string, state: string): Observable<any[]> {
    const url = `${this.apiUrl}/voter-record`;

    return this.http.post<any[]>(url, { firstName, lastName, state }).pipe(
      catchError((error) => {
        console.error('Error fetching voter record:', error);
        return of([]);
      })
    );
  }

  fetchPeopleSearch(firstName: string, lastName: string, state: string): Observable<any> {
    const url = `${this.apiUrl}/people-search`;

    return this.http.post<any[]>(url, { firstName, lastName, state }).pipe(
      catchError((error) => {
        console.error('Error fetching people search results:', error);
        return of({
          addresses: [],
          relatives: [],
          emails: [],
          phoneNumbers: [],
          socialProfiles: [],
        });
      })
    );
  }
}

