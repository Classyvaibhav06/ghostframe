import { useState, useCallback, useEffect } from 'react';
import { UploadCloud, FileVideo, CheckCircle2, Loader2, Download } from 'lucide-react';
import axios from 'axios';
import { io } from 'socket.io-client';
import { Card, CardContent } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Progress } from '../components/ui/progress';

function UploadPage() {
  const [file, setFile] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [status, setStatus] = useState('idle'); // idle, uploading, processing, completed, error
  const [progress, setProgress] = useState(0);
  const [taskId, setTaskId] = useState(null);
  const [outputPath, setOutputPath] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');

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

  const onDragOver = useCallback((e) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const onDragLeave = useCallback((e) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const onDrop = useCallback((e) => {
    e.preventDefault();
    setIsDragging(false);
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile && droppedFile.type.startsWith('video/')) {
      setFile(droppedFile);
    } else {
      alert("Please upload a valid video file.");
    }
  }, []);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
    }
  };

  const handleUpload = async () => {
    if (!file) return;
    
    setStatus('uploading');
    setProgress(0);
    setErrorMsg('');

    const formData = new FormData();
    formData.append('video', file);

    try {
      // Assuming a mock token or user is logged in
      const token = localStorage.getItem('token'); 
      const headers = token ? { Authorization: `Bearer ${token}` } : {};

      const response = await axios.post(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/video/upload`, formData, {
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
      setStatus('processing');
      setProgress(0);
    } catch (error) {
      console.error("Upload error", error);
      setStatus('error');
      setErrorMsg(error.response?.data?.message || 'Error uploading file');
    }
  };

  return (
    <div className="relative min-h-[85vh] flex flex-col items-center justify-center w-full px-4 py-12">
      <div className="absolute inset-0 z-0 bg-[radial-gradient(circle_500px_at_50%_0px,#3b0764,transparent)] opacity-40 pointer-events-none"></div>
      
      <div className="z-10 text-center mb-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
        <h2 className="text-4xl font-extrabold tracking-tight text-white mb-3">Upload your video</h2>
        <p className="text-zinc-400">Supported: MP4, MOV, AVI, MKV. (Max 100MB)</p>
      </div>

      <Card className="z-10 w-full max-w-2xl bg-black/60 border-white/10 animate-in fade-in zoom-in-95 duration-700 delay-150 fill-mode-both">
        <CardContent className="p-10">
          {status === 'idle' && (
            <div 
              className={`border-2 border-dashed rounded-3xl p-16 flex flex-col items-center justify-center transition-all duration-300 ${
                isDragging ? 'border-purple-500 bg-purple-500/10 scale-[1.02]' : 'border-zinc-800 hover:border-zinc-600 hover:bg-zinc-900/50'
              }`}
              onDragOver={onDragOver}
              onDragLeave={onDragLeave}
              onDrop={onDrop}
            >
              {file ? (
                <div className="flex flex-col items-center text-center gap-4 animate-in fade-in zoom-in duration-300">
                  <div className="w-20 h-20 rounded-full bg-purple-500/20 flex items-center justify-center">
                    <FileVideo className="w-10 h-10 text-purple-400" />
                  </div>
                  <div>
                    <p className="font-semibold text-lg text-white">{file.name}</p>
                    <p className="text-zinc-400 text-sm">{(file.size / (1024 * 1024)).toFixed(2)} MB</p>
                  </div>
                  <div className="flex gap-4 mt-8">
                    <Button variant="outline" onClick={() => setFile(null)}>Cancel</Button>
                    <Button onClick={handleUpload} className="px-8 font-semibold">Process Video</Button>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center text-center cursor-pointer group" onClick={() => document.getElementById('fileUpload').click()}>
                  <div className="w-24 h-24 rounded-full bg-zinc-900 border border-white/5 flex items-center justify-center mb-6 shadow-xl group-hover:scale-110 transition-transform duration-300">
                    <UploadCloud className="w-12 h-12 text-purple-400 group-hover:text-purple-300 transition-colors" />
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-2">Click or drag & drop</h3>
                  <p className="text-zinc-500">to upload your video</p>
                  <input type="file" id="fileUpload" className="hidden" accept="video/*" onChange={handleFileChange} />
                </div>
              )}
            </div>
          )}

          {(status === 'uploading' || status === 'processing') && (
            <div className="text-center py-20 space-y-10 animate-in fade-in duration-500">
              <div className="relative w-28 h-28 mx-auto flex items-center justify-center">
                {status === 'uploading' ? (
                  <UploadCloud className="w-12 h-12 text-purple-500 animate-bounce" />
                ) : (
                  <Loader2 className="w-12 h-12 text-purple-500 animate-spin" />
                )}
                <div className="absolute inset-0 border-2 border-zinc-800 rounded-full"></div>
                <div className="absolute inset-0 border-2 border-purple-500 rounded-full border-t-transparent animate-spin"></div>
              </div>
              
              <div>
                <h3 className="text-3xl font-bold text-white mb-3">
                  {status === 'uploading' ? 'Uploading...' : 'AI is processing...'}
                </h3>
                <p className="text-zinc-400 text-lg">
                  {status === 'uploading' ? 'Transferring file securely.' : 'Extracting background at full native resolution.'}
                </p>
              </div>

              <div className="space-y-3 max-w-md mx-auto pt-6">
                <div className="flex justify-between text-sm font-medium">
                  <span className="text-zinc-400">Progress</span>
                  <span className="text-purple-400 font-bold">{progress}%</span>
                </div>
                <Progress value={progress} className="h-4" />
              </div>
            </div>
          )}

          {status === 'completed' && (
            <div className="text-center py-20 space-y-10 animate-in fade-in zoom-in-95 duration-500">
              <div className="w-32 h-32 bg-green-500/10 border border-green-500/20 rounded-full flex items-center justify-center mx-auto shadow-[0_0_50px_rgba(34,197,94,0.15)]">
                <CheckCircle2 className="w-16 h-16 text-green-500" />
              </div>
              <div>
                <h3 className="text-4xl font-extrabold text-white mb-3">Success!</h3>
                <p className="text-zinc-400 text-lg">Your transparent WebM video is ready.</p>
              </div>
              <div className="flex justify-center gap-6 pt-8">
                <Button variant="outline" size="lg" onClick={() => { setStatus('idle'); setFile(null); }}>
                  Upload Another
                </Button>
                <a href={`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/video/download/${taskId}`} download>
                  <Button size="lg" className="gap-2 shadow-[0_0_20px_rgba(168,85,247,0.3)]">
                    <Download className="w-5 h-5" /> Download WebM
                  </Button>
                </a>
              </div>
            </div>
          )}

          {status === 'error' && (
            <div className="text-center py-20 space-y-8 animate-in fade-in duration-500">
              <div className="w-24 h-24 bg-red-500/10 border border-red-500/20 rounded-full flex items-center justify-center mx-auto">
                <span className="text-red-500 text-5xl font-bold">!</span>
              </div>
              <div>
                <h3 className="text-3xl font-bold text-red-500 mb-3">Processing Failed</h3>
                <p className="text-zinc-400 text-lg">{errorMsg}</p>
              </div>
              <Button variant="outline" size="lg" onClick={() => { setStatus('idle'); setFile(null); }} className="mt-6">
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
