import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-reservation',
  templateUrl: './reservation.component.html',
  styleUrls: ['./reservation.component.css']
})
export class ReservationComponent {
  formData = {
    cin: '',
    nom: '',
    prenom: '',
    tel: '',
    olm: '',
    paiement: ''
  };

  apiUrl = 'http://localhost:8088/sheets/write'; // URL de l'API
  showSuccessMessage = false; // Ajout de la propriété pour afficher l'alerte

  constructor(private http: HttpClient) {} // Injection de HttpClient

  onSubmit(form: any) {
    if (form.valid) {
      console.log('Formulaire soumis', this.formData);

      // Création de l'objet JSON au format attendu
      const requestBody = {
        values: [[
          this.formData.cin,
          `${this.formData.nom} ${this.formData.prenom}`, // Concaténer Nom et Prénom avec un espace
          this.formData.tel,
          this.formData.olm,
          this.formData.paiement
        ]]
      };

      // Envoi des données avec HttpClient
      this.http.post(this.apiUrl, requestBody, { responseType: 'text' }).subscribe(
        (response) => {
          console.log('Données envoyées avec succès', response);

          if (response.includes('Données écrites avec succès')) { 
            this.showSuccessMessage = true; // Afficher l'alerte avec animation
            setTimeout(() => {
              window.location.reload(); // Recharger la page après 2 secondes
            }, 2000);
          }
        },
        (error) => {
          console.error("Erreur lors de l'envoi des données", error);
          alert('Une erreur est survenue. Veuillez réessayer.');
        }
      );
    }
  }

  // Fonction pour fermer l'alerte manuellement
  closeAlert() {
    this.showSuccessMessage = false;
    window.location.reload();
  }
}
