import { Component } from "@angular/core";

import { DataService } from "../data.service";
import { AuthService } from "@auth0/auth0-angular";
import { Router } from "@angular/router";
import zoomPlugin from "chartjs-plugin-zoom";
import {
  ChartConfiguration,
  ChartOptions,
  Chart,
  registerables,
} from "chart.js";
import { BaseChartDirective } from "ng2-charts";
import { CommonModule } from "@angular/common";

Chart.register(...registerables, zoomPlugin);

@Component({
  standalone: true,
  selector: "sentiment-graph",
  imports: [BaseChartDirective, CommonModule],
  providers: [DataService, AuthService],
  templateUrl: "./graph.component.html",
  styleUrls: ["./graph.component.css"],
})
export class SentimentGraphComponent {
  chartData: ChartConfiguration<"line">["data"] = {
    labels: [],
    datasets: [
      {
        label: "Sentiment Score",
        data: [],
        borderColor: "#00ff88",
        backgroundColor: "rgba(0, 255, 136, 0.1)",
        borderWidth: 2,
        pointBackgroundColor: "#00b8ff",
        pointRadius: 4,
        tension: 0.4,
        fill: true,
      },
    ],
  };

  chartOptions: ChartOptions<"line"> = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        min: 0,
        max: 10000,
        grid: { color: "rgba(255, 255, 255, 0.1)" },
        ticks: {
          color: "#ffffff",
          callback: (value) => `${Number(value) / 1000}k`,
        },
      },
      x: {
        grid: { color: "rgba(255, 255, 255, 0.1)" },
        ticks: { color: "#ffffff" },
      },
    },
    plugins: {
      legend: {
        labels: {
          color: "#ffffff",
          font: { family: "Roboto Mono" },
        },
      },
      tooltip: {
        backgroundColor: "#1a1a1a",
        titleColor: "#00ff88",
        bodyColor: "#ffffff",
        borderColor: "#00b8ff",
        borderWidth: 1,
        padding: 12,
        usePointStyle: true,
      },
      zoom: {
        pan: {
          enabled: true,
          mode: "x",
        },
        zoom: {
          wheel: {
            enabled: true,
          },
          pinch: {
            enabled: true,
          },
          mode: "x",
        },
      },
    },
  };

  timeFilters = [
    { label: "7d", value: 7 },
    { label: "30d", value: 30 },
    { label: "All", value: 50 },
  ];

  activeFilter: number = 30;

  constructor(
    private dataService: DataService,
    public auth: AuthService,
    private router: Router,
  ) {}

  isAuthenticated = false;

  ngOnInit() {
    this.auth.isAuthenticated$.subscribe((value) => {
      this.isAuthenticated = value;
    });
    this.fetchSentimentData(this.activeFilter);
  }

  updateTimeRange(days: number) {
    this.activeFilter = days;
    this.fetchSentimentData(days);
  }

  fetchSentimentData(days: number) {
    this.dataService.getSentimentScores(days).subscribe((data: any) => {
      console.log(data);
      data = data.reverse();

      this.chartData = {
        labels: data.map((entry: any) =>
          new Date(entry.timestamp * 1000).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
          }),
        ),
        datasets: [
          {
            ...this.chartData.datasets[0],
            data: data.map((entry: any) => entry.average),
          },
        ],
      };
    });
  }

  login() {
    this.auth.loginWithRedirect({
      appState: { target: this.router.url },
    });
  }
}
