'use client'

import { useState, useCallback } from 'react'
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell,
} from 'recharts'
import {
  AlertTriangle, TrendingUp, Package, Users, ShoppingBag, Brain,
  Settings, LayoutDashboard, Bell, ChevronRight, Search, Send, Loader2,
  ArrowUpRight, ArrowDownRight, Minus, Zap, ChevronLeft,
} from 'lucide-react'

// ─── BRAND TOKENS ─────────────────────────────────────────────
const T = {
  teal: '#0891B2', tealDark: '#065F73', tealLight: '#E0F7FA', tealMid: '#B2EBF2',
  navy: '#1E293B', text: '#334155', textLight: '#64748B', textDim: '#94A3B8',
  border: '#E2E8F0', bg: '#F8FAFB', bgAlt: '#EFF3F6', white: '#FFFFFF',
  red: '#DC2626', redLight: '#FEE2E2', redText: '#991B1B',
  amber: '#D97706', amberLight: '#FEF3C7', amberText: '#92400E',
  green: '#059669', greenLight: '#D1FAE5', greenText: '#065F46',
}

// ─── TYPES ────────────────────────────────────────────────────
interface Distributor {
  id: string; name: string; region: string; city: string;
  primaryUnits: number; secondaryUnits: number; sellThrough: number;
  days: number; risk: number; trend: string; topSKUs: string[];
}
interface SKUItem {
  id: string; name: string; cat: string; mrp: number; asp: number;
  monthly: number; secondary: number; ret: number; trend: string;
}
interface AlertItem {
  id: number; sev: string; dist: string; region: string; metric: string;
  sku: string; msg: string; rec: string; ts: string;
}
interface Message { role: 'user' | 'assistant'; content: string }

// ─── DATA ─────────────────────────────────────────────────────
const SKUS: SKUItem[] = [
  { id:'SK001', name:'Vitamin C Face Wash',       cat:'Face Care', mrp:499, asp:299, monthly:185000, secondary:162800, ret:3.2, trend:'up'     },
  { id:'SK002', name:'Ubtan Face Wash',            cat:'Face Care', mrp:269, asp:193, monthly:210000, secondary:201600, ret:2.1, trend:'up'     },
  { id:'SK003', name:'Rice Water Face Wash',       cat:'Face Care', mrp:399, asp:312, monthly:145000, secondary:130500, ret:2.8, trend:'up'     },
  { id:'SK004', name:'Onion Hair Oil',             cat:'Hair Care', mrp:599, asp:539, monthly:172000, secondary:134160, ret:4.1, trend:'down'   },
  { id:'SK005', name:'Vitamin C Face Serum',       cat:'Face Care', mrp:599, asp:499, monthly:98000,  secondary:88200,  ret:3.5, trend:'stable' },
  { id:'SK006', name:'Rosemary Hair Oil',          cat:'Hair Care', mrp:444, asp:249, monthly:132000, secondary:118800, ret:2.9, trend:'up'     },
  { id:'SK007', name:'Onion Shampoo 600ml',        cat:'Hair Care', mrp:899, asp:360, monthly:89000,  secondary:62300,  ret:5.2, trend:'down'   },
  { id:'SK008', name:'Daily Glow Sunscreen SPF50', cat:'Sun Care',  mrp:499, asp:399, monthly:156000, secondary:148200, ret:1.8, trend:'up'     },
  { id:'SK009', name:'Niacinamide Face Serum',     cat:'Face Care', mrp:349, asp:236, monthly:76000,  secondary:68400,  ret:3.8, trend:'stable' },
  { id:'SK010', name:'Bye Bye Blemishes Cream',    cat:'Face Care', mrp:349, asp:299, monthly:54000,  secondary:37800,  ret:6.1, trend:'down'   },
]

const REGIONS = ['Maharashtra','Delhi NCR','Karnataka','Tamil Nadu','Gujarat','Telangana','West Bengal','Rajasthan']
const CITIES: Record<string, string[]> = {
  'Maharashtra':['Mumbai','Pune','Nagpur','Nashik'],
  'Delhi NCR':['New Delhi','Gurgaon','Noida','Faridabad'],
  'Karnataka':['Bangalore','Mysore','Hubli'],
  'Tamil Nadu':['Chennai','Coimbatore','Madurai'],
  'Gujarat':['Ahmedabad','Surat','Vadodara'],
  'Telangana':['Hyderabad','Warangal'],
  'West Bengal':['Kolkata','Howrah'],
  'Rajasthan':['Jaipur','Jodhpur','Udaipur'],
}
const NAMES = [
  'Sharma Distribution Co','Patel Enterprises','Singh & Sons Trading','Reddy Retail Solutions',
  'Gupta FMCG Distributors','Mehta Supply Chain','Iyer & Associates','Khan Wholesale Traders',
  'Joshi Marketing Agency','Nair Consumer Goods','Agarwal Dist. Network','Chatterjee Trading Co',
  'Pillai Retail Hub','Saxena Distribution','Deshmukh Enterprises','Malhotra Trading Co',
  'Choudhary Suppliers','Banerjee & Co','Kulkarni Distribution','Thakur Wholesale',
  'Verma Trading Corp','Mishra Supply Hub','Pandey Dist. Services','Bhat Marketing Pvt',
  'Deshpande Traders','Kapoor Retail Network','Sethi Distribution','Rajput Trading House',
  'Menon Supply Co','Bhatt Enterprises',
]

// Seeded PRNG so data is identical on server and client
function seededRng(seed: number) {
  let s = seed
  return () => {
    s = (s * 1664525 + 1013904223) & 0x7fffffff
    return s / 0x7fffffff
  }
}

