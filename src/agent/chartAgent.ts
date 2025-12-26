import { LlmAgent, FunctionTool } from '@google/adk';
import { z } from 'zod';
import { ChartingTools } from '../tools/chartingTools.js';
import { ChartTemplates } from '../tools/chartTemplates.js';

/**
 * Chart Agent - A Google Gemini Agent that can create charts from data
 * Built with Google's Agent Development Kit (ADK)
 */
export class ChartAgent {
  private chartingTools: ChartingTools;
  private agent: LlmAgent;

  constructor(apiKey?: string) {
    this.chartingTools = new ChartingTools();
    this.agent = this.createAgent(apiKey);
  }

  /**
   * Create the agent with charting tools using Google ADK
   */
  private createAgent(apiKey?: string): LlmAgent {
    // Create line chart tool
    const createLineChartTool = new FunctionTool({
      name: 'create_line_chart',
      description:
        'Creates a line chart from the provided data. Useful for time series or trend visualization. Returns the file path where the chart was saved.',
      parameters: z.object({
        labels: z
          .array(z.string())
          .describe('Array of labels for the x-axis (e.g., dates, categories)'),
        datasets: z
          .array(
            z.object({
              label: z.string().describe('Dataset label'),
              data: z.array(z.number()).describe('Array of numeric values'),
              color: z
                .string()
                .optional()
                .describe('Optional color (e.g., "rgb(255, 99, 132)")'),
            })
          )
          .describe('Array of datasets to plot'),
        title: z.string().optional().describe('Chart title'),
        outputPath: z.string().describe('Path where to save the chart image'),
      }),
      func: async ({ labels, datasets, title, outputPath }) => {
        const path = await this.chartingTools.createLineChart(
          labels,
          datasets,
          title,
          outputPath
        );
        return {
          success: true,
          message: `Line chart created successfully`,
          path,
          type: 'line',
        };
      },
    });

    // Create bar chart tool
    const createBarChartTool = new FunctionTool({
      name: 'create_bar_chart',
      description:
        'Creates a bar chart for comparing values across categories. Great for comparisons. Returns the file path where the chart was saved.',
      parameters: z.object({
        labels: z.array(z.string()).describe('Categories for the bars'),
        datasets: z
          .array(
            z.object({
              label: z.string(),
              data: z.array(z.number()),
              color: z.string().optional(),
            })
          )
          .describe('Data for each bar group'),
        title: z.string().optional().describe('Chart title'),
        outputPath: z.string().describe('Path where to save the chart image'),
      }),
      func: async ({ labels, datasets, title, outputPath }) => {
        const path = await this.chartingTools.createBarChart(
          labels,
          datasets,
          title,
          outputPath
        );
        return {
          success: true,
          message: `Bar chart created successfully`,
          path,
          type: 'bar',
        };
      },
    });

    // Create pie chart tool
    const createPieChartTool = new FunctionTool({
      name: 'create_pie_chart',
      description:
        'Creates a pie chart showing distribution or percentages. Perfect for showing proportions. Returns the file path where the chart was saved.',
      parameters: z.object({
        labels: z.array(z.string()).describe('Labels for each slice'),
        data: z.array(z.number()).describe('Values for each slice'),
        title: z.string().optional().describe('Chart title'),
        outputPath: z.string().describe('Path where to save the chart image'),
      }),
      func: async ({ labels, data, title, outputPath }) => {
        const path = await this.chartingTools.createPieChart(
          labels,
          data,
          title,
          outputPath
        );
        return {
          success: true,
          message: `Pie chart created successfully`,
          path,
          type: 'pie',
        };
      },
    });

    // Create scatter plot tool
    const createScatterPlotTool = new FunctionTool({
      name: 'create_scatter_plot',
      description:
        'Creates a scatter plot for visualizing correlations between two variables. Returns the file path where the chart was saved.',
      parameters: z.object({
        datasets: z
          .array(
            z.object({
              label: z.string(),
              data: z.array(
                z.object({
                  x: z.number(),
                  y: z.number(),
                })
              ),
              color: z.string().optional(),
            })
          )
          .describe('Array of datasets with x,y coordinates'),
        title: z.string().optional().describe('Chart title'),
        outputPath: z.string().describe('Path where to save the chart image'),
      }),
      func: async ({ datasets, title, outputPath }) => {
        const path = await this.chartingTools.createScatterPlot(
          datasets,
          title,
          outputPath
        );
        return {
          success: true,
          message: `Scatter plot created successfully`,
          path,
          type: 'scatter',
        };
      },
    });

    // Create chart from template tool
    const createChartFromTemplateTool = new FunctionTool({
      name: 'create_chart_from_template',
      description:
        'Creates a chart using a predefined template. Available templates: timeSeries (for trends over time), comparison (for comparing groups), distribution (for pie charts), multiMetric (radar chart), progressGoal (actual vs target), correlation (x vs y scatter), stackedBar (stacked bars). Returns the file path where the chart was saved.',
      parameters: z.object({
        template: z
          .enum([
            'timeSeries',
            'comparison',
            'distribution',
            'multiMetric',
            'progressGoal',
            'correlation',
            'stackedBar',
          ])
          .describe('The template to use'),
        data: z.record(z.any()).describe('Template-specific data as a JSON object'),
        outputPath: z.string().describe('Path where to save the chart image'),
      }),
      func: async ({ template, data, outputPath }) => {
        return await this.createChartFromTemplate(template, data, outputPath);
      },
    });

    // Create the Gemini agent with all chart tools
    const agent = new LlmAgent({
      name: 'chart_agent',
      description: 'An agent that creates charts and graphs from data',
      model: 'gemini-2.0-flash-exp',
      instruction: `You are a helpful chart creation assistant. You can create various types of charts and graphs from data provided by users.

Available chart types:
- Line charts: Best for time series data, trends over time
- Bar charts: Best for comparing values across categories
- Pie charts: Best for showing distributions and percentages
- Scatter plots: Best for showing correlations between two variables
- Templates: Pre-configured charts for common use cases

When creating charts:
1. Choose the appropriate chart type based on the data and user's needs
2. Use meaningful labels and titles
3. Save charts with descriptive file names (e.g., "./charts/sales-2024.png")
4. Return the file path to the user so they can view the chart

Always be helpful and suggest the best chart type if the user is unsure.`,
      tools: [
        createLineChartTool,
        createBarChartTool,
        createPieChartTool,
        createScatterPlotTool,
        createChartFromTemplateTool,
      ],
    });

    return agent;
  }

