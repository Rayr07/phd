import { supabase } from './supabaseClient'

export async function uploadPaper(file) {

  const filePath = `papers/${Date.now()}-${file.name}`

  const { data, error } = await supabase.storage
    .from('papers')
    .upload(filePath, file)

  if (error) {
    console.error(error)
    return null
  }

  // save metadata in DB
  const { data: paperData, error: dbError } = await supabase
    .from('papers')
    .insert([
      {
        filename: file.name,
        storage_path: filePath
      }
    ])
    .select()

  if (dbError) {
    console.error(dbError)
  }

  return paperData
}