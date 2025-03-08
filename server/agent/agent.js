import { createReactAgent } from '@langchain/langgraph/prebuilt';
import { ChatAnthropic } from '@langchain/anthropic'
import { tool } from '@langchain/core/tools';
import { z } from 'zod';
import { MemorySaver } from '@langchain/langgraph';


const weatherTool = tool(async ({ query }) => {
    console.log('querying weather', query)
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
const agent = createReactAgent({
    llm: model,
    tools: [weatherTool],
    checkpointSaver
})


const result = await agent.invoke({
    messages: [
        {
            role: 'user',
            content: 'What is the weather in Tokyo?'
        }
    ]
}, {
    configurable: { thread_id: 42 }
})

const followUp = await agent.invoke({
    messages: [
        {
            role: 'user',
            content: 'What city is this about?'
        }
    ]
}, {
    configurable: { thread_id: 42 }
})

console.log(result.messages.at(-1)?.content);
console.log("followUp : " + followUp.messages.at(-1)?.content);