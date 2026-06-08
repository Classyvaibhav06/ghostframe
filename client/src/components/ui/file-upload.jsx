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
        "relative group cursor-pointer w-full flex flex-col items-center justify-center p-16 border-2 border-dashed rounded-3xl transition-all duration-300",
        isDragActive ? "border-purple-500 bg-purple-500/10 scale-[1.02]" : "border-white/10 hover:border-white/20 hover:bg-white/5",
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
      
      <div className="absolute inset-0 bg-gradient-to-b from-purple-500/5 to-transparent opacity-0 group-hover:opacity-100 rounded-3xl transition-opacity duration-500 pointer-events-none" />
      
      <motion.div
        animate={{ y: isDragActive ? -10 : 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
        className="z-10 flex flex-col items-center"
      >
        <div className="w-24 h-24 mb-6 rounded-full flex items-center justify-center bg-black border border-white/10 shadow-[0_0_30px_rgba(168,85,247,0.2)] group-hover:shadow-[0_0_50px_rgba(168,85,247,0.5)] transition-all duration-500 relative overflow-hidden">
          <div className="absolute inset-0 bg-purple-500/20 translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-out" />
          <UploadCloud className="w-10 h-10 text-purple-400 group-hover:text-purple-300 group-hover:scale-110 transition-all z-10" />
        </div>
        <h3 className="text-2xl font-bold text-white mb-2 tracking-tight">
          Drop your media here
        </h3>
        <p className="text-zinc-400 text-sm">
          or click to browse from your computer
        </p>
      </motion.div>
    </div>
  );
};
