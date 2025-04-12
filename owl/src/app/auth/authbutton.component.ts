import { Component, Inject } from "@angular/core";
import { AuthService } from "@auth0/auth0-angular";
import { DOCUMENT } from "@angular/common";
import { AsyncPipe } from "@angular/common";
import { CommonModule } from "@angular/common";
import { Router } from "@angular/router";

/**
 * Component for the Auth Button
 * This component is used to display the login and logout buttons on the navigation bar
 */

@Component({
  selector: "auth-button",
  templateUrl: "authbutton.component.html",
  styleUrls: ["authbutton.component.css"],
  standalone: true,
  imports: [AsyncPipe, CommonModule],
  providers: [Router],
})
export class AuthButtonComponent {
  /**
   * Constructor for the AuthButtonComponent
   * @param document Injecting the Document into the AuthButtonComponent Class
   * @param auth Injecting the AuthService into the AuthButtonComponent Class
   * @param router Injecting the Router into the AuthButtonComponent Class
   */
  constructor(
    @Inject(DOCUMENT) public document: Document,
    public auth: AuthService,
    public router: Router,
  ) {}
}
