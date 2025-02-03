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
    let printContent = `
     <!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Badge Invité - JCI Événement</title>
    <style>
        body {
            font-family: "Arial", sans-serif;
            background-color: #f5f5f5;
            padding: 20px;
            text-align: center;
        }
        .badge-container {
            width: 300px;
            margin: auto;
            background: white;
            border-radius: 15px;
            box-shadow: 0 4px 10px rgba(0, 0, 0, 0.15);
            padding: 20px;
            text-align: center;
            border-top: 5px solid #007bff;
        }
        .badge-header {
            font-size: 18px;
            font-weight: bold;
            color: #007bff;
            margin-bottom: 10px;
        }
        .jci-logo {
            width: 80px;
            margin-bottom: 10px;
        }
        .badge-info p {
            font-size: 16px;
            color: #333;
            margin: 5px 0;
        }
        .badge-status {
            padding: 8px;
            border-radius: 5px;
            font-weight: bold;
            display: inline-block;
            margin-top: 10px;
            font-size: 14px;
        }
        .paid {
            background: #28a745;
            color: white;
        }
        .unpaid {
            background: #dc3545;
            color: white;
        }
        .print-btn {
            margin-top: 15px;
            padding: 10px 15px;
            font-size: 16px;
            color: white;
            background: #007bff;
            border: none;
            border-radius: 5px;
            cursor: pointer;
        }
        .print-btn:hover {
            background: #0056b3;
        }
    </style>
</head>
<body>

    <div class="badge-container">
        <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/6/60/JCI_Logo.png/120px-JCI_Logo.png" alt="JCI Logo" class="jci-logo">
        <div class="badge-header">JCI Événement</div>
        
        <div class="badge-info">
            <p><strong>CIN:</strong> ${invite.cin}</p>
            <p><strong>Nom:</strong> ${invite.nom}</p>
            <p><strong>Email:</strong> ${invite.email}</p>
            <p><strong>Téléphone:</strong> ${invite.telephone}</p>
            <p class="badge-status ${invite.paiement === 'Payé' ? 'paid' : 'unpaid'}">
                ${invite.paiement}
            </p>
        </div>
        
        <button class="print-btn" onclick="window.print();">🖨️ Imprimer</button>
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
