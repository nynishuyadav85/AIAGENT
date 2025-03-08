import { createReactAgent } from '@langchain/langgraph/prebuilt';
import { ChatAnthropic } from '@langchain/anthropic'
import { tool } from '@langchain/core/tools';
import { z } from 'zod';
import { MemorySaver } from '@langchain/langgraph';


const weatherTool = tool(async ({ query }) => {
    return 'The weather in tokoyo is sunny'
},
    {
        name: 'weather',
        description: 'Get Weather in a given location',
        schema: z.object({
            query: z.string().describe("The location to get the weather for")
        })
    }
)
const model = new ChatAnthropic({
    model: 'claude-3-5-sonnet-latest',
})
const checkpointSaver = new MemorySaver()

export const agent = createReactAgent({
    llm: model,
    tools: [weatherTool],
    checkpointSaver
})

