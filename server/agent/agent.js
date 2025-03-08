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



const jsExecutor = tool(async ({ code }) => {
    const result = await fetch(process.env.EXECUTOR_URL || '', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ code })
    }).then(res => res.json())
    return result
}, {
    name: "js",
    description: `Run general purpose javascript code. 
      This can be used to access Internet or do any computation that you need. 
      The output will be composed of the stdout and stderr. 
      The code should be written in a way that it can be executed with javascript eval in node environment.`,
    schema: z.object({
        code: z.string()?.describe("Code to be excuted")
    })
})
const model = new ChatAnthropic({
    model: 'claude-3-5-sonnet-latest',
})
const checkpointSaver = new MemorySaver()

export const agent = createReactAgent({
    llm: model,
    tools: [weatherTool, jsExecutor],
    checkpointSaver
})

