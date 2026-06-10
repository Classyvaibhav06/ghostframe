import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { CheckCircle2, Loader2, Download, RefreshCw, Zap, Sparkles } from 'lucide-react';
import axios from 'axios';
import { io } from 'socket.io-client';
import { FileUpload } from '../components/ui/file-upload';

function UploadPage() {
  const { user, consumeCredit } = useAuth();
  const navigate = useNavigate();
  
  const [file, setFile] = useState(null);
  const [status, setStatus] = useState('idle'); // idle, uploading, processing, completed, error
  const [progress, setProgress] = useState(0);
  const [taskId, setTaskId] = useState(null);
  const [outputPath, setOutputPath] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');
  const [isImage, setIsImage] = useState(false);
  const [queuePosition, setQueuePosition] = useState(0);

  useEffect(() => {
    if (!user) {
      navigate('/signin');
    }
  }, [user, navigate]);

  // Socket connection effect
  useEffect(() => {
    if (taskId && status === 'processing') {
      const socket = io(import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000');
      
      socket.emit('join_task', taskId);
      
      socket.on('status_update', (data) => {
        if (data.status === 'processing') {
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
      
      // 1. Get Presigned URL from Backend
      const urlResponse = await axios.get(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/video/upload-url`, {
        params: { fileType: selectedFile.type, isImage: imageCheck },
        headers
      });
      const { uploadUrl, key } = urlResponse.data;

      // 2. Upload Directly to AWS S3
      await axios.put(uploadUrl, selectedFile, {
        headers: {
          'Content-Type': selectedFile.type
        },
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          setProgress(percentCompleted);
        }
      });

      // 3. Notify Backend that upload is complete
      const endpoint = imageCheck ? '/api/video/upload-image' : '/api/video/upload';

      const response = await axios.post(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}${endpoint}`, {
        originalname: selectedFile.name,
        s3Key: key
      }, { headers });

      setTaskId(response.data.taskId);
      setQueuePosition(response.data.queuePosition || 0);
      setStatus('processing');
      // For images, we might jump to 100% almost instantly, but we wait for the socket event
      setProgress(0);
    } catch (error) {
      console.error("Upload error", error);
      setStatus('error');
      setErrorMsg(error.response?.data?.message || 'Error uploading file');
    }
  };

  return (
    <div className="relative min-h-[calc(100vh-64px)] flex flex-col items-center justify-center w-full px-4 py-24 bg-[var(--color-cream-paper)] overflow-hidden">
      
      {/* Background Dots */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-[0.3]"
        style={{
          backgroundImage: `radial-gradient(var(--color-pencil-gray) 1px, transparent 1px)`,
          backgroundSize: '24px 24px'
        }}
      ></div>

      <div className="z-10 text-center mb-16 relative">
        <div className="absolute -top-10 -left-12 opacity-50 transform -rotate-12">
          <Sparkles className="w-8 h-8 text-[var(--color-terracotta)]" />
        </div>
        <h2 className="font-display text-[55px] text-[var(--color-forest-ink)] mb-4 leading-none">
          Upload media
        </h2>
        <p className="text-[18px] text-[var(--color-forest-ink)] opacity-80 max-w-[600px] mx-auto font-medium">
          Drop your raw files. We'll handle the rotoscoping.
        </p>
      </div>

      {/* Main Upload Box (Sketchbook Style) */}
      <div className="relative z-20 w-full max-w-2xl">
        {/* Taped top edge */}
        <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-32 h-8 bg-white/50 backdrop-blur-sm border border-[var(--color-pencil-gray)]/50 shadow-sm z-30 transform -rotate-2 mix-blend-multiply"></div>
        <div className="absolute -bottom-4 right-10 w-24 h-8 bg-white/50 backdrop-blur-sm border border-[var(--color-pencil-gray)]/50 shadow-sm z-30 transform rotate-3 mix-blend-multiply"></div>

        <div className="bg-[var(--color-cream-paper)] border border-[var(--color-pencil-gray)] rounded-[4px] p-8 md:p-12 shadow-[var(--shadow-subtle-2)] relative">
          
          {status === 'idle' && (
            <FileUpload onChange={handleFileUpload} />
          )}

          {(status === 'uploading' || status === 'processing') && (
            <div className="text-center py-10 space-y-8">
              <div className="relative w-32 h-32 mx-auto flex items-center justify-center">
                <div className="absolute inset-0 bg-[var(--color-highlighter-yellow)] rounded-full animate-ping opacity-50"></div>
                <div className="relative z-10 w-24 h-24 bg-[var(--color-highlighter-yellow)] border-2 border-[var(--color-forest-ink)] rounded-full flex items-center justify-center shadow-sm">
                  <Loader2 className="w-10 h-10 text-[var(--color-forest-ink)] animate-spin" />
                </div>
              </div>
              
              <div>
                <h3 className="font-display text-[32px] text-[var(--color-forest-ink)] mb-2">
                  {status === 'uploading' ? 'Uploading securely...' : 'Extracting Background...'}
                </h3>
                <p className="text-[16px] text-[var(--color-forest-ink)] opacity-80 font-mono">
                  {status === 'uploading' ? 'Sending directly to AWS S3.' : isImage ? 'AI is segmenting your image.' : 'AI is processing every frame at native resolution.'}
                </p>
                {status === 'processing' && progress === 0 && queuePosition > 0 && !isImage && (
                  <div className="mt-6 inline-flex bg-[var(--color-sticky-note-mint)] border border-[var(--color-forest-ink)] rounded-[4px] px-5 py-2">
                    <p className="text-[12px] text-[var(--color-forest-ink)] font-mono font-bold flex items-center gap-2 tracking-wide uppercase">
                      <span className="w-2 h-2 rounded-full bg-[var(--color-forest-ink)] animate-pulse"></span>
                      Queue: {queuePosition} {queuePosition === 1 ? 'user is' : 'users are'} ahead of you.
                    </p>
                  </div>
                )}
              </div>

              <div className="max-w-md mx-auto pt-4 relative">
                {/* Hand-drawn progress bar border */}
                <svg className="absolute inset-0 w-full h-full pointer-events-none -m-1" viewBox="0 0 100 100" preserveAspectRatio="none">
                  <rect x="0" y="0" width="100" height="100" rx="4" fill="none" stroke="var(--color-forest-ink)" strokeWidth="0.5" strokeDasharray="4 2" />
                </svg>

                <div className="flex justify-between text-[12px] font-mono font-bold tracking-wide uppercase mb-3 relative z-10">
                  <span className="text-[var(--color-forest-ink)] opacity-70">{status === 'uploading' ? 'Upload Progress' : 'AI Processing'}</span>
                  <span className="text-[var(--color-forest-ink)]">{progress}%</span>
                </div>
                <div className="h-4 bg-transparent border border-[var(--color-pencil-gray)] rounded-[2px] overflow-hidden relative z-10 p-0.5">
                  <div 
                    className="h-full bg-[var(--color-terracotta)] transition-all duration-300 ease-out rounded-[1px]"
                    style={{ width: `${progress}%` }}
                  ></div>
                </div>
              </div>
            </div>
          )}

          {status === 'completed' && (
            <div className="text-center py-10 space-y-10 relative">
              
              {/* Confetti Skecth SVG */}
              <svg className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-48 pointer-events-none opacity-20" viewBox="0 0 100 100">
                <path d="M 10 10 L 20 20 M 90 10 L 80 20 M 10 90 L 20 80 M 90 90 L 80 80 M 50 5 L 50 15 M 5 50 L 15 50 M 95 50 L 85 50 M 50 95 L 50 85" stroke="var(--color-forest-ink)" strokeWidth="2" strokeLinecap="round" />
              </svg>

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
