import { createWorker } from 'tesseract.js'

const runOCR = async (imagePath) => {
   const worker = await createWorker('eng')
   
   const result = await worker.recognize(imagePath)
   await worker.terminate()
   
   return result.data.text
}

export default runOCR