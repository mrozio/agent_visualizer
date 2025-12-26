import { ChartAgent } from '../src/agent/chartAgent.js';
import { ChartingTools } from '../src/tools/chartingTools.js';
import { ChartTemplates } from '../src/tools/chartTemplates.js';

/**
 * Example 1: Using ChartingTools directly
 */
async function directChartingExample() {
  console.log('Example 1: Direct Charting Tools Usage');
  console.log('========================================\n');

  const tools = new ChartingTools();

  // Create a line chart
  console.log('Creating line chart...');
  await tools.createLineChart(
    ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    [
      { label: 'Sales 2024', data: [65, 59, 80, 81, 56, 55] },
      { label: 'Sales 2025', data: [45, 69, 90, 91, 76, 85] },
    ],
    'Monthly Sales Comparison',
    './output/line-chart.png'
  );
  console.log('✓ Line chart saved to ./output/line-chart.png\n');

  // Create a bar chart
  console.log('Creating bar chart...');
  await tools.createBarChart(
    ['Product A', 'Product B', 'Product C', 'Product D'],
    [
      { label: 'Q1', data: [12, 19, 3, 5] },
      { label: 'Q2', data: [15, 23, 8, 12] },
    ],
    'Product Performance by Quarter',
    './output/bar-chart.png'
  );
  console.log('✓ Bar chart saved to ./output/bar-chart.png\n');

  // Create a pie chart
  console.log('Creating pie chart...');
  await tools.createPieChart(
    ['Desktop', 'Mobile', 'Tablet'],
    [55, 35, 10],
    'Traffic by Device',
    './output/pie-chart.png'
  );
  console.log('✓ Pie chart saved to ./output/pie-chart.png\n');

  // Create a scatter plot
  console.log('Creating scatter plot...');
  await tools.createScatterPlot(
    [
      {
        label: 'Dataset 1',
        data: [
          { x: 10, y: 20 },
          { x: 15, y: 25 },
          { x: 20, y: 30 },
          { x: 25, y: 22 },
          { x: 30, y: 35 },
        ],
      },
    ],
    'Correlation Analysis',
    './output/scatter-plot.png'
  );
  console.log('✓ Scatter plot saved to ./output/scatter-plot.png\n');
}

/**
 * Example 2: Using Chart Templates
 */
async function templateExample() {
  console.log('Example 2: Chart Templates Usage');
  console.log('=================================\n');

  const tools = new ChartingTools();

  // Time series template
  console.log('Creating time series chart...');
  const timeSeriesConfig = ChartTemplates.timeSeries(
    ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
    [100, 120, 115, 134],
    'Weekly Active Users',
    'Users'
  );
  await tools.generateChartToFile(timeSeriesConfig, './output/time-series.png');
  console.log('✓ Time series chart saved to ./output/time-series.png\n');

  // Distribution template
  console.log('Creating distribution chart...');
  const distributionConfig = ChartTemplates.distribution(
    ['Marketing', 'Development', 'Operations', 'Sales'],
    [30, 40, 15, 15],
    'Budget Distribution'
  );
  await tools.generateChartToFile(distributionConfig, './output/distribution.png');
  console.log('✓ Distribution chart saved to ./output/distribution.png\n');

  // Progress vs Goal template
  console.log('Creating progress tracking chart...');
  const progressConfig = ChartTemplates.progressGoal(
    ['Q1', 'Q2', 'Q3', 'Q4'],
    [25, 48, 72, 95],
    [30, 60, 90, 100],
    'Annual Goal Progress'
  );
  await tools.generateChartToFile(progressConfig, './output/progress.png');
  console.log('✓ Progress tracking chart saved to ./output/progress.png\n');

  // Multi-metric radar chart
  console.log('Creating multi-metric chart...');
  const multiMetricConfig = ChartTemplates.multiMetric(
    ['Speed', 'Reliability', 'Security', 'Usability', 'Features'],
    [
      { name: 'Product A', data: [90, 85, 95, 80, 70] },
      { name: 'Product B', data: [70, 90, 80, 95, 85] },
    ],
    'Product Comparison'
  );
  await tools.generateChartToFile(multiMetricConfig, './output/multi-metric.png');
  console.log('✓ Multi-metric chart saved to ./output/multi-metric.png\n');
}

/**
 * Example 3: Using the Chart Agent
 */
async function agentExample() {
  console.log('Example 3: Chart Agent Usage');
  console.log('=============================\n');

  const agent = new ChartAgent();

  console.log('Chart Agent initialized!');
  console.log(
    'The agent can process natural language requests to create charts.\n'
  );
  console.log('Example agent capabilities:');
  console.log('- create_line_chart: For trends and time series');
  console.log('- create_bar_chart: For comparisons');
  console.log('- create_pie_chart: For distributions');
  console.log('- create_scatter_plot: For correlations');
  console.log('- create_chart_from_template: Using predefined templates\n');

  console.log('You can integrate this agent with Google Chat or other platforms!');
}

/**
 * Example 4: Custom chart configuration
 */
async function customChartExample() {
  console.log('Example 4: Custom Chart Configuration');
  console.log('======================================\n');

  const tools = new ChartingTools(1200, 800); // Custom dimensions

  console.log('Creating custom styled chart...');

  const customConfig = {
    type: 'bar' as const,
    title: 'Revenue Growth',
    data: {
      labels: ['2020', '2021', '2022', '2023', '2024', '2025'],
      datasets: [
        {
          label: 'Revenue (in millions)',
          data: [2.5, 3.2, 4.1, 5.8, 7.2, 9.1],
          backgroundColor: 'rgba(54, 162, 235, 0.8)',
          borderColor: 'rgb(54, 162, 235)',
          borderWidth: 2,
        },
      ],
    },
    customConfig: {
      options: {
        scales: {
          y: {
            beginAtZero: true,
            title: {
              display: true,
              text: 'Revenue ($M)',
            },
          },
          x: {
            title: {
              display: true,
              text: 'Year',
            },
          },
        },
      },
    },
  };

  await tools.generateChartToFile(customConfig, './output/custom-chart.png');
  console.log('✓ Custom chart saved to ./output/custom-chart.png\n');
}

/**
 * Run all examples
 */
async function main() {
  console.log('Chart Agent Examples');
  console.log('====================\n');

  try {
    await directChartingExample();
    await templateExample();
    await agentExample();
    await customChartExample();

    console.log('\n✓ All examples completed successfully!');
    console.log('Check the ./output directory for generated charts.');
  } catch (error) {
    console.error('Error running examples:', error);
  }
}

// Run examples
main().catch(console.error);
