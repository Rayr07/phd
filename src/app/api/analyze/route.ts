import { NextResponse } from 'next/server'
import { generateText } from 'ai'
import { google } from '@ai-sdk/google'

export const maxDuration = 60; // Increase serverless timeout for heavy PDFs

export async function POST(req: Request) {
  try {
    const formData = await req.formData()
    const operation = formData.get('operation') as string
    const domain = formData.get('domain') as string
    const contextStr = formData.get('context') as string

    // Extract PDFs
    const repoFiles = formData.getAll('repoFiles') as File[]
    const userFile = formData.get('userFile') as File | null

    // We will securely pass PDFs to Gemini's native multimodal file interface.
    const messageContent: any[] = []

    // Helper to add files to content array
    async function addFileToContent(file: File, prefixText: string) {
      const arrayBuffer = await file.arrayBuffer()
      const buffer = Buffer.from(arrayBuffer)

      messageContent.push({ type: 'text', text: prefixText })
      messageContent.push({
        type: 'file',
        mediaType: 'application/pdf',
        data: buffer
      })
    }

    if (repoFiles.length > 0) {
      messageContent.push({ type: 'text', text: '--- REFERENCE LITERATURE (Ground Truth) ---' })
      for (const file of repoFiles) {
        await addFileToContent(file, `Reference Document: ${file.name}\n`)
      }
    } else {
      messageContent.push({ type: 'text', text: '--- REFERENCE LITERATURE: None Provided ---' })
    }

    if (userFile) {
      messageContent.push({ type: 'text', text: '\n\n--- THE USER TEXT / PAPER UNDER REVIEW ---' })
      await addFileToContent(userFile, `User Document: ${userFile.name}\n`)
    } else {
      messageContent.push({ type: 'text', text: '\n\n--- THE USER TEXT: None Provided ---' })
    }

    // Append context
    if (contextStr) {
      messageContent.push({ type: 'text', text: `\n\nUser Notes / Focus Context: ${contextStr}` })
    }

    let systemInstruction = ''
    if (operation === 'contradiction') {
      systemInstruction = `You are a strict academic reviewer for the domain of ${domain}. Detect explicit contradictions, unsupported claims, or methodology mismatches between the provided User Document and the Reference Literature.`
      messageContent.push({ type: 'text', text: `\n\nTask: Identify explicit contradictions in the User Document when strictly compared against the Reference Literature.` })
    } else if (operation === 'validation') {
      systemInstruction = `You are an expert academic editor. Evaluate Claim & Citation Validation.`
      messageContent.push({ type: 'text', text: `\n\nTask: Verify whether the claims made in the User Document are factually supported by the Reference Literature. Flag hallucinations and discrepancies.` })
    } else if (operation === 'hypothesis') {
      systemInstruction = `You are an innovative principal investigator within the domain of ${domain}.`
      messageContent.push({ type: 'text', text: `\n\nTask: Using strictly the Reference Literature provided, synthesize the current state of the art, pinpoint profound research gaps, and propose 2-3 extremely novel hypotheses.` })
    } else {
      return NextResponse.json({ error: 'Invalid operation type' }, { status: 400 })
    }

    const { text: result } = await generateText({
      model: google('gemini-1.5-flash'),
      system: systemInstruction,
      messages: [
        {
          role: 'user',
          content: messageContent
        }
      ]
    })

    return NextResponse.json({ result })

  } catch (error: any) {
    console.error('Analysis Error:', error)
    return NextResponse.json({ error: error.message || 'Failed to process AI request' }, { status: 500 })
  }
}
