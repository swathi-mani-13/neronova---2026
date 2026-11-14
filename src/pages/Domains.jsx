import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { 
  HeartPulse, 
  Sprout, 
  GraduationCap, 
  TrendingUp, 
  Building2, 
  Factory, 
  Leaf, 
  ShieldAlert, 
  Sparkles, 
  X, 
  ChevronRight, 
  CheckCircle2, 
  Code2, 
  Lightbulb, 
  Cpu 
} from 'lucide-react';

export const DOMAIN_LIST = [
  {
    id: 'ai-healthcare',
    number: '01',
    name: 'AI in Healthcare',
    icon: HeartPulse,
    tagline: 'Predictive diagnostics, clinical edge vision & assistive bio-robotics',
    shortDescription: 'Leveraging AI algorithms, computer vision, and neural networks to transform patient diagnostics, clinical decision-making, and robotic healthcare delivery.',
    detailedOverview: 'Students can develop intelligent medical solutions that assist clinicians, automate radiology or pathology scans, forecast patient vitals in real time, or improve healthcare accessibility in remote and underserved regions.',
    sampleProjects: [
      'Edge AI for low-cost automated diabetic retinopathy or skin lesion classification.',
      'Continuous ICU telemetry anomaly predictor using LSTM neural networks.',
      'AI triage voice assistant converting multi-lingual regional dialects into structured clinical EHR notes.',
      'Computer vision guided physical rehabilitation posture corrector using lightweight mobile poses.'
    ],
    recommendedTech: ['PyTorch', 'TensorFlow Lite', 'OpenCV', 'FastAPI', 'MONAI', 'HuggingFace Transformers'],
    evaluationFocus: 'Clinical accuracy, offline inference feasibility, patient data privacy, and UX usability.'
  },
  {
    id: 'smart-agriculture',
    number: '02',
    name: 'Smart Agriculture',
    icon: Sprout,
    tagline: 'Autonomous crop analytics, precision irrigation & yield forecasting',
    shortDescription: 'Harnessing computer vision, IoT micro-sensors, and predictive models to revolutionize farming efficiency, pest mitigation, and resource conservation.',
    detailedOverview: 'Students can build hardware-software hybrid solutions or mobile apps that empower farmers with actionable real-time insights regarding soil moisture, disease outbreaks, crop yields, and weather risks.',
    sampleProjects: [
      'Low-cost multispectral leaf disease identification mobile app running offline on device.',
      'Automated drip irrigation system powered by soil-sensor telemetry and micro-climate forecasting.',
      'UAV / Drone automated weed detection and targeted chemical micro-spraying guidance.',
      'Fair pricing AI agent connecting local agricultural mandis directly to bulk retail buyers.'
    ],
    recommendedTech: ['Edge Impulse', 'YOLOv8', 'Raspberry Pi / ESP32', 'Python', 'Flask', 'Flutter'],
    evaluationFocus: 'Practical deployability for rural farmers, low-bandwidth resilience, and resource efficiency.'
  },
  {
    id: 'ai-education',
    number: '03',
    name: 'AI in Education',
    icon: GraduationCap,
    tagline: 'Adaptive learning tutors, automated grading & neuro-diverse pedagogy',
    shortDescription: 'Revolutionizing learning journeys through personalized AI mentors, smart curriculum synthesis, automated assessment, and accessible inclusive education tools.',
    detailedOverview: 'Students can tackle learning gaps by architecting AI platforms that adapt to each student’s unique learning speed, translate concepts into interactive visual diagrams, or assist special-needs students.',
    sampleProjects: [
      'Personalized Socratic AI tutor that diagnoses conceptual misunderstandings in STEM subjects.',
      'Inclusive real-time sign language interpreter converting video streams to spoken and captioned lectures.',
      'Automated semantic essay and code evaluator providing granular pedagogical feedback.',
      'Gamified learning engine that generates dynamic quizzes and visual flashcards from raw textbooks.'
    ],
    recommendedTech: ['LangChain', 'Llama 3', 'SpeechRecognition', 'React', 'MediaPipe', 'Vector Databases'],
    evaluationFocus: 'Pedagogical effectiveness, inclusivity, hallucination prevention, and interactive engagement.'
  },
  {
    id: 'fintech-bi',
    number: '04',
    name: 'FinTech and Business Intelligence',
    icon: TrendingUp,
    tagline: 'Real-time fraud radar, algorithmic analytics & decentralized finance',
    shortDescription: 'Applying machine learning, graph analytics, and predictive modeling to detect financial fraud, optimize investment risk, and automate business intelligence pipelines.',
    detailedOverview: 'Students can create resilient financial software that detects subtle money-laundering patterns, predicts creditworthiness for unbanked individuals, or automates corporate analytics with natural language queries.',
    sampleProjects: [
      'Graph neural network analyzing transaction networks to catch instant UPI / credit fraud rings.',
      'Alternative credit-scoring engine evaluating micro-entrepreneurs using non-traditional digital footprints.',
      'Natural-language-to-SQL business intelligence engine generating interactive KPI dashboards.',
      'Automated smart contract security auditor identifying reentrancy and integer overflow vulnerabilities.'
    ],
    recommendedTech: ['NetworkX', 'Scikit-learn', 'PostgreSQL', 'DuckDB', 'FastAPI', 'Chart.js / D3.js'],
    evaluationFocus: 'Detection precision vs false-positive rates, data security, latency, and compliance.'
  },
  {
    id: 'smart-cities',
    number: '05',
    name: 'Smart Cities and Transportation',
    icon: Building2,
    tagline: 'Intelligent traffic grids, emergency corridors & urban IoT telemetry',
    shortDescription: 'Architecting intelligent urban ecosystems through dynamic traffic optimization, pedestrian safety vision, smart waste tracking, and transit logistics.',
    detailedOverview: 'Students can design systems that ease city gridlock, prioritize emergency response vehicles (ambulances, fire engines), optimize public transit routes, or monitor urban infrastructure health.',
    sampleProjects: [
      'Dynamic signal timing engine that reads intersection CCTV cameras and clears green corridors for ambulances.',
      'AI pothole and road anomaly detection system deployed on municipal buses / dashcams.',
      'Smart municipal waste bin fill-level radar optimizing garbage truck collection routes.',
      'Pedestrian collision avoidance and zebra-crossing safety alerts for blind spots.'
    ],
    recommendedTech: ['OpenCV', 'YOLOv10', 'OSMnx', 'MQTT', 'Node.js', 'WebSockets', 'Leaflet'],
    evaluationFocus: 'Real-time edge response, infrastructure scalability, computational efficiency, and citizen safety.'
  },
  {
    id: 'industrial-ai',
    number: '06',
    name: 'Industrial AI and Automation',
    icon: Factory,
    tagline: 'Predictive maintenance, robotic inspection & digital twin telemetry',
    shortDescription: 'Transforming manufacturing and heavy industry through predictive machinery maintenance, automated optical quality inspection, and digital twin simulation.',
    detailedOverview: 'Students can build tools that prevent catastrophic industrial downtime, detect manufacturing defects on assembly lines at high speeds, or safely automate repetitive workshop tasks.',
    sampleProjects: [
      'Acoustic vibration anomaly detector forecasting industrial motor bearing failure 48 hours in advance.',
      'High-speed PCB solder defect inspection camera with real-time bounding box annotations.',
      'Worker safety gear (PPE) compliance computer vision monitor for active construction sites.',
      'Digital twin pipeline simulating energy consumption and cooling optimization in server clusters.'
    ],
    recommendedTech: ['PyTorch', 'TensorRT', 'OpenVINO', 'Industrial IoT Protocols', 'Docker', 'Three.js'],
    evaluationFocus: 'Industrial reliability, false alarm minimization, edge processing throughput, and safety.'
  },
  {
    id: 'environment-sustainability',
    number: '07',
    name: 'Environment and Sustainability',
    icon: Leaf,
    tagline: 'Carbon accounting, climate forecasting & biodiversity conservation',
    shortDescription: 'Leveraging data science and artificial intelligence to monitor ecological health, predict renewable energy generation, and accelerate carbon reduction initiatives.',
    detailedOverview: 'Students can address the global climate crisis by creating solutions for solar/wind power forecasting, wildlife tracking, ocean plastic mapping, or corporate carbon footprint auditing.',
    sampleProjects: [
      'Micro-climate solar irradiance and wind power generation forecasting model for smart micro-grids.',
      'Satellite imagery analysis pipeline detecting illegal deforestation and forest wildfire early warnings.',
      'Computer vision marine plastic waste counter for beach and river cleanup vessels.',
      'Automated supply chain carbon emission tracker providing actionable reduction roadmaps.'
    ],
    recommendedTech: ['GeoPandas', 'Sentinel Hub API', 'XGBoost', 'Python', 'Leaflet / Mapbox', 'FastAPI'],
    evaluationFocus: 'Ecological impact, data validity, actionable insights, and sustainability metrics.'
  },
  {
    id: 'cybersecurity-safety',
    number: '08',
    name: 'Cybersecurity and Digital Safety',
    icon: ShieldAlert,
    tagline: 'Threat hunting, zero-day intrusion detection & deepfake defense',
    shortDescription: 'Defending modern cyberspace using adversarial machine learning, automated malware analysis, zero-trust perimeter auditing, and synthetic media authentication.',
    detailedOverview: 'Students can engineer security solutions that unmask generative deepfakes, thwart automated phishing campaigns, protect IoT device ecosystems from botnets, or detect zero-day exploits.',
    sampleProjects: [
      'Multimodal deepfake audio and video detector verifying authenticity of media files.',
      'Autonomous network intrusion prevention system (NIPS) flagging zero-day reconnaissance probing.',
      'Browser shield extension neutralizing sophisticated spear-phishing and adversarial prompt injection.',
      'Decentralized identity credential vault with biometric zero-knowledge authentication.'
    ],
    recommendedTech: ['Wireshark / Scapy', 'PyTorch', 'Suricata API', 'Rust', 'WebAuthn', 'Chrome Extension API'],
    evaluationFocus: 'Evasion resistance, detection speed, low false alarm rate, and cryptographic security.'
  },
  {
    id: 'generative-ai',
    number: '09',
    name: 'Generative AI and Creative Innovation',
    icon: Sparkles,
    tagline: 'Autonomous agent swarms, multimodal synthesis & generative workflows',
    shortDescription: 'Pushing the frontiers of generative artificial intelligence with multi-agent orchestration, multimodal content generation, interactive design, and creative co-pilots.',
    detailedOverview: 'Students can explore cutting-edge LLMs, diffusion models, and autonomous agent loops to automate complex creative workflows, generate dynamic 3D assets, or create conversational companions.',
    sampleProjects: [
      'Multi-agent software engineering swarm that autonomously plans, writes, and tests full-stack microservices.',
      'AI soundscape and cinematic audio generator tailored for indie game developers.',
      'Generative 3D CAD model synthesizer converting natural language descriptions into 3D printable meshes.',
      'Interactive narrative game engine with dynamically evolving NPC memories and emergent storylines.'
    ],
    recommendedTech: ['LangGraph / CrewAI', 'Stable Diffusion', 'Ollama', 'React', 'Three.js / WebGL', 'Pinecone'],
    evaluationFocus: 'Originality, multimodal integration, agentic reasoning, and interactive responsiveness.'
  }
];

