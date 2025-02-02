import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { ReservationComponent } from './reservation/reservation.component';
import { RechercheComponent } from './recherche/recherche.component';
import { SidebarComponent } from './sidebar/sidebar.component';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'reservation', component: ReservationComponent },
  { path: 'recherche', component: RechercheComponent },
  { path: 'sidebar', component: SidebarComponent },
];;

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
