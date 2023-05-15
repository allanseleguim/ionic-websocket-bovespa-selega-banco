import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class FinnHubService {

  private readonly API_URL = 'https://finnhub.io/api/v1';
  private readonly API_KEY =  environment.apiFinnHunKey;

  constructor(private http: HttpClient) { }

  searchSymbols(query: string): Observable<any> {
    const url = `${this.API_URL}/search?q=${query}&token=${this.API_KEY}`;
    return this.http.get<any>(url).pipe(
      map(result => result.result)
    );
  }
}
