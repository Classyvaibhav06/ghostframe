import { useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { UploadCloud, FileWarning } from "lucide-react";
import { cn } from "../../lib/utils";

const ACCEPTED_TYPES = ["video/", "image/"];
const MAX_SIZE_MB = 500;

export const FileUpload = ({ onChange, className, maxSizeMb = MAX_SIZE_MB }) => {
  const [isDragActive, setIsDragActive] = useState(false);
  const [error, setError] = useState(null);
  const fileInputRef = useRef(null);
  // Depth counter — dragleave fires when crossing child elements,
  // so a boolean alone makes the highlight flicker
  const dragDepth = useRef(0);

  const validate = (file) => {
    if (!ACCEPTED_TYPES.some((t) => file.type.startsWith(t))) {
      return "That's not a video or image. Try MP4, MOV, PNG, or JPG.";
    }
    if (file.size > maxSizeMb * 1024 * 1024) {
      return `File is too big. Max is ${maxSizeMb}MB for now.`;
    }
    return null;
  };

  const handleFile = (file) => {
    const validationError = validate(file);
    if (validationError) {
      setError(validationError);
      return;
    }
    setError(null);
    onChange(file);
  };

  const handleDragEnter = (e) => {
    e.preventDefault();
    dragDepth.current += 1;
    setIsDragActive(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    dragDepth.current -= 1;
    if (dragDepth.current === 0) setIsDragActive(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    dragDepth.current = 0;
    setIsDragActive(false);
    const file = e.dataTransfer.files?.[0];
    if (file) handleFile(file);
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
    // Reset so picking the same file again still fires onChange
    e.target.value = "";
  };

  const openPicker = () => fileInputRef.current?.click();

  const handleKeyDown = (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      openPicker();
    }
  };

  return (
    <div className={cn("w-full", className)}>
      <div
        role="button"
        tabIndex={0}
        aria-label="Upload a video or image. Drop a file here or press Enter to browse."
        className={cn(
          "relative group cursor-pointer w-full flex flex-col items-center justify-center p-16",
          "border-2 border-dashed rounded-2xl transition-all duration-300 outline-none",
          "focus-visible:ring-2 focus-visible:ring-[var(--color-forest-ink)] focus-visible:ring-offset-4 focus-visible:ring-offset-[var(--color-cream-paper)]",
          isDragActive
            ? "border-[var(--color-forest-ink)] bg-[var(--color-highlighter-yellow)]/30 scale-[1.01]"
            : error
              ? "border-[var(--color-terracotta)] bg-[var(--color-terracotta)]/5"
              : "border-[var(--color-pencil-gray)] hover:border-[var(--color-forest-ink)] hover:bg-[var(--color-highlighter-yellow)]/10"
        )}
        onDragEnter={handleDragEnter}
        onDragOver={(e) => e.preventDefault()}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={openPicker}
        onKeyDown={handleKeyDown}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="video/*,image/*"
          onChange={handleFileChange}
          className="hidden"
          tabIndex={-1}
        />

        {/* Corner tick marks — viewfinder framing, hidden until hover */}
        {["top-3 left-3 border-t-2 border-l-2", "top-3 right-3 border-t-2 border-r-2",
          "bottom-3 left-3 border-b-2 border-l-2", "bottom-3 right-3 border-b-2 border-r-2"].map((pos) => (
            <span
              key={pos}
              aria-hidden="true"
              className={cn(
                "absolute w-4 h-4 border-[var(--color-forest-ink)] rounded-[2px] transition-opacity duration-300",
                pos,
                isDragActive ? "opacity-100" : "opacity-0 group-hover:opacity-60"
              )}
            />
          ))}

        <motion.div
          animate={{ y: isDragActive ? -8 : 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
          className="z-10 flex flex-col items-center text-center"
        >
          {/* Icon circle reveals the transparency checkerboard while dragging */}
          <div
            className={cn(
              "w-20 h-20 mb-6 rounded-full flex items-center justify-center relative overflow-hidden",
              "border transition-all duration-300",
              isDragActive
                ? "bg-checkerboard border-[var(--color-forest-ink)]"
                : "bg-[var(--color-cream-paper)] border-[var(--color-pencil-gray)] group-hover:border-[var(--color-forest-ink)]"
            )}
          >
            <motion.div
              animate={isDragActive ? { y: [0, -4, 0] } : { y: 0 }}
              transition={isDragActive ? { repeat: Infinity, duration: 1, ease: "easeInOut" } : {}}
            >
              <UploadCloud
                className="w-8 h-8 text-[var(--color-forest-ink)] group-hover:scale-110 transition-transform duration-300"
                strokeWidth={2}
              />
            </motion.div>
          </div>

          <h3 className="font-display text-[24px] text-[var(--color-forest-ink)] mb-2 tracking-tight">
            {isDragActive ? "Let go. We've got it." : "Drop your media here"}
          </h3>
          <p className="text-[16px] text-[var(--color-forest-ink)] opacity-70">
            or click to browse from your computer
          </p>

          {/* Spec line — pro tools always state their limits up front */}
          <p className="mt-5 font-mono text-[11px] tracking-wider uppercase text-[var(--color-forest-ink)]/50">
            mp4 · mov · webm · png · jpg — up to {maxSizeMb}MB
          </p>
        </motion.div>
      </div>

      {/* Validation error — slides in, shakes once, easy to dismiss by retrying */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0, x: [0, -5, 5, -3, 3, 0] }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ x: { duration: 0.4 } }}
            role="alert"
            className="mt-3 flex items-center justify-center gap-2 text-[14px] font-medium text-[var(--color-terracotta)]"
          >
            <FileWarning className="w-4 h-4 shrink-0" />
            {error}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