export default function Domains() {
  const [selectedDomain, setSelectedDomain] = useState(null);
  const [searchParams] = useSearchParams();

  // If URL has ?domain=... open it automatically
  useEffect(() => {
    const domainQuery = searchParams.get('id');
    if (domainQuery) {
      const match = DOMAIN_LIST.find(d => d.id === domainQuery);
      if (match) setSelectedDomain(match);
    }
  }, [searchParams]);

  return (
    <div className="min-h-screen bg-[#090909] text-white pt-24 pb-20 cyber-grid-bg relative">
      
      {/* Background Glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-3/4 h-80 bg-[#E50914]/10 rounded-full blur-[160px] pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Title Header */}
        <div className="text-center max-w-3xl mx-auto mb-14 space-y-4">
          <div className="inline-flex items-center space-x-2 border border-[#E50914]/40 bg-[#090909]/80 px-4 py-1.5 rounded-full text-xs font-mono tracking-widest text-[#FF3030]">
            <span>// 9 HACKATHON DOMAINS</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-orbitron font-extrabold tracking-tight">
            INNOVATION <span className="text-[#FF3030] cyber-glow-red">DOMAINS</span>
          </h1>
          <p className="text-gray-300 text-sm sm:text-base leading-relaxed">
            Select any domain below to inspect project scopes, recommended technologies, and student project ideas. Every domain card is fully interactive.
          </p>
        </div>

        {/* 9 Domains Grid (Interactive Cards) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          {DOMAIN_LIST.map((domain) => {
            const Icon = domain.icon;
            return (
              <div
                key={domain.id}
                onClick={() => setSelectedDomain(domain)}
                className="group relative bg-[#0e0e0e] border border-[#E50914]/30 hover:border-[#FF3030] rounded-xl p-6 cursor-pointer shadow-cyber-card hover:shadow-neon-red transition-all duration-300 flex flex-col justify-between"
              >
                {/* Tech corner accent */}
                <div className="absolute top-2 right-2 text-xs font-orbitron font-bold text-gray-600 group-hover:text-[#FF3030] transition-colors">
                  #{domain.number}
                </div>

                <div>
                  {/* Icon with glowing badge */}
                  <div className="w-12 h-12 rounded-lg bg-[#E50914]/15 border border-[#E50914]/60 flex items-center justify-center text-[#FF3030] group-hover:bg-[#E50914] group-hover:text-white transition-all duration-300 mb-5 shadow-[0_0_10px_rgba(229,9,20,0.3)]">
                    <Icon className="w-6 h-6" />
                  </div>

                  {/* Title & Tagline */}
                  <h3 className="font-orbitron font-bold text-lg text-white group-hover:text-[#FF3030] transition-colors mb-2">
                    {domain.name}
                  </h3>
                  <p className="text-gray-400 text-xs sm:text-sm line-clamp-3 leading-relaxed mb-4">
                    {domain.shortDescription}
                  </p>
                </div>

                {/* Card Action Trigger */}
                <div className="pt-4 border-t border-white/10 flex items-center justify-between text-xs font-orbitron font-semibold text-[#FF3030] group-hover:text-white">
                  <span>View Project Details</span>
                  <div className="w-6 h-6 rounded-full bg-[#E50914]/20 group-hover:bg-[#E50914] flex items-center justify-center transition-colors">
                    <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* ========================================================================= */}
        {/* INTERACTIVE DOMAIN DETAILS MODAL (Opens on Card Click) */}
        {/* ========================================================================= */}
        {selectedDomain && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/85 backdrop-blur-md animate-fadeIn">
            <div className="relative w-full max-w-3xl bg-[#0e0e0e] border-2 border-[#E50914] rounded-2xl shadow-neon-red-lg overflow-hidden max-h-[90vh] flex flex-col">
              
              {/* Modal Top Cyber Header */}
              <div className="flex items-center justify-between px-6 py-5 bg-[#140204] border-b border-[#E50914]/50">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-lg bg-[#E50914] text-white flex items-center justify-center shadow-neon-red">
                    <selectedDomain.icon className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[10px] font-mono text-[#FF3030] uppercase tracking-widest">
                      DOMAIN #{selectedDomain.number} BRIEFING
                    </span>
                    <h2 className="text-xl sm:text-2xl font-orbitron font-extrabold text-white">
                      {selectedDomain.name}
                    </h2>
                  </div>
                </div>

                <button
                  onClick={() => setSelectedDomain(null)}
                  className="p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                  aria-label="Close Modal"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              {/* Modal Scrollable Body */}
              <div className="p-6 sm:p-8 overflow-y-auto space-y-6 text-sm text-gray-300">
                
                {/* Overview */}
                <div>
                  <h4 className="font-orbitron text-xs font-bold uppercase tracking-wider text-[#FF3030] mb-2 flex items-center space-x-2">
                    <Cpu className="w-4 h-4" />
                    <span>Domain Scope & Architecture</span>
                  </h4>
                  <p className="text-gray-200 text-sm sm:text-base leading-relaxed bg-[#141414] border border-white/10 rounded-lg p-4">
                    {selectedDomain.detailedOverview}
                  </p>
                </div>

                {/* Student Project Ideas */}
                <div>
                  <h4 className="font-orbitron text-xs font-bold uppercase tracking-wider text-[#FF3030] mb-3 flex items-center space-x-2">
                    <Lightbulb className="w-4 h-4" />
                    <span>Sample Student Project Ideas You Can Build</span>
                  </h4>
                  <div className="grid grid-cols-1 gap-2.5">
                    {selectedDomain.sampleProjects.map((idea, idx) => (
                      <div key={idx} className="flex items-start space-x-3 bg-black/50 border border-[#E50914]/20 rounded-lg p-3">
                        <CheckCircle2 className="w-4 h-4 text-[#FF3030] shrink-0 mt-0.5" />
                        <span className="text-xs sm:text-sm text-gray-200 leading-snug">{idea}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Recommended Tech Stack & Evaluation */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="bg-[#141414] border border-white/10 rounded-lg p-4">
                    <h5 className="font-orbitron text-xs font-bold text-white mb-2 flex items-center space-x-1.5">
                      <Code2 className="w-4 h-4 text-[#FF3030]" />
                      <span>Recommended Tech & Tools</span>
                    </h5>
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {selectedDomain.recommendedTech.map((tech, idx) => (
                        <span key={idx} className="bg-black/60 border border-white/15 px-2.5 py-1 rounded text-xs font-mono text-gray-300">
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="bg-[#141414] border border-white/10 rounded-lg p-4">
                    <h5 className="font-orbitron text-xs font-bold text-white mb-2 flex items-center space-x-1.5">
                      <Sparkles className="w-4 h-4 text-[#00d2ff]" />
                      <span>Judging Evaluation Focus</span>
                    </h5>
                    <p className="text-xs text-gray-400 leading-relaxed pt-1">
                      {selectedDomain.evaluationFocus}
                    </p>
                  </div>
                </div>

              </div>

              {/* Modal Footer with Register Action */}
              <div className="px-6 py-4 bg-[#140204] border-t border-[#E50914]/40 flex flex-wrap items-center justify-between gap-4">
                <span className="text-xs text-gray-400 font-mono">
                  Team Size: 2–4 members • Inter & Intra College
                </span>

                <div className="flex items-center space-x-3">
                  <button
                    onClick={() => setSelectedDomain(null)}
                    className="px-4 py-2 border border-white/20 hover:bg-white/10 rounded text-xs font-orbitron font-semibold text-gray-300 transition-colors"
                  >
                    Close Briefing
                  </button>

                  <Link
                    to={`/register?domain=${encodeURIComponent(selectedDomain.name)}`}
                    className="px-6 py-2 bg-gradient-to-r from-[#E50914] to-[#FF3030] text-white font-orbitron font-bold text-xs uppercase rounded cyber-chamfer-btn shadow-neon-red hover:shadow-neon-red-lg transition-all flex items-center"
                  >
                    <span>Register in this Domain</span>
                    <ChevronRight className="w-3.5 h-3.5 ml-1" />
                  </Link>
                </div>
              </div>

            </div>
          </div>
        )}

      </div>
    </div>
  );
}
