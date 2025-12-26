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
 * Example 3: Using the Google Gemini Chart Agent
 */
async function agentExample() {
  console.log('Example 3: Google Gemini Chart Agent Usage');
  console.log('============================================\n');

  console.log('NOTE: To use the agent with Google Gemini, you need:');
  console.log('1. A Google Cloud project with Vertex AI API enabled');
  console.log('2. Authentication set up (gcloud auth or service account)');
  console.log('3. Or use GOOGLE_API_KEY environment variable for Gemini API\n');

  const agent = new ChartAgent();

  console.log('Chart Agent initialized with Google ADK!');
  console.log('Model: gemini-2.0-flash-exp\n');

  console.log('The agent provides these function tools:');
  console.log('- create_line_chart: For trends and time series');
  console.log('- create_bar_chart: For comparisons');
  console.log('- create_pie_chart: For distributions');
  console.log('- create_scatter_plot: For correlations');
  console.log('- create_chart_from_template: Using predefined templates\n');

  console.log('Example usage:');
  console.log('const response = await agent.processMessage(');
  console.log('  "Create a line chart showing sales data: Jan=100, Feb=120, Mar=115"');
  console.log(');\n');

  console.log('For streaming responses:');
  console.log('for await (const chunk of agent.processMessageStream(message)) {');
  console.log('  console.log(chunk);');
  console.log('}\n');

  console.log('Integration options:');
  console.log('- Google Chat: Use Google Chat API webhooks');
  console.log('- Slack: Use Slack Bolt framework');
  console.log('- Discord: Use Discord.js');
  console.log('- Web API: Build REST or WebSocket endpoints\n');
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
 * Example 5: Google Chat Integration Pattern
 */
async function googleChatIntegrationExample() {
  console.log('Example 5: Google Chat Integration Pattern');
  console.log('===========================================\n');

  console.log('To integrate with Google Chat:\n');

  console.log('1. Set up a Google Chat app in Google Cloud Console');
  console.log('2. Configure webhook or Pub/Sub for receiving messages');
  console.log('3. Use the following pattern:\n');

  console.log('```typescript');
  console.log("import { ChartAgent } from './src/agent/chartAgent.js';");
  console.log('');
  console.log('const agent = new ChartAgent();');
  console.log('');
  console.log('// Handle Google Chat message');
  console.log('async function handleChatMessage(event) {');
  console.log('  const userMessage = event.message.text;');
  console.log('  ');
  console.log('  // Process with Gemini agent');
  console.log('  const response = await agent.processMessage(userMessage);');
  console.log('  ');
  console.log('  // Send response back to Google Chat');
  console.log('  return { text: response };');
  console.log('}');
  console.log('```\n');

  console.log('4. Deploy to Cloud Functions or Cloud Run');
  console.log('5. Charts will be created and saved locally or to Cloud Storage');
  console.log('6. Share chart URLs back in the chat\n');
}

/**
 * Run all examples
 */
async function main() {
  console.log('Google ADK Chart Agent Examples');
  console.log('================================\n');
  console.log('Powered by Google Gemini & Agent Development Kit\n');

  try {
    await directChartingExample();
    await templateExample();
    await agentExample();
    await customChartExample();
    await googleChatIntegrationExample();

    console.log('\n✓ All examples completed successfully!');
    console.log('Check the ./output directory for generated charts.');
    console.log('\nNext steps:');
    console.log('- Set up Google Cloud authentication to use the agent');
    console.log('- Integrate with Google Chat, Slack, or other platforms');
    console.log('- Customize chart templates for your use cases');
  } catch (error) {
    console.error('Error running examples:', error);
  }
}

// Run examples
main().catch(console.error);
