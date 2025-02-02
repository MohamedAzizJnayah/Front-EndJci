import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-recherche',
  templateUrl: './recherche.component.html',
  styleUrls: ['./recherche.component.css']
})
export class RechercheComponent {
  searchQuery: string = ''; // Champ de recherche
  invites: any[] = []; // Liste des invités
  successMessage: string = ''; // Message de confirmation
  errorMessage: string = ''; // Message d'erreur
  loading: boolean = false; // État du loader

  constructor(private http: HttpClient) {}

  // Méthode pour récupérer les données
  fetchData() {
    const query = this.searchQuery;

    if (query) {
      this.http.get<any[]>(`http://localhost:8088/sheets/search?query=${query}`)
        .subscribe(data => {
          this.invites = data.map(item => ({
            cin: item[0],       // CIN
            nom: item[1],       // Nom
            email: item[2],     // Email
            telephone: item[3], // Téléphone
            paiement: item[4]   // Paiement
          }));
        }, error => {
          console.error('Erreur lors de la récupération des données', error);
        });
    } else {
      this.invites = [];
    }
  }

  // Méthode pour mettre à jour le paiement
  updatePaiement(cin: string) {
    this.loading = true; // Activation du loader
    const requestData = { paiement: 'Payé' };
  
    this.http.put(`http://localhost:8088/sheets/updatePaiement?cin=${cin}`, requestData, { responseType: 'text' })
      .subscribe(response => {
        console.log('Réponse de l’API:', response);
        
        this.successMessage = "Paiement confirmé avec succès !";
        
        setTimeout(() => {
          this.verifyPaiement(cin);
        }, 1000);
      }, error => {
        console.error('Erreur lors de la mise à jour du paiement', error);
        this.errorMessage = "Erreur lors du paiement. Veuillez réessayer.";
        this.loading = false; // Désactivation du loader en cas d'erreur
      });
  }

  // Vérifie si le paiement est bien mis à jour
  verifyPaiement(cin: string) {
    this.http.get<any[]>(`http://localhost:8088/sheets/search?query=${cin}`)
      .subscribe(data => {
        this.loading = false; // Désactiver le loader
        if (data.length > 0 && data[0][4] === 'Payé') {
          this.successMessage = "Paiement confirmé avec succès !";
          this.fetchData();
        } else {
          this.errorMessage = "Échec de la confirmation du paiement.";
        }
      }, error => {
        console.error('Erreur lors de la vérification du paiement', error);
        this.errorMessage = "Erreur lors de la vérification du paiement.";
        this.loading = false; // Désactivation du loader
      });
  }
}
