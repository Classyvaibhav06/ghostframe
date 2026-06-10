import { useRef, useState } from "react";
import { motion } from "framer-motion";
import { UploadCloud } from "lucide-react";
import { cn } from "../../lib/utils";

export const FileUpload = ({ onChange, className }) => {
  const [isDragActive, setIsDragActive] = useState(false);
  const fileInputRef = useRef(null);

  const handleDragEnter = (e) => {
    e.preventDefault();
    setIsDragActive(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragActive(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      onChange(e.dataTransfer.files[0]);
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      onChange(e.target.files[0]);
    }
  };

  return (
    <div
      className={cn(
        "relative group cursor-pointer w-full flex flex-col items-center justify-center p-16 border-2 border-dashed rounded-2xl transition-all duration-300",
        isDragActive ? "border-[var(--color-forest-ink)] bg-[var(--color-highlighter-yellow)]/30 scale-[1.02]" : "border-[var(--color-pencil-gray)] hover:border-[var(--color-forest-ink)] hover:bg-[var(--color-highlighter-yellow)]/10",
        className
      )}
      onDragEnter={handleDragEnter}
      onDragOver={(e) => e.preventDefault()}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onClick={handleClick}
    >
      <input
        ref={fileInputRef}
        type="file"
        accept="video/*,image/*"
        onChange={handleFileChange}
        className="hidden"
      />
      
      <motion.div
        animate={{ y: isDragActive ? -10 : 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
        className="z-10 flex flex-col items-center"
      >
        <div className="w-20 h-20 mb-6 rounded-full flex items-center justify-center bg-[var(--color-cream-paper)] border border-[var(--color-pencil-gray)] group-hover:border-[var(--color-forest-ink)] transition-all duration-300 relative overflow-hidden">
          <UploadCloud className="w-8 h-8 text-[var(--color-forest-ink)] group-hover:scale-110 transition-transform duration-300 z-10" strokeWidth="2" />
        </div>
        <h3 className="font-display text-[24px] text-[var(--color-forest-ink)] mb-2 tracking-tight">
          Drop your media here
        </h3>
        <p className="text-[16px] text-[var(--color-forest-ink)] opacity-70">
          or click to browse from your computer
        </p>
      </motion.div>
    </div>
  );
};
