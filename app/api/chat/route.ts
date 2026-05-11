import { NextRequest, NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

export async function POST(req: NextRequest) {
  try {
    const { messages, systemPrompt } = await req.json()

    const response = await anthropic.messages.create({
      model: 'claude-3-5-haiku-20241022',
      max_tokens: 1000,
      system: systemPrompt,
      messages,
    })

    return NextResponse.json(response)
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error)
    console.error('Anthropic API error:', message)
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