function mkDistributors(): Distributor[] {
  const rng = seededRng(42)
  return NAMES.map((name, i) => {
    const region = REGIONS[i % REGIONS.length]
    const city   = CITIES[region][i % CITIES[region].length]
    const bad    = i < 4
    const prim   = Math.floor(8000 + rng() * 12000)
    const str    = bad ? 0.35 + rng() * 0.25 : 0.75 + rng() * 0.2
    const sec    = Math.floor(prim * str)
    const days   = Math.max(5, Math.floor((prim - sec) / (sec / 30)))
    const risk   = Math.min(100, Math.round(days > 60 ? 85 + rng()*15 : days > 40 ? 55 + rng()*25 : days > 25 ? 20 + rng()*20 : rng()*15))
    return {
      id: `D${String(i+1).padStart(3,'0')}`, name, region, city,
      primaryUnits: prim, secondaryUnits: sec,
      sellThrough: +(sec/prim).toFixed(2), days, risk,
      trend: bad ? 'declining' : rng() > 0.3 ? 'improving' : 'stable',
      topSKUs: SKUS.slice(0, 3 + Math.floor(rng() * 4)).map(s => s.name),
    }
  })
}

const DIST = mkDistributors()

const ALERTS: AlertItem[] = [
  { id:1, sev:'critical', dist:'Sharma Distribution Co', region:'Maharashtra', metric:'78 days', sku:'Onion Shampoo 600ml', msg:'Inventory at 2.6× safe threshold. Sell-through ratio 0.38. Immediate action required.', rec:'Pause next shipment. Deploy field rep to Pune territory. Consider 15% trade discount.', ts:'2 hrs ago' },
  { id:2, sev:'critical', dist:'Patel Enterprises',       region:'Gujarat',     metric:'65 days', sku:'Bye Bye Blemishes',   msg:'65 days stock. Secondary sales declining 12% WoW for 3 consecutive weeks.',         rec:'Reduce next PO by 40%. Investigate if Minimalist launched competing SKU in Ahmedabad.', ts:'5 hrs ago' },
  { id:3, sev:'warning',  dist:'Singh & Sons Trading',    region:'Delhi NCR',   metric:'Ratio 0.82→0.61', sku:'Onion Hair Oil', msg:'Sell-through declining. Will cross critical zone within 2 weeks.',              rec:'Schedule distributor call. Review pricing vs. WOW Skin Science in Delhi.', ts:'8 hrs ago' },
  { id:4, sev:'warning',  dist:'Reddy Retail Solutions',  region:'Telangana',   metric:'52 days', sku:'Multiple SKUs',       msg:'Broad slowdown across 6 SKUs. Likely territory demand issue, not product-specific.', rec:'Evaluate if Hyderabad territory is over-distributed. Deploy in-store visibility.', ts:'1 day ago' },
  { id:5, sev:'info',     dist:'Joshi Marketing Agency',  region:'Maharashtra', metric:'Ratio 0.94', sku:'Daily Glow SPF50', msg:'Exceptional sell-through. Approaching stockout. Summer demand accelerating.',       rec:'Increase next shipment by 30%. Make this distributor the regional sunscreen hub.', ts:'1 day ago' },
]

const TREND = [
  { m:'Nov', primary:285, secondary:241 }, { m:'Dec', primary:310, secondary:254 },
  { m:'Jan', primary:342, secondary:260 }, { m:'Feb', primary:368, secondary:265 },
  { m:'Mar', primary:395, secondary:274 }, { m:'Apr', primary:358, secondary:285 },
]

// ─── HELPERS ──────────────────────────────────────────────────
function riskColor(score: number) { return score>=70?T.red:score>=40?T.amber:T.green }
function riskBg(score: number)    { return score>=70?T.redLight:score>=40?T.amberLight:T.greenLight }
function riskLabel(score: number) { return score>=70?'Critical':score>=40?'At Risk':'Healthy' }
function sevColor(s: string)      { return s==='critical'?T.red:s==='warning'?T.amber:T.teal }
function sevBg(s: string)         { return s==='critical'?T.redLight:s==='warning'?T.amberLight:T.tealLight }
function sevLabel(s: string)      { return s==='critical'?'Critical':s==='warning'?'Warning':'Info' }
function trendIcon(t: string) {
  if(t==='up'||t==='improving')   return <ArrowUpRight size={13} style={{color:T.green}}/>
  if(t==='down'||t==='declining') return <ArrowDownRight size={13} style={{color:T.red}}/>
  return <Minus size={13} style={{color:T.textDim}}/>
}

// ─── SUBCOMPONENTS ────────────────────────────────────────────
function Logo() {
  return (
    <div style={{display:'flex',alignItems:'center',gap:8,padding:'20px 20px 16px'}}>
      <div style={{width:32,height:32,borderRadius:8,background:T.teal,display:'flex',alignItems:'center',justifyContent:'center'}}>
        <span style={{color:'#fff',fontWeight:800,fontSize:14,fontFamily:'Georgia,serif',letterSpacing:'-0.5px'}}>m</span>
      </div>
      <div>
        <div style={{fontSize:14,fontWeight:700,color:T.navy,fontFamily:'Georgia,serif',letterSpacing:'-0.3px'}}>multicommerce</div>
        <div style={{fontSize:9,color:T.textDim,fontWeight:500,letterSpacing:'0.05em',textTransform:'uppercase',marginTop:1}}>Sell-Through Intelligence</div>
      </div>
    </div>
  )
}

function NavItem({ id, label, icon: Icon, badge, active, onClick }: {
  id: string; label: string; icon: React.ElementType; badge?: number; active: boolean; onClick: (id: string) => void
}) {
  return (
    <button
      onClick={() => onClick(id)}
      style={{width:'100%',display:'flex',alignItems:'center',gap:8,padding:'8px 12px',borderRadius:8,border:'none',cursor:'pointer',textAlign:'left',fontFamily:'inherit',fontSize:13,fontWeight:active?600:400,color:active?T.teal:T.textLight,background:active?T.tealLight:'transparent',transition:'all 0.15s',marginBottom:2}}
    >
      <Icon size={15} style={{flexShrink:0,color:active?T.teal:T.textDim}} />
      <span style={{flex:1}}>{label}</span>
      {badge && badge > 0 && (
        <span style={{background:T.red,color:'#fff',borderRadius:99,fontSize:9,fontWeight:700,padding:'1px 6px',minWidth:16,textAlign:'center'}}>{badge}</span>
      )}
    </button>
  )
}

