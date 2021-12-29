import { Component, OnInit, ViewChild, ViewChildren, QueryList } from '@angular/core';
import { MetarService } from '../metar.service';
import { Metar } from '../metar';
import { ɵBrowserDomAdapter } from '@angular/platform-browser';
import { MetarStationIdMvService } from '../service/metar-station-id-mv.service';
import { MetarStationIdMv } from '../model/metar_station_id_mv';
import { query } from '@angular/animations';
import { StationIdSet } from '../model/station_id_set';
import { SelectItem } from 'primeng/api/selectitem';
import { MessageService } from 'primeng/api';
import { StationIdSetComponent } from '../station-id-set/station-id-set.component';
import { NgModel } from '@angular/forms';
import { LoginPanelComponent } from '../security/login-panel/login-panel.component';
import { User } from '../security/user';
import { SessionDataService } from '../service/session-data.service';

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

    savedstationIdSetNames: SelectItem[];
    stationIdSetName: string;

    foundSavedStationIdSet: boolean;

    savedStationIdSets: Array<StationIdSet>;

    userDetails: User = new User();
    loginButtonLabel: string;

    @ViewChildren(StationIdSetComponent) stationIdSetComponentReferences: QueryList<StationIdSetComponent>;

    @ViewChild(LoginPanelComponent) loginPanelComponent: LoginPanelComponent;

    constructor(private metarService: MetarService, private metarStationIdMvService: MetarStationIdMvService, private messageService: MessageService, public sessionDataService: SessionDataService) { }

    ngOnInit(): void {
        this.metarArray = new Array<Metar>();
        this.fromObservationTime = new Date();
        this.toObservationTime = new Date();
        this.savedStationIdSets = JSON.parse(localStorage.getItem('stationIdSets'));
        if (this.savedStationIdSets) {
            this.initSavedstationIdSetNames();
            this.stationIdSetName = "";
        } else {
            this.savedStationIdSets = new Array<StationIdSet>();
        }
        console.log('this.savedStationIdSets', this.savedStationIdSets)
        console.log('this.savedstationIdSetNames', this.savedstationIdSetNames)
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

        this.loginButtonLabel = "Login";


        // test begin
        this.sessionDataService.userSubject.subscribe((user) => {
            console.log("sessionDataService.userSubject >>>>> " + user.firstName);
        });
        // test end
    }

    private initSavedstationIdSetNames() {
        this.savedstationIdSetNames = this.savedStationIdSets.map(savedStationIdSet => {
            return { label: savedStationIdSet.name, value: savedStationIdSet.name };
        });
        this.savedstationIdSetNames.sort((a, b) => (a.label < b.label ? -1 : 1));

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

        // refresh child component from localstorage
        let stationIdSetComponent = this.stationIdSetComponentReferences.find(stationIdSetComponent => stationIdSetComponent.id == event.index);
        if (stationIdSetComponent) {
            console.log('found stationIdSetComponent');
            stationIdSetComponent.refreshFromLocalStorage();
        }
    }

    public clearMetarStationIdMvs() {
        this.metarStationIdMvs.length = 0;
    }

    public toggleLoginPanel() {
        this.loginPanelComponent.showForm();
    }
}

enum MetarRetrievalMethodEnum {
    Latest, // by number of latest metars
    Range // by observation date range
}
