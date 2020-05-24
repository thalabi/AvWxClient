import { Component, OnInit } from '@angular/core';
import { MetarService } from '../metar.service';
import { Metar } from '../metar';
import { ɵBrowserDomAdapter } from '@angular/platform-browser';

@Component({
    selector: 'app-metar',
    templateUrl: './metar.component.html',
    styleUrls: ['./metar.component.css']
})
export class MetarComponent implements OnInit {

    metarArray: Array<Metar>;
    something: string = 'hello';

    stationIds: Array<string>;
    stationIdResults: Array<string>;

    fromObservationTime: Date;

    constructor(private metarService: MetarService) { }

    ngOnInit(): void {
    }

    public searchStationIds(event: { originalEvent: InputEvent, query: string }) {

        this.stationIdResults = new Array<string>();
        console.log(event.originalEvent);
        console.log(event.query);
        switch (event.query.toUpperCase()) {
            case 'CYOO':
                this.stationIdResults.push('CYOO');
                break;
            case 'CYPQ':
                this.stationIdResults.push('CYPQ');
                break;
            case 'CYQA':
                this.stationIdResults.push('CYQA');
                break;
            default:
            // this.stationIdResults.push('CYOO');
            // break;
        }
        console.log(this.stationIdResults)
    }

    public getMetars() {
        console.log(this.stationIds);
        this.metarService.getMetarList(this.stationIds, this.fromObservationTime).subscribe({
            //this.metarService.ping(null, null).subscribe({
            next: rowResponse => {
                console.log('metar rowResponse: ', rowResponse);
                this.metarArray = rowResponse;
                console.log('metarArray: ', this.metarArray);
                /*
                if (rowResponse._embedded) {
                    this.partRowArray = rowResponse._embedded[this.PART_TABLE_NAME+'s'];
                    ComponentHelper.sortGenericEntity(this.partRowArray, ['name']);
                    console.log('this.partRowArray: ', this.partRowArray);
                } else {
                    this.partRowArray = [];
                }
                */
            },
            error: error => {
                console.error('MetarComponent:ngOnInit()', error);
                //this.messageService.error(error);
            }
        });
    }
}
