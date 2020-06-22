import { Component } from '@angular/core';
import { environment } from '../environments/environment';
import { AppInfoService } from './service/app-info.service';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})
export class AppComponent {
    clientBuildVersionAndTimestamp: string;
    serverBuildVersionAndTimestamp: string;
    title = 'AvWx';

    constructor(
        private appInfoService: AppInfoService
    ) { }

    ngOnInit() {
        this.clientBuildVersionAndTimestamp = environment.buildVersion + "_" + environment.buildTimestamp;
        this.appInfoService.getServerBuildTimestamp().subscribe({
            next: data => {
                this.serverBuildVersionAndTimestamp = data;
                console.log('this.serverBuildTimestamp: ', this.serverBuildVersionAndTimestamp);
            }
        });
    }
}
