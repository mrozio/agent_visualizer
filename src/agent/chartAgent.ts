import { Agent, Tool } from '@anthropic-ai/agent-sdk';
import { ChartingTools, ChartOptions } from '../tools/chartingTools.js';
import { ChartTemplates } from '../tools/chartTemplates.js';

/**
 * Chart Agent - A Google Agent that can create charts from data
 */
export class ChartAgent {
  private chartingTools: ChartingTools;
  private agent: Agent;

  constructor() {
    this.chartingTools = new ChartingTools();
    this.agent = this.createAgent();
  }

  /**
   * Create the agent with charting tools
   */
  private createAgent(): Agent {
    const tools: Tool[] = [
      {
        name: 'create_line_chart',
        description:
          'Creates a line chart from the provided data. Useful for time series or trend visualization.',
        input_schema: {
          type: 'object',
          properties: {
            labels: {
              type: 'array',
              items: { type: 'string' },
              description: 'Array of labels for the x-axis (e.g., dates, categories)',
            },
            datasets: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  label: { type: 'string', description: 'Dataset label' },
                  data: {
                    type: 'array',
                    items: { type: 'number' },
                    description: 'Array of numeric values',
                  },
                  color: {
                    type: 'string',
                    description: 'Optional color (e.g., "rgb(255, 99, 132)")',
                  },
                },
                required: ['label', 'data'],
              },
              description: 'Array of datasets to plot',
            },
            title: {
              type: 'string',
              description: 'Chart title',
            },
            outputPath: {
              type: 'string',
              description: 'Path where to save the chart image',
            },
          },
          required: ['labels', 'datasets', 'outputPath'],
        },
      },
      {
        name: 'create_bar_chart',
        description:
          'Creates a bar chart for comparing values across categories. Great for comparisons.',
        input_schema: {
          type: 'object',
          properties: {
            labels: {
              type: 'array',
              items: { type: 'string' },
              description: 'Categories for the bars',
            },
            datasets: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  label: { type: 'string' },
                  data: { type: 'array', items: { type: 'number' } },
                  color: { type: 'string' },
                },
                required: ['label', 'data'],
              },
              description: 'Data for each bar group',
            },
            title: { type: 'string' },
            outputPath: { type: 'string' },
          },
          required: ['labels', 'datasets', 'outputPath'],
        },
      },
      {
        name: 'create_pie_chart',
        description:
          'Creates a pie chart showing distribution or percentages. Perfect for showing proportions.',
        input_schema: {
          type: 'object',
          properties: {
            labels: {
              type: 'array',
              items: { type: 'string' },
              description: 'Labels for each slice',
            },
            data: {
              type: 'array',
              items: { type: 'number' },
              description: 'Values for each slice',
            },
            title: { type: 'string' },
            outputPath: { type: 'string' },
          },
          required: ['labels', 'data', 'outputPath'],
        },
      },
      {
        name: 'create_scatter_plot',
        description:
          'Creates a scatter plot for visualizing correlations between two variables.',
        input_schema: {
          type: 'object',
          properties: {
            datasets: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  label: { type: 'string' },
                  data: {
                    type: 'array',
                    items: {
                      type: 'object',
                      properties: {
                        x: { type: 'number' },
                        y: { type: 'number' },
                      },
                      required: ['x', 'y'],
                    },
                  },
                  color: { type: 'string' },
                },
                required: ['label', 'data'],
              },
            },
            title: { type: 'string' },
            outputPath: { type: 'string' },
          },
          required: ['datasets', 'outputPath'],
        },
      },
      {
        name: 'create_chart_from_template',
        description:
          'Creates a chart using a predefined template. Available templates: timeSeries, comparison, distribution, multiMetric, progressGoal, correlation, stackedBar',
        input_schema: {
          type: 'object',
          properties: {
            template: {
              type: 'string',
              enum: [
                'timeSeries',
                'comparison',
                'distribution',
                'multiMetric',
                'progressGoal',
                'correlation',
                'stackedBar',
              ],
              description: 'The template to use',
            },
            data: {
              type: 'object',
              description:
                'Template-specific data. Structure varies by template. Check documentation for details.',
            },
            outputPath: { type: 'string' },
          },
          required: ['template', 'data', 'outputPath'],
        },
      },
    ];

    const agent = new Agent({
      name: 'ChartAgent',
      description: 'An agent that creates charts and graphs from data',
      tools,
      toolHandler: async (toolName: string, toolInput: any) => {
        return await this.handleToolCall(toolName, toolInput);
      },
    });

    return agent;
  }

  /**
   * Handle tool calls from the agent
   */
  private async handleToolCall(toolName: string, toolInput: any): Promise<any> {
    try {
      switch (toolName) {
        case 'create_line_chart':
          return await this.createLineChart(toolInput);

        case 'create_bar_chart':
          return await this.createBarChart(toolInput);

        case 'create_pie_chart':
          return await this.createPieChart(toolInput);

        case 'create_scatter_plot':
          return await this.createScatterPlot(toolInput);

        case 'create_chart_from_template':
          return await this.createChartFromTemplate(toolInput);

        default:
          return { error: `Unknown tool: ${toolName}` };
      }
    } catch (error) {
      return { error: `Error creating chart: ${(error as Error).message}` };
    }
  }

  /**
   * Create line chart
   */
  private async createLineChart(input: any) {
    const path = await this.chartingTools.createLineChart(
      input.labels,
      input.datasets,
      input.title,
      input.outputPath
    );

    return {
      success: true,
      message: `Line chart created successfully`,
      path,
      type: 'line',
    };
  }

  /**
   * Create bar chart
   */
  private async createBarChart(input: any) {
    const path = await this.chartingTools.createBarChart(
      input.labels,
      input.datasets,
      input.title,
      input.outputPath
    );

    return {
      success: true,
      message: `Bar chart created successfully`,
      path,
      type: 'bar',
    };
  }

  /**
   * Create pie chart
   */
  private async createPieChart(input: any) {
    const path = await this.chartingTools.createPieChart(
      input.labels,
      input.data,
      input.title,
      input.outputPath
    );

    return {
      success: true,
      message: `Pie chart created successfully`,
      path,
      type: 'pie',
    };
  }

  /**
   * Create scatter plot
   */
  private async createScatterPlot(input: any) {
    const path = await this.chartingTools.createScatterPlot(
      input.datasets,
      input.title,
      input.outputPath
    );

    return {
      success: true,
      message: `Scatter plot created successfully`,
      path,
      type: 'scatter',
    };
  }

  /**
   * Create chart from template
   */
  private async createChartFromTemplate(input: any) {
    const { template, data, outputPath } = input;
    let chartOptions: ChartOptions;

    switch (template) {
      case 'timeSeries':
        chartOptions = ChartTemplates.timeSeries(
          data.dates,
          data.values,
          data.title,
          data.seriesName
        );
        break;

      case 'comparison':
        chartOptions = ChartTemplates.comparison(
          data.categories,
          data.groups,
          data.title
        );
        break;

      case 'distribution':
        chartOptions = ChartTemplates.distribution(
          data.categories,
          data.values,
          data.title
        );
        break;

      case 'multiMetric':
        chartOptions = ChartTemplates.multiMetric(data.labels, data.metrics, data.title);
        break;

      case 'progressGoal':
        chartOptions = ChartTemplates.progressGoal(
          data.milestones,
          data.actual,
          data.target,
          data.title
        );
        break;

      case 'correlation':
        chartOptions = ChartTemplates.correlation(
          data.dataPoints,
          data.title,
          data.xLabel,
          data.yLabel
        );
        break;

      case 'stackedBar':
        chartOptions = ChartTemplates.stackedBar(
          data.categories,
          data.groups,
          data.title
        );
        break;

      default:
        return { error: `Unknown template: ${template}` };
    }

    const path = await this.chartingTools.generateChartToFile(chartOptions, outputPath);

    return {
      success: true,
      message: `Chart created from ${template} template`,
      path,
      template,
    };
  }

  /**
   * Get the agent instance
   */
  getAgent(): Agent {
    return this.agent;
  }

  /**
   * Process a message and generate charts as needed
   */
  async processMessage(message: string): Promise<string> {
    const response = await this.agent.chat(message);
    return response;
  }
}
