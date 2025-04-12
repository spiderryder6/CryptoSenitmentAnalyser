import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";

@Injectable()
export class DataService {
  url = "";

  constructor(private http: HttpClient) {}

  getSentimentScore(daysAgo: number) {
    return this.http.get(this.url + "/" + daysAgo);
  }

  getSentimentScores(daysAgo: number) {
    return this.http.get(this.url + "s/" + daysAgo);
  }
}
