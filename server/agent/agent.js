import { createReactAgent } from '@langchain/langgraph/prebuilt';
import { ChatAnthropic } from '@langchain/anthropic'

const model = new ChatAnthropic({
    model: 'claude-3-5-sonnet-latest',
})

const agent = createReactAgent({
    llm: model,
    tools: []
})


const result = await agent.invoke({
    messages: [
        {
            role: 'user',
            content: 'Hello, how can you help me?'
        }
    ]
})

console.log(result.messages.at(-1)?.content);