import { useState, useRef, useCallback, useEffect } from 'react';
import type { TranscriptSegment } from '../lib/types';

export interface UseVoiceCaptureOptions {
  onSegment: (segment: TranscriptSegment) => void;
  onError?: (error: string) => void;
}

export interface UseVoiceCaptureReturn {
  isConnected: boolean;
  isRecording: boolean;
  startRecording: () => Promise<void>;
  stopRecording: () => void;
  error: string | null;
}

export function useVoiceCapture(
  options: UseVoiceCaptureOptions
): UseVoiceCaptureReturn {
  const [isConnected, setIsConnected] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const wsRef = useRef<WebSocket | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const processorRef = useRef<ScriptProcessorNode | null>(null);
  const recordingStartRef = useRef<number>(0);
  const optionsRef = useRef(options);
  optionsRef.current = options;

  const cleanup = useCallback(() => {
    if (processorRef.current) {
      processorRef.current.disconnect();
      processorRef.current = null;
    }
    if (audioCtxRef.current) {
      audioCtxRef.current.close().catch(() => {});
      audioCtxRef.current = null;
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    if (wsRef.current) {
      if (
        wsRef.current.readyState === WebSocket.OPEN ||
        wsRef.current.readyState === WebSocket.CONNECTING
      ) {
        wsRef.current.close();
      }
      wsRef.current = null;
    }
    setIsConnected(false);
    setIsRecording(false);
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      cleanup();
    };
  }, [cleanup]);

  const startRecording = useCallback(async () => {
    setError(null);

    // Get ephemeral token from server
    let clientSecret: string;
    try {
      const tokenRes = await fetch('/api/realtime-token', { method: 'POST' });
      if (!tokenRes.ok) {
        throw new Error(`Token endpoint returned ${tokenRes.status}`);
      }
      const tokenData = await tokenRes.json();
      clientSecret = tokenData.client_secret?.value;
      if (!clientSecret) {
        throw new Error('No client_secret in token response');
      }
    } catch (err) {
      const msg = `Failed to get realtime token: ${err instanceof Error ? err.message : 'unknown error'}`;
      setError(msg);
      optionsRef.current.onError?.(msg);
      return;
    }

    // Request microphone access
    let stream: MediaStream;
    try {
      stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    } catch {
      const msg = 'Microphone access denied';
      setError(msg);
      optionsRef.current.onError?.(msg);
      return;
    }
    streamRef.current = stream;

    // Open WebSocket to OpenAI Realtime API using ephemeral token
    const url =
      'wss://api.openai.com/v1/realtime?model=gpt-4o-mini-realtime-preview';
    const ws = new WebSocket(url, [
      'realtime',
      'openai-insecure-api-key.' + clientSecret,
      'openai-beta.realtime-v1',
    ]);
    wsRef.current = ws;

    ws.onopen = () => {
      setIsConnected(true);

      // Start audio capture and streaming
      startAudioStream(stream, ws);
      recordingStartRef.current = Date.now();
      setIsRecording(true);
    };

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data as string) as {
          type: string;
          transcript?: string;
        };

        if (
          data.type ===
          'conversation.item.input_audio_transcription.completed'
        ) {
          const text = data.transcript ?? '';
          if (text.trim()) {
            const segment: TranscriptSegment = {
              id: crypto.randomUUID(),
              text: text.trim(),
              timestamp: Date.now() - recordingStartRef.current,
            };
            optionsRef.current.onSegment(segment);
          }
        }
      } catch {
        // Ignore parse errors on non-JSON messages
      }
    };

    ws.onerror = () => {
      const msg = 'WebSocket connection error';
      setError(msg);
      optionsRef.current.onError?.(msg);
      cleanup();
    };

    ws.onclose = () => {
      setIsConnected(false);
      setIsRecording(false);
    };
  }, [cleanup]);

  const stopRecording = useCallback(() => {
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      // Commit remaining audio buffer before closing
      wsRef.current.send(
        JSON.stringify({ type: 'input_audio_buffer.commit' })
      );
      wsRef.current.close();
    }
    cleanup();
  }, [cleanup]);

  return {
    isConnected,
    isRecording,
    startRecording,
    stopRecording,
    error,
  };
}

// --- Audio streaming helpers ---

function startAudioStream(stream: MediaStream, ws: WebSocket): void {
  const audioCtx = new AudioContext({ sampleRate: 24000 });
  const source = audioCtx.createMediaStreamSource(stream);

  // ScriptProcessorNode with 4096 buffer, mono input/output
  const processor = audioCtx.createScriptProcessor(4096, 1, 1);

  processor.onaudioprocess = (e: AudioProcessingEvent) => {
    if (ws.readyState !== WebSocket.OPEN) return;

    const float32 = e.inputBuffer.getChannelData(0);
    const pcm16 = float32ToPcm16(float32);
    const base64 = arrayBufferToBase64(pcm16.buffer as ArrayBuffer);

    ws.send(
      JSON.stringify({
        type: 'input_audio_buffer.append',
        audio: base64,
      })
    );
  };

  source.connect(processor);
  processor.connect(audioCtx.destination);
}

function float32ToPcm16(float32: Float32Array): Int16Array {
  const pcm16 = new Int16Array(float32.length);
  for (let i = 0; i < float32.length; i++) {
    const s = Math.max(-1, Math.min(1, float32[i]));
    pcm16[i] = s < 0 ? s * 0x8000 : s * 0x7fff;
  }
  return pcm16;
}

function arrayBufferToBase64(buffer: ArrayBuffer): string {
  const bytes = new Uint8Array(buffer);
  let binary = '';
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}
