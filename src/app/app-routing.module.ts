import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MetarComponent } from './metar/metar.component';


const routes: Routes = [
    { path: 'metar', component: MetarComponent },
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule { }
