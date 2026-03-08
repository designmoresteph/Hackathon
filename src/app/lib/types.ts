export interface TranscriptSegment {
  id: string;
  text: string;
  timestamp: number; // ms since recording start
}

export interface Entry {
  id: string;           // crypto.randomUUID()
  createdAt: string;    // ISO 8601
  durationSeconds: number;
  transcript: TranscriptSegment[];
  fullText: string;     // joined transcript segments
  userName?: string;    // from WelcomeScreen
}
