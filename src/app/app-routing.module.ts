import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MetarComponent } from './metar/metar.component';
import { HomeComponent } from './home/home.component';


const routes: Routes = [
    { path: '', component: HomeComponent },
    { path: 'metar', component: MetarComponent },
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule { }
