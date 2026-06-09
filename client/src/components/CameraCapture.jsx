import { useEffect, useRef, useState } from "react";

export default function CameraCapture({ onCapture }) {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [error, setError] = useState("");
  const [preview, setPreview] = useState("");
  const [isCameraReady, setIsCameraReady] = useState(false);
  const [isCapturing, setIsCapturing] = useState(false);

  useEffect(() => {
    let stream;
    const start = async () => {
      try {
        stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: "user" },
        });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.onloadedmetadata = () => {
            setIsCameraReady(true);
          };
        }
      } catch (_error) {
        setError("Camera permission is required for selfie attendance.");
      }
    };
    start();
    return () => {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  const capture = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;

    if (!video || !canvas) return;

    setIsCapturing(true);

    // Use setTimeout to show capture animation
    setTimeout(() => {
      canvas.width = video.videoWidth || 640;
      canvas.height = video.videoHeight || 480;
      const context = canvas.getContext("2d");

      // Draw video frame to canvas
      context.drawImage(video, 0, 0, canvas.width, canvas.height);

      // Optional: Add a subtle flash effect
      const image = canvas.toDataURL("image/jpeg", 0.75);
      setPreview(image);
      onCapture(image);

      setIsCapturing(false);
    }, 100);
  };

  const retakePhoto = () => {
    setPreview("");
    onCapture("");
  };

  return (
    <div className="space-y-4">
      {error ? (
        <div className="bg-red-50 dark:bg-red-900/20 border-l-4 border-red-500 dark:border-red-600 rounded-lg p-4">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <i className="fas fa-exclamation-triangle text-red-500 dark:text-red-300"></i>
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700 dark:text-red-200">{error}</p>
            </div>
          </div>
        </div>
      ) : (
        <>
          {/* Camera Preview Container */}
          <div className="relative bg-gray-900 rounded-2xl overflow-hidden shadow-xl">
            {!isCameraReady && !error && (
              <div className="absolute inset-0 flex items-center justify-center bg-gray-900 z-10">
                <div className="text-center">
                  <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-white mb-3"></div>
                  <p className="text-white text-sm">Initializing camera...</p>
                </div>
              </div>
            )}

            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="w-full h-auto max-h-96 object-cover rounded-2xl"
              style={{ minHeight: "240px" }}
            />

            {/* Camera Overlay Grid (optional for better framing) */}
            {isCameraReady && !preview && (
              <div className="absolute inset-0 pointer-events-none">
                <div className="absolute inset-0 border-2 border-white/20 rounded-2xl"></div>
                <div className="absolute top-1/2 left-0 right-0 h-px bg-white/20"></div>
                <div className="absolute left-1/2 top-0 bottom-0 w-px bg-white/20"></div>
                <div className="absolute top-1/4 left-1/4 right-1/4 bottom-1/4 border border-white/10 rounded-lg"></div>
              </div>
            )}

            {/* Flash Effect Overlay */}
            {isCapturing && (
              <div className="absolute inset-0 bg-white animate-pulse rounded-2xl pointer-events-none"></div>
            )}
          </div>

          {/* Capture Button and Controls */}
          <div className="flex flex-col sm:flex-row gap-3 items-center justify-center">
            {!preview ? (
              <button
                type="button"
                onClick={capture}
                disabled={!isCameraReady}
                className={`
                  relative group px-8 py-3 rounded-full font-semibold text-white 
                  transition-all duration-200 transform hover:scale-105 
                  focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500
                  ${
                    isCameraReady
                      ? "bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 shadow-lg"
                      : "bg-gray-400 cursor-not-allowed"
                  }
                `}
              >
                <span className="flex items-center gap-2">
                  <i className="fas fa-camera text-lg"></i>
                  Capture Selfie
                </span>

                {/* Pulsing ring effect when ready */}
                {isCameraReady && (
                  <span className="absolute inset-0 rounded-full animate-ping opacity-20 bg-indigo-500"></span>
                )}
              </button>
            ) : (
              <div className="flex gap-3 w-full sm:w-auto">
                <button
                  type="button"
                  onClick={retakePhoto}
                  className="flex-1 sm:flex-none px-6 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-white rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors duration-200 font-medium"
                >
                  <i className="fas fa-redo-alt mr-2"></i>
                  Retake
                </button>
                <button
                  type="button"
                  onClick={capture}
                  disabled={!isCameraReady}
                  className="flex-1 sm:flex-none px-6 py-2 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-lg hover:from-indigo-600 hover:to-purple-700 dark:from-indigo-500 dark:to-purple-600 dark:hover:from-indigo-600 dark:hover:to-purple-700 transition-all duration-200 font-medium shadow-md"
                >
                  <i className="fas fa-camera mr-2"></i>
                  Capture Again
                </button>
              </div>
            )}
          </div>

          {/* Preview Section */}
          {preview && (
            <div className="mt-4 p-4 bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-gray-800 dark:to-gray-700 rounded-xl border border-indigo-100 dark:border-gray-700">
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0">
                  <div className="relative">
                    <img
                      src={preview}
                      alt="Captured selfie preview"
                      className="w-20 h-20 rounded-xl object-cover shadow-md border-2 border-white"
                    />
                    <div className="absolute -top-1 -right-1 bg-green-500 rounded-full p-1">
                      <i className="fas fa-check text-white text-xs"></i>
                    </div>
                  </div>
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-800 dark:text-gray-100 flex items-center gap-2">
                    <i className="fas fa-check-circle text-green-500"></i>
                    Selfie captured successfully!
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    Preview image ready for attendance submission
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Camera Instructions */}
          {isCameraReady && !preview && (
            <div className="text-center text-xs text-gray-500 dark:text-gray-400 mt-2">
              <i className="fas fa-info-circle mr-1"></i>
              Position your face clearly in the frame and tap capture
            </div>
          )}
        </>
      )}

      {/* Hidden Canvas for Image Processing */}
      <canvas ref={canvasRef} hidden />
    </div>
  );
}