  /**
   * Create chart from template
   */
  private async createChartFromTemplate(
    template: string,
    data: any,
    outputPath: string
  ) {
    let chartOptions;

    try {
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
          chartOptions = ChartTemplates.multiMetric(
            data.labels,
            data.metrics,
            data.title
          );
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

      const path = await this.chartingTools.generateChartToFile(
        chartOptions,
        outputPath
      );

      return {
        success: true,
        message: `Chart created from ${template} template`,
        path,
        template,
      };
    } catch (error) {
      return {
        error: `Error creating chart from template: ${(error as Error).message}`,
      };
    }
  }

  /**
   * Get the agent instance
   */
  getAgent(): LlmAgent {
    return this.agent;
  }

  /**
   * Process a message and generate charts as needed
   * This uses Gemini's streaming response
   */
  async processMessage(message: string): Promise<string> {
    try {
      // Use the agent's generate method to process the message
      const response = await this.agent.generate(message);
      return response.text || 'Chart created successfully.';
    } catch (error) {
      console.error('Error processing message:', error);
      return `Error: ${(error as Error).message}`;
    }
  }

  /**
   * Process a message with streaming support
   */
  async *processMessageStream(message: string): AsyncGenerator<string, void, unknown> {
    try {
      // Use streaming generation for real-time responses
      const stream = await this.agent.generateStream(message);

      for await (const chunk of stream) {
        if (chunk.text) {
          yield chunk.text;
        }
      }
    } catch (error) {
      console.error('Error in streaming:', error);
      yield `Error: ${(error as Error).message}`;
    }
  }
}
