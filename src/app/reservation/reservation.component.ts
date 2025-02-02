import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';  // Importation du Router pour la redirection

@Component({
  selector: 'app-reservation',
  templateUrl: './reservation.component.html',
  styleUrls: ['./reservation.component.css']
})
export class ReservationComponent {formData = {
  cin: '',
  nom: '',
  prenom: '',
  tel: '',
  olm: '',
  paiement: '',
};

onSubmit(form: any) {
  if (form.valid) {
    console.log('Formulaire soumis', this.formData);
    // Traitement de l'inscription (par exemple, appel d'un service API)
  }
}}
