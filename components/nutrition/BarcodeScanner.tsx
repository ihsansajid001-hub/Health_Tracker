'use client';

import { useState, useRef, useEffect } from 'react';
import { Camera, X, Loader2, AlertTriangle, ScanLine } from 'lucide-react';

interface BarcodeScannerProps {
  onScanSuccess: (product: any) => void;
  onClose: () => void;
  userAllergies?: string[];
}

export default function BarcodeScanner({ onScanSuccess, onClose, userAllergies = [] }: BarcodeScannerProps) {
  const [isScanning, setIsScanning] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [manualBarcode, setManualBarcode] = useState('');
  const [loading, setLoading] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  useEffect(() => {
    return () => { streamRef.current?.getTracks().forEach(t => t.stop()); };
  }, []);

  const startCamera = async () => {
    try {
      setError(null);
      setIsScanning(true);
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment', width: { ideal: 1280 }, height: { ideal: 720 } } });
      streamRef.current = stream;
      if (videoRef.current) { videoRef.current.srcObject = stream; videoRef.current.play(); }
    } catch {
      setError('Unable to access camera. Please check permissions or enter barcode manually.');
      setIsScanning(false);
    }
  };

  const stopCamera = () => {
    streamRef.current?.getTracks().forEach(t => t.stop());
    streamRef.current = null;
    setIsScanning(false);
  };

  const lookupBarcode = async (barcode: string) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/nutrition/barcode?barcode=${encodeURIComponent(barcode)}`);
      const data = await res.json();
      if (res.ok) { onScanSuccess(data.product); }
      else { setError(data.error || 'Product not found'); }
    } catch {
      setError('Failed to lookup product. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (manualBarcode.trim()) lookupBarcode(manualBarcode.trim());
  };

  const handleCaptureFrame = () => {
    stopCamera();
    setError('Barcode scanning requires a specialized library. Please enter the barcode manually below.');
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-orange-100 rounded-xl flex items-center justify-center">
              <ScanLine className="w-5 h-5 text-orange-500" />
            </div>
            <h3 className="font-black text-gray-900">Scan Barcode</h3>
          </div>
          <button onClick={onClose} className="w-8 h-8 bg-gray-100 hover:bg-gray-200 rounded-xl flex items-center justify-center transition-colors">
            <X className="w-4 h-4 text-gray-500" />
          </button>
        </div>

        <div className="p-6 space-y-5">
          {/* Camera section */}
          {!isScanning ? (
            <div className="text-center py-4">
              <div className="w-20 h-20 bg-orange-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Camera className="w-10 h-10 text-orange-400" />
              </div>
              <p className="text-sm text-gray-500 font-semibold mb-4">Scan the barcode on your food package</p>
              <button onClick={startCamera} className="w-full py-3 bg-orange-500 hover:bg-orange-600 text-white rounded-2xl font-black text-sm transition-all shadow-lg shadow-orange-200 hover:-translate-y-0.5">
                Start Camera
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="relative bg-black rounded-2xl overflow-hidden">
                <video ref={videoRef} className="w-full h-56 object-cover" playsInline muted />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-48 h-28 border-2 border-orange-400 rounded-xl flex items-center justify-center">
                    <span className="text-white text-xs font-semibold bg-black/40 px-2 py-1 rounded-lg">Position barcode here</span>
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <button onClick={handleCaptureFrame} className="py-2.5 bg-orange-500 hover:bg-orange-600 text-white rounded-xl font-bold text-sm transition-colors">Capture</button>
                <button onClick={stopCamera} className="py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-bold text-sm transition-colors">Stop</button>
              </div>
            </div>
          )}

          {/* Divider */}
          <div className="flex items-center gap-3">
            <div className="flex-1 h-px bg-gray-100" />
            <span className="text-xs text-gray-400 font-semibold">or enter manually</span>
            <div className="flex-1 h-px bg-gray-100" />
          </div>

          {/* Manual entry */}
          <form onSubmit={handleManualSubmit} className="space-y-3">
            <input
              type="text"
              value={manualBarcode}
              onChange={(e) => setManualBarcode(e.target.value)}
              placeholder="Enter barcode number…"
              className="w-full px-4 py-3 border border-gray-200 rounded-2xl text-sm font-semibold text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-400 bg-gray-50"
            />
            <button
              type="submit"
              disabled={!manualBarcode.trim() || loading}
              className="w-full py-3 bg-gray-900 hover:bg-gray-800 disabled:bg-gray-200 disabled:text-gray-400 text-white rounded-2xl font-black text-sm transition-all flex items-center justify-center gap-2"
            >
              {loading ? <><Loader2 className="w-4 h-4 animate-spin" /> Looking up…</> : 'Lookup Product'}
            </button>
          </form>

          {/* Error */}
          {error && (
            <div className="flex items-start gap-3 p-3 bg-red-50 border border-red-100 rounded-2xl">
              <AlertTriangle className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />
              <p className="text-xs text-red-700 font-semibold">{error}</p>
            </div>
          )}

          {/* Tips */}
          <div className="bg-orange-50 rounded-2xl p-4">
            <p className="text-xs font-black text-orange-700 mb-2">Tips for scanning</p>
            <ul className="space-y-1 text-xs text-orange-600 font-semibold">
              <li>• Ensure good lighting</li>
              <li>• Hold steady and focus on the barcode</li>
              <li>• Try different angles if not working</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
