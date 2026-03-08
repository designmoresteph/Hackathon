import { useState, useEffect, useCallback } from "react";
import { useNavigate, useSearchParams } from "react-router";
import { motion, AnimatePresence } from "motion/react";
import { Button } from "../components/ui/button";
import { Card } from "../components/ui/card";
import {
  Sparkles,
  Link2,
  Search,
  Lightbulb,
  Calendar,
  Check,
  X,
  Loader2,
} from "lucide-react";
import { getEntry } from "../lib/storage";
import { runPipeline, type PipelineAgents } from "../lib/pipeline";
import { runSynthesisAgent } from "../lib/agents/synthesisAgent";
import { runLinkerAgent } from "../lib/agents/linkerAgent";
import { runResearchAgent } from "../lib/agents/researchAgent";
import { runActionAgent } from "../lib/agents/actionAgent";
import { runCalendarAgent } from "../lib/agents/calendarAgent";
import type { AgentName, AgentStatus, PipelineState } from "../lib/types";
import type { LucideIcon } from "lucide-react";

interface AgentConfig {
  name: AgentName;
  label: string;
  description: string;
  icon: LucideIcon;
  color: string;
}

const AGENTS: AgentConfig[] = [
  {
    name: "synthesis",
    label: "Synthesis",
    description: "Extracting priorities, themes, and key insights",
    icon: Sparkles,
    color: "#B0C098",
  },
  {
    name: "linker",
    label: "Pattern Linker",
    description: "Finding connections to your past entries",
    icon: Link2,
    color: "#D8E0B8",
  },
  {
    name: "research",
    label: "Research",
    description: "Discovering relevant resources and references",
    icon: Search,
    color: "#C4807A",
  },
  {
    name: "action",
    label: "Action Planner",
    description: "Creating prioritized next steps",
    icon: Lightbulb,
    color: "#C4957A",
  },
  {
    name: "calendar",
    label: "Calendar",
    description: "Proposing time blocks for your actions",
    icon: Calendar,
    color: "#B0C098",
  },
];

function StatusIndicator({ status }: { status: AgentStatus }) {
  switch (status) {
    case "idle":
      return (
        <div
          className="w-3 h-3 rounded-full"
          style={{ backgroundColor: "rgba(26,21,16,0.15)" }}
        />
      );
    case "running":
      return (
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        >
          <Loader2 className="w-5 h-5" style={{ color: "#1A1510" }} />
        </motion.div>
      );
    case "done":
      return (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
        >
          <Check className="w-5 h-5" style={{ color: "#4A9B4A" }} />
        </motion.div>
      );
    case "error":
      return (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
        >
          <X className="w-5 h-5" style={{ color: "#D14343" }} />
        </motion.div>
      );
  }
}

function AgentCard({
  agent,
  status,
  isCurrent,
}: {
  agent: AgentConfig;
  status: AgentStatus;
  isCurrent: boolean;
}) {
  const Icon = agent.icon;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <Card
        className="p-5 transition-all duration-300"
        style={{
          backgroundColor: isCurrent
            ? `${agent.color}20`
            : "rgba(255,255,255,0.55)",
          backdropFilter: 'blur(16px) saturate(1.2)',
          borderColor: isCurrent ? agent.color : "rgba(255,255,255,0.6)",
          borderWidth: isCurrent ? "2px" : "1px",
          transform: isCurrent ? "scale(1.02)" : "scale(1)",
        }}
      >
        <div className="flex items-center gap-4">
          <div
            className="w-10 h-10 rounded-full flex items-center justify-center"
            style={{
              backgroundColor: `${agent.color}40`,
            }}
          >
            <Icon
              className="w-5 h-5"
              strokeWidth={1.5}
              style={{ color: "#1A1510" }}
            />
          </div>

          <div className="flex-1 min-w-0">
            <h3
              className="font-['Playfair_Display'] italic text-lg"
              style={{
                color: status === "idle" ? "rgba(26,21,16,0.35)" : "#1A1510",
              }}
            >
              {agent.label}
            </h3>
            <p
              className="font-['DM_Sans'] text-sm"
              style={{
                color: status === "idle" ? "rgba(26,21,16,0.25)" : "rgba(26,21,16,0.45)",
              }}
            >
              {agent.description}
            </p>
          </div>

          <div className="flex-shrink-0">
            <AnimatePresence mode="wait">
              <StatusIndicator status={status} />
            </AnimatePresence>
          </div>
        </div>

        {isCurrent && (
          <motion.div
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 8, ease: "linear" }}
            className="mt-3 h-0.5 rounded-full origin-left"
            style={{ backgroundColor: agent.color }}
          />
        )}
      </Card>
    </motion.div>
  );
}

