import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router";
import { motion } from "motion/react";
import { Button } from "../components/ui/button";
import { Link2 } from "lucide-react";
import { DndProvider, useDrag } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import cloudImage from 'figma:asset/3c7af6a14225d1ee2a77d186872f69245c52483a.png';

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

const ITEM_TYPE = "CLUSTER";

// Cloud component for floating words
function WordCloud({ word, delay }: { word: string; delay: number }) {
  return (
    <motion.div
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
        delay,
      }}
      className="absolute"
    >
      <div className="relative inline-block">
        {/* Cloud image */}
        <img 
          src={cloudImage} 
          alt="" 
          className="w-32 h-20 object-contain opacity-90"
          style={{ filter: 'brightness(1.1) contrast(0.9)' }}
        />
        {/* Word centered on cloud */}
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-sm font-['DM_Sans'] font-light" style={{ color: '#0D0D0D' }}>
            {word}
          </span>
        </div>
      </div>
    </motion.div>
  );
}

// Large draggable cloud component for clusters
function ClusterCloud({ 
  cluster, 
  onClick, 
  isSelected,
  onDragEnd,
}: { 
  cluster: Cluster; 
  onClick: () => void;
  isSelected: boolean;
  onDragEnd: (id: string, x: number, y: number) => void;
}) {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: ITEM_TYPE,
    item: { id: cluster.id, x: cluster.x, y: cluster.y },
    end: (item, monitor) => {
      const offset = monitor.getSourceClientOffset();
      if (offset && containerRef.current) {
        const containerRect = containerRef.current.getBoundingClientRect();
        const newX = ((offset.x - containerRect.left) / containerRect.width) * 100;
        const newY = ((offset.y - containerRect.top) / containerRect.height) * 100;
        onDragEnd(cluster.id, newX, newY);
      }
    },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  }), [cluster.id, cluster.x, cluster.y]);

  const containerRef = useRef<HTMLDivElement>(null);

  return (
    <motion.div
      ref={drag}
      initial={{ scale: 0, opacity: 0 }}
      animate={{ 
        scale: 1, 
        opacity: isDragging ? 0.5 : 1,
      }}
      transition={{ duration: 0.6, type: "spring" }}
      className={`absolute cursor-move transition-all hover:-translate-y-1 ${
        isSelected ? "scale-105" : ""
      }`}
      style={{
        left: `${cluster.x}%`,
        top: `${cluster.y}%`,
      }}
      onClick={onClick}
    >
      <div className="relative" ref={containerRef}>
        {/* Large cloud image with color tint */}
        <div 
          className="relative w-80 h-52"
          style={{
            filter: isSelected ? 'brightness(1.1) drop-shadow(0 4px 12px rgba(0,0,0,0.15))' : 'brightness(1.05)',
          }}
        >
          <img 
            src={cloudImage} 
            alt="" 
            className="w-full h-full object-contain"
          />
          {/* Color overlay */}
          <div 
            className="absolute inset-0 mix-blend-multiply opacity-40"
            style={{ 
              backgroundColor: cluster.color,
              WebkitMaskImage: `url(${cloudImage})`,
              WebkitMaskSize: 'contain',
              WebkitMaskRepeat: 'no-repeat',
              WebkitMaskPosition: 'center',
              maskImage: `url(${cloudImage})`,
              maskSize: 'contain',
              maskRepeat: 'no-repeat',
              maskPosition: 'center',
            }}
          />
          {isSelected && (
            <div 
              className="absolute inset-0"
              style={{
                border: '3px dashed #0D0D0D',
                borderRadius: '50%',
                opacity: 0.6,
              }}
            />
          )}
        </div>
        
        {/* Cluster content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center p-8 pt-12 pointer-events-none">
          <h3 className="font-['Lora'] text-xl mb-4 text-center" style={{ color: '#0D0D0D' }}>
            {cluster.label}
          </h3>
          <div className="flex flex-wrap gap-2 justify-center max-w-[200px]">
            {cluster.words.map((word, i) => (
              <span
                key={i}
                className="text-xs px-3 py-1 rounded-full font-['DM_Sans'] font-light"
                style={{
                  backgroundColor: 'rgba(255, 255, 255, 0.7)',
                  color: '#0D0D0D',
                  border: '1px solid rgba(232, 229, 224, 0.5)',
                }}
              >
                {word}
              </span>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function ClusteringScreenContent() {
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

  const initialClusterData: Cluster[] = [
    {
      id: "1",
      label: "Blog",
      color: "#C8D5B0", // sage
      words: ["blog", "writing", "creative", "publish"],
      x: 15,
      y: 25,
    },
    {
      id: "2",
      label: "Day job stress",
      color: "#F0D5D0", // blush
      words: ["deadlines", "stress", "project", "team"],
      x: 55,
      y: 20,
    },
    {
      id: "3",
      label: "Morning routine",
      color: "#F5E642", // yellow
      words: ["morning", "routine", "walk", "coffee"],
      x: 30,
      y: 55,
    },
    {
      id: "4",
      label: "Creative block",
      color: "#F5C4A1", // peach
      words: ["blocked", "frustrated", "stuck"],
      x: 65,
      y: 60,
    },
    {
      id: "5",
      label: "Side hustle",
      color: "#C8D5B0", // sage
      words: ["side hustle", "startup", "idea", "weekend"],
      x: 10,
      y: 65,
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
      setClusters(initialClusterData);
      // Add some initial connections
      setConnections([
        { from: "1", to: "4" }, // Blog to Creative block
        { from: "3", to: "1" }, // Morning routine to Blog
        { from: "5", to: "1" }, // Side hustle to Blog
        { from: "2", to: "4" }, // Day job stress to Creative block
      ]);
    }, allWords.length * 200 + 1000);
  }, []);

  const handleDragEnd = (id: string, x: number, y: number) => {
    setClusters((prev) =>
      prev.map((cluster) =>
        cluster.id === id ? { ...cluster, x, y } : cluster
      )
    );
  };

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
      x: (cluster.x / 100) * containerRect.width + 140,
      y: (cluster.y / 100) * containerRect.height + 90,
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

          {/* Floating word clouds */}
          {!showClusters &&
            words.map((word, i) => (
              <WordCloud key={i} word={word} delay={i * 0.2} />
            ))}

          {/* Cluster clouds */}
          {showClusters &&
            clusters.map((cluster) => (
              <ClusterCloud
                key={cluster.id}
                cluster={cluster}
                onClick={() => handleClusterClick(cluster.id)}
                isSelected={selectedCluster === cluster.id}
                onDragEnd={handleDragEnd}
              />
            ))}
        </div>

        {showClusters && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1 }}
            className="flex justify-center mt-12 gap-4"
          >
            {connectMode ? (
              <p className="text-sm self-center font-['DM_Sans']" style={{ color: '#6B6B6B' }}>
                {selectedCluster
                  ? "Click another cluster to connect"
                  : "Click a cluster to start connecting"}
              </p>
            ) : (
              <p className="text-sm self-center font-['DM_Sans']" style={{ color: '#6B6B6B' }}>
                Drag clouds to organize your thoughts
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

export function ClusteringScreen() {
  return (
    <DndProvider backend={HTML5Backend}>
      <ClusteringScreenContent />
    </DndProvider>
  );
}
