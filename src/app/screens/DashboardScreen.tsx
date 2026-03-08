import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { useNavigate } from "react-router";
import { Calendar, Mic, FileText, Coffee, Sparkles, TrendingUp, Lightbulb, Search } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { getLatestPipelineResult, getAllPipelineResults } from '../lib/pipelineStorage';
import { getAllEntries } from '../lib/storage';
import type { Entry, PipelineResult } from '../lib/types';

const priorityColors: Record<string, { bg: string; text: string }> = {
  high: { bg: '#C4807A', text: '#3D2010' },
  medium: { bg: '#C4957A', text: '#3D2010' },
  low: { bg: '#B0C098', text: '#4A5E38' },
};

export function DashboardScreen() {
  const navigate = useNavigate();

  const [latestResult, setLatestResult] = useState<PipelineResult | null>(null);
  const [entries, setEntries] = useState<Entry[]>([]);
  const [allResults, setAllResults] = useState<PipelineResult[]>([]);

  useEffect(() => {
    setLatestResult(getLatestPipelineResult());
    setEntries(getAllEntries());
    setAllResults(getAllPipelineResults());
  }, []);

  const handleSearch = (query: string) => {
    if (query.trim()) {
      navigate(`/search?q=${encodeURIComponent(query.trim())}`);
    }
  };

  return (
    <div className="min-h-screen p-8" style={{ backgroundColor: '#EEF5F8' }}>
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-8"
        >
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="font-['Playfair_Display'] italic text-5xl tracking-[-0.02em] mb-3" style={{ color: '#1A1510' }}>
                Good morning
              </h1>
              <p className="font-['DM_Sans'] font-light" style={{ color: 'rgba(26,21,16,0.45)' }}>
                Your AI workspace is ready
              </p>
            </div>
            <div className="w-80">
              <Input
                placeholder="Search your thoughts... (try &quot;blog&quot;)"
                className="rounded-full font-['DM_Sans'] font-light"
                style={{
                  backgroundColor: 'rgba(255,255,255,0.55)',
                  border: '1px solid rgba(255,255,255,0.6)',
                  backdropFilter: 'blur(16px)',
                  color: '#1A1510',
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handleSearch((e.target as HTMLInputElement).value);
                  }
                }}
              />
            </div>
          </div>

          {/* AI Widgets Section - Top */}
          <div className="space-y-4">
            <h2 className="font-['Playfair_Display'] italic text-2xl tracking-[-0.01em]" style={{ color: '#1A1510' }}>
              AI Agents
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Insight Discovery Widget */}
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.1 }}
              >
                <Card className="border rounded-[20px] p-7 transition-all hover:-translate-y-1" style={{ backgroundColor: '#B0C098', border: '1px solid rgba(255,255,255,0.6)', backdropFilter: 'blur(16px) saturate(1.2)' }}>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 font-['Playfair_Display'] italic text-lg" style={{ color: '#1A1510' }}>
                      <Sparkles className="w-5 h-5" strokeWidth={1.5} />
                      Insight Discovery
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {latestResult?.synthesis ? (
                      <div className="space-y-3">
                        <p className="text-sm font-['DM_Sans'] font-light leading-relaxed" style={{ color: '#1A1510' }}>
                          {latestResult.synthesis.summary}
                        </p>
                        {latestResult.synthesis.priorities.length > 0 && (
                          <div className="space-y-1">
                            <p className="text-xs font-['DM_Sans'] font-medium" style={{ color: '#1A1510' }}>Priorities</p>
                            <ul className="space-y-1">
                              {latestResult.synthesis.priorities.map((p, i) => (
                                <li key={i} className="text-xs font-['DM_Sans'] font-light flex items-start gap-1.5" style={{ color: '#1A1510' }}>
                                  <span className="mt-1.5 w-1 h-1 rounded-full shrink-0" style={{ backgroundColor: '#1A1510' }} />
                                  {p}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                        {latestResult.synthesis.themes.length > 0 && (
                          <div className="flex flex-wrap gap-1.5">
                            {latestResult.synthesis.themes.map((theme, i) => (
                              <span
                                key={i}
                                className="rounded-full px-2.5 py-0.5 text-xs font-['DM_Sans']"
                                style={{ backgroundColor: 'rgba(255,255,255,0.5)', color: '#1A1510' }}
                              >
                                {theme}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    ) : (
                      <p className="text-xs font-['DM_Sans'] font-light" style={{ color: '#1A1510' }}>
                        Record a voice entry and run the pipeline to see insights here
                      </p>
                    )}
                  </CardContent>
                </Card>
              </motion.div>

              {/* Pattern Detection Widget */}
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 }}
              >
                <Card className="border rounded-[20px] p-7 transition-all hover:-translate-y-1" style={{ backgroundColor: '#C4957A', border: '1px solid rgba(255,255,255,0.6)', backdropFilter: 'blur(16px) saturate(1.2)' }}>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 font-['Playfair_Display'] italic text-lg" style={{ color: '#1A1510' }}>
                      <TrendingUp className="w-5 h-5" strokeWidth={1.5} />
                      Pattern Detection
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {latestResult?.linker ? (
                      <div className="space-y-3">
                        {latestResult.linker.recurringPatterns.length > 0 && (
                          <div className="space-y-1">
                            <p className="text-xs font-['DM_Sans'] font-medium" style={{ color: '#1A1510' }}>Recurring Patterns</p>
                            <ul className="space-y-1">
                              {latestResult.linker.recurringPatterns.map((pattern, i) => (
                                <li key={i} className="text-xs font-['DM_Sans'] font-light flex items-start gap-1.5" style={{ color: '#1A1510' }}>
                                  <span className="mt-1.5 w-1 h-1 rounded-full shrink-0" style={{ backgroundColor: '#1A1510' }} />
                                  {pattern}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                        {latestResult.linker.connections.length > 0 && (
                          <p className="text-xs font-['DM_Sans'] font-light" style={{ color: '#1A1510' }}>
                            {latestResult.linker.connections.length} connection{latestResult.linker.connections.length !== 1 ? 's' : ''} found across entries
                          </p>
                        )}
                      </div>
                    ) : (
                      <p className="text-xs font-['DM_Sans'] font-light" style={{ color: '#1A1510' }}>
                        Patterns will appear after processing multiple entries
                      </p>
                    )}
                  </CardContent>
                </Card>
              </motion.div>

              {/* Smart Action Items Widget */}
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3 }}
              >
                <Card className="border rounded-[20px] p-7 transition-all hover:-translate-y-1" style={{ backgroundColor: '#D8E0B8', border: '1px solid rgba(255,255,255,0.6)', backdropFilter: 'blur(16px) saturate(1.2)' }}>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 font-['Playfair_Display'] italic text-lg" style={{ color: '#1A1510' }}>
                      <Lightbulb className="w-5 h-5" strokeWidth={1.5} />
                      Smart Actions
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {latestResult?.action ? (
                      <div className="space-y-2">
                        {latestResult.action.nextSteps.map((step, i) => (
                          <div key={i} className="flex items-start gap-2">
                            <div className="flex-1">
                              <p className="text-xs font-['DM_Sans'] font-light leading-relaxed" style={{ color: '#1A1510' }}>
                                {step.action}
                              </p>
                            </div>
                            <div className="flex items-center gap-1.5 shrink-0">
                              <span
                                className="rounded-full px-2 py-0.5 text-[10px] font-['DM_Sans'] font-medium"
                                style={{
                                  backgroundColor: priorityColors[step.priority]?.bg ?? 'rgba(26,21,16,0.10)',
                                  color: priorityColors[step.priority]?.text ?? '#1A1510',
                                }}
                              >
                                {step.priority}
                              </span>
                              {step.timeEstimate && (
                                <span className="text-[10px] font-['DM_Sans'] font-light" style={{ color: 'rgba(26,21,16,0.45)' }}>
                                  {step.timeEstimate}
                                </span>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-xs font-['DM_Sans'] font-light" style={{ color: '#1A1510' }}>
                        Action items will be generated from your next voice entry
                      </p>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          </div>

          {/* Regular Dashboard Widgets */}
          <div className="space-y-4">
            <h2 className="font-['Playfair_Display'] italic text-2xl tracking-[-0.01em]" style={{ color: '#1A1510' }}>
              Your Workspace
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Recent Entries Widget */}
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.4 }}
              >
                <Card className="border rounded-[20px] p-7 transition-all hover:-translate-y-1" style={{ backgroundColor: '#C4807A', border: '1px solid rgba(255,255,255,0.6)', backdropFilter: 'blur(16px) saturate(1.2)' }}>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 font-['Playfair_Display'] italic" style={{ color: '#1A1510' }}>
                      <Coffee className="w-5 h-5" strokeWidth={1.5} />
                      Recent Entries
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2 font-['DM_Sans'] font-light" style={{ color: '#1A1510' }}>
                    {entries.length > 0 ? (
                      entries.slice(0, 3).map((entry) => {
                        const mins = Math.floor(entry.durationSeconds / 60);
                        const secs = entry.durationSeconds % 60;
                        const preview = entry.fullText.length > 60
                          ? entry.fullText.slice(0, 60) + '...'
                          : entry.fullText;
                        return (
                          <div key={entry.id} className="space-y-0.5">
                            <div className="flex items-center gap-2 text-xs" style={{ color: 'rgba(26,21,16,0.45)' }}>
                              <span>{new Date(entry.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
                              <span>{mins}m {secs}s</span>
                            </div>
                            <p className="text-sm">{preview}</p>
                          </div>
                        );
                      })
                    ) : (
                      <p className="text-sm" style={{ color: 'rgba(26,21,16,0.45)' }}>
                        No entries yet. Start by recording your thoughts.
                      </p>
                    )}
                  </CardContent>
                </Card>
              </motion.div>

              {/* Quick Capture Widget */}
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.5 }}
              >
                <Card className="border rounded-[20px] p-7 transition-all hover:-translate-y-1" style={{ backgroundColor: 'rgba(255,255,255,0.55)', border: '1px solid rgba(255,255,255,0.6)', backdropFilter: 'blur(16px) saturate(1.2)' }}>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 font-['Playfair_Display'] italic" style={{ color: '#1A1510' }}>
                      <Mic className="w-5 h-5" strokeWidth={1.5} />
                      Quick Capture
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Button
                      className="w-full rounded-full font-['DM_Mono'] font-semibold text-[13px] tracking-[0.04em]"
                      onClick={() => navigate("/voice")}
                      style={{ backgroundColor: '#1A1510', color: '#EEF5F8', border: 'none' }}
                    >
                      Start Recording
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Proposed Schedule Widget */}
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.6 }}
              >
                <Card className="border rounded-[20px] p-7 transition-all hover:-translate-y-1" style={{ backgroundColor: 'rgba(255,255,255,0.55)', border: '1px solid rgba(255,255,255,0.6)', backdropFilter: 'blur(16px) saturate(1.2)' }}>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 font-['Playfair_Display'] italic" style={{ color: '#1A1510' }}>
                      <Calendar className="w-5 h-5" strokeWidth={1.5} style={{ color: '#B0C098' }} />
                      Proposed Schedule
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3 font-['DM_Sans'] font-light">
                    {latestResult?.calendar?.proposedEvents && latestResult.calendar.proposedEvents.length > 0 ? (
                      latestResult.calendar.proposedEvents.slice(0, 3).map((event, i) => (
                        <div key={i} className="text-sm">
                          <p className="font-medium" style={{ color: '#1A1510' }}>
                            {new Date(event.startTime).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}
                          </p>
                          <p style={{ color: '#1A1510' }}>{event.title}</p>
                          <p className="text-xs" style={{ color: 'rgba(26,21,16,0.45)' }}>{event.source}</p>
                        </div>
                      ))
                    ) : (
                      <p className="text-sm" style={{ color: 'rgba(26,21,16,0.45)' }}>
                        Run the pipeline to see AI-proposed schedule
                      </p>
                    )}
                  </CardContent>
                </Card>
              </motion.div>

              {/* Session History Widget */}
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.7 }}
              >
                <Card className="border rounded-[20px] p-7 transition-all hover:-translate-y-1" style={{ backgroundColor: 'rgba(255,255,255,0.55)', border: '1px solid rgba(255,255,255,0.6)', backdropFilter: 'blur(16px) saturate(1.2)' }}>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 font-['Playfair_Display'] italic" style={{ color: '#1A1510' }}>
                      <FileText className="w-5 h-5" strokeWidth={1.5} style={{ color: '#B0C098' }} />
                      Session History
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2 font-['DM_Sans'] font-light">
                    <p className="text-sm" style={{ color: '#1A1510' }}>{entries.length} entries recorded</p>
                    <p className="text-sm" style={{ color: '#1A1510' }}>{allResults.length} pipeline runs</p>
                    {entries.length > 0 && (
                      <p className="text-xs" style={{ color: 'rgba(26,21,16,0.45)' }}>
                        Journaling since {new Date(entries[entries.length - 1].createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </p>
                    )}
                    <Button variant="outline" size="sm" className="w-full mt-2 rounded-full border-[1.5px] font-['DM_Mono'] font-semibold text-[13px] tracking-[0.04em]" style={{ borderColor: '#1A1510', color: '#1A1510' }}>
                      Explore
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Research Widget */}
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.8 }}
              >
                <Card className="border rounded-[20px] p-7 transition-all hover:-translate-y-1" style={{ backgroundColor: 'rgba(255,255,255,0.55)', border: '1px solid rgba(255,255,255,0.6)', backdropFilter: 'blur(16px) saturate(1.2)' }}>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 font-['Playfair_Display'] italic" style={{ color: '#1A1510' }}>
                      <Search className="w-5 h-5" strokeWidth={1.5} />
                      Research
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2 font-['DM_Sans'] font-light">
                    {latestResult?.research?.references && latestResult.research.references.length > 0 ? (
                      latestResult.research.references.slice(0, 3).map((ref, i) => (
                        <div key={i} className="space-y-0.5">
                          <p className="text-sm font-medium" style={{ color: '#1A1510' }}>{ref.title}</p>
                          <p className="text-xs" style={{ color: 'rgba(26,21,16,0.45)' }}>{ref.relevantTo}</p>
                        </div>
                      ))
                    ) : (
                      <p className="text-sm" style={{ color: 'rgba(26,21,16,0.45)' }}>
                        Research references will appear after running the pipeline
                      </p>
                    )}
                  </CardContent>
                </Card>
              </motion.div>

              {/* Creative Sparks Widget */}
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.9 }}
              >
                <Card className="border rounded-[20px] p-7 transition-all hover:-translate-y-1" style={{ backgroundColor: 'rgba(255,255,255,0.55)', border: '1px solid rgba(255,255,255,0.6)', backdropFilter: 'blur(16px) saturate(1.2)' }}>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 font-['Playfair_Display'] italic" style={{ color: '#1A1510' }}>
                      <Sparkles className="w-5 h-5" strokeWidth={1.5} />
                      Creative Sparks
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="font-['DM_Sans'] font-light">
                    {latestResult?.synthesis?.sparks && latestResult.synthesis.sparks.length > 0 ? (
                      <ul className="space-y-1">
                        {latestResult.synthesis.sparks.map((spark, i) => (
                          <li key={i} className="text-sm flex items-start gap-1.5" style={{ color: '#1A1510' }}>
                            <span className="mt-1.5 w-1 h-1 rounded-full shrink-0" style={{ backgroundColor: '#1A1510' }} />
                            {spark}
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-sm" style={{ color: 'rgba(26,21,16,0.45)' }}>
                        Creative sparks from your thoughts will appear here
                      </p>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
