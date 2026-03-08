import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useNavigate } from "react-router";
import { Calendar, Mic, FileText, Coffee, Sparkles, TrendingUp, Lightbulb, Search, Loader2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";

interface WidgetState {
  isProcessing: boolean;
  input: string;
  response: string;
  showResponse: boolean;
}

export function DashboardScreen() {
  const navigate = useNavigate();

  // State for each AI widget
  const [insightWidget, setInsightWidget] = useState<WidgetState>({
    isProcessing: false,
    input: "",
    response: "",
    showResponse: false,
  });

  const [patternWidget, setPatternWidget] = useState<WidgetState>({
    isProcessing: false,
    input: "",
    response: "",
    showResponse: false,
  });

  const [actionWidget, setActionWidget] = useState<WidgetState>({
    isProcessing: false,
    input: "",
    response: "",
    showResponse: false,
  });

  const handleSearch = (query: string) => {
    if (query.toLowerCase().includes("blog")) {
      navigate("/search");
    }
  };

  const handleInsightQuery = () => {
    setInsightWidget({ ...insightWidget, isProcessing: true, showResponse: false });
    
    // Simulate AI processing
    setTimeout(() => {
      setInsightWidget({
        ...insightWidget,
        isProcessing: false,
        showResponse: true,
        response: "Based on your recent thoughts, there's a strong connection between your morning routine and creative output. You've mentioned 'morning walks' and 'blog writing' together 8 times this week. Consider dedicating mornings exclusively to creative work.",
        input: "",
      });
    }, 2500);
  };

  const handlePatternQuery = () => {
    setPatternWidget({ ...patternWidget, isProcessing: true, showResponse: false });
    
    // Simulate AI processing
    setTimeout(() => {
      setPatternWidget({
        ...patternWidget,
        isProcessing: false,
        showResponse: true,
        response: "I've detected a recurring pattern: You feel most creative on weekends but struggle with deadlines during weekdays. Your 'side hustle' ideas spike on Saturday mornings (5 mentions). Your 'creative block' correlates with high work stress (73% correlation).",
        input: "",
      });
    }, 3000);
  };

  const handleActionQuery = () => {
    setActionWidget({ ...actionWidget, isProcessing: true, showResponse: false });
    
    // Simulate AI processing
    setTimeout(() => {
      setActionWidget({
        ...actionWidget,
        isProcessing: false,
        showResponse: true,
        response: "Here are your AI-generated action items: 1) Block 7-9 AM daily for blog writing (based on your peak energy patterns), 2) Schedule 30-min weekend review for side hustle ideas, 3) Set up a stress-tracking ritual during your afternoon walks.",
        input: "",
      });
    }, 2800);
  };

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
                Good morning ✨
              </h1>
              <p className="font-['DM_Sans'] font-light" style={{ color: '#6B6B6B' }}>
                Your AI workspace is ready
              </p>
            </div>
            <div className="w-80">
              <Input
                placeholder="Search your thoughts... (try 'blog')"
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleSearch(e.currentTarget.value);
                  }
                }}
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
                    <p className="text-xs font-['DM_Sans'] font-light" style={{ color: '#0D0D0D' }}>
                      Ask me to find hidden connections in your thoughts
                    </p>
                    
                    <div className="flex gap-2">
                      <Input
                        placeholder="e.g., What patterns do you see?"
                        value={insightWidget.input}
                        onChange={(e) => setInsightWidget({ ...insightWidget, input: e.target.value })}
                        onKeyDown={(e) => {
                          if (e.key === "Enter" && insightWidget.input) {
                            handleInsightQuery();
                          }
                        }}
                        disabled={insightWidget.isProcessing}
                        className="rounded-full font-['DM_Sans'] font-light text-xs"
                        style={{
                          backgroundColor: '#FFFFFF',
                          borderColor: '#E8E5E0',
                          color: '#0D0D0D',
                        }}
                      />
                      <Button
                        size="sm"
                        onClick={handleInsightQuery}
                        disabled={insightWidget.isProcessing || !insightWidget.input}
                        className="rounded-full px-3 shrink-0"
                        style={{ backgroundColor: '#FFFFFF', color: '#0D0D0D', border: 'none' }}
                      >
                        {insightWidget.isProcessing ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <Search className="w-4 h-4" />
                        )}
                      </Button>
                    </div>

                    <AnimatePresence>
                      {insightWidget.isProcessing && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          className="space-y-2"
                        >
                          <div className="flex items-center gap-2 text-xs font-['DM_Sans']" style={{ color: '#0D0D0D' }}>
                            <Loader2 className="w-3 h-3 animate-spin" />
                            Analyzing your thought patterns...
                          </div>
                          <div className="flex gap-1">
                            {[0, 1, 2, 3, 4].map((i) => (
                              <motion.div
                                key={i}
                                className="w-2 h-2 rounded-full"
                                style={{ backgroundColor: '#FFFFFF' }}
                                animate={{
                                  scale: [1, 1.3, 1],
                                  opacity: [0.3, 1, 0.3],
                                }}
                                transition={{
                                  duration: 1,
                                  repeat: Infinity,
                                  delay: i * 0.1,
                                }}
                              />
                            ))}
                          </div>
                        </motion.div>
                      )}

                      {insightWidget.showResponse && (
                        <motion.div
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          className="p-3 rounded-xl text-xs font-['DM_Sans'] font-light leading-relaxed"
                          style={{ backgroundColor: '#FFFFFF', color: '#0D0D0D' }}
                        >
                          {insightWidget.response}
                        </motion.div>
                      )}
                    </AnimatePresence>
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
                    <p className="text-xs font-['DM_Sans'] font-light" style={{ color: '#0D0D0D' }}>
                      Discover recurring themes and behaviors
                    </p>
                    
                    <div className="flex gap-2">
                      <Input
                        placeholder="e.g., When am I most creative?"
                        value={patternWidget.input}
                        onChange={(e) => setPatternWidget({ ...patternWidget, input: e.target.value })}
                        onKeyDown={(e) => {
                          if (e.key === "Enter" && patternWidget.input) {
                            handlePatternQuery();
                          }
                        }}
                        disabled={patternWidget.isProcessing}
                        className="rounded-full font-['DM_Sans'] font-light text-xs"
                        style={{
                          backgroundColor: '#FFFFFF',
                          borderColor: '#E8E5E0',
                          color: '#0D0D0D',
                        }}
                      />
                      <Button
                        size="sm"
                        onClick={handlePatternQuery}
                        disabled={patternWidget.isProcessing || !patternWidget.input}
                        className="rounded-full px-3 shrink-0"
                        style={{ backgroundColor: '#FFFFFF', color: '#0D0D0D', border: 'none' }}
                      >
                        {patternWidget.isProcessing ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <Search className="w-4 h-4" />
                        )}
                      </Button>
                    </div>

                    <AnimatePresence>
                      {patternWidget.isProcessing && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          className="space-y-2"
                        >
                          <div className="flex items-center gap-2 text-xs font-['DM_Sans']" style={{ color: '#0D0D0D' }}>
                            <Loader2 className="w-3 h-3 animate-spin" />
                            Finding patterns across 247 entries...
                          </div>
                          <div className="flex gap-1">
                            {[0, 1, 2, 3, 4].map((i) => (
                              <motion.div
                                key={i}
                                className="w-2 h-2 rounded-full"
                                style={{ backgroundColor: '#FFFFFF' }}
                                animate={{
                                  scale: [1, 1.3, 1],
                                  opacity: [0.3, 1, 0.3],
                                }}
                                transition={{
                                  duration: 1,
                                  repeat: Infinity,
                                  delay: i * 0.1,
                                }}
                              />
                            ))}
                          </div>
                        </motion.div>
                      )}

                      {patternWidget.showResponse && (
                        <motion.div
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          className="p-3 rounded-xl text-xs font-['DM_Sans'] font-light leading-relaxed"
                          style={{ backgroundColor: '#FFFFFF', color: '#0D0D0D' }}
                        >
                          {patternWidget.response}
                        </motion.div>
                      )}
                    </AnimatePresence>
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
                    <p className="text-xs font-['DM_Sans'] font-light" style={{ color: '#0D0D0D' }}>
                      Generate personalized action items
                    </p>
                    
                    <div className="flex gap-2">
                      <Input
                        placeholder="e.g., What should I do next?"
                        value={actionWidget.input}
                        onChange={(e) => setActionWidget({ ...actionWidget, input: e.target.value })}
                        onKeyDown={(e) => {
                          if (e.key === "Enter" && actionWidget.input) {
                            handleActionQuery();
                          }
                        }}
                        disabled={actionWidget.isProcessing}
                        className="rounded-full font-['DM_Sans'] font-light text-xs"
                        style={{
                          backgroundColor: '#FFFFFF',
                          borderColor: '#E8E5E0',
                          color: '#0D0D0D',
                        }}
                      />
                      <Button
                        size="sm"
                        onClick={handleActionQuery}
                        disabled={actionWidget.isProcessing || !actionWidget.input}
                        className="rounded-full px-3 shrink-0"
                        style={{ backgroundColor: '#FFFFFF', color: '#0D0D0D', border: 'none' }}
                      >
                        {actionWidget.isProcessing ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <Search className="w-4 h-4" />
                        )}
                      </Button>
                    </div>

                    <AnimatePresence>
                      {actionWidget.isProcessing && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          className="space-y-2"
                        >
                          <div className="flex items-center gap-2 text-xs font-['DM_Sans']" style={{ color: '#0D0D0D' }}>
                            <Loader2 className="w-3 h-3 animate-spin" />
                            Generating personalized actions...
                          </div>
                          <div className="flex gap-1">
                            {[0, 1, 2, 3, 4].map((i) => (
                              <motion.div
                                key={i}
                                className="w-2 h-2 rounded-full"
                                style={{ backgroundColor: '#FFFFFF' }}
                                animate={{
                                  scale: [1, 1.3, 1],
                                  opacity: [0.3, 1, 0.3],
                                }}
                                transition={{
                                  duration: 1,
                                  repeat: Infinity,
                                  delay: i * 0.1,
                                }}
                              />
                            ))}
                          </div>
                        </motion.div>
                      )}

                      {actionWidget.showResponse && (
                        <motion.div
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          className="p-3 rounded-xl text-xs font-['DM_Sans'] font-light leading-relaxed"
                          style={{ backgroundColor: '#FFFFFF', color: '#0D0D0D' }}
                        >
                          {actionWidget.response}
                        </motion.div>
                      )}
                    </AnimatePresence>
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
                    <p className="text-sm">• Start blog draft</p>
                    <p className="text-sm">• Morning walk completed ✓</p>
                    <p className="text-sm">• Review side hustle ideas</p>
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
                      Explore →
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
                      <p>✓ Free slot at 4:00 PM for writing</p>
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
