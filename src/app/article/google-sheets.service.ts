import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})

export class GoogleSheetsService {
  private spreadsheetId = '1tEs9mOYUA0SZuNorY6HS5AEQv-zCiO5VABfpwDA3OUE'; // 試算表 ID
  private apiKey = 'AIzaSyCWlS3auqgd0wJaT8dTR2p_dXjA5kBkTjk'; // google API Key
  private baseUrl = 'https://sheets.googleapis.com/v4/spreadsheets';
  private appsScriptUrl = 'https://script.google.com/macros/s/AKfycbzwPYot9J9EbCdHrXH3X5MIVXmGfMgi0IUeiCgaemvxoHfZG0xa7akv3HLaSkT_f00K/exec'; // App Script URL
  constructor(private http: HttpClient) {}

  // 取得資料 (GET)
  getSheetData(sheetName: string): Observable<any> {
    const url = `${this.baseUrl}/${this.spreadsheetId}/values/${sheetName}?key=${this.apiKey}`;
    return this.http.get<any>(url).pipe(
      map(res => {
        const values = res.values;
        if (!values || values.length < 2) return [];

        const headers = values[0];
        const rows = values.slice(1);

        return rows.map((row: string[]) => {
          const obj: any = {};
          headers.forEach((h: string, i: number) => {
            obj[h] = row[i] ?? null; // 沒值就填 null
          });
          return obj;
        });
      })
    );
  }

  addArticleViaAppsScript(payload: {
    id: string | number;
    title: string;
    author: string;
    createdAt: string; // e.g. '2025/08/21'
    content?: string;
    tags?: string[];
    status?: string;
    sheetName?: string;
  }): Observable<any> {
    const form = new FormData();
    form.append('spreadsheetId', this.spreadsheetId);
    form.append('sheetName', payload.sheetName ?? 'article');
    form.append('id', String(payload.id));
    form.append('title', payload.title);
    form.append('author', payload.author);
    form.append('createdAt', payload.createdAt);
    form.append('content', payload.content ?? '');
    form.append('tags', JSON.stringify(payload.tags));
    form.append('status', payload.status ?? 'draft');

    return this.http.post(this.appsScriptUrl, form);
  }

  deleteArticleViaAppsScript(payload: {
    id: string | number;
    sheetName?: string;
  }): Observable<any> {
    const form = new FormData();
    form.append('action', 'delete');
    form.append('spreadsheetId', this.spreadsheetId);
    form.append('sheetName', payload.sheetName ?? 'article');
    form.append('id', String(payload.id));

    return this.http.post(this.appsScriptUrl, form);
  }

}