function Chip({ score }: { score: number }) {
  return <span style={{fontSize:11,fontWeight:600,padding:'2px 8px',borderRadius:99,background:riskBg(score),color:riskColor(score),display:'inline-block'}}>{riskLabel(score)}</span>
}

function SevChip({ sev }: { sev: string }) {
  return <span style={{fontSize:11,fontWeight:600,padding:'2px 8px',borderRadius:99,background:sevBg(sev),color:sevColor(sev)}}>{sevLabel(sev)}</span>
}

function Card({ children, style = {} }: { children: React.ReactNode; style?: React.CSSProperties }) {
  return <div style={{background:T.white,border:`1px solid ${T.border}`,borderRadius:12,padding:20,...style}}>{children}</div>
}

function MetricCard({ label, value, sub, color = T.teal, icon: Icon, trend }: {
  label: string; value: string | number; sub?: string; color?: string; icon: React.ElementType; trend?: string
}) {
  return (
    <div style={{background:T.white,border:`1px solid ${T.border}`,borderRadius:12,padding:'16px 20px',flex:1}}>
      <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:6}}>
        <div style={{display:'flex',alignItems:'center',gap:6}}>
          <Icon size={13} style={{color:T.textDim}} />
          <span style={{fontSize:10,fontWeight:600,color:T.textDim,textTransform:'uppercase',letterSpacing:'0.06em'}}>{label}</span>
        </div>
        {trend && trendIcon(trend)}
      </div>
      <div style={{fontSize:26,fontWeight:700,color,fontFamily:'Georgia,serif',lineHeight:1}}>{value}</div>
      {sub && <div style={{fontSize:11,color:T.textLight,marginTop:4}}>{sub}</div>}
    </div>
  )
}

const CTooltip = ({ active, payload, label }: { active?: boolean; payload?: Array<{color: string; name: string; value: number}>; label?: string }) => {
  if(!active||!payload?.length) return null
  return (
    <div style={{background:T.white,border:`1px solid ${T.border}`,borderRadius:8,padding:'10px 14px',fontSize:12,boxShadow:'0 4px 12px rgba(0,0,0,0.08)'}}>
      <div style={{fontWeight:600,color:T.navy,marginBottom:4}}>{label}</div>
      {payload.map((p, i) => (
        <div key={i} style={{display:'flex',alignItems:'center',gap:6,color:T.text,marginBottom:2}}>
          <span style={{width:8,height:8,borderRadius:'50%',background:p.color,display:'inline-block'}}/>
          {p.name}: <strong>{p.value}</strong>
        </div>
      ))}
    </div>
  )
}

