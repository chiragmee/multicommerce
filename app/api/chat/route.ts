import { NextRequest, NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

export async function POST(req: NextRequest) {
  try {
    const { messages, systemPrompt } = await req.json()

    const response = await anthropic.messages.create({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 1000,
      system: systemPrompt,
      messages,
    })

    return NextResponse.json(response)
  } catch (error) {
    console.error('Anthropic API error:', error)
    return NextResponse.json({ error: 'Failed to get AI response' }, { status: 500 })
  }
}
