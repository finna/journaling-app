import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { title, content } = await request.json()

    if (!title || !content) {
      return NextResponse.json({ error: 'Title and content are required' }, { status: 400 })
    }

    const apiKey = process.env.OPENAI_API_KEY
    if (!apiKey) {
      return NextResponse.json(
        { error: 'API key not configured' },
        { status: 500 }
      )
    }

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'gpt-5.1-chat-latest',
        max_completion_tokens: 1024,
        temperature: 1,
        reasoning_effort: 'medium',
        messages: [
          {
            role: 'user',
            content: `Please analyze this journal entry and provide insights. Be concise and thoughtful.

Title: ${title}

Content:
${content}

Provide analysis in the following format:
1. **Mood & Tone**: Brief description of the emotional tone
2. **Key Themes**: Main topics or themes identified
3. **Insights**: Meaningful observations or patterns
4. **Suggestions**: Optional constructive suggestions for reflection`,
          },
        ],
      }),
    })

    if (!response.ok) {
      const error = await response.json()
      console.error('OpenAI API error:', error)
      return NextResponse.json(
        { error: 'Failed to analyze entry', details: error },
        { status: response.status }
      )
    }

    const data = await response.json()
    const analysis = data.choices[0]?.message?.content || ''

    return NextResponse.json({ analysis })
  } catch (error) {
    console.error('Analysis error:', error)
    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}
