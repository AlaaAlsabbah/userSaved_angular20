
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map, of } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ApiService {
  private baseUrl = 'http://localhost:3000';
  private isStaticMode = false;
  private staticData: any = null;

  constructor(private http: HttpClient) {
    // Check if running on GitHub Pages (static mode)
    this.isStaticMode = window.location.hostname.includes('github.io') || 
                        window.location.hostname.includes('github.com');
  }

  private loadStaticData(): Observable<Record<string, unknown>> {
    if (this.staticData) {
      return of(this.staticData);
    }
    return this.http.get<Record<string, unknown>>('assets/db.json').pipe(
      map((data: Record<string, unknown>) => {
        this.staticData = data;
        return data;
      })
    );
  }

  get<T>(endpoint: string): Observable<T> {
    if (this.isStaticMode) {
      return this.loadStaticData().pipe(
        map(data => data[endpoint] as T)
      );
    }
    return this.http.get<T>(`${this.baseUrl}/${endpoint}`);
  }

  post<T>(endpoint: string, data: any): Observable<T> {
    if (this.isStaticMode) {
      // In static mode, simulate a successful post by returning the data
      console.warn('POST operations are not supported in demo mode');
      return of(data as T);
    }
    return this.http.post<T>(`${this.baseUrl}/${endpoint}`, data);
  }

  put<T>(endpoint: string, id: number, data: any): Observable<T> {
    if (this.isStaticMode) {
      // In static mode, simulate a successful put by returning the data
      console.warn('PUT operations are not supported in demo mode');
      return of(data as T);
    }
    return this.http.put<T>(`${this.baseUrl}/${endpoint}/${id}`, data);
  }

  delete<T>(endpoint: string, id: number): Observable<T> {
    if (this.isStaticMode) {
      // In static mode, simulate a successful delete
      console.warn('DELETE operations are not supported in demo mode');
      return of({} as T);
    }
    return this.http.delete<T>(`${this.baseUrl}/${endpoint}/${id}`);
  }
}
