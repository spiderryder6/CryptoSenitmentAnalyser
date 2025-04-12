import { Component } from "@angular/core";
import { RouterOutlet, RouterModule } from "@angular/router";
import { AuthButtonComponent } from "./../auth/authbutton.component";

@Component({
  selector: "navigation",
  standalone: true,
  imports: [RouterOutlet, RouterModule, AuthButtonComponent],
  templateUrl: "./nav.component.html",
  styleUrl: "./nav.component.css",
})
export class NavComponent {}
