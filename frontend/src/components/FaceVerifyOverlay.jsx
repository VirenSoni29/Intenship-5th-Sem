import { useContext, useEffect, useRef, useState } from "react";
import "../css/face-overlay.css";
import { AuthContext } from "../context/AuthContext";
import { loadModels } from "../face/loadModels";
import { generateDescriptor } from "../face/generateDescriptor";
import axios from "axios";
import { delay } from "../helpers/helpers";

const FaceVerifyOverlay = () => {
   const { backendUrl, setFaceVerified } = useContext(AuthContext);

   const videoRef = useRef(null);

   const [loading, setLoading] = useState(false);

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

            if (currentVideo) currentVideo.srcObject = stream;
         } catch (err) {
            console.log(err);
         }
      };

      initialize();

      return () => {
         if (currentVideo?.srcObject) {
            currentVideo.srcObject.getTracks().forEach((track) => track.stop());
         }
      };
   }, []);

   const verifyFace = async () => {
      setCamError("");
      setCamSuccess("");

      if (videoRef.current) videoRef.current.pause();

      try {
         setLoading(true);

         const descriptor = await generateDescriptor(videoRef.current);

         if (!descriptor) {
            setCamError("No face detected");
            if (videoRef.current) videoRef.current.play();
            return;
         }

         const { data } = await axios.post(
            `${backendUrl}/api/admin/verify-face`,
            { descriptor },
            { withCredentials: true },
         );

         if (data.success) {
            setFaceVerified(true);

            sessionStorage.setItem("faceVerified", "true");
            setCamSuccess(data.message);
            window.scrollTo(0, 0);
         } else {
            setCamError(data.message);
            if (videoRef.current) videoRef.current.play();
         }
      } catch (err) {
         setCamError(err.response?.data?.message || err.message);
         if (videoRef.current) videoRef.current.play();
      } finally {
         setLoading(false);
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

            const verifyFaceUsingKey = async () => {
               setCamError("");
               setCamSuccess("");

               if (videoRef.current) videoRef.current.pause();

               try {
                  setLoading(true);

                  const descriptor = await generateDescriptor(videoRef.current);

                  if (!descriptor) {
                     setCamError("No face detected");
                     if (videoRef.current) videoRef.current.play();
                     return;
                  }

                  const { data } = await axios.post(
                     `${backendUrl}/api/admin/verify-face`,
                     { descriptor },
                     { withCredentials: true },
                  );

                  if (data.success) {
                     await delay(1400);
                     setFaceVerified(true);

                     sessionStorage.setItem("faceVerified", "true");
                     setCamSuccess(data.message);
                     window.scrollTo(0, 0);
                  } else {
                     setCamError(data.message);
                     if (videoRef.current) videoRef.current.play();
                  }
               } catch (err) {
                  setCamError(err.response?.data?.message || err.message);
                  if (videoRef.current) videoRef.current.play();
               } finally {
                  setLoading(false);
               }
            };

            if (!loading) {
               verifyFaceUsingKey();
            }
         }
      };

      window.addEventListener("keydown", handleKeyDown);

      return () => {
         window.removeEventListener("keydown", handleKeyDown);
      };
   }, [loading, backendUrl, setFaceVerified]);

   return (
      <main className="biometric-main-viewport">
         <div className="face-module-container verify-module-modifier">
            <h2>Biometric Authentication</h2>
            <p className="subtitle">
               Verify identity matching your security enrollment parameters
            </p>
            {camError && <div className="auth-error">{camError}</div>}
            {camSuccess && <div className="auth-success">{camSuccess}</div>}
            <div className="scanner-viewport">
               <div className="scanner-hud"></div>
               <div
                  className={`scanner-laser ${loading ? "scanning-active" : ""}`}
               ></div>
               <video
                  ref={videoRef}
                  className="video-feed"
                  autoPlay
                  muted
                  playsInline
               />
            </div>
            <button
               type="button"
               className="face-btn btn-accent"
               onClick={verifyFace}
               disabled={loading}
            >
               {loading ? (
                  "Verifying Identity..."
               ) : (
                  <>
                     Verify Identity <kbd className="shortcut-key">K</kbd>
                  </>
               )}
            </button>
         </div>
      </main>
   );
};

export default FaceVerifyOverlay;
