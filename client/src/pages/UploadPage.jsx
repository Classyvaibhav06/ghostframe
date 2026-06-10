import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { CheckCircle2, Loader2, Download, RefreshCw, Zap, Sparkles, Server, Cpu, Activity } from 'lucide-react';
import axios from 'axios';
import { io } from 'socket.io-client';
import { FileUpload } from '../components/ui/file-upload';

// Messages shown while Fargate spins up (~3 min cold start)
const ASSIGNING_STEPS = [
  { icon: '🔍', text: 'Finding available compute region...' },
  { icon: '🖥️', text: 'Provisioning dedicated server instance...' },
  { icon: '📦', text: 'Loading AI container image...' },
  { icon: '🧠', text: 'Warming up neural network weights...' },
  { icon: '⚡', text: 'Server assigned! Preparing pipeline...' },
];

function UploadPage() {
  const { user, consumeCredit } = useAuth();
  const navigate = useNavigate();
  
  const [file, setFile] = useState(null);
  const [status, setStatus] = useState('idle'); // idle, uploading, assigning, processing, completed, error
  const [progress, setProgress] = useState(0);
  const [taskId, setTaskId] = useState(null);
  const [outputPath, setOutputPath] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');
  const [isImage, setIsImage] = useState(false);
  const [queuePosition, setQueuePosition] = useState(0);
  const [stepIndex, setStepIndex] = useState(0);
  const stepTimer = useRef(null);

  // Cycle through assigning steps during Fargate cold start
  useEffect(() => {
    if (status === 'assigning') {
      setStepIndex(0);
      stepTimer.current = setInterval(() => {
        setStepIndex(prev => Math.min(prev + 1, ASSIGNING_STEPS.length - 1));
      }, 22000);
    } else {
      clearInterval(stepTimer.current);
    }
    return () => clearInterval(stepTimer.current);
  }, [status]);

  useEffect(() => {
    if (!user) {
      navigate('/signin');
    }
  }, [user, navigate]);

  // Socket connection effect
  useEffect(() => {
    if (taskId && (status === 'processing' || status === 'assigning')) {
      const socket = io(import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000');
      
      socket.emit('join_task', taskId);
      
      socket.on('status_update', (data) => {
        if (data.status === 'processing') {
          setStatus('processing');
          setProgress(data.progress || 0);
        } else if (data.status === 'completed') {
          setStatus('completed');
          setProgress(100);
          setOutputPath(data.outputPath);
          consumeCredit(isImage ? 'image' : 'video');
          socket.disconnect();
        } else if (data.status === 'failed') {
          alert('Processing failed: ' + (data.errorMessage || 'Unknown error'));
          setStatus('idle');
          setProgress(0);
          socket.disconnect();
        }
      });

      return () => socket.disconnect();
    }
  }, [taskId, status]);

  const handleFileUpload = async (selectedFile) => {
    setFile(selectedFile);
    setStatus('uploading');
    setProgress(0);
    setErrorMsg('');

    const imageCheck = selectedFile.type.startsWith('image/');
    setIsImage(imageCheck);

    const formData = new FormData();
    if (imageCheck) {
      formData.append('image', selectedFile);
    } else {
      formData.append('video', selectedFile);
    }

    try {
      const headers = user?.token ? { Authorization: `Bearer ${user.token}` } : {};
      
      const urlResponse = await axios.get(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/video/upload-url`, {
        params: { fileType: selectedFile.type, isImage: imageCheck },
        headers
      });
      const { uploadUrl, key } = urlResponse.data;

      await axios.put(uploadUrl, selectedFile, {
        headers: {
          'Content-Type': selectedFile.type
        },
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          setProgress(percentCompleted);
        }
      });

      setStatus('assigning');
      const endpoint = imageCheck ? '/api/video/upload-image' : '/api/video/upload';

      const response = await axios.post(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}${endpoint}`, {
        originalname: selectedFile.name,
        s3Key: key
      }, { headers });

      setTaskId(response.data.taskId);
      setQueuePosition(response.data.queuePosition || 0);
      setProgress(0);
    } catch (error) {
      console.error("Upload error", error);
      setStatus('error');
      setErrorMsg(error.response?.data?.message || 'Error uploading file');
    }
  };

  const getStatusMessage = () => {
    switch (status) {
      case 'uploading': return 'Uploading securely...';
      case 'assigning': return 'Assigning to server...';
      case 'processing': return 'Extracting Background...';
      default: return 'Processing...';
    }
  };

  const getStatusSubtext = () => {
    if (status === 'uploading') return 'Sending file directly to secure storage.';
    if (status === 'assigning') return 'Finding the best compute node for your media.';
    return isImage ? 'AI is segmenting your image.' : 'AI is processing every frame at native resolution.';
  };

  return (
    <div className="relative min-h-[calc(100vh-64px)] flex flex-col items-center justify-center w-full px-4 py-24 bg-[var(--color-cream-paper)] overflow-hidden">
      <div 
        className="absolute inset-0 pointer-events-none opacity-[0.3]"
        style={{
          backgroundImage: `radial-gradient(var(--color-pencil-gray) 1px, transparent 1px)`,
          backgroundSize: '24px 24px'
        }}
      ></div>

      <div className="z-10 text-center mb-16 relative">
        <h2 className="font-display text-[55px] text-[var(--color-forest-ink)] mb-4 leading-none">
          Upload media
        </h2>
        <p className="text-[18px] text-[var(--color-forest-ink)] opacity-80 max-w-[600px] mx-auto font-medium">
          Drop your raw files. We'll handle the rotoscoping.
        </p>
      </div>

      <div className="relative z-20 w-full max-w-2xl">
        <div className="bg-[var(--color-cream-paper)] border border-[var(--color-pencil-gray)] rounded-[4px] p-8 md:p-12 shadow-[var(--shadow-subtle-2)] relative">
          
          {status === 'idle' && (
            <FileUpload onChange={handleFileUpload} />
          )}

          {/* ── UPLOADING ── */}
          {status === 'uploading' && (
            <div className="text-center py-10 space-y-8">
              <div className="relative w-32 h-32 mx-auto flex items-center justify-center">
                <div className="absolute inset-0 bg-[var(--color-highlighter-yellow)] rounded-full animate-ping opacity-50"></div>
                <div className="relative z-10 w-24 h-24 bg-[var(--color-highlighter-yellow)] border-2 border-[var(--color-forest-ink)] rounded-full flex items-center justify-center shadow-sm">
                  <Loader2 className="w-10 h-10 text-[var(--color-forest-ink)] animate-spin" />
                </div>
              </div>
              <div>
                <h3 className="font-display text-[32px] text-[var(--color-forest-ink)] mb-2">Uploading securely...</h3>
                <p className="text-[16px] text-[var(--color-forest-ink)] opacity-80 font-mono">Sending directly to AWS S3.</p>
              </div>
              <div className="max-w-md mx-auto pt-4">
                <div className="flex justify-between text-[12px] font-mono font-bold tracking-wide uppercase mb-3">
                  <span className="text-[var(--color-forest-ink)] opacity-70">Upload Progress</span>
                  <span className="text-[var(--color-forest-ink)]">{progress}%</span>
                </div>
                <div className="h-4 bg-transparent border border-[var(--color-pencil-gray)] rounded-[2px] overflow-hidden p-0.5">
                  <div className="h-full bg-[var(--color-terracotta)] transition-all duration-300 ease-out rounded-[1px]" style={{ width: `${progress}%` }}></div>
                </div>
              </div>
            </div>
          )}

          {/* ── ASSIGNING SERVER (Fargate cold start) ── */}
          {status === 'assigning' && (
            <div className="text-center py-10 space-y-8">
              <div className="relative w-32 h-32 mx-auto flex items-center justify-center">
                <div className="absolute inset-0 rounded-full border-2 border-dashed border-[var(--color-forest-ink)] opacity-20 animate-spin" style={{ animationDuration: '8s' }}></div>
                <div className="absolute inset-3 rounded-full border border-[var(--color-forest-ink)] opacity-20 animate-ping"></div>
                <div className="relative z-10 w-24 h-24 bg-[var(--color-sticky-note-mint)] border-2 border-[var(--color-forest-ink)] rounded-full flex items-center justify-center shadow-sm">
                  <Server className="w-10 h-10 text-[var(--color-forest-ink)]" />
                </div>
              </div>
              <div>
                <h3 className="font-display text-[32px] text-[var(--color-forest-ink)] mb-2">Assigning dedicated server</h3>
                <p className="text-[16px] text-[var(--color-forest-ink)] opacity-60 font-mono mb-6">Spinning up an isolated compute instance just for your video.</p>
                {/* Animated step card */}
                <div className="max-w-sm mx-auto bg-[var(--color-forest-ink)]/5 border border-[var(--color-pencil-gray)] rounded-[4px] px-5 py-3 text-left">
                  <div className="flex items-center gap-3">
                    <span className="text-[20px]">{ASSIGNING_STEPS[stepIndex].icon}</span>
                    <p className="text-[13px] font-mono text-[var(--color-forest-ink)] font-bold flex-1">{ASSIGNING_STEPS[stepIndex].text}</p>
                    <Loader2 className="w-4 h-4 text-[var(--color-forest-ink)] animate-spin shrink-0" />
                  </div>
                </div>
                {/* Progress dots */}
                <div className="flex justify-center gap-2 mt-4">
                  {ASSIGNING_STEPS.map((_, i) => (
                    <div key={i} className={`h-1.5 rounded-full transition-all duration-500 ${
                      i === stepIndex ? 'w-6 bg-[var(--color-forest-ink)]'
                      : i < stepIndex ? 'w-1.5 bg-[var(--color-forest-ink)] opacity-40'
                      : 'w-1.5 bg-[var(--color-pencil-gray)]'
                    }`} />
                  ))}
                </div>
                {queuePosition > 0 && (
                  <div className="mt-5 inline-flex bg-[var(--color-sticky-note-mint)] border border-[var(--color-forest-ink)] rounded-[4px] px-5 py-2">
                    <p className="text-[12px] text-[var(--color-forest-ink)] font-mono font-bold flex items-center gap-2 tracking-wide uppercase">
                      <span className="w-2 h-2 rounded-full bg-[var(--color-forest-ink)] animate-pulse"></span>
                      Queue: {queuePosition} {queuePosition === 1 ? 'user is' : 'users are'} ahead.
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ── ACTIVELY PROCESSING ── */}
          {status === 'processing' && (
            <div className="text-center py-10 space-y-8">
              <div className="relative w-32 h-32 mx-auto flex items-center justify-center">
                <div className="absolute inset-0 bg-[var(--color-highlighter-yellow)] rounded-full animate-ping opacity-40"></div>
                <div className="relative z-10 w-24 h-24 bg-[var(--color-highlighter-yellow)] border-2 border-[var(--color-forest-ink)] rounded-full flex items-center justify-center shadow-sm">
                  <Cpu className="w-10 h-10 text-[var(--color-forest-ink)] animate-pulse" />
                </div>
              </div>
              <div>
                <div className="inline-flex items-center gap-2 bg-[var(--color-sticky-note-mint)] border border-[var(--color-forest-ink)] rounded-full px-4 py-1 mb-4">
                  <span className="w-2 h-2 rounded-full bg-green-600 animate-pulse"></span>
                  <span className="text-[11px] font-mono font-bold text-[var(--color-forest-ink)] uppercase tracking-widest">Server assigned</span>
                </div>
                <h3 className="font-display text-[32px] text-[var(--color-forest-ink)] mb-2">
                  {isImage ? 'AI is segmenting your image.' : 'Processing every frame...'}
                </h3>
                <p className="text-[16px] text-[var(--color-forest-ink)] opacity-80 font-mono">
                  {isImage ? 'Removing background with U-2-Net.' : 'U-2-Net AI is extracting the background.'}
                </p>
              </div>
              <div className="max-w-md mx-auto pt-4 relative">
                <div className="flex justify-between text-[12px] font-mono font-bold tracking-wide uppercase mb-3">
                  <span className="text-[var(--color-forest-ink)] opacity-70 flex items-center gap-1.5"><Activity className="w-3 h-3" /> AI Processing</span>
                  <span className="text-[var(--color-forest-ink)]">{progress}%</span>
                </div>
                <div className="h-4 bg-transparent border border-[var(--color-pencil-gray)] rounded-[2px] overflow-hidden p-0.5">
                  <div className="h-full bg-[var(--color-terracotta)] transition-all duration-500 ease-out rounded-[1px]" style={{ width: `${progress}%` }}></div>
                </div>
              </div>
            </div>
          )}

          {status === 'completed' && (
            <div className="text-center py-10 space-y-10 relative">
              <div className="relative z-10 w-32 h-32 bg-[var(--color-sticky-note-mint)] border-2 border-[var(--color-forest-ink)] rounded-full flex items-center justify-center mx-auto shadow-[4px_4px_0px_0px_var(--color-forest-ink)] transform -rotate-3">
                <CheckCircle2 className="w-14 h-14 text-[var(--color-forest-ink)]" />
              </div>
              <div className="relative z-10">
                <h3 className="font-display text-[48px] text-[var(--color-forest-ink)] mb-4">Success!</h3>
                <p className="text-[16px] text-[var(--color-forest-ink)] font-mono opacity-80">Your perfectly transparent {isImage ? 'PNG image' : 'WebM video'} is ready.</p>
              </div>
              <div className="relative z-10 flex flex-col sm:flex-row justify-center items-center gap-4 pt-6">
                <button 
                  onClick={() => { setStatus('idle'); setFile(null); }} 
                  className="w-full sm:w-auto py-[12px] px-6 bg-transparent border border-[var(--color-forest-ink)] text-[var(--color-forest-ink)] hover:bg-[var(--color-forest-ink)] hover:text-[var(--color-cream-paper)] font-medium text-[15px] rounded-[4px] transition-colors flex items-center justify-center gap-2"
                >
                  <RefreshCw className="w-4 h-4" />
                  Upload Another
                </button>
                <a href={`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/video/${isImage ? 'download-image' : 'download'}/${taskId}`} download className="w-full sm:w-auto">
                  <button className="w-full py-[12px] px-6 bg-[#8a9c7b] hover:bg-[#7b8e6c] text-[var(--color-cream-paper)] border border-[var(--color-forest-ink)] font-medium text-[15px] rounded-[4px] transition-colors flex items-center justify-center gap-2 shadow-[2px_2px_0px_0px_var(--color-forest-ink)] hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px]">
                    <Download className="w-5 h-5" /> 
                    <span>Download {isImage ? 'Image' : 'Video'}</span>
                  </button>
                </a>
              </div>
            </div>
          )}

          {status === 'error' && (
            <div className="text-center py-10 space-y-8">
              <div className="w-32 h-32 bg-[var(--color-terracotta)] border-2 border-[var(--color-forest-ink)] rounded-full flex items-center justify-center mx-auto shadow-[4px_4px_0px_0px_var(--color-forest-ink)] transform rotate-6">
                <Zap className="w-14 h-14 text-[var(--color-cream-paper)]" />
              </div>
              <div>
                <h3 className="font-display text-[40px] text-[var(--color-forest-ink)] mb-4">Processing Failed</h3>
                <p className="text-[16px] text-[var(--color-forest-ink)] font-mono opacity-80">{errorMsg}</p>
              </div>
              <button 
                onClick={() => { setStatus('idle'); setFile(null); }} 
                className="py-[12px] px-8 bg-transparent border border-[var(--color-forest-ink)] text-[var(--color-forest-ink)] hover:bg-[var(--color-forest-ink)] hover:text-[var(--color-cream-paper)] font-medium text-[15px] rounded-[4px] transition-colors mt-4"
              >
                Try Again
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default UploadPage;
