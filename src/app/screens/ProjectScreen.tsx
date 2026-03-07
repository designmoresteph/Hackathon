import { motion } from "motion/react";
import { CheckSquare, Calendar, Search, Clock } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Textarea } from "../components/ui/textarea";
import { Button } from "../components/ui/button";

export function ProjectScreen() {
  return (
    <div className="min-h-screen" style={{ backgroundColor: '#F7F5F0' }}>
      <div className="grid grid-cols-12 h-screen">
        {/* Left Panel - Outline */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="col-span-3 p-8 overflow-y-auto border-r"
          style={{ backgroundColor: '#FFFFFF', borderColor: '#E8E5E0' }}
        >
          <h2 className="font-['Lora'] text-xl tracking-[-0.01em] mb-6" style={{ color: '#0D0D0D' }}>Outline</h2>
          <div className="space-y-5 text-sm font-['DM_Sans'] font-light">
            <div className="space-y-2">
              <p className="font-medium" style={{ color: '#0D0D0D' }}>Introduction</p>
              <ul className="pl-4 space-y-1" style={{ color: '#6B6B6B' }}>
                <li>• Hook: Early morning walk story</li>
                <li>• Why mornings matter</li>
              </ul>
            </div>
            <div className="space-y-2">
              <p className="font-medium" style={{ color: '#0D0D0D' }}>Main Content</p>
              <ul className="pl-4 space-y-1" style={{ color: '#6B6B6B' }}>
                <li>• Movement & creativity connection</li>
                <li>• Personal examples</li>
                <li>• Research & insights</li>
              </ul>
            </div>
            <div className="space-y-2">
              <p className="font-medium" style={{ color: '#0D0D0D' }}>Conclusion</p>
              <ul className="pl-4 space-y-1" style={{ color: '#6B6B6B' }}>
                <li>• Practical takeaways</li>
                <li>• Invitation to try</li>
              </ul>
            </div>
          </div>
        </motion.div>

        {/* Center Panel - Writing Space */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="col-span-6 p-12 overflow-y-auto"
        >
          <div className="max-w-3xl mx-auto space-y-8">
            <div>
              <h1 className="font-['Playfair_Display'] text-5xl tracking-[-0.02em] mb-3" style={{ color: '#0D0D0D' }}>The Morning Mind</h1>
              <p className="text-sm font-['Outfit'] tracking-[0.08em] uppercase" style={{ color: '#A8A49E' }}>
                Draft started: Saturday, March 7, 2026
              </p>
            </div>

            <div className="rounded-2xl p-5 border-l-4" style={{ backgroundColor: '#F2EFE9', borderLeftColor: '#C8D5B0' }}>
              <p className="text-sm font-['Cormorant_Garamond'] italic font-light" style={{ color: '#0D0D0D' }}>
                Here's how you started last time: "The best ideas come during morning walks..."
              </p>
            </div>

            <Textarea
              placeholder="Start writing..."
              className="min-h-[500px] text-base leading-[1.7] resize-none rounded-2xl border font-['DM_Sans'] font-light"
              style={{
                backgroundColor: '#FFFFFF',
                borderColor: '#E8E5E0',
                color: '#0D0D0D',
              }}
              defaultValue="The best ideas come during morning walks. There's something about the combination of movement, fresh air, and the quiet stillness of early morning that unlocks creativity in a way nothing else can.

I've noticed this pattern in my own life for years, but I never really understood why until recently..."
            />

            <div className="flex gap-3">
              <Button variant="outline" className="rounded-full border-[1.5px] font-['Outfit'] font-semibold text-xs tracking-[0.08em] uppercase" style={{ borderColor: '#0D0D0D', color: '#0D0D0D' }}>
                Save Draft
              </Button>
              <Button className="rounded-full font-['Outfit'] font-semibold text-xs tracking-[0.08em] uppercase" style={{ backgroundColor: '#F5E642', color: '#0D0D0D', border: 'none' }}>
                Continue Writing
              </Button>
            </div>
          </div>
        </motion.div>

        {/* Right Panel - Widgets */}
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.6 }}
          className="col-span-3 p-8 overflow-y-auto space-y-6 border-l"
          style={{ backgroundColor: '#F2EFE9', borderColor: '#E8E5E0' }}
        >
          {/* To-do Widget */}
          <Card className="border rounded-2xl" style={{ backgroundColor: '#FFFFFF', borderColor: '#E8E5E0' }}>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm flex items-center gap-2 font-['Lora']" style={{ color: '#0D0D0D' }}>
                <CheckSquare className="w-4 h-4" strokeWidth={1.5} style={{ color: '#C8D5B0' }} />
                Next Steps
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm font-['DM_Sans'] font-light">
              <div className="flex items-start gap-2">
                <input type="checkbox" className="mt-1" />
                <span style={{ color: '#0D0D0D' }}>Research walking & creativity studies</span>
              </div>
              <div className="flex items-start gap-2">
                <input type="checkbox" className="mt-1" />
                <span style={{ color: '#0D0D0D' }}>Add personal anecdote</span>
              </div>
              <div className="flex items-start gap-2">
                <input type="checkbox" className="mt-1" />
                <span style={{ color: '#0D0D0D' }}>Write conclusion</span>
              </div>
            </CardContent>
          </Card>

          {/* Timeline Widget */}
          <Card className="border rounded-2xl" style={{ backgroundColor: '#FFFFFF', borderColor: '#E8E5E0' }}>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm flex items-center gap-2 font-['Lora']" style={{ color: '#0D0D0D' }}>
                <Clock className="w-4 h-4" strokeWidth={1.5} style={{ color: '#F5C4A1' }} />
                Timeline
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm font-['DM_Sans'] font-light">
              <div className="flex justify-between" style={{ color: '#6B6B6B' }}>
                <span>First draft</span>
                <span className="font-medium" style={{ color: '#0D0D0D' }}>Mar 10</span>
              </div>
              <div className="flex justify-between" style={{ color: '#6B6B6B' }}>
                <span>Editing</span>
                <span className="font-medium" style={{ color: '#0D0D0D' }}>Mar 12</span>
              </div>
              <div className="flex justify-between" style={{ color: '#6B6B6B' }}>
                <span>Publish</span>
                <span className="font-medium" style={{ color: '#0D0D0D' }}>Mar 15</span>
              </div>
            </CardContent>
          </Card>

          {/* Research Widget */}
          <Card className="border rounded-2xl" style={{ backgroundColor: '#FFFFFF', borderColor: '#E8E5E0' }}>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm flex items-center gap-2 font-['Lora']" style={{ color: '#0D0D0D' }}>
                <Search className="w-4 h-4" strokeWidth={1.5} style={{ color: '#C8D5B0' }} />
                Research
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-xs font-['DM_Sans'] font-light">
              <div className="p-3 rounded-xl" style={{ backgroundColor: '#F2EFE9' }}>
                <p className="font-medium" style={{ color: '#0D0D0D' }}>
                  Walking increases creative thinking by 60%
                </p>
                <p className="mt-1" style={{ color: '#6B6B6B' }}>Stanford Study, 2014</p>
              </div>
              <div className="p-3 rounded-xl" style={{ backgroundColor: '#F2EFE9' }}>
                <p className="font-medium" style={{ color: '#0D0D0D' }}>
                  Why great ideas come during walks
                </p>
                <p className="mt-1" style={{ color: '#6B6B6B' }}>Psychology Today</p>
              </div>
              <div className="p-3 rounded-xl" style={{ backgroundColor: '#F2EFE9' }}>
                <p className="font-medium" style={{ color: '#0D0D0D' }}>
                  The science of morning routines
                </p>
                <p className="mt-1" style={{ color: '#6B6B6B' }}>Harvard Business Review</p>
              </div>
            </CardContent>
          </Card>

          {/* Calendar Widget */}
          <Card className="border rounded-2xl" style={{ backgroundColor: '#FFFFFF', borderColor: '#E8E5E0' }}>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm flex items-center gap-2 font-['Lora']" style={{ color: '#0D0D0D' }}>
                <Calendar className="w-4 h-4" strokeWidth={1.5} style={{ color: '#F5E642' }} />
                Schedule
              </CardTitle>
            </CardHeader>
            <CardContent className="text-sm font-['DM_Sans'] font-light">
              <div className="rounded-xl border p-4" style={{ backgroundColor: '#F2EFE9', borderColor: '#C8D5B0' }}>
                <p className="mb-3" style={{ color: '#0D0D0D' }}>
                  ✓ Tuesday 9am looks free
                </p>
                <Button size="sm" variant="outline" className="w-full rounded-full border-[1.5px] font-['Outfit'] font-semibold text-xs tracking-[0.08em] uppercase" style={{ borderColor: '#0D0D0D', color: '#0D0D0D' }}>
                  Schedule Writing Session
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
