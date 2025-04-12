import { Component } from "@angular/core";
import { CommonModule } from "@angular/common";
import { DataService } from "../data.service";
import { RouterModule } from "@angular/router";

@Component({
  selector: "app-root",
  standalone: true,
  imports: [CommonModule, RouterModule],
  providers: [DataService],
  templateUrl: "./home.component.html",
  styleUrl: "./home.component.css",
})
export class HomeComponent {}
