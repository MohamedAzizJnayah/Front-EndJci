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
  chartData: any;
  chartOptions: any;
  barChartData: any;
  barChartOptions: any;

  // Variable pour gérer les erreurs
  errorMessage: string = '';

  constructor(private http: HttpClient) { }

  ngOnInit(): void {
    this.http.get<any[]>('http://localhost:8088/sheets/read').subscribe(
      data => {
        this.invites = data;
        this.calculateStatistics();
        this.initializeChart();  // Initialisation du graphique après récupération des données
        this.initializeBarChart();  // Initialisation du graphique à barres
      },
      error => {
        this.errorMessage = 'Erreur lors de la récupération des données. Veuillez réessayer plus tard.';
      }
    );
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

  // Initialiser les données et options du graphique à camembert
  initializeChart(): void {
    this.chartData = {
      labels: ['Payés', 'Non Payés'],
      datasets: [{
        data: [this.paidInvites, this.unpaidInvites],
        backgroundColor: ['#42A5F5', '#FF7043'],
        hoverBackgroundColor: ['#64B5F6', '#FF8A65']
      }]
    };
  
    this.chartOptions = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'top',
        },
        tooltip: {
          callbacks: {
            label: (tooltipItem: any) => {
              return tooltipItem.raw + ' invités';
            }
          }
        }
      },
      animation: {
        duration: 1000,
        easing: 'easeOutQuart',
        animateScale: true,
        animateRotate: true
      }
    };
  }

  // Initialiser les données et options du graphique à barres (bar chart)
  initializeBarChart(): void {
    this.barChartData = {
      labels: Object.keys(this.invitesGroupedByOlm), // Liste des OLM
      datasets: [{
        data: Object.values(this.invitesGroupedByOlm).map(invites => invites.length), // Nombre d'invités par OLM
        backgroundColor: '#42A5F5',  // Couleur des barres
        hoverBackgroundColor: '#64B5F6'  // Couleur de survol
      }]
    };

    this.barChartOptions = {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        x: {
          title: {
            display: true,
            text: 'OLM' // Légende de l'axe X
          }
        },
        y: {
          title: {
            display: true,
            text: 'Nombre d\'invités' // Légende de l'axe Y
          },
          beginAtZero: true // Commencer l'axe Y à zéro
        }
      },
      plugins: {
        legend: {
          position: 'top', // Position de la légende
        },
        tooltip: {
          callbacks: {
            label: (tooltipItem: any) => {
              return tooltipItem.raw + ' invités';
            }
          }
        }
      },
      animation: {
        duration: 1000,  // Temps de l'animation
        easing: 'easeOutQuart',  // Effet de l'animation
        animateScale: true,  // Animation de l'échelle
        animateRotate: true  // Animation de la rotation
      }
    };
  }
}
