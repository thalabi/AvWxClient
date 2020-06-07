import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { SelectItem } from 'primeng/api/selectitem';
import { MetarStationIdMv } from '../model/metar_station_id_mv';
import { MessageService } from 'primeng/api';
import { StationIdSet } from '../model/station_id_set';

@Component({
    selector: 'app-station-id-set',
    templateUrl: './station-id-set.component.html',
    styleUrls: ['./station-id-set.component.css']
})
export class StationIdSetComponent implements OnInit {
    @Input() id: number;
    @Input() metarStationIdMvArrayCache: Array<MetarStationIdMv>;

    // metarStationIdMvs is an input and output argument
    @Input() metarStationIdMvs: Array<MetarStationIdMv>;
    @Output() metarStationIdMvsChange: EventEmitter<Array<MetarStationIdMv>> = new EventEmitter();

    // stationIdSetName is an input and output argument
    @Input() stationIdSetName: string;
    @Output() stationIdSetNameChange: EventEmitter<string> = new EventEmitter();

    // foundSavedStationIdSet is an input and output argument
    @Input() foundSavedStationIdSet: boolean;
    @Output() foundSavedStationIdSetChange: EventEmitter<boolean> = new EventEmitter();

    savedstationIdSetNames: SelectItem[];
    savedStationIdSets: Array<StationIdSet>;
    //foundSavedStationIdSet: boolean;

    constructor(private messageService: MessageService) { }

    ngOnInit(): void {
        console.log('StationIdSetComponent id is', this.id);
        //this.messageService.add({ severity: 'info', summary: 'StationIdSetComponent Initialized', detail: '' });
        this.refreshFromLocalStorage();
    }

    public refreshFromLocalStorage() {
        //this.messageService.add({ severity: 'info', summary: 'refreshFromLocalStorage', detail: '' });
        this.savedStationIdSets = JSON.parse(localStorage.getItem('stationIdSets'));
        if (this.savedStationIdSets) {
            this.initSavedstationIdSetNames();
            //this.stationIdSetName = "";
        } else {
            this.savedStationIdSets = new Array<StationIdSet>();
        }
        console.log('this.savedStationIdSets', this.savedStationIdSets)
        console.log('this.savedstationIdSetNames', this.savedstationIdSetNames)

    }

    private initSavedstationIdSetNames() {
        this.savedstationIdSetNames = this.savedStationIdSets.map(savedStationIdSet => {
            return { label: savedStationIdSet.name, value: savedStationIdSet.name };
        });
        this.savedstationIdSetNames.sort((a, b) => (a.label < b.label ? -1 : 1));

    }

    public onChangeStationIdSet(event: { originalEvent: InputEvent, value: string }) {
        console.log('in onChangeStationIdSet');
        let stationIdSetName: string = event.value;
        console.log('stationIdSetName', stationIdSetName);
        console.log('this.savedStationIdSets', this.savedStationIdSets);
        let savedStationIdSet = this.savedStationIdSets.find(stationIdSet => stationIdSet.name == stationIdSetName);
        console.log('savedStationIdSet', savedStationIdSet);
        if (savedStationIdSet) {
            this.foundSavedStationIdSet = true;
            this.foundSavedStationIdSetChange.emit(this.foundSavedStationIdSet);
            this.metarStationIdMvs = new Array<MetarStationIdMv>();
            savedStationIdSet.stationIds.forEach(stationId => {
                let metarStationIdMv = this.metarStationIdMvArrayCache.find(metarStationIdMv => metarStationIdMv.stationId == stationId);
                if (metarStationIdMv) {
                    this.metarStationIdMvs.push(metarStationIdMv);
                }
            });
            this.metarStationIdMvsChange.emit(this.metarStationIdMvs);
        } else {
            this.foundSavedStationIdSet = false;
            this.foundSavedStationIdSetChange.emit(this.foundSavedStationIdSet);
        }

        this.stationIdSetNameChange.emit(this.stationIdSetName);
        console.log('this.foundStationIdSet', this.foundSavedStationIdSet);
    }

