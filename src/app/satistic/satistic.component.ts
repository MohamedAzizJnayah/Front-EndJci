// satistic.component.ts
import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-satistic',
  templateUrl: './satistic.component.html',
  styleUrls: ['./satistic.component.css']
})
export class SatisticComponent implements OnInit {

  invites: any[] = [];
  totalInvites: number = 0;
  paidInvites: number = 0;
  unpaidInvites: number = 0;
  invitesGroupedByOlm: { [key: string]: any[] } = {};  // Déclaration correcte

  constructor(private http: HttpClient) { }

  ngOnInit(): void {
    this.http.get<any[]>('http://localhost:8088/sheets/read').subscribe(data => {
      this.invites = data;
      this.calculateStatistics();
    });
  }

  calculateStatistics(): void {
    this.totalInvites = this.invites.length;
    this.paidInvites = this.invites.filter(invite => invite[4] === 'Payé').length;
    this.unpaidInvites = this.totalInvites - this.paidInvites;

    // Regroupement par OLM (ville)
    this.invitesGroupedByOlm = this.invites.reduce((acc, invite) => {
      const olm = invite[3]; // OLM est dans la colonne 3 (index 3)
      if (!acc[olm]) {
        acc[olm] = [];
      }
      acc[olm].push(invite);
      return acc;
    }, {}); // Initialisation d'un objet vide
  }

  // Getter pour Object.keys
  get olmKeys(): string[] {
    return Object.keys(this.invitesGroupedByOlm);
  }
}
