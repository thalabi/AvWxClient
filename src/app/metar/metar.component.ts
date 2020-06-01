import { Component, OnInit } from '@angular/core';
import { MetarService } from '../metar.service';
import { Metar } from '../metar';
import { ɵBrowserDomAdapter } from '@angular/platform-browser';
import { MetarStationIdMvService } from '../service/metar-station-id-mv.service';
import { MetarStationIdMv } from '../model/metar_station_id_mv';
import { query } from '@angular/animations';

@Component({
    selector: 'app-metar',
    templateUrl: './metar.component.html',
    styleUrls: ['./metar.component.css']
})
export class MetarComponent implements OnInit {

    metarStationIdMvArrayCache: Array<MetarStationIdMv>;
    metarArray: Array<Metar>;
    something: string = 'hello';

    metarStationIdMvs: Array<MetarStationIdMv>;
    metarStationIdMvResults: Array<MetarStationIdMv>;

    fromObservationTime: Date;
    toObservationTime: Date;

    numberOfObersvations: number;

    panelNumberSelected: MetarRetrievalMethodEnum;

    loadingFlag: boolean;

    constructor(private metarService: MetarService, private metarStationIdMvService: MetarStationIdMvService) { }

    ngOnInit(): void {
        this.metarArray = new Array<Metar>();
        this.fromObservationTime = new Date();
        this.toObservationTime = new Date();
        this.metarStationIdMvs = JSON.parse(localStorage.getItem('metarStationIdMvs'));
        this.numberOfObersvations = +localStorage.getItem('numberOfObersvations');
        if (! /* not */ this.numberOfObersvations) {
            this.numberOfObersvations = 3;
        }
        this.metarStationIdMvService.getStationIds().subscribe({
            next: rowResponse => {
                console.log('metar rowResponse: ', rowResponse);
                this.metarStationIdMvArrayCache = rowResponse;
                console.log('metarStationIdMvArray: ', this.metarStationIdMvArrayCache);
            },
            error: error => {
                console.error('MetarComponent:ngOnInit()', error);
            }
        });
        this.panelNumberSelected = MetarRetrievalMethodEnum.Latest;
    }

    public searchStationIds(event: { originalEvent: InputEvent, query: string }) {

        this.metarStationIdMvResults = new Array<MetarStationIdMv>();
        console.log(event.originalEvent);
        console.log(event.query);
        this.metarStationIdMvResults =
            this.metarStationIdMvArrayCache.filter(e => e.stationId.indexOf(event.query.toUpperCase()) > -1).concat(
                this.metarStationIdMvArrayCache.filter(e => e.name.indexOf(event.query.toUpperCase()) > -1)
            );
        console.log(this.metarStationIdMvResults)
    }

    public getMetars() {
        this.metarArray.length = 0;
        this.loadingFlag = true;
        console.log(this.metarStationIdMvs);
        let stationIds: Array<string> = this.metarStationIdMvs.map(metarStationIdMv => {
            return metarStationIdMv.stationId;
        });
        localStorage.setItem('metarStationIdMvs', JSON.stringify(this.metarStationIdMvs));
        switch (this.panelNumberSelected) {
            case MetarRetrievalMethodEnum.Latest:
                localStorage.setItem('numberOfObersvations', this.numberOfObersvations.toString());
                this.metarService.getMetarListForLatestNObservations(stationIds, this.numberOfObersvations).subscribe({
                    next: rowResponse => {
                        console.log('metar rowResponse: ', rowResponse);
                        this.metarArray = rowResponse;
                        console.log('metarArray: ', this.metarArray);
                    },
                    complete: () => {
                        this.loadingFlag = false;
                    },
                    error: error => {
                        console.error('MetarComponent:ngOnInit()', error);
                        //this.messageService.error(error);
                    }
                });
                break;
            case MetarRetrievalMethodEnum.Range:
                this.metarService.getMetarListInObervationTimeRange(stationIds, this.fromObservationTime, this.toObservationTime).subscribe({
                    next: rowResponse => {
                        console.log('metar rowResponse: ', rowResponse);
                        this.metarArray = rowResponse;
                        console.log('metarArray: ', this.metarArray);
                    },
                    complete: () => {
                        this.loadingFlag = false;
                    },
                    error: error => {
                        console.error('MetarComponent:ngOnInit()', error);
                        //this.messageService.error(error);
                    }
                });
                break;
        }
    }

    public setPanelNumberSelected(event): void {
        console.log('event.index', event.index);
        this.panelNumberSelected = MetarRetrievalMethodEnum[MetarRetrievalMethodEnum[event.index]];
        console.log(this.panelNumberSelected);
        this.metarArray = new Array<Metar>();
    }
}

enum MetarRetrievalMethodEnum {
    Latest, // by number of latest metars
    Range // by observation date range
}
