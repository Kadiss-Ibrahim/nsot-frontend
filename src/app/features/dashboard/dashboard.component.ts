import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChartModule } from 'primeng/chart';
import { DashboardService } from '../../core/services/dashboard.service';
import { DashboardStats } from '../../core/models/dashboard.model';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, ChartModule],
  templateUrl: './dashboard.component.html'
})
export class DashboardComponent implements OnInit {
  private dashboardService = inject(DashboardService);

  stats: DashboardStats | null = null;
  loading = true;
  error: string | null = null;

  statusChartData: unknown;
  statusChartOptions: unknown;
  siteChartData: unknown;
  manufacturerChartData: unknown;
  roleChartData: unknown;
  barChartOptions: unknown;
  
  currentDate = new Date();

  ngOnInit(): void {
    this.dashboardService.getStats().subscribe({
      next: (data) => {
        this.stats = data;
        this.buildCharts(data);
        this.loading = false;
      },
      error: () => {
        this.error = 'Erreur lors du chargement du dashboard';
        this.loading = false;
      }
    });
  }

  private buildCharts(data: DashboardStats): void {
    // Donut chart — Devices par Statut
    this.statusChartData = {
      labels: ['Production', 'Standby', 'Critical', 'Decommissioned'],
      datasets: [{
        data: [data.productionCount, data.standbyCount, data.criticalCount, data.decommissionedCount],
        backgroundColor: ['#22c55e', '#f59e0b', '#ef4444', '#94a3b8'],
        hoverBackgroundColor: ['#16a34a', '#d97706', '#dc2626', '#64748b']
      }]
    };

    this.statusChartOptions = {
      cutout: '60%',
      plugins: {
        legend: {
          position: 'bottom'
        }
      }
    };

    // Bar chart options communs (horizontal)
    this.barChartOptions = {
      indexAxis: 'y',
      plugins: {
        legend: { display: false }
      },
      scales: {
        x: { beginAtZero: true, ticks: { stepSize: 1 } }
      }
    };

    this.siteChartData = this.buildBarData(data.devicesBySite, '#3b82f6');
    this.manufacturerChartData = this.buildBarData(data.devicesByManufacturer, '#8b5cf6');
    this.roleChartData = this.buildBarData(data.devicesByRole, '#06b6d4');
  }

  private buildBarData(record: Record<string, number>, color: string) {
    return {
      labels: Object.keys(record),
      datasets: [{
        label: 'Devices',
        data: Object.values(record),
        backgroundColor: color,
        borderRadius: 4
      }]
    };
  }
}