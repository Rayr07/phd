import { uploadPaper } from "../lib/uploadPaper"

const handleUpload = async (event) => {

  const file = event.target.files[0]

  const result = await uploadPaper(file)

  console.log("Uploaded:", result)
}