export function PipelineScreen() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const entryId = searchParams.get("entryId");

  const [pipelineState, setPipelineState] = useState<PipelineState>({
    agents: {
      synthesis: "idle",
      linker: "idle",
      research: "idle",
      action: "idle",
      calendar: "idle",
    },
    currentAgent: null,
    isComplete: false,
    error: null,
  });
  const [hasStarted, setHasStarted] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);

  const handleStatusChange = useCallback((state: PipelineState) => {
    setPipelineState({ ...state, agents: { ...state.agents } });
  }, []);

  useEffect(() => {
    if (hasStarted) return;

    const entry = entryId ? getEntry(entryId) : null;
    if (!entry) {
      setLoadError(
        entryId
          ? `Entry "${entryId}" not found. It may have been cleared from storage.`
          : "No entry ID provided. Please start from the voice recording screen."
      );
      return;
    }

    setHasStarted(true);

    const agents: PipelineAgents = {
      synthesis: (e) => runSynthesisAgent(e),
      linker: (e, past, synth) => runLinkerAgent(e, past, synth),
      research: (synth) => runResearchAgent(synth),
      action: (synth, research) => runActionAgent(synth, research),
      calendar: (action) => runCalendarAgent(action),
    };

    runPipeline(entry, agents, handleStatusChange).catch((err) => {
      console.error("Pipeline failed:", err);
    });
  }, [entryId, hasStarted, handleStatusChange]);

  const handleRetry = () => {
    setHasStarted(false);
    setPipelineState({
      agents: {
        synthesis: "idle",
        linker: "idle",
        research: "idle",
        action: "idle",
        calendar: "idle",
      },
      currentAgent: null,
      isComplete: false,
      error: null,
    });
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center p-8"
      style={{ backgroundColor: "#EEF5F8" }}
    >
      <div className="w-full max-w-lg">
        <motion.h2
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="font-['Playfair_Display'] italic text-3xl text-center mb-2"
          style={{ color: "#1A1510" }}
        >
          Processing your thoughts...
        </motion.h2>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="font-['DM_Sans'] text-sm text-center mb-10"
          style={{ color: "rgba(26,21,16,0.45)" }}
        >
          Five AI agents are analyzing your voice dump
        </motion.p>

        {loadError ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center"
          >
            <p
              className="font-['DM_Sans'] text-sm mb-6"
              style={{ color: "#D14343" }}
            >
              {loadError}
            </p>
            <Button
              onClick={() => navigate("/")}
              className="rounded-full font-['DM_Sans'] text-[13px] font-medium tracking-[0.04em] h-12 px-7"
              style={{
                backgroundColor: "#1A1510",
                color: "#F0E8D8",
                border: "none",
              }}
            >
              Start Over
            </Button>
          </motion.div>
        ) : (
          <>
            <div className="space-y-3">
              {AGENTS.map((agent, i) => (
                <motion.div
                  key={agent.name}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                >
                  <AgentCard
                    agent={agent}
                    status={pipelineState.agents[agent.name]}
                    isCurrent={pipelineState.currentAgent === agent.name}
                  />
                </motion.div>
              ))}
            </div>

            {pipelineState.error && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-6 text-center"
              >
                <p
                  className="font-['DM_Sans'] text-sm mb-4"
                  style={{ color: "#D14343" }}
                >
                  {pipelineState.error}
                </p>
                <Button
                  onClick={handleRetry}
                  variant="outline"
                  className="rounded-full font-['DM_Sans'] text-[13px] font-medium tracking-[0.04em] h-10 px-6"
                  style={{
                    background: "rgba(26,21,16,0.08)",
                    border: "1.5px solid rgba(26,21,16,0.20)",
                    color: "#1A1510",
                  }}
                >
                  Retry
                </Button>
              </motion.div>
            )}

            {pipelineState.isComplete && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="mt-10 text-center"
              >
                <p
                  className="font-['DM_Sans'] text-sm mb-4"
                  style={{ color: "rgba(26,21,16,0.45)" }}
                >
                  All agents have finished processing
                </p>
                <Button
                  onClick={() => navigate("/dashboard")}
                  size="lg"
                  className="rounded-full font-['DM_Sans'] text-[13px] font-medium tracking-[0.04em] h-12 px-7 transition-all hover:-translate-y-0.5"
                  style={{
                    backgroundColor: "#1A1510",
                    color: "#F0E8D8",
                    border: "none",
                  }}
                >
                  View Dashboard
                </Button>
              </motion.div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
