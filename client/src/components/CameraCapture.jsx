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
    <div className="space-y-3 sm:space-y-4 w-full">
      {error ? (
        <div className="bg-red-50 dark:bg-red-900/20 border-l-4 border-red-500 dark:border-red-600 rounded-lg p-3 sm:p-4">
          <div className="flex items-start sm:items-center">
            <div className="shrink-0">
              <i className="fas fa-exclamation-triangle text-red-500 dark:text-red-300 text-sm sm:text-base"></i>
            </div>
            <div className="ml-2 sm:ml-3 flex-1">
              <p className="text-xs sm:text-sm text-red-700 dark:text-red-200 break-words">
                {error}
              </p>
            </div>
          </div>
        </div>
      ) : (
        <>
          {/* Camera Preview Container */}
          <div className="relative bg-gray-900 rounded-xl sm:rounded-2xl overflow-hidden shadow-xl">
            {!isCameraReady && !error && (
              <div className="absolute inset-0 flex items-center justify-center bg-gray-900 z-10">
                <div className="text-center px-4">
                  <div className="inline-block animate-spin rounded-full h-6 w-6 sm:h-8 sm:w-8 border-b-2 border-white mb-2 sm:mb-3"></div>
                  <p className="text-white text-xs sm:text-sm">
                    Initializing camera...
                  </p>
                </div>
              </div>
            )}

            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="w-full h-auto max-h-64 sm:max-h-80 md:max-h-96 object-cover rounded-xl sm:rounded-2xl"
              style={{ minHeight: "180px" }}
            />

            {/* Camera Overlay Grid (optional for better framing) */}
            {isCameraReady && !preview && (
              <div className="absolute inset-0 pointer-events-none">
                <div className="absolute inset-0 border-2 border-white/20 rounded-xl sm:rounded-2xl"></div>
                <div className="absolute top-1/2 left-0 right-0 h-px bg-white/20"></div>
                <div className="absolute left-1/2 top-0 bottom-0 w-px bg-white/20"></div>
                <div className="absolute top-1/4 left-1/4 right-1/4 bottom-1/4 border border-white/10 rounded-lg"></div>
              </div>
            )}

            {/* Flash Effect Overlay */}
            {isCapturing && (
              <div className="absolute inset-0 bg-white animate-pulse rounded-xl sm:rounded-2xl pointer-events-none"></div>
            )}

            {/* Face Frame Guide */}
            {isCameraReady && !preview && (
              <div className="absolute bottom-3 left-1/2 transform -translate-x-1/2 bg-black/60 backdrop-blur-sm rounded-full px-3 py-1 text-white text-[10px] sm:text-xs whitespace-nowrap">
                <i className="fas fa-smile-wink mr-1"></i>
                <span className="hidden xs:inline">
                  Position your face in the center
                </span>
                <span className="xs:hidden">Face center</span>
              </div>
            )}
          </div>

          {/* Capture Button and Controls */}
          <div className="flex flex-col xs:flex-row gap-2 sm:gap-3 items-center justify-center">
            {!preview ? (
              <button
                type="button"
                onClick={capture}
                disabled={!isCameraReady}
                className={`
                  relative w-full xs:w-auto group px-4 xs:px-6 sm:px-8 py-2.5 sm:py-3 
                  rounded-full font-semibold text-white text-sm sm:text-base
                  transition-all duration-200 transform hover:scale-105 
                  focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500
                  ${
                    isCameraReady
                      ? "bg-linear-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 shadow-lg"
                      : "bg-gray-400 cursor-not-allowed"
                  }
                `}
              >
                <span className="flex items-center justify-center gap-2">
                  <i className="fas fa-camera text-base sm:text-lg"></i>
                  <span>Capture Selfie</span>
                </span>

                {/* Pulsing ring effect when ready */}
                {isCameraReady && (
                  <span className="absolute inset-0 rounded-full animate-ping opacity-20 bg-indigo-500"></span>
                )}
              </button>
            ) : (
              <div className="flex flex-col xs:flex-row gap-2 sm:gap-3 w-full">
                <button
                  type="button"
                  onClick={retakePhoto}
                  className="flex-1 px-4 sm:px-6 py-2.5 sm:py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-white rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors duration-200 font-medium text-sm sm:text-base"
                >
                  <i className="fas fa-redo-alt mr-1 sm:mr-2"></i>
                  <span>Retake</span>
                </button>
                <button
                  type="button"
                  onClick={capture}
                  disabled={!isCameraReady}
                  className="flex-1 px-4 sm:px-6 py-2.5 sm:py-2 bg-linear-to-r from-indigo-500 to-purple-600 text-white rounded-lg hover:from-indigo-600 hover:to-purple-700 transition-all duration-200 font-medium shadow-md text-sm sm:text-base"
                >
                  <i className="fas fa-camera mr-1 sm:mr-2"></i>
                  <span>Capture Again</span>
                </button>
              </div>
            )}
          </div>

          {/* Preview Section */}
          {preview && (
            <div className="mt-3 sm:mt-4 p-3 sm:p-4 bg-linear-to-r from-indigo-50 to-purple-50 dark:from-gray-800 dark:to-gray-700 rounded-lg sm:rounded-xl border border-indigo-100 dark:border-gray-700">
              <div className="flex flex-col xs:flex-row items-start gap-3">
                <div className="shrink-0 self-center xs:self-start">
                  <div className="relative">
                    <img
                      src={preview}
                      alt="Captured selfie preview"
                      className="w-16 h-16 sm:w-20 sm:h-20 rounded-lg sm:rounded-xl object-cover shadow-md border-2 border-white"
                    />
                    <div className="absolute -top-1 -right-1 bg-green-500 rounded-full p-0.5 sm:p-1">
                      <i className="fas fa-check text-white text-[8px] sm:text-xs"></i>
                    </div>
                  </div>
                </div>
                <div className="flex-1 text-center xs:text-left">
                  <p className="text-xs sm:text-sm font-medium text-gray-800 dark:text-gray-100 flex flex-col xs:flex-row items-center gap-1 sm:gap-2">
                    <i className="fas fa-check-circle text-green-500 text-sm sm:text-base"></i>
                    <span>Selfie captured successfully!</span>
                  </p>
                  <p className="text-[10px] sm:text-xs text-gray-500 dark:text-gray-400 mt-0.5 sm:mt-1">
                    Preview image ready for attendance submission
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Camera Instructions */}
          {isCameraReady && !preview && (
            <div className="text-center text-[10px] sm:text-xs text-gray-500 dark:text-gray-400 mt-1 sm:mt-2 px-2">
              <i className="fas fa-info-circle mr-1 text-xs"></i>
              <span className="hidden xs:inline">
                Position your face clearly in the frame and tap capture
              </span>
              <span className="xs:hidden">Face in frame, tap capture</span>
            </div>
          )}
        </>
      )}

      {/* Hidden Canvas for Image Processing */}
      <canvas ref={canvasRef} hidden />
    </div>
  );
}
