import { Component, computed, inject, input } from '@angular/core';
import { BaseChartDirective } from 'ng2-charts';
import type { ChartConfiguration, ChartType } from 'chart.js';
import { ThemeService } from '../../../core/services/theme.service';
import { chartBaseOptions, chartPalette } from './chart-theme';

export interface ChartWrapperSeries {
  label: string;
  data: number[];
}

@Component({
  selector: 'app-chart-wrapper',
  imports: [BaseChartDirective],
  templateUrl: './chart-wrapper.html',
  styleUrl: './chart-wrapper.scss',
})
export class ChartWrapper {
  private readonly themeService = inject(ThemeService);

  readonly type = input.required<ChartType>();
  readonly labels = input.required<string[]>();
  readonly datasets = input.required<ChartWrapperSeries[]>();
  readonly height = input(260);

  private readonly isCircular = computed(() => this.type() === 'doughnut' || this.type() === 'pie');

  readonly chartData = computed<ChartConfiguration['data']>(() => {
    const palette = chartPalette();
    if (this.isCircular()) {
      const series = this.datasets()[0];
      return {
        labels: this.labels(),
        datasets: [
          {
            label: series?.label ?? '',
            data: series?.data ?? [],
            backgroundColor: this.labels().map((_, i) => palette[i % palette.length]),
            borderWidth: 0,
          },
        ],
      };
    }
    return {
      labels: this.labels(),
      datasets: this.datasets().map((series, i) => ({
        label: series.label,
        data: series.data,
        backgroundColor: this.type() === 'line' ? `${palette[i % palette.length]}26` : palette[i % palette.length],
        borderColor: palette[i % palette.length],
        borderWidth: 2,
        tension: 0.35,
        fill: this.type() === 'line',
        borderRadius: this.type() === 'bar' ? 8 : 0,
        maxBarThickness: 42,
      })),
    };
  });

  readonly chartOptions = computed<ChartConfiguration['options']>(() => {
    this.themeService.mode();
    const theme = chartBaseOptions();
    const fontFamily = 'Cairo, Tajawal, sans-serif';
    return {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: this.isCircular() || this.datasets().length > 1,
          rtl: true,
          labels: { color: theme.font, font: { family: fontFamily } },
        },
        tooltip: {
          rtl: true,
          titleFont: { family: fontFamily },
          bodyFont: { family: fontFamily },
        },
      },
      scales: this.isCircular()
        ? {}
        : {
            x: { ticks: { color: theme.muted, font: { family: fontFamily } }, grid: { color: theme.grid } },
            y: { ticks: { color: theme.muted, font: { family: fontFamily } }, grid: { color: theme.grid } },
          },
    };
  });
}
