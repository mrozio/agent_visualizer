import { ChartConfiguration } from 'chart.js';
import { ChartJSNodeCanvas } from 'chartjs-node-canvas';
import { promises as fs } from 'fs';
import path from 'path';

export interface ChartData {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    backgroundColor?: string | string[];
    borderColor?: string | string[];
    borderWidth?: number;
  }[];
}

export interface ChartOptions {
  type: 'line' | 'bar' | 'pie' | 'doughnut' | 'scatter' | 'radar' | 'polarArea';
  title?: string;
  width?: number;
  height?: number;
  data: ChartData;
  customConfig?: Partial<ChartConfiguration>;
}

/**
 * ChartingTools - Provides utilities for creating various chart types
 */
export class ChartingTools {
  private width: number;
  private height: number;

  constructor(width = 800, height = 600) {
    this.width = width;
    this.height = height;
  }

  /**
   * Generate a chart and return the buffer
   */
  async generateChart(options: ChartOptions): Promise<Buffer> {
    const chartJSNodeCanvas = new ChartJSNodeCanvas({
      width: options.width || this.width,
      height: options.height || this.height,
    });

    const configuration: ChartConfiguration = {
      type: options.type,
      data: options.data,
      options: {
        plugins: {
          title: {
            display: !!options.title,
            text: options.title || '',
            font: {
              size: 18,
            },
          },
          legend: {
            display: true,
            position: 'top',
          },
        },
        ...options.customConfig?.options,
      },
      ...options.customConfig,
    };

    return await chartJSNodeCanvas.renderToBuffer(configuration);
  }

  /**
   * Generate a chart and save it to a file
   */
  async generateChartToFile(
    options: ChartOptions,
    outputPath: string
  ): Promise<string> {
    const buffer = await this.generateChart(options);

    // Ensure directory exists
    const dir = path.dirname(outputPath);
    await fs.mkdir(dir, { recursive: true });

    await fs.writeFile(outputPath, buffer);
    return outputPath;
  }

  /**
   * Generate a chart and return base64 string
   */
  async generateChartToBase64(options: ChartOptions): Promise<string> {
    const buffer = await this.generateChart(options);
    return buffer.toString('base64');
  }

  /**
   * Create a line chart
   */
  async createLineChart(
    labels: string[],
    datasets: { label: string; data: number[]; color?: string }[],
    title?: string,
    outputPath?: string
  ): Promise<string | Buffer> {
    const chartData: ChartData = {
      labels,
      datasets: datasets.map((ds, idx) => ({
        label: ds.label,
        data: ds.data,
        borderColor: ds.color || this.getColor(idx),
        backgroundColor: this.getColorWithAlpha(ds.color || this.getColor(idx), 0.2),
        borderWidth: 2,
      })),
    };

    const options: ChartOptions = {
      type: 'line',
      title,
      data: chartData,
    };

    if (outputPath) {
      return await this.generateChartToFile(options, outputPath);
    }
    return await this.generateChart(options);
  }

  /**
   * Create a bar chart
   */
  async createBarChart(
    labels: string[],
    datasets: { label: string; data: number[]; color?: string }[],
    title?: string,
    outputPath?: string
  ): Promise<string | Buffer> {
    const chartData: ChartData = {
      labels,
      datasets: datasets.map((ds, idx) => ({
        label: ds.label,
        data: ds.data,
        backgroundColor: ds.color || this.getColor(idx),
        borderColor: this.getBorderColor(ds.color || this.getColor(idx)),
        borderWidth: 1,
      })),
    };

    const options: ChartOptions = {
      type: 'bar',
      title,
      data: chartData,
    };

    if (outputPath) {
      return await this.generateChartToFile(options, outputPath);
    }
    return await this.generateChart(options);
  }

  /**
   * Create a pie chart
   */
  async createPieChart(
    labels: string[],
    data: number[],
    title?: string,
    outputPath?: string
  ): Promise<string | Buffer> {
    const chartData: ChartData = {
      labels,
      datasets: [
        {
          label: 'Data',
          data,
          backgroundColor: labels.map((_, idx) => this.getColor(idx)),
          borderColor: labels.map((_, idx) => this.getBorderColor(this.getColor(idx))),
          borderWidth: 1,
        },
      ],
    };

    const options: ChartOptions = {
      type: 'pie',
      title,
      data: chartData,
    };

    if (outputPath) {
      return await this.generateChartToFile(options, outputPath);
    }
    return await this.generateChart(options);
  }

  /**
   * Create a scatter plot
   */
  async createScatterPlot(
    datasets: { label: string; data: { x: number; y: number }[]; color?: string }[],
    title?: string,
    outputPath?: string
  ): Promise<string | Buffer> {
    const chartData: any = {
      datasets: datasets.map((ds, idx) => ({
        label: ds.label,
        data: ds.data,
        backgroundColor: ds.color || this.getColor(idx),
        borderColor: this.getBorderColor(ds.color || this.getColor(idx)),
      })),
    };

    const options: ChartOptions = {
      type: 'scatter',
      title,
      data: chartData,
    };

    if (outputPath) {
      return await this.generateChartToFile(options, outputPath);
    }
    return await this.generateChart(options);
  }

  /**
   * Helper: Get a color from a predefined palette
   */
  private getColor(index: number): string {
    const colors = [
      'rgb(75, 192, 192)',
      'rgb(255, 99, 132)',
      'rgb(54, 162, 235)',
      'rgb(255, 206, 86)',
      'rgb(153, 102, 255)',
      'rgb(255, 159, 64)',
      'rgb(199, 199, 199)',
      'rgb(83, 102, 255)',
      'rgb(255, 102, 204)',
      'rgb(102, 255, 178)',
    ];
    return colors[index % colors.length];
  }

  /**
   * Helper: Get border color (darker version)
   */
  private getBorderColor(color: string): string {
    return color.replace('rgb', 'rgba').replace(')', ', 0.8)');
  }

  /**
   * Helper: Get color with alpha transparency
   */
  private getColorWithAlpha(color: string, alpha: number): string {
    return color.replace('rgb', 'rgba').replace(')', `, ${alpha})`);
  }
}
