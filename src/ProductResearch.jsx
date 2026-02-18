import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Download, FileText, Loader2, CheckCircle, AlertCircle, ChevronDown, ChevronUp } from 'lucide-react';
import { api } from './services/api'; 
import './ProductResearch.css';

const ProductResearch = () => {
  // --- STATE ---
  const [productName, setProductName] = useState(() => localStorage.getItem('mercado_product_name') || '');
  const [mau, setMau] = useState(""); // Empty string lets the input be blank
const [arpu, setArpu] = useState("");
  const [showAdvanced, setShowAdvanced] = useState(false);

  const [currentJobId, setCurrentJobId] = useState(() => localStorage.getItem('mercado_current_job'));
  
  // Guard: Only start processing if we actually have a valid ID
  const [state, setState] = useState(() => {
      const storedId = localStorage.getItem('mercado_current_job');
      return (storedId && storedId !== 'undefined') ? 'processing' : 'idle';
  });

  const [processingSteps, setProcessingSteps] = useState([]);
  
  // --- REFS ---
  const pollTimerRef = useRef(null); 
  const lastStageRef = useRef(''); 

  // --- POLLING LOGIC (Safe Version) ---
  const pollJob = (jobId) => {
    // SAFETY GUARD: Stop immediately if ID is missing or "undefined" string
    if (!jobId || jobId === 'undefined') {
  console.warn("⚠️ pollJob skipped — jobId not ready yet");
  return;
}
    if (pollTimerRef.current) clearInterval(pollTimerRef.current);

    pollTimerRef.current = setInterval(async () => {
      try {
        const job = await api.getStatus(jobId);
        
        const currentStatus = job.status.toLowerCase();
        const currentStage = job.stage || "Processing...";

        // 1. UPDATE LOGS
        if (currentStage !== lastStageRef.current) {
            lastStageRef.current = currentStage;
            if (currentStatus !== 'done' && currentStatus !== 'failed') {
               addLog(`⚙️ ${currentStage}`, 'active');
            }
        }

        // 2. SUCCESS CASE
        if (currentStatus === 'done' || currentStatus === 'completed') {
           clearInterval(pollTimerRef.current);
           addLog("✅ Intelligence Dossier Ready.", 'completed');
           setTimeout(() => setState('success'), 1000);
        }

        // 3. FAILURE CASE
        if (currentStatus === 'failed' || currentStatus.includes('error')) {
          clearInterval(pollTimerRef.current);
          addLog(`❌ Process Failed: ${job.error || "Unknown Error"}`, 'error');
          cleanupJob();
          setState('error');
        }

      } catch (err) {
        console.error("Polling Error:", err);
        // If 404 (Job Not Found), stop polling to prevent spam
        if (err.response && err.response.status === 404) {
            clearInterval(pollTimerRef.current);
            setState('error');
            addLog("❌ Job not found on server.", 'error');
        }
      }
    }, 2000);
  };
  
  const cleanupJob = () => {
      localStorage.removeItem('mercado_current_job'); 
      localStorage.removeItem('mercado_product_name');
  };

  // --- HANDLERS ---
  // --- CANCEL HANDLER ---
  const handleCancel = async () => {
  if (!currentJobId) return;

  try {
    addLog("🛑 Sending stop command...", 'active');

    await api.cancelJob(currentJobId); // 🔥 ONLY PLACE

    if (pollTimerRef.current) clearInterval(pollTimerRef.current);

    addLog("⛔ Analysis terminated by user.", 'error');

    cleanupJob();
    setState('error');

  } catch (err) {
    console.error("Cancel failed:", err);
    setState('error');
  }
};
  const handleSubmit = async (e) => {
  e.preventDefault();
  if (!productName.trim()) return;

  setState('processing');
  setProcessingSteps([{
    id: Date.now(),
    text: `🚀 Initializing Market Agent for: ${productName}...`,
    status: 'completed'
  }]);

  lastStageRef.current = '';

  try {
    const finalMau = mau ? parseInt(mau, 10) : 0;
    const finalArpu = arpu ? parseFloat(arpu) : 0.0;

    const response = await api.startAnalysis(productName, finalMau, finalArpu);
    const jobId = response.job_id || response;

    if (!jobId || jobId === 'undefined') {
      throw new Error("Invalid Job ID");
    }

    localStorage.setItem('mercado_current_job', jobId);
    localStorage.setItem('mercado_product_name', productName);

    setCurrentJobId(jobId); // 🔥 this alone triggers polling safely

  } catch (err) {
    console.error(err);
    addLog("❌ Connection Failed. Gateway may be down.", 'error');
    setState('error');
  }
};
  const addLog = (text, status) => {
    setProcessingSteps(prev => {
      const updatedPrev = prev.map(s => s.status === 'active' ? { ...s, status: 'completed' } : s);
      // Deduplicate logs
      if (prev.length > 0 && prev[prev.length - 1].text === text) return prev;
      return [...updatedPrev, { id: Date.now(), text, status }];
    });
  };

  const handleDownload = () => {
    if (currentJobId) window.open(api.getDownloadUrl(currentJobId), '_blank');
  };

  const resetState = () => {
  setState('idle');
  setProductName('');
  setMau("");
  setArpu("");
  setProcessingSteps([]);
  setCurrentJobId(null);
  lastStageRef.current = '';
  cleanupJob(); // UI cleanup ONLY
};
  // --- EFFECT: RESUME JOB ON RELOAD ---
  useEffect(() => {
    // Only attempt to resume if we have a valid ID and are in 'processing' mode
    if (state === 'processing' && currentJobId && currentJobId !== 'undefined') {
      console.log("Resuming job:", currentJobId);
      
      // Only set these logs if the list is empty (prevents overwriting "Initializing...")
      if (processingSteps.length === 0) {
          setProcessingSteps([{ id: Date.now(), text: `🔄 Reconnecting...`, status: 'active' }]);
      }
      
      pollJob(currentJobId);
    } 
    
    // REMOVED THE "ELSE" BLOCK THAT WAS AUTO-CANCELLING YOUR JOB
    
    return () => { if (pollTimerRef.current) clearInterval(pollTimerRef.current); };
  }, [currentJobId, state]); // Added dependencies to keep it in sync
  // ... (Keep your JSX return structure exactly as it was, it was good)
  return (
    <div className="product-research">
      <div className="command-center">
        <AnimatePresence mode="wait">
          {state === 'idle' && (
            <motion.div
              key="idle"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="idle-state"
            >
              <h1 className="page-title">Product Intelligence Research</h1>
              <p className="page-subtitle">Generate comprehensive market intelligence dossiers</p>
              
              <form onSubmit={handleSubmit} className="input-form">
                <div className="input-container">
                  <Search size={20} className="input-icon" />
                  <input
                    type="text"
                    value={productName}
                    onChange={(e) => setProductName(e.target.value)}
                    placeholder="Enter Product Name (e.g., Linear, Cursor)..."
                    className="product-input"
                    autoFocus
                  />
                </div>

                {/* ADVANCED OPTIONS TOGGLE */}
                <div className="advanced-toggle" onClick={() => setShowAdvanced(!showAdvanced)}>
                    <span>{showAdvanced ? "Hide Internal Data" : "Add Internal Data (Optional)"}</span>
                    {showAdvanced ? <ChevronUp size={16}/> : <ChevronDown size={16}/>}
                </div>

                <AnimatePresence>
                    {showAdvanced && (
                        <motion.div 
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="advanced-inputs"
                        >
                            <div className="input-group">
    <label>Monthly Active Users (MAU)</label>
    <input 
        type="number" 
        value={mau} 
        onChange={(e) => setMau(e.target.value)} // Keep as string while typing
        placeholder="0" // Shows "0" only when empty
    />
</div>
<div className="input-group">
    <label>Avg Revenue Per User ($)</label>
    <input 
        type="number" 
        value={arpu} 
        onChange={(e) => setArpu(e.target.value)} // Keep as string while typing
        placeholder="0.00"
    />
</div>
                        </motion.div>
                    )}
                </AnimatePresence>

                <button type="submit" className="analyze-btn">
                  Analyze Product
                </button>
              </form>
            </motion.div>
          )}
          {state === 'processing' && (
            <motion.div
              key="processing"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="processing-state"
            >
              <h2 className="processing-title">Analyzing: {productName}</h2>
              <div className="terminal">
                <div className="terminal-header">
                  <div className="terminal-dots">
                    <span className="dot red"></span>
                    <span className="dot yellow"></span>
                    <span className="dot green"></span>
                  </div>
                  <span className="terminal-title">Live Terminal</span>
                </div>
                <div className="terminal-body">
                  {processingSteps.map((step, index) => (
                    <motion.div
                      key={step.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className={`terminal-step ${step.status}`}
                    >
                      <div className="step-content">
                        {step.status === 'active' && <Loader2 size={16} className="step-spinner" />}
                        {step.status === 'completed' && <CheckCircle size={16} className="step-check" />}
                        {step.status === 'error' && <AlertCircle size={16} className="text-red-500" />}
                        <span className="step-text">{step.text}</span>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
              {/* STOP BUTTON */}
     <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'center' }}>
        <button 
            onClick={handleCancel}
            className="btn btn-ghost stop-btn" // Style this red in CSS
            style={{ 
                borderColor: '#ef4444', 
                color: '#ef4444',
                background: 'transparent',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
            }}
        >
            <AlertCircle size={18} />
            Stop Analysis
        </button>
     </div>
            </motion.div>
          )}

          {state === 'success' && (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="success-state"
            >
              <div className="success-card">
                <div className="success-icon">
                  <CheckCircle size={48} />
                </div>
                <h2 className="success-title">Report Ready</h2>
                <p className="success-subtitle">Intelligence dossier for "{productName}" is complete</p>
                
                <div className="success-actions">
                  <button onClick={handleDownload} className="btn btn-success">
                    <Download size={20} />
                    Download PDF
                  </button>
                 {/* <button className="btn btn-outline" onClick={() => console.log("Summary Click")}>
                    <FileText size={20} />
                    Try out Market Research
                  </button>*/}
               
              
                
                <button onClick={resetState} className="btn btn-ghost">
                  Analyze Another Product
                </button>
              </div>
              </div>
              
            </motion.div>
          )}

          {state === 'error' && (
             <motion.div className="processing-state">
                <h2 className="text-red-500 font-bold mb-4">Mission Failed</h2>
                <div className="terminal">
                    <div className="terminal-body">
                         {processingSteps.map((step) => (
                            <div key={step.id} className={`terminal-step ${step.status}`}>
                                {step.text}
                            </div>
                         ))}
                    </div>
                </div>
                <button onClick={resetState} className="btn btn-ghost mt-4">Try Again</button>
             </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default ProductResearch;