    // addStationIdSet to localStorage
    // Note this.stationIdSet is a string
    public addStationIdSet(): void {
        console.log('in addStationIdSet');
        console.log('this.stationIdSetName', this.stationIdSetName);
        console.log('this.metarStationIdMvs', this.metarStationIdMvs);
        let stationIds: Array<string> = this.metarStationIdMvs.map(metarStationIdMv => {
            return metarStationIdMv.stationId;
        });
        console.log('stationIds', stationIds);
        let stationIdSet: StationIdSet = { "name": this.stationIdSetName, "stationIds": stationIds };
        this.savedStationIdSets.push(stationIdSet);
        console.log('this.savedStationIdSets', this.savedStationIdSets);
        this.savedStationIdSets.forEach(stationIdSet => {
            console.log('stationIdSet', stationIdSet);
        })
        //this.savedStationIdSets = [...this.savedStationIdSets]; // use the spread operator to trigger change detection and the option list is updated in the dropdown
        this.initSavedstationIdSetNames();
        console.log('this.savedStationIdSets', this.savedStationIdSets);
        localStorage.setItem('stationIdSets', JSON.stringify(this.savedStationIdSets));
        this.messageService.add({ severity: 'info', summary: 'Station Set Added', detail: '' });

    }

    // modifyStationIdSet in localStorage
    public modifyStationIdSet(): void {
        console.log('in modifyStationIdSet');
        // console.log('this.stationIdSet', this.stationIdSet);
        // console.log('typeof this.stationIdSet === "string"', typeof this.stationIdSet === "string");
        // console.log('this.stationIdSet.name', this.stationIdSet.name);
        // if (typeof this.stationIdSet === "string") {
        //     let name = this.stationIdSet;
        //     this.stationIdSet = this.stationIdSet as unknown;
        //     this.stationIdSet = this.stationIdSet as StationIdSet; // cast as StationIdSet
        //     this.stationIdSet = new StationIdSet();
        //     this.stationIdSet.name = name;
        // } else {
        //     this.stationIdSet = this.stationIdSet as StationIdSet; // cast as StationIdSet
        // }

        console.log('this.stationIdSetName', this.stationIdSetName);
        console.log('this.metarStationIdMvs', this.metarStationIdMvs);
        let stationIds: Array<string> = this.metarStationIdMvs.map(metarStationIdMv => {
            return metarStationIdMv.stationId;
        });
        console.log('stationIds', stationIds);
        let foundStationIdSet: StationIdSet = this.savedStationIdSets.find(stationIdSet => stationIdSet.name == this.stationIdSetName);
        if (foundStationIdSet) {
            console.log('found it');
            foundStationIdSet.stationIds = stationIds;
        }
        //this.savedStationIdSets = [...this.savedStationIdSets]; // use the spread operator to trigger change detection and the option list is updated in the dropdown
        console.log('this.savedStationIdSets', this.savedStationIdSets);
        localStorage.setItem('stationIdSets', JSON.stringify(this.savedStationIdSets));
        this.messageService.add({ severity: 'info', summary: 'Station Set Updated' });
    }

    public deleteStationIdSet(): void {
        console.log('in deleteStationIdSet');
        console.log('this.stationIdSetName', this.stationIdSetName);
        let index: number = this.savedStationIdSets.findIndex(stationIdSet => stationIdSet.name == this.stationIdSetName);
        if (index == -1) {
            console.error('Could not find this.stationIdSetName', this.stationIdSetName, 'in this.savedStationIdSets', this.savedStationIdSets);
            return;
        }
        this.savedStationIdSets.splice(index, 1);
        this.initSavedstationIdSetNames();
        console.log('this.savedStationIdSets', this.savedStationIdSets);
        localStorage.setItem('stationIdSets', JSON.stringify(this.savedStationIdSets));
        this.stationIdSetName = undefined;
        this.messageService.add({ severity: 'info', summary: 'Station Set Deleted' });
    }

}
