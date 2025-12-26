import { ChartAgent } from './agent/chartAgent.js';
import { ChartingTools } from './tools/chartingTools.js';
import { ChartTemplates } from './tools/chartTemplates.js';

export { ChartAgent, ChartingTools, ChartTemplates };

/**
 * Main entry point for the agent visualizer
 */
export async function main() {
  console.log('Chart Agent Visualizer');
  console.log('======================\n');

  const agent = new ChartAgent();

  console.log('Chart Agent initialized and ready to create visualizations!');
  console.log('Use the ChartAgent to process messages and generate charts.\n');

  return agent;
}

// Run if executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch(console.error);
}
