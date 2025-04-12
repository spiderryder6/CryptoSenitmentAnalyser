import { Component } from "@angular/core";
import { RouterOutlet } from "@angular/router";
import { NavComponent } from "./nav/nav.component";

/**
 * Root component for the application
 */

@Component({
  selector: "app-root",
  standalone: true,
  imports: [RouterOutlet, NavComponent],
  templateUrl: "./app.component.html",
  styleUrl: "./app.component.css",
})
export class AppComponent {}
