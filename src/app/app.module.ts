import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { HttpClientModule } from '@angular/common/http';
import { ReservationComponent } from './reservation/reservation.component';
import { RechercheComponent } from './recherche/recherche.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { SatisticComponent } from './satistic/satistic.component'; // Corrected import
import { ChartModule } from 'primeng/chart';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    ReservationComponent,
    RechercheComponent,
    SidebarComponent,
    SatisticComponent // Corrected declaration
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    RouterModule,
    ReactiveFormsModule,
    FormsModule,
    ChartModule
    
   
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }