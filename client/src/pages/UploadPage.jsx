import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { CheckCircle2, Loader2, Download, Image as ImageIcon, Video } from 'lucide-react';
import axios from 'axios';
import { io } from 'socket.io-client';
import { Card, CardContent } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Progress } from '../components/ui/progress';
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
      
      const endpoint = imageCheck ? '/api/video/upload-image' : '/api/video/upload';

      const response = await axios.post(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}${endpoint}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          ...headers
        },
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          setProgress(percentCompleted);
        }
      });

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
    <div className="relative min-h-[85vh] flex flex-col items-center justify-center w-full px-4 py-12 bg-black">
      <div className="absolute inset-0 z-0 bg-[radial-gradient(ellipse_800px_800px_at_50%_-20%,rgba(168,85,247,0.15),transparent)] pointer-events-none"></div>
      
      <div className="z-10 text-center mb-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
        <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight text-white mb-4">Upload your media</h2>
        <p className="text-zinc-400 text-lg">Supported: Videos (MP4, MOV, WebM) & Images (PNG, JPG, WebP)</p>
      </div>

      <Card className="z-10 w-full max-w-3xl bg-white/5 backdrop-blur-xl border-white/10 shadow-[0_8px_30px_rgba(0,0,0,0.5)] animate-in fade-in zoom-in-95 duration-700 delay-150 fill-mode-both overflow-hidden">
        <CardContent className="p-8 md:p-12">
          {status === 'idle' && (
            <div className="animate-in fade-in zoom-in duration-500">
              <FileUpload onChange={handleFileUpload} />
            </div>
          )}

          {(status === 'uploading' || status === 'processing') && (
            <div className="text-center py-16 space-y-12 animate-in fade-in duration-500">
              <div className="relative w-32 h-32 mx-auto flex items-center justify-center">
                <div className="absolute inset-0 bg-purple-500/20 rounded-full animate-ping opacity-75 duration-1000"></div>
                <div className="relative z-10 w-24 h-24 bg-black border border-purple-500/50 rounded-full flex items-center justify-center shadow-[0_0_30px_rgba(168,85,247,0.4)]">
                  <Loader2 className="w-10 h-10 text-purple-400 animate-spin" />
                </div>
              </div>
              
              <div>
                <h3 className="text-3xl font-bold text-white mb-3 tracking-tight">
                  {status === 'uploading' ? 'Uploading...' : 'Extracting Background...'}
                </h3>
                <p className="text-zinc-400 text-lg">
                  {status === 'uploading' ? 'Securely transferring file to the cloud.' : isImage ? 'AI is processing your image.' : 'AI is processing every frame at native resolution.'}
                </p>
                {status === 'processing' && progress === 0 && queuePosition > 0 && !isImage && (
                  <div className="mt-4 inline-block bg-yellow-500/20 border border-yellow-500/30 rounded-lg px-4 py-2">
                    <p className="text-yellow-400 font-medium text-sm flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-yellow-400 animate-pulse"></span>
                      High Traffic: {queuePosition} {queuePosition === 1 ? 'user is' : 'users are'} ahead of you in the queue.
                    </p>
                  </div>
                )}
              </div>

              <div className="space-y-4 max-w-md mx-auto pt-4 bg-white/5 p-6 rounded-2xl border border-white/5">
                <div className="flex justify-between text-sm font-medium">
                  <span className="text-zinc-400">{status === 'uploading' ? 'Upload Progress' : 'AI Processing'}</span>
                  <span className="text-purple-400 font-bold text-lg">{progress}%</span>
                </div>
                <Progress value={progress} className="h-3 bg-white/10" />
              </div>
            </div>
          )}

          {status === 'completed' && (
            <div className="text-center py-16 space-y-10 animate-in fade-in zoom-in-95 duration-500">
              <div className="w-32 h-32 bg-green-500/10 border border-green-500/30 rounded-full flex items-center justify-center mx-auto shadow-[0_0_50px_rgba(34,197,94,0.2)] relative">
                <div className="absolute inset-0 border-2 border-green-500/50 rounded-full animate-ping opacity-50"></div>
                <CheckCircle2 className="w-16 h-16 text-green-400 relative z-10" />
              </div>
              <div>
                <h3 className="text-4xl font-extrabold text-white mb-4 tracking-tight">Success!</h3>
                <p className="text-zinc-400 text-lg">Your perfectly transparent {isImage ? 'PNG image' : 'WebM video'} is ready.</p>
              </div>
              <div className="flex flex-col sm:flex-row justify-center gap-4 pt-8">
                <Button variant="outline" size="lg" onClick={() => { setStatus('idle'); setFile(null); }} className="border-white/10 hover:bg-white/5 text-white h-14 px-8 text-lg rounded-xl">
                  Upload Another
                </Button>
                <a href={`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/video/${isImage ? 'download-image' : 'download'}/${taskId}`} download>
                  <Button size="lg" className="bg-white text-black hover:bg-zinc-200 h-14 px-8 text-lg font-semibold rounded-xl shadow-[0_0_30px_rgba(255,255,255,0.2)] gap-2 group">
                    <Download className="w-6 h-6 group-hover:-translate-y-1 transition-transform" /> 
                    Download {isImage ? 'Image' : 'Video'}
                  </Button>
                </a>
              </div>
            </div>
          )}

          {status === 'error' && (
            <div className="text-center py-16 space-y-8 animate-in fade-in duration-500">
              <div className="w-28 h-28 bg-red-500/10 border border-red-500/30 rounded-full flex items-center justify-center mx-auto shadow-[0_0_30px_rgba(239,68,68,0.2)]">
                <span className="text-red-400 text-6xl font-bold">!</span>
              </div>
              <div>
                <h3 className="text-3xl font-bold text-red-400 mb-3 tracking-tight">Processing Failed</h3>
                <p className="text-zinc-400 text-lg">{errorMsg}</p>
              </div>
              <Button variant="outline" size="lg" onClick={() => { setStatus('idle'); setFile(null); }} className="mt-8 border-white/10 text-white hover:bg-white/5 h-12 px-8 rounded-xl">
                Try Again
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

export default UploadPage;