// ─── VIEWS ────────────────────────────────────────────────────
function OverviewView() {
  const totalPrimary   = DIST.reduce((s,d)=>s+d.primaryUnits,0)
  const totalSecondary = DIST.reduce((s,d)=>s+d.secondaryUnits,0)
  const ratio          = (totalSecondary/totalPrimary).toFixed(2)
  const critical       = DIST.filter(d=>d.risk>=70).length
  const atRisk         = DIST.filter(d=>d.risk>=40&&d.risk<70).length
  const avgDays        = Math.round(DIST.reduce((s,d)=>s+d.days,0)/DIST.length)
  const riskPie        = [{name:'Healthy',v:DIST.filter(d=>d.risk<40).length},{name:'At Risk',v:atRisk},{name:'Critical',v:critical}]

  return (
    <div style={{display:'flex',flexDirection:'column',gap:20}}>
      <div>
        <h1 style={{fontSize:20,fontWeight:700,color:T.navy,fontFamily:'Georgia,serif',margin:0}}>Distribution Health</h1>
        <p style={{fontSize:13,color:T.textLight,margin:'4px 0 0'}}>Real-time sell-through intelligence across your distributor network</p>
      </div>

      <div style={{display:'flex',gap:14}}>
        <MetricCard label="Sell-Through Ratio" value={ratio} sub={+ratio>=0.8?'In healthy range':+ratio>=0.65?'Below target':'Needs attention'} color={+ratio>=0.8?T.green:+ratio>=0.65?T.amber:T.red} icon={TrendingUp} />
        <MetricCard label="Critical Distributors" value={critical} sub={`${atRisk} more at risk`} color={critical>0?T.red:T.green} icon={AlertTriangle} />
        <MetricCard label="Avg Days Inventory" value={`${avgDays}d`} sub="Target: ≤30 days" color={avgDays<=30?T.green:avgDays<=45?T.amber:T.red} icon={Package} />
        <MetricCard label="Active Distributors" value={DIST.length} sub={`${DIST.filter(d=>d.trend==='improving').length} improving`} color={T.teal} icon={Users} />
      </div>

      <div style={{display:'grid',gridTemplateColumns:'1fr 280px',gap:14}}>
        <Card>
          <div style={{fontSize:13,fontWeight:600,color:T.navy,marginBottom:2}}>Primary vs Secondary Sales</div>
          <div style={{fontSize:11,color:T.textLight,marginBottom:16}}>Gap between lines = unsold stock accumulating at distributors</div>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={TREND} margin={{top:4,right:4,left:-20,bottom:0}}>
              <defs>
                <linearGradient id="gP" x1="0" y1="0" x2="0" y2="1"><stop offset="5%"  stopColor={T.red}  stopOpacity={0.12}/><stop offset="95%" stopColor={T.red}  stopOpacity={0}/></linearGradient>
                <linearGradient id="gS" x1="0" y1="0" x2="0" y2="1"><stop offset="5%"  stopColor={T.teal} stopOpacity={0.12}/><stop offset="95%" stopColor={T.teal} stopOpacity={0}/></linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke={T.border} vertical={false}/>
              <XAxis dataKey="m" tick={{fill:T.textDim,fontSize:11}} axisLine={false} tickLine={false}/>
              <YAxis tick={{fill:T.textDim,fontSize:11}} axisLine={false} tickLine={false}/>
              <Tooltip content={<CTooltip/>}/>
              <Area type="monotone" dataKey="primary"   stroke={T.red}  fill="url(#gP)" strokeWidth={2} name="Primary (shipped)"/>
              <Area type="monotone" dataKey="secondary" stroke={T.teal} fill="url(#gS)" strokeWidth={2} name="Secondary (sold)"/>
            </AreaChart>
          </ResponsiveContainer>
          <div style={{display:'flex',gap:20,marginTop:8}}>
            {[{c:T.red,l:'Primary (Shipped to Distributors)'},{c:T.teal,l:'Secondary (Sold at Retail)'}].map(x=>(
              <div key={x.l} style={{display:'flex',alignItems:'center',gap:6,fontSize:11,color:T.textLight}}>
                <span style={{width:24,height:2,background:x.c,display:'inline-block',borderRadius:2}}/>
                {x.l}
              </div>
            ))}
          </div>
        </Card>

        <Card style={{display:'flex',flexDirection:'column'}}>
          <div style={{fontSize:13,fontWeight:600,color:T.navy,marginBottom:4}}>Risk Breakdown</div>
          <ResponsiveContainer width="100%" height={140}>
            <PieChart>
              <Pie data={riskPie} cx="50%" cy="50%" innerRadius={38} outerRadius={58} paddingAngle={3} dataKey="v">
                {[T.green,T.amber,T.red].map((c,i)=><Cell key={i} fill={c}/>)}
              </Pie>
              <Tooltip content={<CTooltip/>}/>
            </PieChart>
          </ResponsiveContainer>
          <div style={{display:'flex',flexDirection:'column',gap:6,marginTop:4}}>
            {[{c:T.green,l:'Healthy',n:DIST.filter(d=>d.risk<40).length},{c:T.amber,l:'At Risk',n:atRisk},{c:T.red,l:'Critical',n:critical}].map(x=>(
              <div key={x.l} style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
                <div style={{display:'flex',alignItems:'center',gap:6}}><span style={{width:10,height:10,borderRadius:'50%',background:x.c,display:'inline-block'}}/><span style={{fontSize:12,color:T.textLight}}>{x.l}</span></div>
                <span style={{fontSize:12,fontWeight:600,color:T.navy}}>{x.n}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <Card>
        <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:14}}>
          <div style={{fontSize:13,fontWeight:600,color:T.navy}}>Recent Alerts</div>
          <button style={{fontSize:12,color:T.teal,background:'none',border:'none',cursor:'pointer',display:'flex',alignItems:'center',gap:2}}>View all <ChevronRight size={12}/></button>
        </div>
        <div style={{display:'flex',flexDirection:'column',gap:8}}>
          {ALERTS.slice(0,3).map(a=>(
            <div key={a.id} style={{display:'flex',alignItems:'flex-start',gap:12,padding:'12px 14px',background:T.bg,borderRadius:8}}>
              <SevChip sev={a.sev}/>
              <div style={{flex:1,minWidth:0}}>
                <div style={{fontSize:12,fontWeight:600,color:T.navy}}>{a.dist} · <span style={{color:T.textLight,fontWeight:400}}>{a.region}</span></div>
                <div style={{fontSize:11,color:T.textLight,marginTop:2,lineHeight:1.4}}>{a.msg}</div>
              </div>
              <span style={{fontSize:10,color:T.textDim,whiteSpace:'nowrap'}}>{a.ts}</span>
            </div>
          ))}
        </div>
      </Card>
    </div>
  )
}

function DistributorsView() {
  const [search, setSearch]     = useState('')
  const [selected, setSelected] = useState<Distributor | null>(null)
  const filtered = DIST.filter(d=>!search||d.name.toLowerCase().includes(search.toLowerCase())||d.city.toLowerCase().includes(search.toLowerCase()))

  if(selected) {
    const d = selected
    return (
      <div style={{display:'flex',flexDirection:'column',gap:18}}>
        <button onClick={()=>setSelected(null)} style={{display:'flex',alignItems:'center',gap:4,fontSize:12,color:T.textLight,background:'none',border:'none',cursor:'pointer',padding:0,width:'fit-content'}}>
          <ChevronLeft size={14}/> Back to all distributors
        </button>
        <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start'}}>
          <div>
            <h1 style={{fontSize:20,fontWeight:700,color:T.navy,fontFamily:'Georgia,serif',margin:0}}>{d.name}</h1>
            <p style={{fontSize:12,color:T.textLight,margin:'4px 0 0'}}>{d.city}, {d.region} · {d.id}</p>
          </div>
          <Chip score={d.risk}/>
        </div>
        <div style={{display:'flex',gap:14}}>
          {[
            {l:'Sell-Through',    v:d.sellThrough, color:+d.sellThrough>=0.8?T.green:+d.sellThrough>=0.6?T.amber:T.red, icon:TrendingUp,  sub:'Target: ≥0.80'},
            {l:'Inventory Days',  v:`${d.days}d`,  color:d.days<=30?T.green:T.red,   icon:Package,     sub:'Target: ≤30 days'},
            {l:'Shipped (Primary)', v:d.primaryUnits.toLocaleString(),   color:T.teal,  icon:ShoppingBag, sub:'Units this month'},
            {l:'Sold (Secondary)',  v:d.secondaryUnits.toLocaleString(), color:d.sellThrough>=0.8?T.green:T.amber, icon:TrendingUp, sub:`${(d.primaryUnits-d.secondaryUnits).toLocaleString()} unsold`},
          ].map(m=><MetricCard key={m.l} label={m.l} value={m.v} sub={m.sub} color={m.color} icon={m.icon}/>)}
        </div>
        <Card>
          <div style={{display:'flex',alignItems:'center',gap:6,marginBottom:10}}>
            <Zap size={14} style={{color:T.teal}}/>
            <div style={{fontSize:13,fontWeight:600,color:T.navy}}>AI Risk Assessment</div>
          </div>
          <div style={{fontSize:12,color:T.text,lineHeight:1.65,padding:'12px 14px',background:T.bg,borderRadius:8}}>
            {d.risk>=70
              ? <><strong style={{color:T.red}}>Critical: </strong>This distributor holds {d.days} days of inventory — {(d.days/30).toFixed(1)}× the standard 30-day cycle. Sell-through of <strong>{d.sellThrough}</strong> is well below the 0.80 target. <strong>Recommended action: </strong>Pause next scheduled PO immediately. Deploy field team to audit retail placements in {d.city}. If sell-through doesn&apos;t recover to 0.65+ within 14 days, initiate partial stock return to prevent expiry write-offs.</>
              : d.risk>=40
              ? <><strong style={{color:T.amber}}>Warning: </strong>Inventory building at {d.days} days. Sell-through of <strong>{d.sellThrough}</strong> is below target. <strong>Recommended: </strong>Reduce next PO by 25%. Schedule check-in call with distributor. Monitor weekly — escalate if ratio drops below 0.60.</>
              : <><strong style={{color:T.green}}>Healthy: </strong>Strong sell-through at <strong>{d.sellThrough}</strong> with only {d.days} days of inventory. {d.trend==='improving'?'Trend is positive — consider increasing allocation by 10-15% next cycle.':'Maintain current shipment cadence.'}</>
            }
          </div>
        </Card>
        <Card>
          <div style={{fontSize:13,fontWeight:600,color:T.navy,marginBottom:12}}>Top SKUs at this Distributor</div>
          <div style={{display:'flex',flexDirection:'column',gap:6}}>
            {d.topSKUs.map((name,i)=>{
              const s=SKUS.find(x=>x.name===name)
              return s ? (
                <div key={i} style={{display:'flex',alignItems:'center',justifyContent:'space-between',padding:'8px 12px',background:T.bg,borderRadius:8}}>
                  <span style={{fontSize:12,color:T.navy,fontWeight:500}}>{s.name}</span>
                  <div style={{display:'flex',alignItems:'center',gap:12,fontSize:11,color:T.textLight}}>
                    <span>₹{s.asp}</span><span>Returns: {s.ret}%</span>{trendIcon(s.trend)}
                  </div>
                </div>
              ) : null
            })}
          </div>
        </Card>
      </div>
    )
  }

  return (
    <div style={{display:'flex',flexDirection:'column',gap:18}}>
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
        <div>
          <h1 style={{fontSize:20,fontWeight:700,color:T.navy,fontFamily:'Georgia,serif',margin:0}}>Distributors</h1>
          <p style={{fontSize:13,color:T.textLight,margin:'4px 0 0'}}>{DIST.length} distributors across {REGIONS.length} regions</p>
        </div>
        <div style={{display:'flex',alignItems:'center',gap:8,padding:'8px 14px',background:T.white,border:`1px solid ${T.border}`,borderRadius:8}}>
          <Search size={14} style={{color:T.textDim}}/>
          <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search distributor or city..." style={{background:'transparent',border:'none',outline:'none',fontSize:13,color:T.navy,width:200}}/>
        </div>
      </div>
      <Card style={{padding:0,overflow:'hidden'}}>
        <div style={{display:'grid',gridTemplateColumns:'2fr 1fr 0.8fr 0.8fr 0.9fr 0.7fr 60px',gap:0,padding:'10px 20px',background:T.bg,borderBottom:`1px solid ${T.border}`}}>
          {['Distributor','Region','Sell-Through','Inv. Days','Units','Risk',''].map(h=>(
            <div key={h} style={{fontSize:10,fontWeight:600,color:T.textDim,textTransform:'uppercase',letterSpacing:'0.05em'}}>{h}</div>
          ))}
        </div>
        <div style={{maxHeight:480,overflowY:'auto'}}>
          {[...filtered].sort((a,b)=>b.risk-a.risk).map(d=>(
            <div key={d.id} onClick={()=>setSelected(d)} style={{display:'grid',gridTemplateColumns:'2fr 1fr 0.8fr 0.8fr 0.9fr 0.7fr 60px',gap:0,padding:'12px 20px',borderBottom:`1px solid ${T.border}`,cursor:'pointer',alignItems:'center',transition:'background 0.1s'}} onMouseEnter={e=>(e.currentTarget.style.background=T.bg)} onMouseLeave={e=>(e.currentTarget.style.background=T.white)}>
              <div><div style={{fontSize:13,fontWeight:500,color:T.navy}}>{d.name}</div><div style={{fontSize:11,color:T.textDim}}>{d.city}</div></div>
              <div style={{fontSize:12,color:T.textLight}}>{d.region}</div>
              <div style={{fontSize:14,fontWeight:700,color:riskColor(d.risk)}}>{d.sellThrough}</div>
              <div style={{fontSize:13,fontWeight:500,color:d.days<=30?T.navy:d.days<=45?T.amber:T.red}}>{d.days}d</div>
              <div style={{fontSize:12,color:T.textLight}}>{d.primaryUnits.toLocaleString()}</div>
              <div><Chip score={d.risk}/></div>
              <div style={{display:'flex',justifyContent:'flex-end'}}>{trendIcon(d.trend)}</div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  )
}

function SKUView() {
  const sorted = [...SKUS].sort((a,b)=>(a.secondary/a.monthly)-(b.secondary/b.monthly))
  return (
    <div style={{display:'flex',flexDirection:'column',gap:18}}>
      <div>
        <h1 style={{fontSize:20,fontWeight:700,color:T.navy,fontFamily:'Georgia,serif',margin:0}}>SKU Intelligence</h1>
        <p style={{fontSize:13,color:T.textLight,margin:'4px 0 0'}}>Product-level sell-through performance across all distributors</p>
      </div>
      <Card>
        <div style={{fontSize:13,fontWeight:600,color:T.navy,marginBottom:4}}>Sell-Through Ratio by Product</div>
        <div style={{fontSize:11,color:T.textLight,marginBottom:16}}>Products sorted by worst-to-best sell-through — red bars need attention</div>
        <ResponsiveContainer width="100%" height={260}>
          <BarChart data={sorted.map(s=>({name:s.name.substring(0,20),ratio:+(s.secondary/s.monthly).toFixed(2)}))} layout="vertical" margin={{left:140,right:24,top:0,bottom:0}}>
            <CartesianGrid strokeDasharray="3 3" stroke={T.border} vertical={true} horizontal={false}/>
            <XAxis type="number" domain={[0,1]} tick={{fill:T.textDim,fontSize:10}} axisLine={false} tickLine={false}/>
            <YAxis type="category" dataKey="name" tick={{fill:T.text,fontSize:10}} axisLine={false} tickLine={false} width={135}/>
            <Tooltip content={<CTooltip/>}/>
            <Bar dataKey="ratio" name="Sell-Through" radius={[0,4,4,0]}>
              {sorted.map((s,i)=>{const r=s.secondary/s.monthly;return <Cell key={i} fill={r>=0.85?T.green:r>=0.70?T.amber:T.red}/>})}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </Card>
      <Card style={{padding:0,overflow:'hidden'}}>
        <div style={{display:'grid',gridTemplateColumns:'2.2fr 1fr 0.8fr 0.9fr 0.9fr 0.8fr 80px',gap:0,padding:'10px 20px',background:T.bg,borderBottom:`1px solid ${T.border}`}}>
          {['Product','Category','MRP','Sell-Through','Return Rate','Dead Stock',''].map(h=>(
            <div key={h} style={{fontSize:10,fontWeight:600,color:T.textDim,textTransform:'uppercase',letterSpacing:'0.05em'}}>{h}</div>
          ))}
        </div>
        {sorted.map(s=>{
          const ratio = +(s.secondary/s.monthly).toFixed(2)
          const dead  = ratio<0.70?'High':ratio<0.85?'Medium':'Low'
          const dc    = dead==='High'?T.red:dead==='Medium'?T.amber:T.green
          const db    = dead==='High'?T.redLight:dead==='Medium'?T.amberLight:T.greenLight
          return (
            <div key={s.id} style={{display:'grid',gridTemplateColumns:'2.2fr 1fr 0.8fr 0.9fr 0.9fr 0.8fr 80px',gap:0,padding:'11px 20px',borderBottom:`1px solid ${T.border}`,alignItems:'center'}}>
              <div style={{fontSize:12,fontWeight:500,color:T.navy}}>{s.name}</div>
              <div style={{fontSize:11,color:T.textLight}}>{s.cat}</div>
              <div style={{fontSize:12,color:T.text}}>₹{s.mrp}</div>
              <div style={{fontSize:13,fontWeight:700,...(ratio>=0.85?{color:T.green}:ratio>=0.70?{color:T.amber}:{color:T.red})}}>{ratio}</div>
              <div style={{fontSize:12,color:T.textLight}}>{s.ret}%</div>
              <div><span style={{fontSize:11,fontWeight:600,padding:'2px 8px',borderRadius:99,background:db,color:dc}}>{dead}</span></div>
              <div style={{display:'flex',justifyContent:'flex-end'}}>{trendIcon(s.trend)}</div>
            </div>
          )
        })}
      </Card>
    </div>
  )
}

function AlertsView() {
  const [filter, setFilter] = useState('all')
  const shown = ALERTS.filter(a=>filter==='all'||a.sev===filter)
  return (
    <div style={{display:'flex',flexDirection:'column',gap:18}}>
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
        <div>
          <h1 style={{fontSize:20,fontWeight:700,color:T.navy,fontFamily:'Georgia,serif',margin:0}}>Alerts & Actions</h1>
          <p style={{fontSize:13,color:T.textLight,margin:'4px 0 0'}}>AI-generated alerts with specific recommended actions</p>
        </div>
        <div style={{display:'flex',gap:4}}>
          {[['all','All'],['critical','Critical'],['warning','Warning'],['info','Info']].map(([v,l])=>(
            <button key={v} onClick={()=>setFilter(v)} style={{padding:'5px 12px',borderRadius:7,border:`1px solid ${filter===v?T.teal:T.border}`,background:filter===v?T.tealLight:'transparent',color:filter===v?T.teal:T.textLight,fontSize:12,fontWeight:filter===v?600:400,cursor:'pointer',fontFamily:'inherit'}}>{l}</button>
          ))}
        </div>
      </div>
      <div style={{display:'flex',flexDirection:'column',gap:12}}>
        {shown.map(a=>(
          <Card key={a.id}>
            <div style={{display:'flex',gap:12,alignItems:'flex-start'}}>
              <SevChip sev={a.sev}/>
              <div style={{flex:1}}>
                <div style={{display:'flex',alignItems:'center',gap:8,marginBottom:4}}>
                  <span style={{fontSize:13,fontWeight:600,color:T.navy}}>{a.dist}</span>
                  <span style={{fontSize:11,color:T.textDim}}>·</span>
                  <span style={{fontSize:12,color:T.textLight}}>{a.region}</span>
                  <span style={{fontSize:11,color:T.textDim}}>·</span>
                  <span style={{fontSize:11,color:T.textDim,fontStyle:'italic'}}>{a.sku}</span>
                </div>
                <div style={{fontSize:11,color:T.textDim,fontWeight:500,marginBottom:4}}>{a.metric}</div>
                <div style={{fontSize:12,color:T.text,lineHeight:1.5,marginBottom:10}}>{a.msg}</div>
                <div style={{padding:'10px 12px',background:T.tealLight,borderRadius:8,display:'flex',gap:8}}>
                  <Zap size={13} style={{color:T.teal,flexShrink:0,marginTop:1}}/>
                  <div>
                    <div style={{fontSize:10,fontWeight:700,color:T.teal,textTransform:'uppercase',letterSpacing:'0.05em',marginBottom:3}}>Recommended Action</div>
                    <div style={{fontSize:11,color:T.tealDark,lineHeight:1.5}}>{a.rec}</div>
                  </div>
                </div>
              </div>
              <span style={{fontSize:10,color:T.textDim,whiteSpace:'nowrap'}}>{a.ts}</span>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}

function AIView() {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput]       = useState('')
  const [loading, setLoading]   = useState(false)

  const ctx = `You are the AI analyst for Multicommerce, a distributor intelligence platform for D2C brands in India.

LIVE DATA — Honasa Consumer (Mamaearth, Derma Co, Aqualogica):
- Overall sell-through ratio: 0.78 (target: 0.80+)
- Critical distributors: 4 (Sharma Dist. Pune: 78d/0.38, Patel Ent. Ahmedabad: 65d/0.52, Singh & Sons Delhi: 42d/0.61, Reddy Retail Hyderabad: 52d/varied)
- Avg days of inventory: 34 (target: ≤30)
- Total distributors: 30 across 8 regions
- Top performers: Joshi Marketing Mumbai (0.94), Nair Consumer Chennai (0.88)
- Worst SKU: Onion Shampoo 600ml (0.70 sell-through, 5.2% return rate)
- Best SKU: Daily Glow Sunscreen SPF50 (0.95, 1.8% return rate)
- Trend: Primary sales grew Nov-Mar but secondary lagged — distributor inventory building

Respond in 2-3 short paragraphs. Be specific with names and numbers. No bullet points. Use plain prose. Reference the actual data.`

  const send = useCallback(async () => {
    if(!input.trim() || loading) return
    const q = input.trim()
    setInput('')
    setLoading(true)
    setMessages(p => [...p, { role: 'user', content: q }])
    try {
      const r = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          systemPrompt: ctx,
          messages: [...messages.slice(-6).map(m=>({role:m.role,content:m.content})), {role:'user',content:q}],
        }),
      })
      const d = await r.json()
      const txt = d.content?.filter((b: {type:string;text:string}) => b.type==='text').map((b: {type:string;text:string}) => b.text).join('\n') || 'Unable to generate insight.'
      setMessages(p => [...p, { role: 'assistant', content: txt }])
    } catch {
      setMessages(p => [...p, { role: 'assistant', content: 'Connect to the Multicommerce backend to activate live AI analysis.' }])
    }
    setLoading(false)
  }, [input, loading, messages, ctx])

  const suggestions = [
    'Which distributors need immediate attention?',
    'What\'s causing the inventory buildup this quarter?',
    'Which SKUs should we stop promoting offline?',
    'How do we prevent another channel stuffing crisis?',
  ]

  return (
    <div style={{display:'flex',flexDirection:'column',height:'calc(100vh - 120px)',gap:16}}>
      <div>
        <h1 style={{fontSize:20,fontWeight:700,color:T.navy,fontFamily:'Georgia,serif',margin:0}}>AI Insights Engine</h1>
        <p style={{fontSize:13,color:T.textLight,margin:'4px 0 0'}}>Ask anything about your distribution network. Real-time analysis of sell-through data.</p>
      </div>
      <div style={{display:'flex',gap:8,flexWrap:'wrap'}}>
        {suggestions.map(q=>(
          <button key={q} onClick={()=>setInput(q)} style={{padding:'5px 12px',borderRadius:99,border:`1px solid ${T.border}`,background:T.white,color:T.textLight,fontSize:12,cursor:'pointer',fontFamily:'inherit',transition:'all 0.1s'}}>{q}</button>
        ))}
      </div>
      <Card style={{flex:1,display:'flex',flexDirection:'column',padding:0,overflow:'hidden'}}>
        <div style={{flex:1,overflowY:'auto',padding:20,display:'flex',flexDirection:'column',gap:14}}>
          {messages.length===0 && (
            <div style={{display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',height:'100%',textAlign:'center'}}>
              <Brain size={36} style={{color:T.border,marginBottom:12}}/>
              <div style={{fontSize:13,color:T.textDim,maxWidth:380}}>Ask about distributor health, SKU performance, risk alerts, or what actions to take. The AI has full context of your distribution network.</div>
            </div>
          )}
          {messages.map((m, i) => (
            <div key={i} style={{display:'flex',justifyContent:m.role==='user'?'flex-end':'flex-start'}}>
              <div style={{maxWidth:'78%',padding:'10px 14px',borderRadius:12,fontSize:12,lineHeight:1.65,...(m.role==='user'?{background:T.tealLight,color:T.tealDark,fontWeight:500}:{background:T.bg,color:T.text,border:`1px solid ${T.border}`})}}>
                {m.content}
              </div>
            </div>
          ))}
          {loading && (
            <div style={{display:'flex',justifyContent:'flex-start'}}>
              <div style={{padding:'10px 14px',borderRadius:12,background:T.bg,border:`1px solid ${T.border}`,display:'flex',alignItems:'center',gap:8,fontSize:12,color:T.textLight}}>
                <Loader2 size={13} style={{animation:'spin 1s linear infinite',color:T.teal}}/> Analysing distribution data...
              </div>
            </div>
          )}
        </div>
        <div style={{borderTop:`1px solid ${T.border}`,padding:'12px 20px',display:'flex',gap:10,alignItems:'center',background:T.white}}>
          <input value={input} onChange={e=>setInput(e.target.value)} onKeyDown={e=>e.key==='Enter'&&send()} placeholder="Ask about distributors, SKUs, risks, or recommendations..." style={{flex:1,background:'transparent',border:'none',outline:'none',fontSize:13,color:T.navy,fontFamily:'inherit'}}/>
          <button onClick={send} disabled={loading||!input.trim()} style={{width:34,height:34,borderRadius:8,background:T.teal,border:'none',cursor:'pointer',display:'flex',alignItems:'center',justifyContent:'center',opacity:(!input.trim()||loading)?0.4:1,transition:'opacity 0.15s'}}>
            <Send size={14} style={{color:'#fff'}}/>
          </button>
        </div>
      </Card>
    </div>
  )
}

function IntegrationsView() {
  const integrations = [
    {name:'Unicommerce (Uniware)',     desc:'Order management, inventory sync, returns data',      status:'connected', eps:['GET /orders','GET /inventory-snapshot','GET /return','GET /products']},
    {name:'Amazon SP-API',             desc:'Product reviews, search analytics, BSR rankings',      status:'ready',     eps:['Product Reviews','Search Terms','Catalog Items']},
    {name:'Flipkart Seller API',       desc:'Order data, return reasons, search analytics',          status:'ready',     eps:['Orders','Returns','Listings']},
    {name:'Nykaa Brand Portal',        desc:'Category sales, review sentiment, competitor data',     status:'pending',   eps:['Sales Dashboard','Reviews','Analytics']},
    {name:'Distributor Mobile App',    desc:'Secondary sales logging from field distributors',       status:'connected', eps:['Daily Sell-Through','Retailer Log','Stock Count']},
    {name:'Google Trends API',         desc:'Ingredient and consumer concern trend signals',          status:'ready',     eps:['Interest Over Time','Regional Interest','Related Queries']},
  ]
  return (
    <div style={{display:'flex',flexDirection:'column',gap:18}}>
      <div>
        <h1 style={{fontSize:20,fontWeight:700,color:T.navy,fontFamily:'Georgia,serif',margin:0}}>Integrations</h1>
        <p style={{fontSize:13,color:T.textLight,margin:'4px 0 0'}}>Connect your existing tools to power the intelligence layer</p>
      </div>
      <div style={{display:'flex',flexDirection:'column',gap:10}}>
        {integrations.map(it=>(
          <Card key={it.name} style={{display:'flex',alignItems:'center',justifyContent:'space-between',gap:16,padding:'14px 20px'}}>
            <div style={{flex:1}}>
              <div style={{display:'flex',alignItems:'center',gap:10,marginBottom:4}}>
                <span style={{fontSize:13,fontWeight:600,color:T.navy}}>{it.name}</span>
                <span style={{fontSize:10,fontWeight:600,padding:'2px 8px',borderRadius:99,...(it.status==='connected'?{background:T.greenLight,color:T.greenText}:it.status==='ready'?{background:T.tealLight,color:T.tealDark}:{background:T.bgAlt,color:T.textLight})}}>{it.status==='connected'?'Connected':it.status==='ready'?'Ready to Connect':'Coming Soon'}</span>
              </div>
              <div style={{fontSize:11,color:T.textLight,marginBottom:8}}>{it.desc}</div>
              <div style={{display:'flex',gap:6,flexWrap:'wrap'}}>
                {it.eps.map(ep=><span key={ep} style={{fontSize:10,padding:'2px 8px',borderRadius:4,background:T.bg,border:`1px solid ${T.border}`,color:T.textLight,fontFamily:"'Courier New',monospace"}}>{ep}</span>)}
              </div>
            </div>
            <button style={{padding:'6px 16px',borderRadius:8,fontSize:12,fontWeight:500,cursor:'pointer',fontFamily:'inherit',...(it.status==='connected'?{background:T.greenLight,color:T.greenText,border:`1px solid ${T.green}20`}:{background:T.white,color:T.textLight,border:`1px solid ${T.border}`})}}>{it.status==='connected'?'Synced':'Connect'}</button>
          </Card>
        ))}
      </div>
    </div>
  )
}

// ─── ROOT ─────────────────────────────────────────────────────
export default function Dashboard() {
  const [view, setView]       = useState('dashboard')
  const criticalCount         = ALERTS.filter(a=>a.sev==='critical').length

  const nav = [
    {id:'dashboard',    label:'Overview',      icon:LayoutDashboard},
    {id:'distributors', label:'Distributors',  icon:Users},
    {id:'skus',         label:'SKU Intelligence', icon:ShoppingBag},
    {id:'alerts',       label:'Alerts',        icon:Bell, badge:criticalCount},
    {id:'ai',           label:'AI Insights',   icon:Brain},
    {id:'integrations', label:'Integrations',  icon:Settings},
  ]

  return (
    <div style={{display:'flex',height:'100vh',width:'100%',background:T.bg,fontFamily:"'DM Sans','Helvetica Neue',system-ui,sans-serif",color:T.text}}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&display=swap'); @keyframes spin{to{transform:rotate(360deg)}} *{box-sizing:border-box;}`}</style>

      <div style={{width:220,flexShrink:0,background:T.white,borderRight:`1px solid ${T.border}`,display:'flex',flexDirection:'column',overflowY:'auto'}}>
        <Logo/>
        <div style={{padding:'0 10px 8px'}}>
          <div style={{fontSize:10,color:T.textDim,fontWeight:600,textTransform:'uppercase',letterSpacing:'0.06em',padding:'4px 4px 6px'}}>Platform</div>
          {nav.map(n=><NavItem key={n.id} {...n} active={view===n.id} onClick={id=>setView(id)}/>)}
        </div>
        <div style={{marginTop:'auto',padding:12}}>
          <div style={{background:T.bg,border:`1px solid ${T.border}`,borderRadius:10,padding:'12px 14px'}}>
            <div style={{fontSize:10,color:T.textDim,fontWeight:600,textTransform:'uppercase',letterSpacing:'0.05em',marginBottom:4}}>Connected Brand</div>
            <div style={{fontSize:13,fontWeight:600,color:T.navy}}>Honasa Consumer</div>
            <div style={{fontSize:10,color:T.textLight,marginBottom:6}}>Mamaearth · Derma Co · Aqualogica</div>
            <div style={{display:'flex',alignItems:'center',gap:5}}>
              <span style={{width:6,height:6,borderRadius:'50%',background:T.green,display:'inline-block'}}/>
              <span style={{fontSize:10,color:T.green,fontWeight:500}}>Unicommerce synced</span>
            </div>
          </div>
        </div>
      </div>

      <div style={{flex:1,overflowY:'auto',padding:28}}>
        <div style={{maxWidth:1100,margin:'0 auto'}}>
          {view==='dashboard'    && <OverviewView/>}
          {view==='distributors' && <DistributorsView/>}
          {view==='skus'         && <SKUView/>}
          {view==='alerts'       && <AlertsView/>}
          {view==='ai'           && <AIView/>}
          {view==='integrations' && <IntegrationsView/>}
        </div>
      </div>
    </div>
  )
}
