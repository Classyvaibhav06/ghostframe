import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { CheckCircle2, Check, Loader2, Download, RefreshCw, Zap, Server, Cpu, Activity } from 'lucide-react';
import axios from 'axios';
import { io } from 'socket.io-client';
import { FileUpload } from '../components/ui/file-upload';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000';

const ASSIGNING_STEPS = [
  { icon: '🔍', text: 'Finding available compute region...' },
  { icon: '🖥️', text: 'Provisioning dedicated server instance...' },
  { icon: '📦', text: 'Loading AI container image...' },
  { icon: '🧠', text: 'Warming up neural network weights...' },
  { icon: '⚡', text: 'Server assigned! Preparing pipeline...' },
];

// Shared enter/exit animation for each status panel
const panelVariants = {
  initial: { opacity: 0, y: 16, scale: 0.99 },
  animate: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.35, ease: [0.32, 0.72, 0, 1] } },
  exit: { opacity: 0, y: -12, scale: 0.99, transition: { duration: 0.2, ease: 'easeIn' } },
};

const formatBytes = (bytes) => {
  if (!bytes) return '';
  const mb = bytes / (1024 * 1024);
  return mb < 1 ? `${(bytes / 1024).toFixed(0)} KB` : `${mb.toFixed(1)} MB`;
};

// Progress bar: spring-animated width + striped sheen while active
const ProgressBar = ({ progress, label, icon: Icon }) => (
  <div className="max-w-md mx-auto pt-4">
    <div className="flex justify-between text-[12px] font-mono font-bold tracking-wide uppercase mb-3">
      <span className="text-[var(--color-forest-ink)] opacity-70 flex items-center gap-1.5">
        {Icon && <Icon className="w-3 h-3" />} {label}
      </span>
      <span className="text-[var(--color-forest-ink)] tabular-nums">{Math.round(progress)}%</span>
    </div>
    <div className="h-4 border border-[var(--color-pencil-gray)] rounded-[2px] overflow-hidden p-0.5">
      <motion.div
        className="h-full bg-[var(--color-terracotta)] rounded-[1px] progress-stripes"
        initial={{ width: 0 }}
        animate={{ width: `${progress}%` }}
        transition={{ type: 'spring', stiffness: 60, damping: 18 }}
      />
    </div>
  </div>
);

// Pulsing icon orb shared by busy states
const StatusOrb = ({ icon: Icon, bg, spin = false }) => (
  <div className="relative w-32 h-32 mx-auto flex items-center justify-center">
    <motion.div
      className="absolute inset-0 rounded-full border-2 border-dashed border-[var(--color-forest-ink)] opacity-15"
      animate={{ rotate: 360 }}
      transition={{ repeat: Infinity, duration: 10, ease: 'linear' }}
    />
    <motion.div
      className="absolute inset-2 rounded-full"
      style={{ backgroundColor: bg }}
      animate={{ scale: [1, 1.12, 1], opacity: [0.35, 0.15, 0.35] }}
      transition={{ repeat: Infinity, duration: 2.4, ease: 'easeInOut' }}
    />
    <div
      className="relative z-10 w-24 h-24 border-2 border-[var(--color-forest-ink)] rounded-full flex items-center justify-center shadow-sm"
      style={{ backgroundColor: bg }}
    >
      <Icon className={`w-10 h-10 text-[var(--color-forest-ink)] ${spin ? 'animate-spin' : ''}`} />
    </div>
  </div>
);

