import { Component, ChangeDetectorRef } from '@angular/core';
import { MyMessageService } from './mymessage.service';
import { MyMessage } from './mymessage';
import { Message } from '@angular/compiler/src/i18n/i18n_ast';
import { OverlayPanel } from 'primeng/primeng';
import { Abbreviate } from '../abbreviate/abbreviate';


@Component({
    selector: 'message',
    // template: `
    //     <div *ngFor="let message of messageArray" style="margin-top: 0.3rem;">
    //         <p-message [severity]="message.severity" [text]="abbreviateMessage(message.summary)" [pTooltip]="message.detail" tooltipPosition="right"></p-message>
    //     </div>
    //     <button *ngIf="messageArray && messageArray.length > 0" pButton type="button" label="Clear message(s)" (click)="onClearMessages($event)"></button>
    // `,
    template: `
        <div *ngFor="let message of messageArray" style="margin-top: 0.3rem;">
            <p-message [severity]="message.severity" [text]="abbreviateMessage(message.summary)" [pTooltip]="message.detail" tooltipPosition="right"></p-message>
        </div>
        <button *ngIf="messageArray && messageArray.length > 0" pButton type="button" label="Clear message(s)" (click)="onClearMessages()"></button>
    `,
    styles: ['::ng-deep .ui-tooltip {max-width: 50rem;}']
})
export class MessageComponent {

    messageArray: MyMessage[];

    constructor(private myMessageService: MyMessageService, private changeDetectorRef: ChangeDetectorRef) {
    }

    ngOnInit() {
        this.myMessageService.currentMessageArray.subscribe(messageArray => {
            this.messageArray = messageArray;
            this.changeDetectorRef.detectChanges();
        });
    }

    abbreviateMessage(inputText: string): string {
        return Abbreviate.abbreviateText(inputText);
    }

    onClearMessages() {
        this.myMessageService.clear();
    }
}