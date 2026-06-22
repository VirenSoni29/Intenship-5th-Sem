import * as faceapi from 'face-api.js';

export const generateDescriptor = async (image) => {
   const detection = await faceapi
      .detectSingleFace(image, new faceapi.TinyFaceDetectorOptions())
      .withFaceLandmarks()
      .withFaceDescriptor();

   if (!detection) return null

   return Array.from(detection.descriptor)
};