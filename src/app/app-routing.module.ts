import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { ReservationComponent } from './reservation/reservation.component';
import { RechercheComponent } from './recherche/recherche.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { SatisticComponent } from './satistic/satistic.component';


const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'reservation', component: ReservationComponent },
  { path: 'recherche', component: RechercheComponent },
  { path: 'sidebar', component: SidebarComponent },
  { path: 'statistic', component: SatisticComponent },
  
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