function UploadPage() {
  const { user, consumeCredit } = useAuth();
  const navigate = useNavigate();

  const [file, setFile] = useState(null);
  const [status, setStatus] = useState('idle');
  const [progress, setProgress] = useState(0);
  const [taskId, setTaskId] = useState(null);
  const [outputPath, setOutputPath] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');
  const [isImage, setIsImage] = useState(false);
  const [queuePosition, setQueuePosition] = useState(0);
  const [stepIndex, setStepIndex] = useState(0);

  const stepTimer = useRef(null);
  const fakeProgressTimer = useRef(null);
  const isImageRef = useRef(false); // avoids stale closure inside socket handler

  const isBusy = ['uploading', 'assigning', 'processing'].includes(status);

  // Warn before closing the tab mid-job — losing a 3-minute job is the worst UX
  useEffect(() => {
    if (!isBusy) return;
    const warn = (e) => { e.preventDefault(); e.returnValue = ''; };
    window.addEventListener('beforeunload', warn);
    return () => window.removeEventListener('beforeunload', warn);
  }, [isBusy]);

  // Cycle assigning steps during Fargate cold start
  useEffect(() => {
    if (status === 'assigning') {
      setStepIndex(0);
      stepTimer.current = setInterval(() => {
        setStepIndex((prev) => Math.min(prev + 1, ASSIGNING_STEPS.length - 1));
      }, 22000);
    } else {
      clearInterval(stepTimer.current);
    }
    return () => clearInterval(stepTimer.current);
  }, [status]);

  // Fake progress 0→90% so the bar never looks frozen; real webhook progress overrides
  useEffect(() => {
    if (status === 'processing') {
      fakeProgressTimer.current = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 90) { clearInterval(fakeProgressTimer.current); return prev; }
          const increment = prev < 30 ? 1.5 : prev < 60 ? 0.8 : 0.3;
          return Math.min(90, parseFloat((prev + increment).toFixed(1)));
        });
      }, 3000);
    } else {
      clearInterval(fakeProgressTimer.current);
    }
    return () => clearInterval(fakeProgressTimer.current);
  }, [status]);

  useEffect(() => {
    if (!user) navigate('/signin');
  }, [user, navigate]);

  // Socket: connect once per task and stay connected across assigning → processing.
  // Previously this tore down and reconnected on every status change.
  useEffect(() => {
    if (!taskId) return;
    const socket = io(SOCKET_URL);
    socket.emit('join_task', taskId);

    socket.on('status_update', (data) => {
      if (data.status === 'processing') {
        setStatus('processing');
        setProgress((prev) => Math.max(prev, data.progress || 0));
      } else if (data.status === 'completed') {
        setStatus('completed');
        setProgress(100);
        setOutputPath(data.outputPath);
        consumeCredit(isImageRef.current ? 'image' : 'video');
        socket.disconnect();
      } else if (data.status === 'failed') {
        setErrorMsg(data.errorMessage || 'Unknown error');
        setStatus('error');
        socket.disconnect();
      }
    });

    return () => socket.disconnect();
  }, [taskId]); // eslint-disable-line react-hooks/exhaustive-deps

  const reset = () => {
    setStatus('idle');
    setFile(null);
    setTaskId(null);
    setProgress(0);
    setErrorMsg('');
  };

  const handleFileUpload = async (selectedFile) => {
    setFile(selectedFile);
    setStatus('uploading');
    setProgress(0);
    setErrorMsg('');

    const imageCheck = selectedFile.type.startsWith('image/');
    setIsImage(imageCheck);
    isImageRef.current = imageCheck;

    try {
      const headers = user?.token ? { Authorization: `Bearer ${user.token}` } : {};

      const urlResponse = await axios.get(`${API_URL}/api/video/upload-url`, {
        params: { fileType: selectedFile.type, isImage: imageCheck },
        headers,
      });
      const { uploadUrl, key } = urlResponse.data;

      await axios.put(uploadUrl, selectedFile, {
        headers: { 'Content-Type': selectedFile.type },
        onUploadProgress: (e) => setProgress(Math.round((e.loaded * 100) / e.total)),
      });

      setStatus('assigning');
      const endpoint = imageCheck ? '/api/video/upload-image' : '/api/video/upload';
      const response = await axios.post(`${API_URL}${endpoint}`, {
        originalname: selectedFile.name,
        s3Key: key,
      }, { headers });

      setTaskId(response.data.taskId);
      setQueuePosition(response.data.queuePosition || 0);
      setProgress(0);
    } catch (error) {
      console.error('Upload error', error);
      setErrorMsg(error.response?.data?.message || 'Error uploading file');
      setStatus('error');
    }
  };

  return (
    <div className="relative min-h-[calc(100vh-64px)] flex flex-col items-center justify-center w-full px-4 py-24 bg-[var(--color-cream-paper)] overflow-hidden">
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.3]"
        style={{ backgroundImage: 'radial-gradient(var(--color-pencil-gray) 1px, transparent 1px)', backgroundSize: '24px 24px' }}
      />

      <div className="z-10 text-center mb-16 relative">
        <h2 className="font-display text-[42px] md:text-[55px] text-[var(--color-forest-ink)] mb-4 leading-none">Upload media</h2>
        <p className="text-[18px] text-[var(--color-forest-ink)] opacity-80 max-w-[600px] mx-auto font-medium">
          Drop your raw files. We'll handle the rotoscoping.
        </p>
      </div>

      <div className="relative z-20 w-full max-w-2xl">
        <div className="bg-[var(--color-cream-paper)] border border-[var(--color-pencil-gray)] rounded-[4px] p-8 md:p-12 shadow-[var(--shadow-subtle-2)] relative">

          {/* File chip — persistent context across every busy state */}
          <AnimatePresence>
            {file && isBusy && (
              <motion.div
                initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                className="absolute -top-4 left-1/2 -translate-x-1/2 bg-[var(--color-highlighter-yellow)] border border-[var(--color-forest-ink)]/20 rounded-full px-4 py-1 font-mono text-[11px] font-bold tracking-wide whitespace-nowrap max-w-[90%] overflow-hidden text-ellipsis"
              >
                {file.name} · {formatBytes(file.size)}
              </motion.div>
            )}
          </AnimatePresence>

          <AnimatePresence mode="wait">

            {status === 'idle' && (
              <motion.div key="idle" variants={panelVariants} initial="initial" animate="animate" exit="exit">
                <FileUpload onChange={handleFileUpload} />
              </motion.div>
            )}

            {/* ── UPLOADING ── */}
            {status === 'uploading' && (
              <motion.div key="uploading" variants={panelVariants} initial="initial" animate="animate" exit="exit" className="text-center py-10 space-y-8">
                <StatusOrb icon={Loader2} bg="var(--color-highlighter-yellow)" spin />
                <div>
                  <h3 className="font-display text-[32px] text-[var(--color-forest-ink)] mb-2">Uploading securely...</h3>
                  <p className="text-[16px] text-[var(--color-forest-ink)] opacity-80 font-mono">Sending directly to AWS S3.</p>
                </div>
                <ProgressBar progress={progress} label="Upload Progress" />
              </motion.div>
            )}

            {/* ── ASSIGNING (Fargate cold start) ── */}
            {status === 'assigning' && (
              <motion.div key="assigning" variants={panelVariants} initial="initial" animate="animate" exit="exit" className="text-center py-10 space-y-8">
                <StatusOrb icon={Server} bg="var(--color-sticky-note-mint)" />
                <div>
                  <h3 className="font-display text-[32px] text-[var(--color-forest-ink)] mb-2">Assigning dedicated server</h3>
                  <p className="text-[15px] text-[var(--color-forest-ink)] opacity-60 font-mono mb-6">
                    Cold starts take ~3 minutes. Your file is safe — feel free to stretch.
                  </p>

                  {/* Live checklist: done steps tick off, current pulses, future dimmed */}
                  <div className="max-w-sm mx-auto bg-[var(--color-forest-ink)]/5 border border-[var(--color-pencil-gray)] rounded-[4px] px-5 py-4 text-left space-y-3">
                    {ASSIGNING_STEPS.map((step, i) => {
                      const done = i < stepIndex;
                      const current = i === stepIndex;
                      return (
                        <motion.div
                          key={step.text}
                          className="flex items-center gap-3"
                          animate={{ opacity: done ? 0.45 : current ? 1 : 0.3 }}
                          transition={{ duration: 0.4 }}
                        >
                          <span className="w-5 h-5 flex items-center justify-center shrink-0">
                            {done ? (
                              <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 400, damping: 18 }}>
                                <Check className="w-4 h-4 text-[var(--color-forest-ink)]" strokeWidth={3} />
                              </motion.span>
                            ) : current ? (
                              <Loader2 className="w-4 h-4 text-[var(--color-forest-ink)] animate-spin" />
                            ) : (
                              <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-pencil-gray)]" />
                            )}
                          </span>
                          <p className={`text-[13px] font-mono font-bold text-[var(--color-forest-ink)] ${done ? 'line-through' : ''}`}>
                            {step.icon} {step.text}
                          </p>
                        </motion.div>
                      );
                    })}
                  </div>

                  {queuePosition > 0 && (
                    <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} className="mt-5 inline-flex bg-[var(--color-sticky-note-mint)] border border-[var(--color-forest-ink)] rounded-[4px] px-5 py-2">
                      <p className="text-[12px] text-[var(--color-forest-ink)] font-mono font-bold flex items-center gap-2 tracking-wide uppercase">
                        <span className="w-2 h-2 rounded-full bg-[var(--color-forest-ink)] animate-pulse" />
                        Queue: {queuePosition} {queuePosition === 1 ? 'user is' : 'users are'} ahead.
                      </p>
                    </motion.div>
                  )}
                </div>
              </motion.div>
            )}

            {/* ── PROCESSING ── */}
            {status === 'processing' && (
              <motion.div key="processing" variants={panelVariants} initial="initial" animate="animate" exit="exit" className="text-center py-10 space-y-8">
                <StatusOrb icon={Cpu} bg="var(--color-highlighter-yellow)" />
                <div>
                  <motion.div
                    initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
                    transition={{ type: 'spring', stiffness: 300, damping: 16 }}
                    className="inline-flex items-center gap-2 bg-[var(--color-sticky-note-mint)] border border-[var(--color-forest-ink)] rounded-full px-4 py-1 mb-4"
                  >
                    <span className="w-2 h-2 rounded-full bg-green-600 animate-pulse" />
                    <span className="text-[11px] font-mono font-bold text-[var(--color-forest-ink)] uppercase tracking-widest">Server assigned</span>
                  </motion.div>
                  <h3 className="font-display text-[32px] text-[var(--color-forest-ink)] mb-2">
                    {isImage ? 'AI is segmenting your image.' : 'Processing every frame...'}
                  </h3>
                  <p className="text-[16px] text-[var(--color-forest-ink)] opacity-80 font-mono">
                    {isImage ? 'Removing background with U-2-Net.' : 'U-2-Net AI is extracting the background.'}
                  </p>
                </div>
                <ProgressBar progress={progress} label="AI Processing" icon={Activity} />
              </motion.div>
            )}

            {/* ── COMPLETED ── */}
            {status === 'completed' && (
              <motion.div key="completed" variants={panelVariants} initial="initial" animate="animate" exit="exit" className="text-center py-10 space-y-10">
                <motion.div
                  initial={{ scale: 0, rotate: -20 }}
                  animate={{ scale: 1, rotate: -3 }}
                  transition={{ type: 'spring', stiffness: 200, damping: 13, delay: 0.1 }}
                  className="relative z-10 w-32 h-32 bg-[var(--color-sticky-note-mint)] border-2 border-[var(--color-forest-ink)] rounded-full flex items-center justify-center mx-auto shadow-[4px_4px_0px_0px_var(--color-forest-ink)]"
                >
                  <motion.div initial={{ pathLength: 0, opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
                    <CheckCircle2 className="w-14 h-14 text-[var(--color-forest-ink)]" />
                  </motion.div>
                </motion.div>
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}>
                  <h3 className="font-display text-[48px] text-[var(--color-forest-ink)] mb-4">Success!</h3>
                  <p className="text-[16px] text-[var(--color-forest-ink)] font-mono opacity-80">
                    Your perfectly transparent {isImage ? 'PNG image' : 'WebM video'} is ready.
                  </p>
                </motion.div>
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="flex flex-col sm:flex-row justify-center items-center gap-4 pt-6">
                  <button onClick={reset} className="w-full sm:w-auto py-[12px] px-6 bg-transparent border border-[var(--color-forest-ink)] text-[var(--color-forest-ink)] hover:bg-[var(--color-forest-ink)] hover:text-[var(--color-cream-paper)] font-medium text-[15px] rounded-[4px] transition-colors flex items-center justify-center gap-2">
                    <RefreshCw className="w-4 h-4" /> Upload Another
                  </button>
                  <a href={`${API_URL}/api/video/${isImage ? 'download-image' : 'download'}/${taskId}`} download className="w-full sm:w-auto">
                    <button className="w-full py-[12px] px-6 bg-[#8a9c7b] hover:bg-[#7b8e6c] text-[var(--color-cream-paper)] border border-[var(--color-forest-ink)] font-medium text-[15px] rounded-[4px] transition-all flex items-center justify-center gap-2 shadow-[2px_2px_0px_0px_var(--color-forest-ink)] hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px]">
                      <Download className="w-5 h-5" /> Download {isImage ? 'Image' : 'Video'}
                    </button>
                  </a>
                </motion.div>
              </motion.div>
            )}

            {/* ── ERROR ── */}
            {status === 'error' && (
              <motion.div key="error" variants={panelVariants} initial="initial" animate="animate" exit="exit" className="text-center py-10 space-y-8">
                <motion.div
                  initial={{ scale: 0 }} animate={{ scale: 1, rotate: 6, x: [0, -6, 6, -4, 4, 0] }}
                  transition={{ scale: { type: 'spring', stiffness: 250, damping: 14 }, x: { delay: 0.3, duration: 0.4 } }}
                  className="w-32 h-32 bg-[var(--color-terracotta)] border-2 border-[var(--color-forest-ink)] rounded-full flex items-center justify-center mx-auto shadow-[4px_4px_0px_0px_var(--color-forest-ink)]"
                >
                  <Zap className="w-14 h-14 text-[var(--color-cream-paper)]" />
                </motion.div>
                <div>
                  <h3 className="font-display text-[40px] text-[var(--color-forest-ink)] mb-4">Processing Failed</h3>
                  <p className="text-[16px] text-[var(--color-forest-ink)] font-mono opacity-80">{errorMsg}</p>
                </div>
                <button onClick={reset} className="py-[12px] px-8 bg-transparent border border-[var(--color-forest-ink)] text-[var(--color-forest-ink)] hover:bg-[var(--color-forest-ink)] hover:text-[var(--color-cream-paper)] font-medium text-[15px] rounded-[4px] transition-colors mt-4">
                  Try Again
                </button>
              </motion.div>
            )}

          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

export default UploadPage;
