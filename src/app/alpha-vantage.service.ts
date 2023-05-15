import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AlphaVantageService {


  private readonly API_URL = 'https://www.alphavantage.co/query';
  private readonly API_KEY = environment.apiAlphaVantageKey;

  constructor(private http: HttpClient) {}

  getStockDetails(symbol: string): Observable<any> {
    const url = `${this.API_URL}?function=TIME_SERIES_DAILY_ADJUSTED&symbol=${symbol}&apikey=${this.API_KEY}`;
    return this.http.get<any>(url);
  }
  
}
