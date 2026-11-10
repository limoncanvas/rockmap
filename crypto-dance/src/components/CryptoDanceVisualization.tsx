import React, { useState, useEffect, useRef } from 'react';

export interface CryptoData {
  symbol: string;
  name: string;
  price: number;
  change: number;
  size: number;
  dominance?: number;
  section: string;
  animScale?: number;
  animRotate?: number;
  tempChange?: number;
  baseColor?: string;
}

// Generate a color based on price change, beat, and frequency
export const getColor = (crypto: CryptoData, freqData: number[], beatIntensity: number) => {
  // Deterministic mapping to frequency bands based on crypto symbol with safe guard for empty array
  const freqIndex = freqData.length > 0 ? Math.abs(crypto.symbol.charCodeAt(0)) % freqData.length : 0;
  const freqValue = freqData[freqIndex] || 0;
  
  // Binary color selection based on frequency value
  if (freqValue > 0.5) {
    // High frequency energy - use green
    const intensity = Math.floor(150 + (freqValue * 105));
    return `rgb(0, ${intensity}, 0)`;
  } else {
    // Low frequency energy - use red
    const intensity = Math.floor(150 + ((1 - freqValue) * 105));
    return `rgb(${intensity}, 0, 0)`;
  }
};

const CryptoDanceVisualization = () => {
  // Comprehensive crypto data based on your image
  const [cryptoData, setCryptoData] = useState<CryptoData[]>([
    // Main sections
    { symbol: 'BTC', name: 'Bitcoin', price: 80657.45, change: -1.15, size: 25, dominance: 61.22, section: 'bitcoin' },
    { symbol: 'ETH', name: 'Ethereum', price: 1541.10, change: -4.09, size: 15, section: 'infrastructure' },
    
    // Infrastructure & Platform
    { symbol: 'BNB', name: 'BNB', price: 580.149, change: 1.24, size: 10, section: 'infrastructure' },
    { symbol: 'XRP', name: 'XRP', price: 1.9984, change: 0.62, size: 8, section: 'infrastructure' },
    { symbol: 'SOL', name: 'Solana', price: 115.414, change: 0.34, size: 8, section: 'infrastructure' },
    { symbol: 'AVAX', name: 'Avalanche', price: 18.5081, change: -1.8, size: 4, section: 'infrastructure' },
    { symbol: 'SUI', name: 'SUI', price: 2.158, change: -2.5, size: 3, section: 'infrastructure' },
    { symbol: 'NEAR', name: 'NEAR', price: 3.7778, change: -1.2, size: 3, section: 'infrastructure' },
    { symbol: 'APT', name: 'Aptos', price: 4.72, change: 0.6, size: 2, section: 'infrastructure' },
    { symbol: 'XLM', name: 'Stellar', price: 0.12, change: -1.8, size: 3, section: 'infrastructure' },
    
    // Stablecoins
    { symbol: 'USDT', name: 'Tether', price: 1.0007, change: 0.07, size: 12, section: 'stablecoins' },
    { symbol: 'USDC', name: 'USD Coin', price: 1.0011, change: 0.08, size: 10, section: 'stablecoins' },
    { symbol: 'USDS', name: 'USDS', price: 1.0017, change: 0.03, size: 3, section: 'others' },
    { symbol: 'USDE', name: 'USDE', price: 1.0014, change: 0.05, size: 3, section: 'others' },
    
    // DeFi
    { symbol: 'ADA', name: 'Cardano', price: 0.622264, change: 0.15, size: 7, section: 'defi' },
    { symbol: 'DOT', name: 'Polkadot', price: 3.5307, change: 0.5, size: 4, section: 'defi' },
    { symbol: 'LINK', name: 'Chainlink', price: 12.339, change: 0.3, size: 4, section: 'defi' },
    { symbol: 'TRX', name: 'TRON', price: 0.236062, change: -0.8, size: 6, section: 'defi' },
    { symbol: 'LTC', name: 'Litecoin', price: 75.2645, change: 0.1, size: 4, section: 'defi' },
    { symbol: 'DAI', name: 'DAI', price: 1.001, change: 0.02, size: 3, section: 'defi' },
    
    // Other notable coins from image
    { symbol: 'DOGE', name: 'Dogecoin', price: 0.156694, change: -1.9, size: 5, section: 'meme' },
    { symbol: 'SHIB', name: 'Shiba Inu', price: 0.00001637, change: -1.7, size: 4, section: 'meme' },
    { symbol: 'PEPE', name: 'Pepe', price: 0.000008, change: -2.1, size: 3, section: 'meme' },
    
    // Others from image
    { symbol: 'LEO', name: 'LEO Token', price: 9.4253, change: 0.2, size: 4, section: 'others' },
    { symbol: 'HBAR', name: 'Hedera', price: 0.171504, change: 0.8, size: 4, section: 'others' },
    { symbol: 'FIL', name: 'Filecoin', price: 4.20, change: -3.1, size: 3, section: 'others' },
    { symbol: 'OM', name: 'OM', price: 0.4821, change: -2.3, size: 3, section: 'others' },
    { symbol: 'TON', name: 'TON', price: 2.6404, change: -4.2, size: 3, section: 'others' },
    
    // Additional tokens visible in the image
    { symbol: 'XMR', name: 'Monero', price: 202.662, change: 0.9, size: 3, section: 'others' },
    { symbol: 'OKB', name: 'OKB', price: 51.147, change: -2.1, size: 3, section: 'others' },
    { symbol: 'CRO', name: 'Cronos', price: 0.095, change: -1.5, size: 2, section: 'others' },
    { symbol: 'UNI', name: 'Uniswap', price: 7.20, change: -3.8, size: 3, section: 'defi' },
    { symbol: 'BGB', name: 'BGB', price: 4.3235, change: -2.5, size: 3, section: 'others' },
    { symbol: 'ARB', name: 'Arbitrum', price: 0.912, change: 0.4, size: 2, section: 'defi' },
    { symbol: 'ICP', name: 'Internet Computer', price: 10.21, change: 1.1, size: 2, section: 'infrastructure' },
    { symbol: 'FTM', name: 'Fantom', price: 0.36, change: -2.9, size: 2, section: 'defi' },
    { symbol: 'EOS', name: 'EOS', price: 0.77, change: -1.4, size: 2, section: 'infrastructure' },
    { symbol: 'KAS', name: 'Kaspa', price: 0.0814, change: 0.5, size: 2, section: 'others' },
    { symbol: 'VET', name: 'VeChain', price: 0.0245, change: 0.3, size: 2, section: 'others' },
    { symbol: 'XDC', name: 'XDC Network', price: 0.0815, change: -1.2, size: 2, section: 'others' },
    { symbol: 'ATOM', name: 'Cosmos', price: 7.125, change: -2.8, size: 2, section: 'infrastructure' },
    { symbol: 'GT', name: 'GT', price: 6.13, change: -0.7, size: 2, section: 'others' },
    { symbol: 'MNT', name: 'Mantle', price: 0.795, change: 1.2, size: 2, section: 'others' },
    { symbol: 'TAO', name: 'TAO', price: 1.94, change: -0.8, size: 2, section: 'others' },
    { symbol: 'POL', name: 'Polygon', price: 0.585, change: 0.9, size: 2, section: 'infrastructure' },
    { symbol: 'ONDO', name: 'ONDO', price: 0.795, change: -1.4, size: 2, section: 'others' },
    { symbol: 'WBETH', name: 'Wrapped Beacon ETH', price: 1625.14, change: -4.1, size: 2, section: 'defi' },

    // Small tokens visible in the treemap
    { symbol: 'ALGO', name: 'Algorand', price: 0.215, change: 0.4, size: 1, section: 'others' },
    { symbol: 'TIA', name: 'Celestia', price: 12.65, change: -2.9, size: 1, section: 'others' },
    { symbol: 'OP', name: 'Optimism', price: 1.85, change: 0.7, size: 1, section: 'others' },
    { symbol: 'FTN', name: 'FTN', price: 0.089, change: -3.4, size: 1, section: 'others' },
    { symbol: 'S', name: 'S', price: 0.072, change: 0.6, size: 1, section: 'others' },
    { symbol: 'ENA', name: 'ENA', price: 0.041, change: -1.8, size: 1, section: 'others' },
    { symbol: 'HYPE', name: 'HYPE', price: 0.0532, change: 3.2, size: 1, section: 'others' },
    { symbol: 'PI', name: 'PI', price: 1.41, change: 0.3, size: 1, section: 'others' }
  ]);

  // State for animation even without audio
  const [isPlaying, setIsPlaying] = useState(false);
  const isPlayingRef = useRef(false);
  const audioContext = useRef<AudioContext | null>(null);
  const analyser = useRef<AnalyserNode | null>(null);
  const dataArray = useRef<Uint8Array | null>(null);
  const audioElement = useRef<HTMLAudioElement | null>(null);
  const animationFrameId = useRef<number | null>(null);
  const [beatIntensity, setBeatIntensity] = useState(0);
  const simulatedBeatRef = useRef(0);
  const [frequencyData, setFrequencyData] = useState<number[]>([]);
  
  // Add a ref to store the current audio source
  const audioSource = useRef<MediaElementAudioSourceNode | null>(null);
  
  // Analyze audio data and update visualization
  const analyzeAudio = () => {
    if (!analyser.current) return;

    const updateData = () => {
      analyser.current!.getByteFrequencyData(dataArray.current!);
      const freqs = Array.from(dataArray.current!).map(val => val / 255);
      setFrequencyData(freqs);

      const totalIntensity = freqs.reduce((acc, val) => acc + val, 0) / freqs.length;
      setBeatIntensity(totalIntensity);

      animationFrameId.current = requestAnimationFrame(updateData);
    };

    updateData();
  };

  // Simulated beat for demo without audio
  useEffect(() => {
    const simulateBeat = () => {
      if (isPlaying && (!audioElement.current || !audioSource.current)) {
        // Create a pulsing beat effect
        simulatedBeatRef.current += 0.1;
        const sinValue = Math.sin(simulatedBeatRef.current);
        const beatValue = (sinValue + 1) / 2; // Normalize to 0-1
        
        // Add some randomness for more natural feel
        const randomFactor = Math.random() * 0.3;
        const currentBeatIntensity = beatValue + randomFactor > 1 ? 1 : beatValue + randomFactor;
        setBeatIntensity(currentBeatIntensity);
        
        // Create simulated frequency data with more variation
        const simulatedFreqs = Array(32).fill(0).map((_, i) => {
          const baseValue = Math.sin(simulatedBeatRef.current + i * 0.2) * 0.5 + 0.5;
          return baseValue + (Math.random() * 0.3);
        });
        setFrequencyData(simulatedFreqs);
        
        // Update crypto data with new animations based on the beat
        setCryptoData(prevData => 
          prevData.map((crypto) => {
            // Generate color based on the beat intensity
            let baseColor;
            if (currentBeatIntensity > 0.1) {
              // Strong beat - bright green
              const greenIntensity = Math.floor(255 * currentBeatIntensity);
              baseColor = `rgb(0, ${greenIntensity}, 0)`;
            } else {
              // Weak beat - bright red
              const redIntensity = Math.floor(255 * (1 - currentBeatIntensity));
              baseColor = `rgb(${redIntensity}, 0, 0)`;
            }
            
            return {
              ...crypto,
              animScale: 1 + (currentBeatIntensity * 0.5),
              animRotate: (Math.random() * 2 - 1) * currentBeatIntensity * 10,
              tempChange: crypto.change + (currentBeatIntensity * 2 - 1) * 5,
              baseColor
            };
          })
        );
        
        animationFrameId.current = requestAnimationFrame(simulateBeat);
      }
    };
    
    if (isPlaying && (!audioElement.current || !audioSource.current)) {
      simulateBeat();
    }
    
    return () => {
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
    };
  }, [isPlaying]);

  // Initialize audio context
  useEffect(() => {
    if (!audioContext.current) {
      try {
        const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
        audioContext.current = new AudioContext();
        analyser.current = audioContext.current.createAnalyser();
        analyser.current.fftSize = 256; // Increase FFT size for more data
        const bufferLength = analyser.current.frequencyBinCount;
        dataArray.current = new Uint8Array(bufferLength);
      } catch (error) {
        console.log("Audio context initialization error:", error);
      }
    }

    return () => {
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
      if (audioContext.current) {
        audioContext.current.close();
        audioContext.current = null;
      }
      if (audioSource.current) {
        audioSource.current.disconnect();
        audioSource.current = null;
      }
    };
  }, []);

  // Set up audio connections and start analyzing
  const startAudio = (force = false) => {
    if (isPlayingRef.current && !force) return;

    // If no custom audio element is uploaded, run in simulated visualization mode
    if (!audioElement.current) {
      isPlayingRef.current = true;
      setIsPlaying(true);
      return;
    }

    try {
      // Create new AudioContext if it doesn't exist or is closed
      if (!audioContext.current || audioContext.current.state === 'closed') {
        const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
        audioContext.current = new AudioContextClass();
        analyser.current = audioContext.current.createAnalyser();
        analyser.current.fftSize = 64;
        const bufferLength = analyser.current.frequencyBinCount;
        dataArray.current = new Uint8Array(bufferLength);
      }

      // Resume audio context if it's suspended
      if (audioContext.current.state === 'suspended') {
        audioContext.current.resume();
      }

      // Re-use existing audio source if already created for this audioElement.
      // HTMLMediaElement cannot be passed to createMediaElementSource more than once.
      if (!audioSource.current) {
        audioSource.current = audioContext.current.createMediaElementSource(audioElement.current);
        audioSource.current.connect(analyser.current!);
        analyser.current!.connect(audioContext.current.destination);
      }

      // Start playing the audio
      audioElement.current.play().catch(error => {
        console.log("Audio play error:", error);
        // Fall back to simulated beats
        isPlayingRef.current = true;
        setIsPlaying(true);
      });

      isPlayingRef.current = true;
      setIsPlaying(true);
      analyzeAudio();
    } catch (error) {
      console.log("Audio setup error:", error);
      // Fall back to simulated beats
      isPlayingRef.current = true;
      setIsPlaying(true);
    }
  };

  // Toggle audio playback
  const toggleAudio = () => {
    if (isPlayingRef.current) {
      isPlayingRef.current = false;
      setIsPlaying(false);
      if (audioElement.current) {
        audioElement.current.pause();
      }
      // Note: Preserve audioSource.current across pause/resume cycles.
      // Calling disconnect() and nulling audioSource causes InvalidStateError on subsequent play.
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
    } else {
      startAudio();
    }
  };

  // Handle file upload
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Clean up existing audio resources
      if (audioElement.current) {
        audioElement.current.pause();
        URL.revokeObjectURL(audioElement.current.src);
      }
      if (audioSource.current) {
        audioSource.current.disconnect();
        audioSource.current = null;
      }
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }

      // Create new audio element
      const url = URL.createObjectURL(file);
      audioElement.current = new Audio(url);
      audioElement.current.onended = () => {
        isPlayingRef.current = false;
        setIsPlaying(false);
        if (animationFrameId.current) {
          cancelAnimationFrame(animationFrameId.current);
        }
      };

      // Automatically start visualization with the newly uploaded track
      startAudio(true);
    }
  };


  return (
    <div className="fixed inset-0 bg-gray-900 overflow-hidden">
      <div className="absolute top-4 left-4 z-10">
        <h1 className="text-white text-2xl mb-4">Crypto Market Dance Visualization</h1>
        <div className="flex items-center gap-4">
          <button
            onClick={toggleAudio}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            {isPlaying ? 'Stop' : 'Start'} Visualization
          </button>
          
          <input
            type="file"
            accept="audio/*"
            onChange={handleFileUpload}
            className="hidden"
            id="audio-input"
          />
          <label
            htmlFor="audio-input"
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors cursor-pointer"
          >
            Upload Audio
          </label>
        </div>
      </div>

      <div className="w-full h-full p-4">
        <div className="grid grid-cols-12 gap-1 h-full">
          {/* Bitcoin Section */}
          <div className="col-span-3">
            <div className="font-bold text-white text-xs mb-1 pl-1">Bitcoin & Derivatives</div>
            <div className="h-full relative">
              {cryptoData.filter(c => c.section === 'bitcoin').map((crypto) => {
                // Calculate color once
                const color = getColor(crypto, frequencyData, beatIntensity);
                
                return (
                  <div 
                    key={crypto.symbol}
                    className="absolute top-0 left-0 right-0 bottom-0 flex flex-col items-center justify-center rounded-md overflow-hidden text-center"
                    style={{
                      backgroundColor: color,
                      transition: 'background-color 0.1s ease-out', 
                      opacity: 0.8 + (beatIntensity * 0.2),
                      boxShadow: `0 0 ${10 * beatIntensity}px ${color}`,
                    }}
                  >
                    <div className="text-white font-bold text-6xl">{crypto.symbol}</div>
                    <div className="text-white text-2xl">${crypto.price.toLocaleString()}</div>
                    <div className={crypto.change > 0 ? "text-green-300 text-xl" : "text-red-300 text-xl"}>
                      ▼ {crypto.change}%
                    </div>
                    <div className="text-white text-sm absolute bottom-2">Dominance: {crypto.dominance}%</div>
                  </div>
                );
              })}
            </div>
          </div>
          
          {/* Infrastructure & Platform Section */}
          <div className="col-span-6">
            <div className="font-bold text-white text-xs mb-1 pl-1">Infrastructure & Platform</div>
            <div className="grid grid-cols-6 grid-rows-6 gap-1 h-full">
              {/* ETH gets a large space */}
              <div className="col-span-6 row-span-2 relative">
                {cryptoData.filter(c => c.symbol === 'ETH').map((crypto, index) => {
                  const scale = crypto.animScale || 1;
                  const rotate = crypto.animRotate || 0;
                  
                  return (
                    <div 
                      key={crypto.symbol}
                      className="absolute top-0 left-0 right-0 bottom-0 flex flex-col items-center justify-center rounded-md overflow-hidden text-center"
                      style={{
                        backgroundColor: getColor(crypto, frequencyData, beatIntensity),
                        transform: `rotate(${rotate}deg) scale(${1 + (beatIntensity * 0.1)})`,
                        transition: 'all 0.3s ease-in-out',
                        opacity: 0.8 + (beatIntensity * 0.2),
                        boxShadow: `0 0 ${10 * beatIntensity}px ${getColor(crypto, frequencyData, beatIntensity)}`,
                      }}
                    >
                      <div className="text-white font-bold text-4xl">{crypto.symbol}</div>
                      <div className="text-white text-xl">${crypto.price.toLocaleString()}</div>
                      <div className={crypto.change > 0 ? "text-green-300" : "text-red-300"}>
                        ▼ {crypto.change}%
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Other infrastructure tokens */}
              <div className="col-span-6 row-span-4 grid grid-cols-6 gap-1">
                {cryptoData.filter(c => c.section === 'infrastructure' && c.symbol !== 'ETH').map((crypto, index) => {
                  const scale = crypto.animScale || 1;
                  const rotate = crypto.animRotate || 0;
                  
                  return (
                    <div 
                      key={crypto.symbol}
                      className="flex flex-col items-center justify-center rounded-md overflow-hidden text-center p-1"
                      style={{
                        backgroundColor: getColor(crypto, frequencyData, beatIntensity),
                        transform: `rotate(${rotate}deg) scale(${1 + (beatIntensity * 0.1)})`,
                        transition: 'all 0.3s ease-in-out',
                        opacity: 0.8 + (beatIntensity * 0.2),
                        boxShadow: `0 0 ${10 * beatIntensity}px ${getColor(crypto, frequencyData, beatIntensity)}`,
                      }}
                    >
                      <div className="text-white font-bold text-xs">{crypto.symbol}</div>
                      <div className="text-white text-tiny">${crypto.price.toLocaleString(undefined, {maximumFractionDigits: 2})}</div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
          
          {/* Others & Stablecoins Section */}
          <div className="col-span-3">
            <div className="font-bold text-white text-xs mb-1 pl-1">Others & Stablecoins</div>
            <div className="grid grid-cols-3 grid-rows-6 gap-1 h-full">
              {cryptoData.filter(c => c.section === 'stablecoins' || c.section === 'others').map((crypto, index) => {
                const scale = crypto.animScale || 1;
                const rotate = crypto.animRotate || 0;
                
                return (
                  <div 
                    key={crypto.symbol}
                    className="flex flex-col items-center justify-center rounded-md overflow-hidden text-center p-1"
                    style={{
                      backgroundColor: getColor(crypto, frequencyData, beatIntensity),
                      transform: `rotate(${rotate}deg) scale(${1 + (beatIntensity * 0.1)})`,
                      transition: 'all 0.3s ease-in-out',
                      opacity: 0.8 + (beatIntensity * 0.2),
                      boxShadow: `0 0 ${10 * beatIntensity}px ${getColor(crypto, frequencyData, beatIntensity)}`,
                    }}
                  >
                    <div className="text-white font-bold text-xs">{crypto.symbol}</div>
                    <div className="text-white text-tiny">${crypto.price.toLocaleString(undefined, {maximumFractionDigits: 2})}</div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CryptoDanceVisualization; 