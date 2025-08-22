import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface DocumentModel {
  id: number; // ✅ obligatoire
  numero_dossier: string;
  numero_carton: string;
  modele: string;
  states?: any[];
}

@Injectable({
  providedIn: 'root'
})
export class DocumentService {
  private apiUrl = 'http://127.0.0.1:5000/api/documents';

  constructor(private http: HttpClient) {}

  addDocument(document: DocumentModel): Observable<DocumentModel> {
    return this.http.post<DocumentModel>(this.apiUrl, document);
  }

  getDocuments(): Observable<DocumentModel[]> {
    return this.http.get<DocumentModel[]>(this.apiUrl);
  }

  updateDocument(id: number, document: DocumentModel): Observable<DocumentModel> {
    return this.http.put<DocumentModel>(`${this.apiUrl}/${id}`, document);
  }

  deleteDocument(id: number): Observable<any> {  // ✅ méthode delete
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}
