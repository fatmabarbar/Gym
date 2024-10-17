import { Component, OnInit } from '@angular/core';
import { ApiService } from './../service/api.service';
import { User } from './../models/register.model';
import { ChartOptions, ChartType, ChartDataset } from 'chart.js';

import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { Chart } from 'chart.js';
import { Router } from '@angular/router';
import { NgConfirmService } from 'ng-confirm-box';
import { NgToastService } from 'ng-angular-popup';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  public users!: User[];
  dataSource!: MatTableDataSource<User>;

  displayedColumns: string[] = ['id', 'firstName', 'lastName', 'email', 'mobile', 'bmiResult', 'gender', 'importantList', 'coachName', 'package', 'enquiryDate', 'action'];

  constructor(private apiService: ApiService, private router: Router, private confirmService: NgConfirmService, private toastService: NgToastService) { }

  ngOnInit() {
    this.getUsers();
  }

  getUsers() {
    this.apiService.getRegisteredUser()
      .subscribe({
        next: (res) => {
          this.users = res.map(user => {
            // Assuming the image URL is stored in the 'image' property of the user object
            user.image = user.image ? user.image : '/assets/images/default-user-image ' + user.id + '.png'; // Replace with the path to your default user image
            return user;
          });
          this.dataSource = new MatTableDataSource(this.users);
          this.createPieChart();
        },
        error: (err) => {
          console.log(err);
        }
      });
  }

  createPieChart() {
    // Data aggregation for charts
    const genderData: { [key: string]: number } = {};
    const bmiResultData: { [key: string]: number } = {};
    const importantData: { [key: string]: number } = {};
    const coachNameData: { [key: string]: number } = {};

    for (const user of this.users) {
      if (user.gender) {
        genderData[user.gender] = (genderData[user.gender] || 0) + 1;
      }
      if (user.bmiResult) {
        bmiResultData[user.bmiResult] = (bmiResultData[user.bmiResult] || 0) + 1;
      }
      if (user.coachName) {
        coachNameData[user.coachName] = (coachNameData[user.coachName] || 0) + 1;
      }
    }

    // Gender Chart
    const genderChartCanvas = document.getElementById('pie-chart') as HTMLCanvasElement;
    const genderChartCtx = genderChartCanvas.getContext('2d');
    if (genderChartCtx) {
      new Chart(genderChartCtx, {
        type: 'pie',
        data: {
          labels: Object.keys(genderData),
          datasets: [{
            data: Object.values(genderData),
            backgroundColor: ['#808080', '#FF0000', '#C0C0C0'] // Grey, Red, Silver
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          aspectRatio: 0.4,
        }
      });
    }

    // Coach Name Chart
    const coachNameChartCanvas = document.getElementById('coachName-chart') as HTMLCanvasElement;
    const coachNameChartCtx = coachNameChartCanvas.getContext('2d');
    if (coachNameChartCtx) {
      new Chart(coachNameChartCtx, {
        type: 'pie',
        data: {
          labels: Object.keys(coachNameData),
          datasets: [{
            data: Object.values(coachNameData),
            backgroundColor: ['#808080', '#FF0000', '#C0C0C0', '#A9A9A9', '#696969'] // Grey variations
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          aspectRatio: 0.4,
        }
      });
    }

    // BMI Result Chart
    const bmiResultChartCanvas = document.getElementById('bmi-result-chart') as HTMLCanvasElement;
    const bmiResultChartCtx = bmiResultChartCanvas.getContext('2d');
    if (bmiResultChartCtx) {
      new Chart(bmiResultChartCtx, {
        type: 'pie',
        data: {
          labels: Object.keys(bmiResultData),
          datasets: [{
            data: Object.values(bmiResultData),
            backgroundColor: ['#808080', '#FF0000', '#C0C0C0'] // Grey, Red, Silver
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          aspectRatio: 0.4,
        }
      });
    }

    for (const user of this.users) {
      if (user.important) {
        for (const important of user.important) {
          importantData[important] = (importantData[important] || 0) + 1;
        }
      }
    }

    // Important Data Chart
    const importantChartCanvas = document.getElementById('important-chart') as HTMLCanvasElement;
    const importantChartCtx = importantChartCanvas.getContext('2d');
    if (importantChartCtx) {
      new Chart(importantChartCtx, {
        type: 'pie',
        data: {
          labels: Object.keys(importantData),
          datasets: [{
            data: Object.values(importantData),
            backgroundColor: ['#808080', '#FF0000', '#C0C0C0', '#A9A9A9', '#696969'] // Grey variations
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          aspectRatio: 0.4,
        }
      });
    }
  }
}
