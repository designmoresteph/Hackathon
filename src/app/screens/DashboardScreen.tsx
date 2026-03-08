import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { useNavigate } from "react-router";
import { Calendar, Mic, FileText, Coffee, Sparkles, TrendingUp, Lightbulb, Search } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { getLatestPipelineResult } from '../lib/pipelineStorage';
import type { PipelineResult } from '../lib/types';

const priorityColors: Record<string, { bg: string; text: string }> = {
  high: { bg: '#F5C4A1', text: '#7A3A1A' },
  medium: { bg: '#F5E6A1', text: '#6B5A1A' },
  low: { bg: '#C8D5B0', text: '#2A3D1A' },
};

export function DashboardScreen() {
  const navigate = useNavigate();

  const [latestResult, setLatestResult] = useState<PipelineResult | null>(null);

  useEffect(() => {
    setLatestResult(getLatestPipelineResult());
  }, []);

  return (
    <div className="min-h-screen p-8" style={{ backgroundColor: '#F7F5F0' }}>
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-8"
        >
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="font-['Playfair_Display'] text-5xl tracking-[-0.02em] mb-3" style={{ color: '#0D0D0D' }}>
                Good morning
              </h1>
              <p className="font-['DM_Sans'] font-light" style={{ color: '#6B6B6B' }}>
                Your AI workspace is ready
              </p>
            </div>
            <div className="w-80">
              <Input
                placeholder="Search your thoughts..."
                className="rounded-full font-['DM_Sans'] font-light"
                style={{
                  backgroundColor: '#FFFFFF',
                  borderColor: '#E8E5E0',
                  color: '#0D0D0D',
                }}
              />
            </div>
          </div>

          {/* AI Widgets Section - Top */}
          <div className="space-y-4">
            <h2 className="font-['Lora'] text-2xl tracking-[-0.01em]" style={{ color: '#0D0D0D' }}>
              AI Agents
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Insight Discovery Widget */}
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.1 }}
              >
                <Card className="border rounded-2xl transition-all hover:-translate-y-1" style={{ backgroundColor: '#C8D5B0', borderColor: '#E8E5E0' }}>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 font-['Lora'] text-lg" style={{ color: '#0D0D0D' }}>
                      <Sparkles className="w-5 h-5" strokeWidth={1.5} />
                      Insight Discovery
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {latestResult?.synthesis ? (
                      <div className="space-y-3">
                        <p className="text-sm font-['DM_Sans'] font-light leading-relaxed" style={{ color: '#0D0D0D' }}>
                          {latestResult.synthesis.summary}
                        </p>
                        {latestResult.synthesis.priorities.length > 0 && (
                          <div className="space-y-1">
                            <p className="text-xs font-['DM_Sans'] font-medium" style={{ color: '#0D0D0D' }}>Priorities</p>
                            <ul className="space-y-1">
                              {latestResult.synthesis.priorities.map((p, i) => (
                                <li key={i} className="text-xs font-['DM_Sans'] font-light flex items-start gap-1.5" style={{ color: '#0D0D0D' }}>
                                  <span className="mt-1.5 w-1 h-1 rounded-full shrink-0" style={{ backgroundColor: '#0D0D0D' }} />
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
                                style={{ backgroundColor: 'rgba(255,255,255,0.5)', color: '#0D0D0D' }}
                              >
                                {theme}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    ) : (
                      <p className="text-xs font-['DM_Sans'] font-light" style={{ color: '#0D0D0D' }}>
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
                <Card className="border rounded-2xl transition-all hover:-translate-y-1" style={{ backgroundColor: '#F5C4A1', borderColor: '#E8E5E0' }}>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 font-['Lora'] text-lg" style={{ color: '#0D0D0D' }}>
                      <TrendingUp className="w-5 h-5" strokeWidth={1.5} />
                      Pattern Detection
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {latestResult?.linker ? (
                      <div className="space-y-3">
                        {latestResult.linker.recurringPatterns.length > 0 && (
                          <div className="space-y-1">
                            <p className="text-xs font-['DM_Sans'] font-medium" style={{ color: '#0D0D0D' }}>Recurring Patterns</p>
                            <ul className="space-y-1">
                              {latestResult.linker.recurringPatterns.map((pattern, i) => (
                                <li key={i} className="text-xs font-['DM_Sans'] font-light flex items-start gap-1.5" style={{ color: '#0D0D0D' }}>
                                  <span className="mt-1.5 w-1 h-1 rounded-full shrink-0" style={{ backgroundColor: '#0D0D0D' }} />
                                  {pattern}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                        {latestResult.linker.connections.length > 0 && (
                          <p className="text-xs font-['DM_Sans'] font-light" style={{ color: '#0D0D0D' }}>
                            {latestResult.linker.connections.length} connection{latestResult.linker.connections.length !== 1 ? 's' : ''} found across entries
                          </p>
                        )}
                      </div>
                    ) : (
                      <p className="text-xs font-['DM_Sans'] font-light" style={{ color: '#0D0D0D' }}>
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
                <Card className="border rounded-2xl transition-all hover:-translate-y-1" style={{ backgroundColor: '#F5E642', borderColor: '#E8E5E0' }}>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 font-['Lora'] text-lg" style={{ color: '#0D0D0D' }}>
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
                              <p className="text-xs font-['DM_Sans'] font-light leading-relaxed" style={{ color: '#0D0D0D' }}>
                                {step.action}
                              </p>
                            </div>
                            <div className="flex items-center gap-1.5 shrink-0">
                              <span
                                className="rounded-full px-2 py-0.5 text-[10px] font-['DM_Sans'] font-medium"
                                style={{
                                  backgroundColor: priorityColors[step.priority]?.bg ?? '#E8E5E0',
                                  color: priorityColors[step.priority]?.text ?? '#0D0D0D',
                                }}
                              >
                                {step.priority}
                              </span>
                              {step.timeEstimate && (
                                <span className="text-[10px] font-['DM_Sans'] font-light" style={{ color: '#6B6B6B' }}>
                                  {step.timeEstimate}
                                </span>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-xs font-['DM_Sans'] font-light" style={{ color: '#0D0D0D' }}>
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
            <h2 className="font-['Lora'] text-2xl tracking-[-0.01em]" style={{ color: '#0D0D0D' }}>
              Your Workspace
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* TODAY Widget */}
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.4 }}
              >
                <Card className="border rounded-2xl transition-all hover:-translate-y-1" style={{ backgroundColor: '#F0D5D0', borderColor: '#E8E5E0' }}>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 font-['Lora']" style={{ color: '#0D0D0D' }}>
                      <Coffee className="w-5 h-5" strokeWidth={1.5} />
                      TODAY
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2 font-['DM_Sans'] font-light" style={{ color: '#0D0D0D' }}>
                    <p className="text-sm">Start blog draft</p>
                    <p className="text-sm">Morning walk completed</p>
                    <p className="text-sm">Review side hustle ideas</p>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Blog Widget */}
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.5 }}
              >
                <Card className="border rounded-2xl transition-all hover:-translate-y-1 cursor-pointer" onClick={() => navigate("/search")} style={{ backgroundColor: '#FFFFFF', borderColor: '#E8E5E0' }}>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 font-['Lora']" style={{ color: '#0D0D0D' }}>
                      <FileText className="w-5 h-5" strokeWidth={1.5} style={{ color: '#C8D5B0' }} />
                      Blog
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <p className="text-sm font-['DM_Sans'] font-light" style={{ color: '#6B6B6B' }}>12 notes collected</p>
                    <p className="text-xs font-['DM_Sans'] font-light" style={{ color: '#A8A49E' }}>
                      Last mention: 2 minutes ago
                    </p>
                    <Button variant="outline" size="sm" className="w-full mt-2 rounded-full border-[1.5px] font-['Outfit'] font-semibold text-xs tracking-[0.08em] uppercase" style={{ borderColor: '#0D0D0D', color: '#0D0D0D' }}>
                      Explore
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Quick Capture Widget */}
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.6 }}
              >
                <Card className="border rounded-2xl transition-all hover:-translate-y-1" style={{ backgroundColor: '#FFFFFF', borderColor: '#E8E5E0' }}>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 font-['Lora']" style={{ color: '#0D0D0D' }}>
                      <Mic className="w-5 h-5" strokeWidth={1.5} />
                      Quick Capture
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Button
                      className="w-full rounded-full font-['Outfit'] font-semibold text-xs tracking-[0.08em] uppercase"
                      onClick={() => navigate("/voice")}
                      style={{ backgroundColor: '#0D0D0D', color: '#F7F5F0', border: 'none' }}
                    >
                      Start Recording
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Calendar Widget */}
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.7 }}
              >
                <Card className="border rounded-2xl transition-all hover:-translate-y-1" style={{ backgroundColor: '#FFFFFF', borderColor: '#E8E5E0' }}>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 font-['Lora']" style={{ color: '#0D0D0D' }}>
                      <Calendar className="w-5 h-5" strokeWidth={1.5} style={{ color: '#C8D5B0' }} />
                      Today's Schedule
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3 font-['DM_Sans'] font-light">
                    <div className="text-sm">
                      <p className="font-medium" style={{ color: '#0D0D0D' }}>9:00 AM</p>
                      <p style={{ color: '#6B6B6B' }}>Team standup</p>
                    </div>
                    <div className="text-sm">
                      <p className="font-medium" style={{ color: '#0D0D0D' }}>2:00 PM</p>
                      <p style={{ color: '#6B6B6B' }}>Project review</p>
                    </div>
                    <div className="text-sm mt-3" style={{ color: '#C8D5B0' }}>
                      <p>Free slot at 4:00 PM for writing</p>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Creative Block Widget */}
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.8 }}
              >
                <Card className="border rounded-2xl transition-all hover:-translate-y-1" style={{ backgroundColor: '#FFFFFF', borderColor: '#E8E5E0' }}>
                  <CardHeader>
                    <CardTitle className="font-['Lora']" style={{ color: '#0D0D0D' }}>Creative Block</CardTitle>
                  </CardHeader>
                  <CardContent className="font-['DM_Sans'] font-light">
                    <p className="text-sm mb-3" style={{ color: '#0D0D0D' }}>
                      You've mentioned feeling stuck 3 times this week
                    </p>
                    <Button size="sm" className="rounded-full font-['Outfit'] font-semibold text-xs tracking-[0.08em] uppercase" style={{ backgroundColor: '#0D0D0D', color: '#F7F5F0', border: 'none' }}>
                      See Patterns
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Side Hustle Widget */}
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.9 }}
              >
                <Card className="border rounded-2xl transition-all hover:-translate-y-1" style={{ backgroundColor: '#FFFFFF', borderColor: '#E8E5E0' }}>
                  <CardHeader>
                    <CardTitle className="font-['Lora']" style={{ color: '#0D0D0D' }}>Side Hustle Ideas</CardTitle>
                  </CardHeader>
                  <CardContent className="font-['DM_Sans'] font-light">
                    <p className="text-sm mb-3" style={{ color: '#6B6B6B' }}>
                      8 ideas captured this month
                    </p>
                    <Button variant="outline" size="sm" className="w-full rounded-full border-[1.5px] font-['Outfit'] font-semibold text-xs tracking-[0.08em] uppercase" style={{ borderColor: '#0D0D0D', color: '#0D0D0D' }}>
                      Review Ideas
                    </Button>
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
