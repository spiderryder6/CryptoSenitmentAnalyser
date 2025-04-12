import { Routes } from "@angular/router";
import { HomeComponent } from "./home/home.component";
import { SentimentComponent } from "./sentiment/sentiment.component";
import { SentimentGraphComponent } from "./graph/graph.component";

export const routes: Routes = [
  {
    path: "",
    component: HomeComponent,
  },
  {
    path: "sentiment",
    component: SentimentComponent,
  },
  {
    path: "graph",
    component: SentimentGraphComponent,
  },
];
