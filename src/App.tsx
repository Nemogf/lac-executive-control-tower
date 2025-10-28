import React, { useMemo, useState } from "react";
import { Info, AlertTriangle, TrendingUp, CalendarDays, Send, Sparkles, MessageCircle, Bell, CheckCircle2, ExternalLink, Filter } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, Tooltip as RTooltip, ResponsiveContainer, CartesianGrid, Legend, PieChart, Pie, Cell } from "recharts";

// BRAND & THEME
const brand = {
  primary: "#231F20",
  gray700: "#534F50",
  gray500: "#8C8A8B",
  gray300: "#CBCACA",
  bg: "#F5F5F5",
};

// Tiny UI primitives (no shadcn)
const Card = ({ className = "", style, children }: any) => (
  <div className={`rounded-2xl border bg-white ${className}`} style={style}>{children}</div>
);
const CardHeader = ({ className = "", children }: any) => (
  <div className={`px-4 pt-4 pb-2 ${className}`}>{children}</div>
);
const CardTitle = ({ className = "", children }: any) => (
  <div className={`text-base font-semibold tracking-tight ${className}`}>{children}</div>
);
const CardContent = ({ className = "", children }: any) => (
  <div className={`px-4 pb-4 ${className}`}>{children}</div>
);

const Badge = ({ className = "", children }: any) => (
  <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium border ${className}`}>{children}</span>
);
const Button = ({ className = "", variant = "default", size = "md", disabled = false, children, onClick }: any) => {
  const base = "inline-flex items-center justify-center rounded-xl transition-colors focus:outline-none border";
  const variants: any = {
    default: "bg-black text-white border-black hover:opacity-90",
    outline: "bg-white text-black border-gray-300 hover:bg-gray-50",
    ghost: "bg-transparent text-black border-transparent hover:bg-gray-100",
    secondary: "bg-gray-900 text-white border-gray-900 hover:opacity-90",
  };
  const sizes: any = { sm: "h-8 px-3 text-sm", md: "h-10 px-4", icon: "h-10 w-10" };
  return (
    <button onClick={onClick} disabled={disabled} className={`${base} ${variants[variant]} ${sizes[size]} disabled:opacity-50 disabled:cursor-not-allowed ${className}`}>
      {children}
    </button>
  );
};
const Input = ({ className = "", ...props }: any) => (
  <input {...props} className={`w-full h-10 rounded-xl border px-3 outline-none focus:ring-2 focus:ring-gray-300 ${className}`} />
);

// Tabs
function Tabs({ value, onValueChange, children }: any) {
  return <div data-value={value}>{children({ value, onValueChange })}</div>;
}
function TabsList({ children }: any) { return <div className="inline-flex rounded-xl border p-1 gap-1 bg-white">{children}</div>; }
function TabsTrigger({ value, current, onClick, children }: any) {
  const active = current === value;
  return (
    <button onClick={() => onClick(value)} className={`px-3 h-8 rounded-lg text-sm ${active ? "bg-black text-white" : "text-black hover:bg-gray-100"}`}>
      {children}
    </button>
  );
}

// Mock Data
const kpi = [
  { label: "Occupazione serata (Biglietteria LAC)", value: "72%", delta: "+6% vs settimana scorsa" },
  { label: "Ricavi Prevendite oggi", value: "CHF 48’200", delta: "+12% vs target giornaliero" },
  { label: "Eventi critici (T-7/T-3)", value: "3", delta: "2 a T-7 · 1 a T-3" },
  { label: "Costi operativi di giornata", value: "CHF 21’400", delta: "-4% vs budget" },
  { label: "Sentiment pubblico 72h", value: "78/100", delta: "stabile" },
  { label: "Benefit sponsor erogati (SLA)", value: "92%", delta: "on‑time" },
  { label: "Cash‑in ultimi 7 gg", value: "CHF 311’000", delta: "+9%" },
  { label: "NPS post‑evento 30 gg", value: "+57", delta: "+3 pts" },
];

const salesSeries = [
  { day: "Lun", tickets: 420, revenue: 38000 },
  { day: "Mar", tickets: 510, revenue: 45200 },
  { day: "Mer", tickets: 465, revenue: 39900 },
  { day: "Gio", tickets: 610, revenue: 51200 },
  { day: "Ven", tickets: 780, revenue: 68400 },
  { day: "Sab", tickets: 920, revenue: 81200 },
  { day: "Dom", tickets: 690, revenue: 60300 },
];

const funnel = [
  { step: "Reach (Sito/GA4)", value: 120000 },
  { step: "Click (Campagne/DEM)", value: 18300 },
  { step: "Aggiunta al carrello (Ticketing)", value: 2900 },
  { step: "Acquisto (Biglietteria LAC)", value: 1950 },
];

const topEvents = [
  { title: "Opera — Don Giovanni", date: "Ven 24", occupancy: 0.82, risk: "low" },
  { title: "Danza — Contemporary Mix", date: "Sab 25", occupancy: 0.61, risk: "mid" },
  { title: "Teatro — Classici d’Autunno", date: "Dom 26", occupancy: 0.44, risk: "high" },
  { title: "Musica — Quartetto d’Archi", date: "Lun 27", occupancy: 0.53, risk: "mid" },
  { title: "Family — Favole al LAC", date: "Mar 28", occupancy: 0.39, risk: "high" },
] as const;

type Risk = (typeof topEvents)[number]["risk"];

const anomalyFeed = [
  { type: "Vendite/DEM", msg: "Calo conversione newsletter per ‘Classici d’Autunno’ (−31% vs 14 gg)", severity: "high" },
  { type: "Accessi/UX", msg: "Discussioni social su code all’ingresso; sentiment −12 in 48 h", severity: "mid" },
  { type: "Ops/Allestimenti", msg: "Gap crew palco sabato (−2 tecnici luci)", severity: "mid" },
];

const revenueMix = [
  { name: "Biglietti (Arti performative)", value: 62 },
  { name: "Sponsorship/Donor", value: 21 },
  { name: "Venue Rental (spazi LAC)", value: 9 },
  { name: "Merch/Altro", value: 8 },
];

const heatmapDays = Array.from({ length: 14 }, (_, i) => ({
  day: i + 1,
  slots: [
    { label: "Matt", value: Math.random() },
    { label: "Pome", value: Math.random() },
    { label: "Sera", value: Math.random() },
  ],
}));

function RiskBadge({ risk }: { risk: Risk }) {
  const map: Record<Risk, { label: string; cls: string }> = {
    low: { label: "Basso", cls: "bg-emerald-100 text-emerald-700 border-emerald-200" },
    mid: { label: "Medio", cls: "bg-amber-100 text-amber-700 border-amber-200" },
    high: { label: "Alto", cls: "bg-rose-100 text-rose-700 border-rose-200" },
  };
  return <Badge className={`${map[risk].cls} font-medium`}>{map[risk].label}</Badge>;
}

function LACLogoPlaceholder() {
  return (
    <div className="flex items-baseline gap-2 select-none" style={{ color: brand.primary }}>
      <div className="text-2xl font-semibold tracking-tight">LAC</div>
      <div className="text-sm text-neutral-600">Lugano Arte e Cultura</div>
    </div>
  );
}

export default function App() {
  const [query, setQuery] = useState("");
  const [activeTab, setActiveTab] = useState("overview");

  const funnelNorm = useMemo(() => {
    const max = Math.max(...funnel.map((f) => f.value));
    return funnel.map((f) => ({ ...f, pct: Math.round((f.value / max) * 100) }));
  }, []);

  return (
    <div className="w-full min-h-screen" style={{ backgroundColor: brand.bg, color: brand.primary }}>
      {/* Header */}
      <div className="sticky top-0 z-40 backdrop-blur border-b" style={{ backgroundColor: "rgba(255,255,255,0.85)", borderColor: brand.gray300 }}>
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center gap-3">
          <LACLogoPlaceholder />
          <div className="h-6 w-px mx-2" style={{ backgroundColor: brand.gray300 }} />
          <span className="text-sm" style={{ color: brand.gray700 }}>Executive Control Tower — Stagione Arti Performative 2025/26</span>
          <span className="ml-auto text-xs px-2 py-1 rounded-full" style={{ backgroundColor: brand.gray300, color: brand.primary }}>ANTEPRIMA NON FUNZIONANTE</span>
          <Button variant="ghost" size="icon" className="ml-2" title="Mock interattivo a scopo dimostrativo. Dati statici."><Info className="w-5 h-5" /></Button>
        </div>
      </div>

      {/* KPI TOP BAR */}
      <div className="max-w-7xl mx-auto px-4 py-6 grid grid-cols-1 lg:grid-cols-4 gap-4">
        {kpi.map((k) => (
          <Card key={k.label} className="shadow-sm" style={{ borderColor: brand.gray300 }}>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium" style={{ color: brand.gray500 }}>{k.label}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-semibold" style={{ color: brand.primary }}>{k.value}</div>
              <div className="text-sm" style={{ color: brand.gray500 }}>{k.delta}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* GRID PRINCIPALE */}
      <div className="max-w-7xl mx-auto px-4 pb-8 grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Digest + Anomalie */}
        <Card className="xl:col-span-2 shadow-sm" style={{ borderColor: brand.gray300 }}>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="flex items-center gap-2"><Sparkles className="w-5 h-5"/>3 cose da sapere oggi (Direzione LAC)</CardTitle>
            <Badge className="bg-gray-100 text-gray-800 border-gray-200">Digest AI</Badge>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="p-3 rounded-xl" style={{ backgroundColor: brand.bg, color: brand.primary }}>1) Prevendite +12% vs target: traino eventi weekend (Opera/Danza).</div>
            <div className="p-3 rounded-xl" style={{ backgroundColor: brand.bg, color: brand.primary }}>2) Occupazione media serata 72%: rischio su Teatro (44%) e Family (39%).</div>
            <div className="p-3 rounded-xl" style={{ backgroundColor: brand.bg, color: brand.primary }}>3) Sponsor: 2 benefit in scadenza ≤7 giorni (ospitalità foyer).</div>
            <div className="pt-2 border-t mt-2" style={{ borderColor: brand.gray300 }}>
              <div className="font-medium mb-2 flex items-center gap-2"><AlertTriangle className="w-5 h-5"/>Segnali di anomalia</div>
              <ul className="space-y-2">
                {anomalyFeed.map((a, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <Badge className="border-gray-300 bg-white text-gray-800">{a.type}</Badge>
                    <span className={`${a.severity === 'high' ? 'text-rose-600' : ''}`}>{a.msg}</span>
                  </li>
                ))}
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* Chat AI (mock) */}
        <Card className="shadow-sm" style={{ borderColor: brand.gray300 }}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><MessageCircle className="w-5 h-5"/>Chiedi alla dashboard (LAC+ / Ticketing / GA4)</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Input placeholder="Es. Perché l’occupazione di sabato è scesa?" value={query} onChange={(e:any)=>setQuery(e.target.value)} />
            <Button className="w-full" disabled>
              <Send className="w-4 h-4 mr-2"/>Invia domanda (demo)
            </Button>
            <div className="text-xs" style={{ color: brand.gray500 }}>RAG su report interni + query live; azioni Make/n8n.</div>
          </CardContent>
        </Card>

        {/* Heatmap calendario */}
        <Card className="xl:col-span-2 shadow-sm" style={{ borderColor: brand.gray300 }}>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="flex items-center gap-2"><CalendarDays className="w-5 h-5"/>Heatmap prossimi 14 giorni</CardTitle>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm"><Filter className="w-4 h-4 mr-1"/>Filtri</Button>
              <Button variant="ghost" size="sm"><ExternalLink className="w-4 h-4 mr-1"/>Calendario LAC</Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-7 gap-2">
              {heatmapDays.map((d) => (
                <div key={d.day} className="p-2 rounded-xl bg-white border" style={{ borderColor: brand.gray300 }}>
                  <div className="text-xs" style={{ color: brand.gray500 }}>Giorno {d.day}</div>
                  <div className="mt-2 grid grid-cols-1 gap-1">
                    {d.slots.map((s, i) => (
                      <div key={i} className="flex items-center gap-2">
                        <span className="w-10 text-xs" style={{ color: brand.gray500 }}>{s.label}</span>
                        <div className="flex-1 h-3 rounded-full overflow-hidden" style={{ backgroundColor: brand.gray300 }}>
                          <div className="h-3" style={{ width: `${Math.round(s.value*100)}%`, backgroundColor: brand.primary }} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Top 5 Eventi */}
        <Card className="shadow-sm" style={{ borderColor: brand.gray300 }}>
          <CardHeader>
            <CardTitle>Top 5 eventi imminenti</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {topEvents.map((e) => (
              <div key={e.title} className="p-3 rounded-xl border bg-white flex items-center gap-3" style={{ borderColor: brand.gray300 }}>
                <div className="w-16 text-sm" style={{ color: brand.gray500 }}>{e.date}</div>
                <div className="flex-1">
                  <div className="font-medium" style={{ color: brand.primary }}>{e.title}</div>
                  <div className="text-sm" style={{ color: brand.gray500 }}>Occupazione: {(e.occupancy*100).toFixed(0)}%</div>
                </div>
                {/* @ts-ignore */}
                <RiskBadge risk={e.risk} />
                <Button variant="outline" size="sm" disabled>
                  <Bell className="w-4 h-4 mr-1"/>Alert
                </Button>
                <Button size="sm" disabled>
                  <Sparkles className="w-4 h-4 mr-1"/>Azioni
                </Button>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Vendite & Ricavi */}
        <Card className="xl:col-span-2 shadow-sm" style={{ borderColor: brand.gray300 }}>
          <CardHeader>
            <CardTitle>Vendite & Ricavi (ultimi 7 giorni)</CardTitle>
          </CardHeader>
          <CardContent className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={salesSeries}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis yAxisId="left" />
                <YAxis yAxisId="right" orientation="right" />
                <RTooltip />
                <Legend />
                <Line yAxisId="left" type="monotone" dataKey="tickets" strokeWidth={2} />
                <Line yAxisId="right" type="monotone" dataKey="revenue" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Funnel & Mix ricavi */}
        <Card className="shadow-sm" style={{ borderColor: brand.gray300 }}>
          <CardHeader>
            <CardTitle>Funnel — Top eventi (Sito/DEM → Biglietteria LAC)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {funnelNorm.map((f) => (
                <div key={f.step}>
                  <div className="flex items-center justify-between text-sm"><span>{f.step}</span><span className="text-neutral-500">{f.value.toLocaleString()}</span></div>
                  <div className="h-3 rounded-full overflow-hidden" style={{ backgroundColor: brand.gray300 }}>
                    <div className="h-3" style={{ width: `${f.pct}%`, backgroundColor: brand.primary }} />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-sm" style={{ borderColor: brand.gray300 }}>
          <CardHeader>
            <CardTitle>Mix ricavi (ultimi 30 gg)</CardTitle>
          </CardHeader>
          <CardContent className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={revenueMix} dataKey="value" nameKey="name" outerRadius={90} label>
                  {revenueMix.map((_, idx) => (
                    <Cell key={idx} />
                  ))}
                </Pie>
                <Legend />
                <RTooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Operations Pulse */}
        <Card className="xl:col-span-3 shadow-sm" style={{ borderColor: brand.gray300 }}>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="flex items-center gap-2"><TrendingUp className="w-5 h-5"/>Operations Pulse (Allestimenti/Accessi/Servizi)</CardTitle>
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              {({ value, onValueChange }: any) => (
                <TabsList>
                  <TabsTrigger value="overview" current={value} onClick={onValueChange}>Overview</TabsTrigger>
                  <TabsTrigger value="staff" current={value} onClick={onValueChange}>Staff</TabsTrigger>
                  <TabsTrigger value="incident" current={value} onClick={onValueChange}>Incident</TabsTrigger>
                </TabsList>
              )}
            </Tabs>
          </CardHeader>
          <CardContent>
            {activeTab === "overview" && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 rounded-xl border bg-white" style={{ borderColor: brand.gray300 }}>
                  <div className="text-sm" style={{ color: brand.gray500 }}>Allestimenti on‑time</div>
                  <div className="text-2xl font-semibold">94%</div>
                  <div className="text-xs" style={{ color: brand.gray500 }}>−1 pt vs settimana scorsa</div>
                </div>
                <div className="p-4 rounded-xl border bg-white" style={{ borderColor: brand.gray300 }}>
                  <div className="text-sm" style={{ color: brand.gray500 }}>Straordinari (ore / 7 gg)</div>
                  <div className="text-2xl font-semibold">31h</div>
                  <div className="text-xs" style={{ color: brand.gray500 }}>−12% vs target</div>
                </div>
                <div className="p-4 rounded-xl border bg-white" style={{ borderColor: brand.gray300 }}>
                  <div className="text-sm" style={{ color: brand.gray500 }}>Ticket tecnici aperti</div>
                  <div className="text-2xl font-semibold">5</div>
                  <div className="text-xs" style={{ color: brand.gray500 }}>2 ad alta priorità</div>
                </div>
              </div>
            )}
            {activeTab === "staff" && (
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 rounded-xl border" style={{ borderColor: brand.gray300 }}>
                  <div>
                    <div className="font-medium">Crew Palco — Sabato</div>
                    <div className="text-sm" style={{ color: brand.gray500 }}>Richieste 8 · Pianificate 6</div>
                  </div>
                  <Badge className="bg-amber-100 text-amber-700 border-amber-200">Gap</Badge>
                </div>
                <div className="flex items-center justify-between p-3 rounded-xl border" style={{ borderColor: brand.gray300 }}>
                  <div>
                    <div className="font-medium">Tecnici Luci — Venerdì</div>
                    <div className="text-sm" style={{ color: brand.gray500 }}>Richieste 4 · Pianificate 4</div>
                  </div>
                  <Badge className="bg-emerald-100 text-emerald-700 border-emerald-200">OK</Badge>
                </div>
              </div>
            )}
            {activeTab === "incident" && (
              <div className="space-y-3">
                <div className="p-3 rounded-xl border" style={{ borderColor: brand.gray300 }}>
                  <div className="flex items-center gap-2 font-medium"><AlertTriangle className="w-4 h-4 text-rose-600"/>Accessi foyer — coda prolungata</div>
                  <div className="text-sm" style={{ color: brand.gray500 }}>Segnalato: ieri 20:11 · Tempo risoluzione: 23 m</div>
                  <div className="mt-2 text-sm">Check‑list: aprire varco 2 · segnaletica mobile · push info 60’ prima</div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Footer */}
      <div className="max-w-7xl mx-auto px-4 pb-12 text-center text-sm" style={{ color: brand.gray500 }}>
        Anteprima statica con terminologia LAC e palette brand. Da sostituire il logo placeholder con file SVG/EPS ufficiale.
      </div>
    </div>
  );
}
