import sharp from 'sharp'
import path from 'path'

const processImage = async (imagePath) => {
   sharp.cache(false)
      
   const processedImagePath = `uploads/processed/processed-${path.basename(imagePath)}`

   await sharp(imagePath)
         .resize({ width: 1200 })
         .grayscale()
         .normalize()
         .sharpen({ sigma: 4 })
         .toFile(processedImagePath)

   return processedImagePath
}

export default processImage