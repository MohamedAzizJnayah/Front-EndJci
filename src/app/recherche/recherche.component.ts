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
    if (!this.searchQuery.trim()) {
      this.invites = [];
      return;
    }

    this.http.get<any[]>(`http://localhost:8088/sheets/search?query=${this.searchQuery}`)
      .subscribe(
        data => {
          this.invites = data.map(item => ({
            cin: item[0],       // CIN
            nom: item[1],       // Nom
            email: item[2],     // Email
            telephone: item[3], // Téléphone
            paiement: item[4]   // Paiement
          }));
        },
        error => {
          console.error('Erreur lors de la récupération des données', error);
          this.errorMessage = "Erreur de connexion avec le serveur.";
        }
      );
  }

  // Méthode pour mettre à jour le paiement
  updatePaiement(cin: string) {
    this.loading = true;
    
    this.http.put(`http://localhost:8088/sheets/updatePaiement?cin=${cin}`, { paiement: 'Payé' }, { responseType: 'text' })
      .subscribe(
        response => {
          console.log('Réponse de l’API:', response);
          this.verifyPaiement(cin);
        },
        error => {
          console.error('Erreur lors de la mise à jour du paiement', error);
          this.errorMessage = "Erreur lors du paiement. Veuillez réessayer.";
          this.loading = false;
        }
      );
  }

  // Vérifie si le paiement est bien mis à jour
  verifyPaiement(cin: string) {
    setTimeout(() => {
      this.http.get<any[]>(`http://localhost:8088/sheets/search?query=${cin}`)
        .subscribe(
          data => {
            this.loading = false;
            if (data.length > 0 && data[0][4] === 'Payé') {
              this.successMessage = "Paiement confirmé avec succès !";
              this.fetchData();
            } else {
              this.errorMessage = "Échec de la confirmation du paiement.";
            }
          },
          error => {
            console.error('Erreur lors de la vérification du paiement', error);
            this.errorMessage = "Erreur lors de la vérification du paiement.";
            this.loading = false;
          }
        );
    }, 1000);
  }

  // Générer une page imprimable de la liste complète
  generatePrintablePage() {
    let printContent = `
      <html>
      <head>
        <title>Liste des Invités</title>
        <style>
          body { font-family: Arial, sans-serif; padding: 20px; }
          table { width: 100%; border-collapse: collapse; margin-top: 20px; }
          th, td { border: 1px solid #ddd; padding: 10px; text-align: left; }
          th { background-color: #007bff; color: white; }
          .paid { color: green; font-weight: bold; }
          .unpaid { color: red; font-weight: bold; }
        </style>
      </head>
      <body>
        <h2>Liste des invités</h2>
        <table>
          <tr><th>CIN</th><th>Nom</th><th>Email</th><th>Téléphone</th><th>Paiement</th></tr>
    `;
    
    this.invites.forEach(invite => {
      printContent += `
        <tr>
          <td>${invite.cin}</td>
          <td>${invite.nom}</td>
          <td>${invite.email}</td>
          <td>${invite.telephone}</td>
          <td class="${invite.paiement === 'Payé' ? 'paid' : 'unpaid'}">${invite.paiement}</td>
        </tr>
      `;
    });

    printContent += `</table></body></html>`;

    this.printContent(printContent);
  }

  // Générer une page imprimable pour un seul invité
  printInvite(invite: any) {
    let printContent = `<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Badge Invité - JCI Événement</title>
    <style>
        @page {
            size: 85.60mm 53.98mm;
            margin: 0;
        }
        body {
            font-family: "Arial", sans-serif;
            background-color: #f0f4f8;
            margin: 0;
            padding: 0;
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100vh;
            color: #333;
        }
        .badge-container {
            width: 85.60mm;
            height: 53.98mm;
            background: white;
            border-radius: 5px;
            box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
            padding: 5mm;
            text-align: center;
            border: 2px solid #007bff;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            box-sizing: border-box;
        }
        .badge-header {
            font-size: 12px;
            font-weight: bold;
            color: #007bff;
            margin-bottom: 5px;
            letter-spacing: 1px;
        }
        .jci-logo {
            width: 15mm;
            margin-bottom: 5px;
        }
        .badge-info p {
            font-size: 10px;
            color: #555;
            margin: 2px 0;
            line-height: 1.2;
        }
        .badge-status {
            padding: 4px;
            border-radius: 3px;
            font-weight: bold;
            display: inline-block;
            margin-top: 5px;
            font-size: 9px;
            text-transform: uppercase;
        }
        .paid {
            background: #28a745;
            color: white;
        }
        .unpaid {
            background: #dc3545;
            color: white;
        }
    </style>
</head>
<body>

    <div class="badge-container">
        <img src="assets/jci-eljem.ico" alt="JCI Logo" class="jci-logo">
        <div class="badge-header">JCI Événement</div>
        
        <div class="badge-info">
            <p><strong>CIN:</strong> ${invite.cin}</p>
            <p><strong>Nom:</strong> ${invite.nom}</p>
            <p><strong>OLM:</strong> ${invite.telephone}</p>
        </div>

        <div class="badge-status ${invite.paiement === 'Payé' ? 'paid' : 'unpaid'}">
            ${invite.paiement}
        </div>
    </div>

    <script>
        window.onload = function() {
            setTimeout(() => window.print(), 500);
            setTimeout(() => window.close(), 1500);
        };
    </script>

</body>
</html>
`;

    this.printContent(printContent);
}


  // Fonction pour ouvrir une nouvelle fenêtre et imprimer le contenu
  private printContent(content: string) {
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.open();
      printWindow.document.write(content);
      printWindow.document.close();
    }
  }
}
