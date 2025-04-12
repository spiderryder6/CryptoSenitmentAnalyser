import { Component, OnInit } from "@angular/core";
import { DataService } from "../data.service";
import { CommonModule } from "@angular/common";
import { NgxGaugeModule } from "ngx-gauge";

@Component({
  selector: "app-sentiment-dial",
  standalone: true,
  imports: [CommonModule, NgxGaugeModule],
  providers: [DataService],
  templateUrl: "./sentiment.component.html",
  styleUrls: ["./sentiment.component.css"],
})
export class SentimentComponent implements OnInit {
  sentimentScores: { label: string; score: number; index: number }[] = [];

  thresholdConfig = {
    "0": { color: "red", size: 10, label: "0" }, // Red at 0
    "5000": { color: "yellow", size: 10, label: "5000" }, // Yellow at 5000
    "10000": { color: "green", size: 10, label: "10000" }, // Green at 10000
  };

  markers = {
    "0": {
      color: "white",
      type: "triangle",
      size: 8,
      label: "0",
      font: "16px Arial",
    },
    "5000": {
      color: "white",
      type: "triangle",
      size: 8,
      label: "5000",
      font: "16px Arial",
    },
    "10000": {
      color: "white",
      type: "triangle",
      size: 8,
      label: "10000",
      font: "16px Arial",
    },
  };

  constructor(private dataService: DataService) {}

  ngOnInit(): void {
    this.fetchSentimentScores();
    console.log(this.sentimentScores);
  }

  fetchSentimentScores(): void {
    const daysAgoList = [
      { daysAgo: 0, index: 0 }, // Today
      { daysAgo: 1, index: 1 }, // Yesterday
      { daysAgo: 7, index: 2 }, // 7 Days Ago
      { daysAgo: 30, index: 3 }, // 30 Days Ago
    ];

    daysAgoList.forEach((item) => {
      this.dataService
        .getSentimentScore(item.daysAgo)
        .subscribe((response: any) => {
          const score = response.average;
          this.sentimentScores.push({
            label: this.getLabel(item.daysAgo),
            score: score,
            index: item.index, // Add index for sorting
          });

          // Sort the scores by index after each update
          this.sentimentScores.sort((a, b) => a.index - b.index);
        });
    });
  }

  getLabel(daysAgo: number): string {
    switch (daysAgo) {
      case 0:
        return "Today";
      case 1:
        return "Yesterday";
      case 7:
        return "7 Days Ago";
      case 30:
        return "30 Days Ago";
      default:
        return "";
    }
  }

  getScoreColor(score: number): string {
    // Calculate a color between red (0) and green (10,000)
    const red = Math.round(255 - (score / 10000) * 255);
    const green = Math.round((score / 10000) * 255);
    return `rgb(${red}, ${green}, 0)`;
  }
}
