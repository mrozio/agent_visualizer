"""
Data Analysis Agent - Python ADK Agent
Works alongside the TypeScript Chart Agent for complete data workflow
"""

from adk import LlmAgent, FunctionTool
from typing import Dict, List, Any
import json

class DataAgent:
    """
    Python agent that analyzes data and prepares it for visualization.
    This agent can:
    - Calculate statistics
    - Transform data
    - Generate insights
    - Prepare data for the TypeScript Chart Agent
    """

    def __init__(self):
        self.agent = self._create_agent()

    def _create_agent(self) -> LlmAgent:
        """Create the data analysis agent with tools"""

        # Tool: Calculate statistics
        calculate_stats_tool = FunctionTool(
            name="calculate_statistics",
            description="Calculate statistical measures (mean, median, sum, min, max) from numerical data",
            parameters={
                "type": "object",
                "properties": {
                    "data": {
                        "type": "array",
                        "items": {"type": "number"},
                        "description": "Array of numbers to analyze"
                    },
                    "metrics": {
                        "type": "array",
                        "items": {
                            "type": "string",
                            "enum": ["mean", "median", "sum", "min", "max", "count"]
                        },
                        "description": "Which statistics to calculate"
                    }
                },
                "required": ["data", "metrics"]
            },
            func=self._calculate_statistics
        )

        # Tool: Transform data for charting
        transform_data_tool = FunctionTool(
            name="transform_for_chart",
            description="Transform raw data into format suitable for chart creation",
            parameters={
                "type": "object",
                "properties": {
                    "data": {
                        "type": "object",
                        "description": "Raw data object"
                    },
                    "chart_type": {
                        "type": "string",
                        "enum": ["line", "bar", "pie", "scatter"],
                        "description": "Target chart type"
                    }
                },
                "required": ["data", "chart_type"]
            },
            func=self._transform_for_chart
        )

        # Tool: Generate insights
        generate_insights_tool = FunctionTool(
            name="generate_insights",
            description="Analyze data and generate textual insights",
            parameters={
                "type": "object",
                "properties": {
                    "data": {
                        "type": "object",
                        "description": "Data to analyze"
                    }
                },
                "required": ["data"]
            },
            func=self._generate_insights
        )

        # Create agent
        agent = LlmAgent(
            name="data_analyst",
            description="An agent that analyzes data and prepares it for visualization",
            model="gemini-3-flash",
            instruction="""You are a helpful data analysis assistant. You can:

1. Calculate statistics from numerical data
2. Transform data into chart-friendly formats
3. Generate insights from data patterns

When working with data:
- Use calculate_statistics to get numerical insights
- Use transform_for_chart to prepare data for visualization
- Use generate_insights to identify patterns and trends

You work alongside a Chart Agent that will visualize your prepared data.""",
            tools=[calculate_stats_tool, transform_data_tool, generate_insights_tool]
        )

        return agent

    def _calculate_statistics(self, data: List[float], metrics: List[str]) -> Dict[str, Any]:
        """Calculate statistical measures"""
        import statistics

        results = {}

        if "mean" in metrics:
            results["mean"] = statistics.mean(data)
        if "median" in metrics:
            results["median"] = statistics.median(data)
        if "sum" in metrics:
            results["sum"] = sum(data)
        if "min" in metrics:
            results["min"] = min(data)
        if "max" in metrics:
            results["max"] = max(data)
        if "count" in metrics:
            results["count"] = len(data)

        return {
            "success": True,
            "statistics": results,
            "data_points": len(data)
        }

    def _transform_for_chart(self, data: Dict[str, Any], chart_type: str) -> Dict[str, Any]:
        """Transform data for chart creation"""

        # Example transformations based on chart type
        if chart_type == "line" or chart_type == "bar":
            # Expect data with labels and values
            return {
                "success": True,
                "chart_type": chart_type,
                "labels": data.get("labels", []),
                "datasets": data.get("datasets", []),
                "ready_for_chart": True
            }

        elif chart_type == "pie":
            # Expect data with categories and values
            return {
                "success": True,
                "chart_type": "pie",
                "labels": data.get("categories", []),
                "data": data.get("values", []),
                "ready_for_chart": True
            }

        elif chart_type == "scatter":
            # Expect x,y coordinate pairs
            return {
                "success": True,
                "chart_type": "scatter",
                "datasets": data.get("datasets", []),
                "ready_for_chart": True
            }

        return {"success": False, "error": "Unknown chart type"}

    def _generate_insights(self, data: Dict[str, Any]) -> Dict[str, Any]:
        """Generate insights from data"""

        insights = []

        # Check for data with values
        if "values" in data:
            values = data["values"]
            if values:
                avg = sum(values) / len(values)
                max_val = max(values)
                min_val = min(values)

                insights.append(f"Average value: {avg:.2f}")
                insights.append(f"Range: {min_val} to {max_val}")

                # Trend detection
                if len(values) >= 2:
                    if values[-1] > values[0]:
                        insights.append("📈 Overall upward trend")
                    elif values[-1] < values[0]:
                        insights.append("📉 Overall downward trend")
                    else:
                        insights.append("➡️ Stable trend")

        # Check for categorical data
        if "categories" in data and "values" in data:
            categories = data["categories"]
            values = data["values"]

            if categories and values:
                max_idx = values.index(max(values))
                insights.append(f"Highest: {categories[max_idx]} ({values[max_idx]})")

        return {
            "success": True,
            "insights": insights,
            "insight_count": len(insights)
        }

    async def process_message(self, message: str) -> str:
        """Process a message with the data agent"""
        response = await self.agent.generate(message)
        return response.text or "Analysis complete."

    def get_agent(self) -> LlmAgent:
        """Get the agent instance for multi-agent orchestration"""
        return self.agent


# Example usage
if __name__ == "__main__":
    import asyncio

    async def main():
        print("Data Analysis Agent (Python)")
        print("=" * 40)
        print()

        agent = DataAgent()

        # Example: Calculate statistics
        print("Example 1: Calculate Statistics")
        response = await agent.process_message(
            "Calculate mean, median, and max for this data: [10, 20, 30, 40, 50]"
        )
        print(response)
        print()

        # Example: Generate insights
        print("Example 2: Generate Insights")
        response = await agent.process_message(
            "Analyze this sales data and give insights: {'categories': ['Q1', 'Q2', 'Q3', 'Q4'], 'values': [100, 120, 95, 140]}"
        )
        print(response)
        print()

    asyncio.run(main())
