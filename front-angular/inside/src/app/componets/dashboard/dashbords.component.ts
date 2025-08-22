import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { DocumentService, DocumentModel } from '../../services/document.service';

@Component({
  selector: 'app-dashbords',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './dashbords.component.html',
  styleUrls: ['./dashbords.component.css']
})
export class DashbordsComponent implements OnInit {
  searchQuery: string = '';
  documents: DocumentModel[] = [];
  filteredDocuments: DocumentModel[] = [];
  isLoading = false;
  errorMessage = '';
  
  stats = [
    { icon: 'folder', count: 0, label: 'Documents', color: 'primary' },
    { icon: 'boxes', count: 0, label: 'Cartons', color: 'success' },
    { icon: 'microchip', count: 0, label: 'Modèles', color: 'info' },
    { icon: 'chart-bar', count: 0, label: 'États', color: 'warning' }
  ];

  constructor(private router: Router, private documentService: DocumentService) {}

  ngOnInit(): void {
    this.loadDocuments();
  }

  loadDocuments(): void {
    this.isLoading = true;
    this.errorMessage = '';
    
    this.documentService.getDocuments().subscribe({
      next: (docs) => {
        this.documents = docs || [];
        this.filteredDocuments = [...this.documents];
        this.updateStats();
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Erreur lors du chargement des documents:', err);
        this.errorMessage = 'Erreur lors du chargement des documents. Veuillez réessayer.';
        this.documents = [];
        this.filteredDocuments = [];
        this.updateStats();
        this.isLoading = false;
      }
    });
  }

  updateStats(): void {
    this.stats[0].count = this.documents.length;
    this.stats[1].count = new Set(this.documents.map(d => d.numero_carton || '')).size;
    this.stats[2].count = new Set(this.documents.map(d => d.modele || '')).size;
    this.stats[3].count = this.documents.reduce((sum, d) => sum + (d.states?.length || 0), 0);
  }

  onSearch(): void {
    if (!this.searchQuery.trim()) {
      this.filteredDocuments = [...this.documents];
    } else {
      const query = this.searchQuery.toLowerCase();
      this.filteredDocuments = this.documents.filter(doc => 
        (doc.numero_dossier?.toLowerCase() || '').includes(query) ||
        (doc.numero_carton?.toLowerCase() || '').includes(query) ||
        (doc.modele?.toLowerCase() || '').includes(query)
      );
    }
  }

  clearSearch(): void {
    this.searchQuery = '';
    this.filteredDocuments = [...this.documents];
  }

  editDocument(id: number): void {
    this.router.navigate(['/edit-document', id]);
  }

  deleteDocument(id: number): void {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce document ?')) {
      this.documentService.deleteDocument(id).subscribe({
        next: () => {
          this.loadDocuments();
        },
        error: (err) => {
          console.error('Erreur lors de la suppression:', err);
          alert('Erreur lors de la suppression du document');
        }
      });
    }
  }

  refreshData(): void {
    this.loadDocuments();
  }
}
