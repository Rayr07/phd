import { NextResponse } from 'next/server'
import { generateText } from 'ai'
import { google } from '@ai-sdk/google'
import { createClient } from '@/utils/supabase/server'

export const maxDuration = 60; // Increase serverless timeout for heavy PDFs
export const dynamic = "force-dynamic"; // Bypass Vercel 404 caching lock

export async function POST(req: Request) {
  try {
    const supabase = await createClient()

    // 1. Enforce Authentication
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
        return NextResponse.json({ error: 'Unauthorized user.' }, { status: 401 })
    }

    const payload = await req.json()
    const { operation, domain, context, projectId, repoFiles, userFile } = payload

    // 2. We securely pass PDFs to Gemini's native multimodal file interface.
    const messageContent: any[] = []

    // Helper to download securely from Supabase Storage and push to buffer array
    async function downloadAndInject(path: string, prefixText: string) {
        const { data, error } = await supabase.storage.from('project_files').download(path)
        if (error || !data) {
            console.error("Failed to download file:", path, error)
            messageContent.push({ type: 'text', text: `[Warning: Core Document Failed to Download - ${path}]` })
            return
        }

        const arrayBuffer = await data.arrayBuffer()
        const buffer = Buffer.from(arrayBuffer)
        
        messageContent.push({ type: 'text', text: prefixText })
        messageContent.push({ 
            type: 'file', 
            mediaType: 'application/pdf', 
            data: buffer 
        })
    }

    // 3. Inject Repository PDFs (Reference Literature)
    if (repoFiles && repoFiles.length > 0) {
        messageContent.push({ type: 'text', text: '--- REFERENCE LITERATURE (Ground Truth) ---' })
        // Fetch files consecutively
        for (const fileName of repoFiles) {
            const filePath = `${user.id}/${projectId}/repo/${fileName}`
            await downloadAndInject(filePath, `Reference Document: ${fileName}\n`)
        }
    } else {
        messageContent.push({ type: 'text', text: '--- REFERENCE LITERATURE: None Provided ---' })
    }

    // 4. Inject User Uploaded PDF (Test Document)
    if (userFile) {
        messageContent.push({ type: 'text', text: '\n\n--- THE USER TEXT / PAPER UNDER REVIEW ---' })
        const filePath = `${user.id}/${projectId}/user/${userFile}`
        await downloadAndInject(filePath, `User Document: ${userFile}\n`)
    } else {
        messageContent.push({ type: 'text', text: '\n\n--- THE USER TEXT: None Provided ---' })
    }

    // Append user focus context
    if (context) {
        messageContent.push({ type: 'text', text: `\n\nUser Notes / Focus Context: ${context}` })
    }

    // 5. Structure AI System Instructions
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

    // 6. Generate Supercompute output payload
    const { text: result } = await generateText({
      model: google('gemini-1.5-pro'),
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
