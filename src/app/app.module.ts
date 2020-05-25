import { BrowserModule } from '@angular/platform-browser';
import { NgModule, APP_INITIALIZER } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MetarComponent } from './metar/metar.component';
import { MetarService } from './metar.service';
import { HttpClientModule } from '@angular/common/http';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations'
import { TableModule } from 'primeng/table';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { ButtonModule } from 'primeng/button';
import { CalendarModule } from 'primeng/calendar';
import { FormsModule } from '@angular/forms';
import { TabViewModule } from 'primeng/tabview';
import { InputTextModule } from 'primeng/inputtext';

import { DatePipe } from '@angular/common';
import { ConfigService, configServiceLoadConfig } from './config/config.service';
import { HomeComponent } from './home/home.component';

@NgModule({
    declarations: [
        AppComponent,
        MetarComponent,
        HomeComponent
    ],
    imports: [
        BrowserModule,
        AppRoutingModule,
        HttpClientModule,
        FormsModule,

        BrowserAnimationsModule, TableModule, AutoCompleteModule, ButtonModule, CalendarModule, TabViewModule, InputTextModule,
    ],
    providers: [
        MetarService, DatePipe, ConfigService,
        { provide: APP_INITIALIZER, useFactory: configServiceLoadConfig, deps: [ConfigService], multi: true },

    ],
    bootstrap: [AppComponent]
})
export class AppModule { }
