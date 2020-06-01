import { Injectable } from '@angular/core';

import { catchError, map } from 'rxjs/operators';
import { HttpClient, HttpErrorResponse, HttpHeaders, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';
import { DatePipe } from '@angular/common';
import { MetarStationIdMv } from '../model/metar_station_id_mv';
import { ConfigService } from '../config/config.service';
import { ApplicationProperties } from '../config/application.properties';

@Injectable()
export class MetarStationIdMvService {
    readonly serviceUrl: string;

    constructor(
        private configService: ConfigService,
        private httpClient: HttpClient,
        private datePipe: DatePipe
    ) {
        const applicationProperties: ApplicationProperties = this.configService.getApplicationProperties();
        this.serviceUrl = applicationProperties.serviceUrl;
    }

    getStationIds(): Observable<Array<MetarStationIdMv>> {
        let url: string = `${this.serviceUrl}/getStationIds`;
        console.log(url);
        return this.httpClient.get<Array<MetarStationIdMv>>(url);
    }

}
