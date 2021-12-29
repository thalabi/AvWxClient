import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { AuthenticationService } from '../authentication.service';
import { User } from '../user';
import { SessionDataService } from '../../service/session-data.service';
import { MyMessageService } from '../../message/mymessage.service';

@Component({
    selector: 'app-login-panel',
    templateUrl: './login-panel.component.html',
    styleUrls: ['./login-panel.component.css']
})
export class LoginPanelComponent implements OnInit {
    // visible is an input and output argument
    visible: boolean;

    // modal is an input and output argument
    @Input() userDetails: User = new User();
    @Output() userDetailsChange: EventEmitter<any> = new EventEmitter();

    //model: any = {};
    isProcessingRequest: boolean;

    constructor(private authenticationService: AuthenticationService, private sessionDataService: SessionDataService, private myMessageService: MyMessageService) { }

    ngOnInit(): void {
        this.visible = false;
    }

    public showForm() {
        console.log('showForm()');
        this.visible = true;
    }

    public loginFormSubmit() {
        this.userDetails.firstName = this.userDetails.username + '\'s first name';
        this.userDetailsChange.emit(this.userDetails);
        this.visible = false;


        // this.isPprocessingRequest = true;
        // this.messageService.clear();
        this.authenticationService.login(this.userDetails.username, this.userDetails.password)
            .subscribe({
                next: (user: User) => {
                    console.log('user', user);
                    this.sessionDataService.user = user;
                    this.sessionDataService.userSubject.next(user);

                    // this.router.navigate([this.returnUrl]);
                    // this.messageService.clear();
                    // this.isPprocessingRequest = false;
                },
                error: () => {
                    // this.isPprocessingRequest = false;
                    console.error('error')
                    this.myMessageService.error("Unauthorized");
                }
            });
    }

    public logout() {
        console.log('logout()');
        this.userDetailsChange.emit({});
    }
}
