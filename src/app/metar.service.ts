import { Injectable } from '@angular/core';

import { catchError, map } from 'rxjs/operators';
import { HttpClient, HttpErrorResponse, HttpHeaders, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Metar } from './metar';
import { DatePipe } from '@angular/common';
import { ConfigService } from './config/config.service';
import { ApplicationProperties } from './config/application.properties';

@Injectable()
export class MetarService {
    readonly serviceUrl: string;

    constructor(
        private configService: ConfigService,
        private httpClient: HttpClient,
        private datePipe: DatePipe
    ) {
        const applicationProperties: ApplicationProperties = this.configService.getApplicationProperties();
        this.serviceUrl = applicationProperties.serviceUrl;
    }

    ping(tableName: string, orderColumnName?: string): Observable<string> {
        m: Metar;
        let url: string = `${this.serviceUrl}/ping`;
        console.log(url);
        return this.httpClient.get<string>(url);
        //return null;
    }

    getMetarList(stationIds: Array<string>, fromObservationTime: Date, toObservationTime: Date): Observable<Array<Metar>> {
        let stationIdsConcatenated: string = stationIds.join("&stationId=");
        let fromObservationTimeString = this.datePipe.transform(fromObservationTime, "yyyy-MM-dd");
        let toObservationTimeString = this.datePipe.transform(toObservationTime, "yyyy-MM-dd");
        let url: string = `${this.serviceUrl}/get2?stationId=${stationIdsConcatenated}&fromObservationTime=${fromObservationTimeString}&toObservationTime=${toObservationTimeString}`;
        console.log(url);
        return this.httpClient.get<Array<Metar>>(url);
        //return null;
    }

}
