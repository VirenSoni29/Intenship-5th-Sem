import { useContext, useEffect, useRef, useState } from "react";
import "../css/face-overlay.css";
import { AuthContext } from "../context/AuthContext";
import { loadModels } from "../face/loadModels";
import { generateDescriptor } from "../face/generateDescriptor";
import axios from "axios";
import { averageDescriptors } from "../face/averageDescriptors";
import { delay } from "../helpers/helpers";

const FaceEnrollOverlay = () => {
   const { backendUrl, getUserData, setFaceVerified } = useContext(AuthContext);

   const videoRef = useRef(null);

   const [samples, setSamples] = useState([]);
   const [loading, setLoading] = useState(false);
   const [modelsReady, setModelsReady] = useState(false);

   const [camError, setCamError] = useState("");
   const [camSuccess, setCamSuccess] = useState("");

   useEffect(() => {
      const currentVideo = videoRef.current;

      const initialize = async () => {
         try {
            await loadModels();

            const stream = await navigator.mediaDevices.getUserMedia({
               video: true,
            });

            if (currentVideo) {
               currentVideo.srcObject = stream;
            }

            setModelsReady(true);
         } catch (err) {
            console.log(err.message);
         }
      };

      initialize();

      return () => {
         if (currentVideo?.srcObject) {
            currentVideo.srcObject.getTracks().forEach((track) => track.stop());
         }
      };
   }, []);

   const captureSample = async () => {
      setCamError("");
      setCamSuccess("");

      if (videoRef.current) videoRef.current.pause();

      try {
         const descriptor = await generateDescriptor(videoRef.current);

         if (!descriptor) {
            setCamError("No face detected");
            if (videoRef.current) videoRef.current.play();
            return;
         }

         setSamples((prev) => [...prev, descriptor]);
      } catch (err) {
         console.log(err);
      } finally {
         if (videoRef.current) videoRef.current.play();
      }
   };

   useEffect(() => {
      const handleKeyDown = (event) => {
         if (event.key.toLowerCase() === "k") {
            const activeEl = document.activeElement;
            if (
               activeEl &&
               (activeEl.tagName === "INPUT" ||
                  activeEl.tagName === "TEXTAREA" ||
                  activeEl.isContentEditable)
            ) {
               return;
            }

            event.preventDefault();

            const captureUsingKey = async () => {
               setCamError("");
               setCamSuccess("");

               if (videoRef.current) videoRef.current.pause();

               try {
                  const descriptor = await generateDescriptor(videoRef.current);

                  if (!descriptor) {
                     setCamError("No face detected");
                     if (videoRef.current) videoRef.current.play();
                     return;
                  }

                  setSamples((prev) => [...prev, descriptor]);
               } catch (err) {
                  console.log(err);
                  if (videoRef.current) videoRef.current.play();
               } finally {
                  if (videoRef.current) videoRef.current.play();
               }
            };

            if (modelsReady && samples.length < 5) {
               captureUsingKey();
            }
         }
      };

      window.addEventListener("keydown", handleKeyDown);

      return () => {
         window.removeEventListener("keydown", handleKeyDown);
      };
   }, [modelsReady, samples]);

   const handleEnrollment = async () => {
      setCamError('')
      setCamSuccess('')

         if (videoRef.current) videoRef.current.pause();
            
      try {
         setLoading(true);

         const averagedDescriptor = averageDescriptors(samples);

         const { data } = await axios.post(
            `${backendUrl}/api/admin/enroll-face`,
            { descriptor: averagedDescriptor },
            { withCredentials: true },
         );

         if (data.success) {
            await getUserData();
            await delay(1400);
            setFaceVerified(true);

            sessionStorage.setItem("faceVerified", "true");

            setCamSuccess(data.message);
            window.scrollTo(0, 0)
         }
      } catch (err) {
         setCamError(err.response?.data?.message || err.message);
      } finally {
         setLoading(false);
         if (videoRef.current) videoRef.current.play();
      }
   };

   return (
      <main className="biometric-main-viewport">
         <div className="face-module-container">
            <h2>Biometric Security</h2>
            <p className="subtitle">
               Position your face clearly in front of the camera module
            </p>
            {camError && <div className="auth-error">{camError}</div>}
            {camSuccess && <div className="auth-success">{camSuccess}</div>}
            <div className="scanner-viewport">
               <div className="scanner-hud"></div>
               <div className="scanner-laser"></div>
               <video
                  ref={videoRef}
                  className="video-feed"
                  autoPlay
                  muted
                  playsInline
               />
            </div>
            <div className="samples-tracker">
               <span className="samples-label">
                  Captured Samples: {samples.length} / 5
               </span>
               <div className="progress-nodes">
                  {Array.from({ length: 5 }).map((_, index) => (
                     <div
                        key={index}
                        className={`node ${
                           index < samples.length
                              ? samples.length === 5
                                 ? "complete"
                                 : "active"
                              : ""
                        }`}
                     />
                  ))}
               </div>
            </div>
            <div className="action-controls">
               <button
                  type="button"
                  className="face-btn btn-outline"
                  onClick={captureSample}
                  disabled={!modelsReady || samples.length >= 5}
               >
                  Capture Sample Frame <kbd className="shortcut-key">K</kbd>
               </button>
               {samples.length === 5 && (
                  <button
                     type="button"
                     className="face-btn btn-success"
                     onClick={handleEnrollment}
                     disabled={loading}
                  >
                     {loading
                        ? "Processing Encryption..."
                        : "Complete Face Registration"}
                  </button>
               )}
            </div>
         </div>
      </main>
   );
};

export default FaceEnrollOverlay;
