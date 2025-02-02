import { Component } from '@angular/core';

@Component({
  selector: 'app-recherche',
  templateUrl: './recherche.component.html',
  styleUrls: ['./recherche.component.css']
})
export class RechercheComponent {
  searchQuery: string = ''; // Variable liée à l'entrée de recherche
  invités = [              // Exemple de liste d'invités
    { nom: 'John Doe', email: 'john@example.com' },
    { nom: 'Jane Smith', email: 'jane@example.com' },
    { nom: 'Mohamed Aziz', email: 'aziz@example.com' },
    { nom: 'Sophie Martin', email: 'sophie@example.com' }
  ];

  get filteredInvites() {
    return this.invités.filter(invité => 
      invité.nom.toLowerCase().includes(this.searchQuery.toLowerCase())
    );
  }
}
