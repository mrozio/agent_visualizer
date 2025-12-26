import { ChartOptions, ChartData } from './chartingTools.js';

/**
 * Predefined chart templates for common use cases
 */
export class ChartTemplates {
  /**
   * Template for time series data
   */
  static timeSeries(
    dates: string[],
    values: number[],
    title: string,
    seriesName: string = 'Value'
  ): ChartOptions {
    return {
      type: 'line',
      title,
      data: {
        labels: dates,
        datasets: [
          {
            label: seriesName,
            data: values,
            borderColor: 'rgb(75, 192, 192)',
            backgroundColor: 'rgba(75, 192, 192, 0.2)',
            borderWidth: 2,
          },
        ],
      },
    };
  }

  /**
   * Template for comparison bar chart
   */
  static comparison(
    categories: string[],
    groups: { name: string; values: number[]; color?: string }[],
    title: string
  ): ChartOptions {
    const colors = [
      'rgb(75, 192, 192)',
      'rgb(255, 99, 132)',
      'rgb(54, 162, 235)',
      'rgb(255, 206, 86)',
    ];

    return {
      type: 'bar',
      title,
      data: {
        labels: categories,
        datasets: groups.map((group, idx) => ({
          label: group.name,
          data: group.values,
          backgroundColor: group.color || colors[idx % colors.length],
        })),
      },
    };
  }

  /**
   * Template for distribution/percentage pie chart
   */
  static distribution(
    categories: string[],
    values: number[],
    title: string
  ): ChartOptions {
    const colors = [
      'rgb(255, 99, 132)',
      'rgb(54, 162, 235)',
      'rgb(255, 206, 86)',
      'rgb(75, 192, 192)',
      'rgb(153, 102, 255)',
      'rgb(255, 159, 64)',
    ];

    return {
      type: 'pie',
      title,
      data: {
        labels: categories,
        datasets: [
          {
            label: 'Distribution',
            data: values,
            backgroundColor: categories.map((_, idx) => colors[idx % colors.length]),
          },
        ],
      },
    };
  }

  /**
   * Template for multi-metric dashboard
   */
  static multiMetric(
    labels: string[],
    metrics: { name: string; data: number[]; color?: string }[],
    title: string
  ): ChartOptions {
    const colors = [
      'rgb(75, 192, 192)',
      'rgb(255, 99, 132)',
      'rgb(54, 162, 235)',
      'rgb(255, 206, 86)',
    ];

    return {
      type: 'radar',
      title,
      data: {
        labels,
        datasets: metrics.map((metric, idx) => ({
          label: metric.name,
          data: metric.data,
          backgroundColor: (metric.color || colors[idx % colors.length])
            .replace('rgb', 'rgba')
            .replace(')', ', 0.2)'),
          borderColor: metric.color || colors[idx % colors.length],
          borderWidth: 2,
        })),
      },
    };
  }

  /**
   * Template for progress/goal tracking
   */
  static progressGoal(
    milestones: string[],
    actual: number[],
    target: number[],
    title: string
  ): ChartOptions {
    return {
      type: 'line',
      title,
      data: {
        labels: milestones,
        datasets: [
          {
            label: 'Actual',
            data: actual,
            borderColor: 'rgb(75, 192, 192)',
            backgroundColor: 'rgba(75, 192, 192, 0.2)',
            borderWidth: 2,
          },
          {
            label: 'Target',
            data: target,
            borderColor: 'rgb(255, 99, 132)',
            backgroundColor: 'rgba(255, 99, 132, 0.2)',
            borderWidth: 2,
            borderDash: [5, 5],
          },
        ],
      },
    };
  }

  /**
   * Template for correlation scatter plot
   */
  static correlation(
    dataPoints: { x: number; y: number }[],
    title: string,
    xLabel: string = 'X',
    yLabel: string = 'Y'
  ): ChartOptions {
    return {
      type: 'scatter',
      title,
      data: {
        labels: [],
        datasets: [
          {
            label: `${xLabel} vs ${yLabel}`,
            data: dataPoints as any,
            backgroundColor: 'rgb(75, 192, 192)',
          },
        ],
      },
    };
  }

  /**
   * Template for stacked bar chart
   */
  static stackedBar(
    categories: string[],
    groups: { name: string; values: number[]; color?: string }[],
    title: string
  ): ChartOptions {
    const colors = [
      'rgb(75, 192, 192)',
      'rgb(255, 99, 132)',
      'rgb(54, 162, 235)',
      'rgb(255, 206, 86)',
    ];

    return {
      type: 'bar',
      title,
      data: {
        labels: categories,
        datasets: groups.map((group, idx) => ({
          label: group.name,
          data: group.values,
          backgroundColor: group.color || colors[idx % colors.length],
        })),
      },
      customConfig: {
        options: {
          scales: {
            x: {
              stacked: true,
            },
            y: {
              stacked: true,
            },
          },
        },
      },
    };
  }
}
