export default function calculateFaceDistance(des1, des2) {

   if (des1.length !== des2.length) {
      throw new Error("Descriptor lengths do not match!")
   }

   let sum = 0

   for (let i = 0; i < des1.length; i++) {
      const diff = des1[i] - des2[i]

      sum += diff * diff
   }

   return Math.sqrt(sum)
}