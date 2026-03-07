import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router";
import { motion } from "motion/react";
import { Button } from "../components/ui/button";
import { Link2 } from "lucide-react";

interface Cluster {
  id: string;
  label: string;
  color: string;
  words: string[];
  x: number;
  y: number;
}

interface Connection {
  from: string;
  to: string;
}

export function ClusteringScreen() {
  const navigate = useNavigate();
  const [words, setWords] = useState<string[]>([]);
  const [clusters, setClusters] = useState<Cluster[]>([]);
  const [showClusters, setShowClusters] = useState(false);
  const [connections, setConnections] = useState<Connection[]>([]);
  const [connectMode, setConnectMode] = useState(false);
  const [selectedCluster, setSelectedCluster] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const allWords = [
    "blog",
    "writing",
    "creative",
    "publish",
    "deadlines",
    "stress",
    "project",
    "team",
    "morning",
    "routine",
    "walk",
    "coffee",
    "blocked",
    "frustrated",
    "stuck",
    "side hustle",
    "startup",
    "idea",
    "weekend",
  ];

  const clusterData: Cluster[] = [
    {
      id: "1",
      label: "Blog",
      color: "#C8D5B0", // sage
      words: ["blog", "writing", "creative", "publish"],
      x: 20,
      y: 30,
    },
    {
      id: "2",
      label: "Day job stress",
      color: "#F0D5D0", // blush
      words: ["deadlines", "stress", "project", "team"],
      x: 60,
      y: 25,
    },
    {
      id: "3",
      label: "Morning routine",
      color: "#F5E642", // yellow
      words: ["morning", "routine", "walk", "coffee"],
      x: 35,
      y: 60,
    },
    {
      id: "4",
      label: "Creative block",
      color: "#F5C4A1", // peach
      words: ["blocked", "frustrated", "stuck"],
      x: 70,
      y: 65,
    },
    {
      id: "5",
      label: "Side hustle",
      color: "#C8D5B0", // sage
      words: ["side hustle", "startup", "idea", "weekend"],
      x: 15,
      y: 70,
    },
  ];

  // Animate words appearing
  useEffect(() => {
    allWords.forEach((word, i) => {
      setTimeout(() => {
        setWords((prev) => [...prev, word]);
      }, i * 200);
    });

    // Show clusters after words
    setTimeout(() => {
      setShowClusters(true);
      setClusters(clusterData);
      // Add some initial connections
      setConnections([
        { from: "1", to: "4" }, // Blog to Creative block
        { from: "3", to: "1" }, // Morning routine to Blog
        { from: "5", to: "1" }, // Side hustle to Blog
        { from: "2", to: "4" }, // Day job stress to Creative block
      ]);
    }, allWords.length * 200 + 1000);
  }, []);

  const handleClusterClick = (clusterId: string) => {
    if (!connectMode) return;

    if (!selectedCluster) {
      setSelectedCluster(clusterId);
    } else {
      if (selectedCluster !== clusterId) {
        // Create connection
        const newConnection = { from: selectedCluster, to: clusterId };
        // Check if connection already exists
        const exists = connections.some(
          (c) =>
            (c.from === selectedCluster && c.to === clusterId) ||
            (c.from === clusterId && c.to === selectedCluster)
        );
        if (!exists) {
          setConnections([...connections, newConnection]);
        }
      }
      setSelectedCluster(null);
    }
  };

  const getClusterCenter = (cluster: Cluster) => {
    if (!containerRef.current) return { x: 0, y: 0 };
    const containerRect = containerRef.current.getBoundingClientRect();
    return {
      x: (cluster.x / 100) * containerRect.width + 100,
      y: (cluster.y / 100) * containerRect.height + 60,
    };
  };

  const drawConnection = (from: Cluster, to: Cluster) => {
    const start = getClusterCenter(from);
    const end = getClusterCenter(to);

    const midX = (start.x + end.x) / 2;
    const midY = (start.y + end.y) / 2;
    const offset = 50;

    return `M ${start.x} ${start.y} Q ${midX} ${midY - offset} ${end.x} ${end.y}`;
  };

  return (
    <div className="min-h-screen p-8 relative overflow-hidden" style={{ backgroundColor: '#F7F5F0' }}>
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-12">
          <motion.h2
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="font-['Lora'] text-4xl tracking-[-0.01em]"
            style={{ color: '#0D0D0D' }}
          >
            Your thoughts are organizing...
          </motion.h2>

          {showClusters && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex gap-3"
            >
              <Button
                variant={connectMode ? "default" : "outline"}
                onClick={() => {
                  setConnectMode(!connectMode);
                  setSelectedCluster(null);
                }}
                className="flex items-center gap-2 rounded-full font-['Outfit'] font-semibold text-xs tracking-[0.08em] uppercase h-12 px-6 transition-all hover:-translate-y-0.5"
                style={
                  connectMode
                    ? {
                        backgroundColor: '#F5E642',
                        color: '#0D0D0D',
                        border: 'none',
                      }
                    : {
                        backgroundColor: 'transparent',
                        borderColor: '#0D0D0D',
                        borderWidth: '1.5px',
                        color: '#0D0D0D',
                      }
                }
              >
                <Link2 className="w-4 h-4" strokeWidth={1.5} />
                {connectMode ? "Connecting..." : "Connect Ideas"}
              </Button>
            </motion.div>
          )}
        </div>

        <div ref={containerRef} className="relative h-[70vh]">
          {/* SVG for connections */}
          {showClusters && (
            <svg className="absolute inset-0 w-full h-full pointer-events-none">
              {connections.map((conn, i) => {
                const fromCluster = clusters.find((c) => c.id === conn.from);
                const toCluster = clusters.find((c) => c.id === conn.to);
                if (!fromCluster || !toCluster) return null;

                return (
                  <motion.path
                    key={i}
                    d={drawConnection(fromCluster, toCluster)}
                    stroke="#0D0D0D"
                    strokeWidth="1.5"
                    fill="none"
                    strokeDasharray="5,5"
                    initial={{ pathLength: 0, opacity: 0 }}
                    animate={{ pathLength: 1, opacity: 0.3 }}
                    transition={{ duration: 0.8 }}
                  />
                );
              })}
            </svg>
          )}

          {!showClusters &&
            words.map((word, i) => (
              <motion.div
                key={i}
                initial={{
                  opacity: 0,
                  y: window.innerHeight,
                  x: Math.random() * window.innerWidth,
                }}
                animate={{
                  opacity: 1,
                  y: Math.random() * 500 + 50,
                  x: Math.random() * (window.innerWidth - 200) + 100,
                }}
                transition={{
                  duration: 1.5,
                  ease: "easeOut",
                }}
                className="absolute px-4 py-2 rounded-full text-sm font-['DM_Sans'] font-light"
                style={{
                  backgroundColor: '#FFFFFF',
                  border: '1px solid #E8E5E0',
                  color: '#0D0D0D',
                }}
              >
                {word}
              </motion.div>
            ))}

          {/* Clusters */}
          {showClusters &&
            clusters.map((cluster) => (
              <motion.div
                key={cluster.id}
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.6, type: "spring" }}
                className={`absolute cursor-pointer transition-all hover:-translate-y-1 ${
                  selectedCluster === cluster.id
                    ? "ring-2 ring-offset-4 scale-105"
                    : ""
                }`}
                style={{
                  left: `${cluster.x}%`,
                  top: `${cluster.y}%`,
                  ringColor: '#0D0D0D',
                }}
                onClick={() => handleClusterClick(cluster.id)}
              >
                <div
                  className="rounded-2xl p-6 min-w-[200px]"
                  style={{
                    backgroundColor: cluster.color,
                    border: '1px solid #E8E5E0',
                  }}
                >
                  <h3 className="font-['Lora'] text-lg mb-3" style={{ color: '#0D0D0D' }}>
                    {cluster.label}
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {cluster.words.map((word, i) => (
                      <span
                        key={i}
                        className="text-xs px-2 py-1 rounded-full font-['DM_Sans'] font-light"
                        style={{
                          backgroundColor: 'rgba(255, 255, 255, 0.5)',
                          color: '#0D0D0D',
                        }}
                      >
                        {word}
                      </span>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
        </div>

        {showClusters && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1 }}
            className="flex justify-center mt-12 gap-4"
          >
            {connectMode && (
              <p className="text-sm self-center font-['DM_Sans']" style={{ color: '#6B6B6B' }}>
                {selectedCluster
                  ? "Click another cluster to connect"
                  : "Click a cluster to start connecting"}
              </p>
            )}
            <Button
              onClick={() => navigate("/dashboard")}
              size="lg"
              className="rounded-full font-['Outfit'] font-semibold text-xs tracking-[0.08em] uppercase h-12 px-7 transition-all hover:-translate-y-0.5"
              style={{
                backgroundColor: '#F5E642',
                color: '#0D0D0D',
                border: 'none',
              }}
            >
              Create My Dashboard
            </Button>
          </motion.div>
        )}
      </div>
    </div>
  );
}
