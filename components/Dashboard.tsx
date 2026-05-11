'use client'

import React, { useState, useCallback } from 'react'
import Link from 'next/link'
import {
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell,
} from 'recharts'
import {
  AlertTriangle, TrendingUp, Package, Users, ShoppingBag, Brain,
  Settings, LayoutDashboard, Bell, ChevronRight, Search, Send, Loader2,
  ArrowUpRight, ArrowDownRight, Minus, Zap, ChevronLeft,
  Smartphone, CheckCircle, Clock, MessageCircle, Download,
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
interface AppStatus {
  id: string; name: string; region: string; city: string;
  appStatus: 'active' | 'inactive' | 'not_installed';
  compliance: number; lastLog: string; logsThisWeek: number; daysAgo: number;
}

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

const APP_STATUS: AppStatus[] = DIST.map((d, i) => {
  const rng = seededRng(i * 11 + 99)
  const appStatus: AppStatus['appStatus'] = i < 3 ? 'not_installed' : i < 7 ? 'inactive' : 'active'
  const compliance = appStatus === 'active' ? Math.floor(62 + rng() * 35) :
                     appStatus === 'inactive' ? Math.floor(8 + rng() * 22) : 0
  const daysAgo = appStatus === 'active' ? Math.floor(rng() * 2) :
                  appStatus === 'inactive' ? Math.floor(3 + rng() * 11) : 999
  const lastLog = daysAgo === 0 ? 'Today' : daysAgo === 1 ? 'Yesterday' : daysAgo >= 999 ? 'Never' : `${daysAgo}d ago`
  const logsThisWeek = appStatus === 'active' ? Math.floor(3 + rng() * 4) :
                       appStatus === 'inactive' ? Math.floor(rng() * 2) : 0
  return { id: d.id, name: d.name, region: d.region, city: d.city,
           appStatus, compliance, lastLog, logsThisWeek, daysAgo }
})

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
      if (!r.ok) {
        setMessages(p => [...p, { role: 'assistant', content: `API error: ${d.error ?? r.status}` }])
      } else {
        const txt = d.content?.filter((b: {type:string;text:string}) => b.type==='text').map((b: {type:string;text:string}) => b.text).join('\n') || 'Unable to generate insight.'
        setMessages(p => [...p, { role: 'assistant', content: txt }])
      }
    } catch (err) {
      setMessages(p => [...p, { role: 'assistant', content: `Network error: ${err instanceof Error ? err.message : 'unknown'}` }])
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

function PhoneShell({ children }: { children: React.ReactNode }) {
  return (
    <div style={{width:200,background:'#fff',borderRadius:32,border:'8px solid #1E293B',overflow:'hidden',boxShadow:'0 24px 64px rgba(0,0,0,0.22)',display:'flex',flexDirection:'column',flexShrink:0}}>
      <div style={{height:24,background:'#1E293B',display:'flex',alignItems:'center',justifyContent:'space-between',padding:'0 14px',flexShrink:0}}>
        <span style={{color:'#fff',fontSize:8,fontWeight:700}}>9:41</span>
        <div style={{width:36,height:5,background:'#374151',borderRadius:3}}/>
        <span style={{color:'#94A3B8',fontSize:8}}>●●●</span>
      </div>
      <div style={{flex:1,display:'flex',flexDirection:'column',overflow:'hidden'}}>{children}</div>
    </div>
  )
}

function MobileAppView() {
  const [activeScreen, setActiveScreen]         = useState(0)
  const [firstLogSubmitted, setFirstLogSubmitted] = useState(false)

  const active       = APP_STATUS.filter(d => d.appStatus === 'active').length
  const inactive     = APP_STATUS.filter(d => d.appStatus === 'inactive').length
  const notInstalled = APP_STATUS.filter(d => d.appStatus === 'not_installed').length
  const loggedToday  = APP_STATUS.filter(d => d.lastLog === 'Today').length
  const avgCompliance = Math.round(
    APP_STATUS.filter(d => d.appStatus === 'active').reduce((s, d) => s + d.compliance, 0) / active
  )

  const statusColor = (s: string) => s==='active'?T.green:s==='inactive'?T.amber:T.red
  const statusBg    = (s: string) => s==='active'?T.greenLight:s==='inactive'?T.amberLight:T.redLight
  const statusLabel = (s: string) => s==='active'?'Active':s==='inactive'?'Inactive':'Not Installed'

  return (
    <div style={{display:'flex',flexDirection:'column',gap:20}}>

      {/* Header */}
      <div>
        <h1 style={{fontSize:20,fontWeight:700,color:T.navy,fontFamily:'Georgia,serif',margin:0}}>Distributor Mobile App</h1>
        <p style={{fontSize:13,color:T.textLight,margin:'4px 0 0'}}>Complete user journey — from invite to daily contributor to brand intelligence</p>
      </div>

      {/* KPI row */}
      <div style={{display:'flex',gap:14}}>
        <MetricCard label="App Adoption" value={`${active+inactive}/30`} sub={`${notInstalled} distributors not yet onboarded`} color={(active+inactive)>=25?T.green:T.amber} icon={Smartphone}/>
        <MetricCard label="Logged Today" value={loggedToday} sub={`of ${active} active distributors`} color={loggedToday>=15?T.green:T.amber} icon={CheckCircle}/>
        <MetricCard label="Avg Compliance" value={`${avgCompliance}%`} sub="logs submitted in last 30 days" color={avgCompliance>=80?T.green:avgCompliance>=60?T.amber:T.red} icon={TrendingUp}/>
        <MetricCard label="Data Lag" value="< 4h" sub="avg time from log to dashboard" color={T.teal} icon={Clock}/>
      </div>

      {/* SECTION 1: JOURNEY MAP */}
      <Card>
        <div style={{fontSize:13,fontWeight:600,color:T.navy,marginBottom:2}}>Complete User Journey</div>
        <div style={{fontSize:11,color:T.textLight,marginBottom:20}}>From first invite to daily contributor — under 5 minutes to onboard, 60 seconds every day after</div>
        <div style={{display:'grid',gridTemplateColumns:'1fr 28px 1fr 28px 1fr 28px 1fr 28px 1fr',alignItems:'start',gap:0}}>
          {[
            {icon:'📲',label:'Invite',     desc:'Brand sends a WhatsApp magic link or QR code. No app store. Pre-authenticated.'},
            {icon:'🏁',label:'Onboard',    desc:'Distributor confirms their details and SKU catalogue. One-time setup, 5 minutes.'},
            {icon:'📝',label:'Daily Log',  desc:'Every evening: SKU, units sold, retailer. 3 fields, 60 seconds, works offline.'},
            {icon:'⚡',label:'Data Sync',  desc:'Multicommerce validates, cross-references Unicommerce, updates sell-through ratios.'},
            {icon:'📊',label:'Get Back',   desc:'Distributor unlocks their own analytics — territory ranking, SKU tips, reorder signals.'},
          ].map((stage,i,arr) => (
            <React.Fragment key={stage.label}>
              <div style={{display:'flex',flexDirection:'column',alignItems:'center',textAlign:'center',gap:8}}>
                <div style={{width:44,height:44,borderRadius:12,background:i<2?T.tealLight:i<4?T.bg:T.greenLight,border:`2px solid ${i<2?T.teal:i<4?T.border:T.green}`,display:'flex',alignItems:'center',justifyContent:'center',fontSize:20}}>{stage.icon}</div>
                <div style={{fontSize:12,fontWeight:700,color:i<2?T.teal:i<4?T.navy:T.green}}>{stage.label}</div>
                <div style={{fontSize:10,color:T.textLight,lineHeight:1.5}}>{stage.desc}</div>
              </div>
              {i < arr.length-1 && (
                <div style={{display:'flex',alignItems:'flex-start',justifyContent:'center',paddingTop:14}}>
                  <span style={{fontSize:16,color:T.border}}>→</span>
                </div>
              )}
            </React.Fragment>
          ))}
        </div>
      </Card>

      {/* SECTION 2: ONBOARDING CAROUSEL */}
      <Card>
        <div style={{fontSize:13,fontWeight:600,color:T.navy,marginBottom:2}}>Onboarding Flow — 5 Screens</div>
        <div style={{fontSize:11,color:T.textLight,marginBottom:16}}>Click through the exact experience a distributor sees when they tap the invite link for the first time</div>

        <div style={{display:'flex',gap:0,marginBottom:20,borderRadius:8,overflow:'hidden',border:`1px solid ${T.border}`}}>
          {['Invite','Welcome','Your SKUs','How It Works','First Log'].map((label,i) => (
            <button key={label} onClick={()=>{setActiveScreen(i); if(i!==4) setFirstLogSubmitted(false);}} style={{
              flex:1,padding:'7px 4px',fontSize:10,fontWeight:activeScreen===i?700:400,
              color:activeScreen===i?'#fff':T.textLight,
              background:activeScreen===i?T.teal:T.white,
              border:'none',borderRight:i<4?`1px solid ${T.border}`:'none',
              cursor:'pointer',transition:'all 0.15s',
            }}>{label}</button>
          ))}
        </div>

        <div style={{display:'flex',gap:28,alignItems:'flex-start'}}>
          <PhoneShell>
            {activeScreen===0 && (
              <>
                <div style={{background:'#075E54',padding:'8px 12px',display:'flex',alignItems:'center',gap:8,flexShrink:0}}>
                  <div style={{width:28,height:28,borderRadius:'50%',background:'#25D366',display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0,fontSize:13}}>🏷️</div>
                  <div>
                    <div style={{fontSize:10,fontWeight:700,color:'#fff'}}>Honasa Consumer</div>
                    <div style={{fontSize:8,color:'rgba(255,255,255,0.65)'}}>Brand Partner · online</div>
                  </div>
                </div>
                <div style={{flex:1,background:'#ECE5DD',padding:'10px 8px',display:'flex',flexDirection:'column',gap:8,overflowY:'auto'}}>
                  <div style={{background:'#fff',borderRadius:'0 8px 8px 8px',padding:'10px 10px',maxWidth:'92%',boxShadow:'0 1px 2px rgba(0,0,0,0.08)'}}>
                    <div style={{fontSize:8,color:'#075E54',fontWeight:700,marginBottom:4}}>Honasa Consumer 🏷️</div>
                    <div style={{fontSize:8,color:'#303030',lineHeight:1.55,marginBottom:8}}>Hi! You&apos;ve been invited to Multicommerce to track your sell-through and unlock your own analytics dashboard.<br/><br/>No app download needed. Takes 5 minutes.</div>
                    <div style={{background:T.teal,borderRadius:5,padding:'6px 10px',textAlign:'center'}}>
                      <div style={{fontSize:8,fontWeight:700,color:'#fff'}}>Open Multicommerce →</div>
                    </div>
                    <div style={{fontSize:7,color:'#8696A0',marginTop:4,textAlign:'right'}}>9:41 AM ✓✓</div>
                  </div>
                  <div style={{background:'rgba(255,255,255,0.6)',borderRadius:5,padding:'5px 8px',fontSize:7,color:'#8696A0',textAlign:'center'}}>No app download · Opens in browser · Pre-authenticated</div>
                </div>
              </>
            )}
            {activeScreen===1 && (
              <>
                <div style={{background:T.teal,padding:'8px 12px',flexShrink:0}}>
                  <div style={{fontSize:7,color:'rgba(255,255,255,0.65)',fontWeight:700,textTransform:'uppercase',letterSpacing:'0.08em',marginBottom:1}}>multicommerce · step 1 of 3</div>
                  <div style={{fontSize:12,fontWeight:700,color:'#fff'}}>Welcome 👋</div>
                </div>
                <div style={{flex:1,padding:'10px 12px',display:'flex',flexDirection:'column',gap:8,background:'#fff',overflowY:'auto'}}>
                  <div style={{padding:'5px 8px',background:T.greenLight,borderRadius:5,display:'flex',alignItems:'center',gap:5}}>
                    <CheckCircle size={10} style={{color:T.green,flexShrink:0}}/>
                    <span style={{fontSize:8,color:T.greenText,fontWeight:600}}>Invited by Honasa Consumer</span>
                  </div>
                  {[['Distributor','Sharma Distribution Co'],['City','Pune, Maharashtra'],['Territory','Pune West']].map(([label,val])=>(
                    <div key={label}>
                      <div style={{fontSize:7,color:T.textDim,marginBottom:2,fontWeight:600,textTransform:'uppercase',letterSpacing:'0.05em'}}>{label}</div>
                      <div style={{padding:'5px 8px',background:T.bg,border:`1px solid ${T.border}`,borderRadius:4,fontSize:9,color:T.navy}}>{val}</div>
                    </div>
                  ))}
                  <div style={{fontSize:7,color:T.textLight,lineHeight:1.4}}>Pre-filled by Honasa Consumer. Tap to edit if anything is wrong.</div>
                  <button style={{width:'100%',padding:'7px',background:T.teal,color:'#fff',border:'none',borderRadius:5,fontSize:9,fontWeight:700,cursor:'pointer',marginTop:'auto'}}>Confirm &amp; Continue →</button>
                </div>
              </>
            )}
            {activeScreen===2 && (
              <>
                <div style={{background:T.teal,padding:'8px 12px',flexShrink:0}}>
                  <div style={{fontSize:7,color:'rgba(255,255,255,0.65)',fontWeight:700,textTransform:'uppercase',letterSpacing:'0.08em',marginBottom:1}}>multicommerce · step 2 of 3</div>
                  <div style={{fontSize:12,fontWeight:700,color:'#fff'}}>Your Products</div>
                </div>
                <div style={{flex:1,padding:'10px 12px',display:'flex',flexDirection:'column',gap:6,background:'#fff',overflowY:'auto'}}>
                  <div style={{fontSize:8,color:T.textLight,lineHeight:1.4,marginBottom:2}}>Honasa Consumer pre-loaded the products you carry. Uncheck any you don&apos;t stock.</div>
                  {[{name:'Daily Glow SPF50',checked:true},{name:'Onion Hair Oil',checked:true},{name:'Vitamin C Face Wash',checked:true},{name:'Ubtan Face Wash',checked:true},{name:'Rosemary Hair Oil',checked:true},{name:'Niacinamide Serum',checked:false}].map(s=>(
                    <div key={s.name} style={{display:'flex',alignItems:'center',gap:7,padding:'5px 8px',background:s.checked?T.tealLight:T.bg,borderRadius:5,border:`1px solid ${s.checked?T.teal:T.border}`}}>
                      <div style={{width:13,height:13,borderRadius:3,background:s.checked?T.teal:'transparent',border:`1.5px solid ${s.checked?T.teal:T.border}`,flexShrink:0,display:'flex',alignItems:'center',justifyContent:'center'}}>
                        {s.checked && <span style={{color:'#fff',fontSize:8,fontWeight:900,lineHeight:1}}>✓</span>}
                      </div>
                      <span style={{fontSize:9,color:s.checked?T.tealDark:T.textLight,fontWeight:s.checked?500:400}}>{s.name}</span>
                    </div>
                  ))}
                  <button style={{width:'100%',padding:'7px',background:T.teal,color:'#fff',border:'none',borderRadius:5,fontSize:9,fontWeight:700,cursor:'pointer',marginTop:4}}>5 Products Confirmed →</button>
                </div>
              </>
            )}
            {activeScreen===3 && (
              <>
                <div style={{background:T.teal,padding:'8px 12px',flexShrink:0}}>
                  <div style={{fontSize:7,color:'rgba(255,255,255,0.65)',fontWeight:700,textTransform:'uppercase',letterSpacing:'0.08em',marginBottom:1}}>multicommerce · step 3 of 3</div>
                  <div style={{fontSize:12,fontWeight:700,color:'#fff'}}>How It Works</div>
                </div>
                <div style={{flex:1,padding:'10px 12px',display:'flex',flexDirection:'column',gap:8,background:'#fff',overflowY:'auto'}}>
                  {[
                    {icon:'🕕',title:'Every evening',   desc:'Log what you sold that day before you close up'},
                    {icon:'📝',title:'3 fields only',   desc:'SKU · Units sold · Retailer name or city'},
                    {icon:'⚡',title:'60 seconds',      desc:'Works offline — syncs when you have signal'},
                  ].map(step=>(
                    <div key={step.title} style={{display:'flex',gap:10,padding:'8px 10px',background:T.bg,borderRadius:7,alignItems:'flex-start'}}>
                      <span style={{fontSize:18,flexShrink:0,lineHeight:1}}>{step.icon}</span>
                      <div>
                        <div style={{fontSize:9,fontWeight:700,color:T.navy,marginBottom:2}}>{step.title}</div>
                        <div style={{fontSize:8,color:T.textLight,lineHeight:1.4}}>{step.desc}</div>
                      </div>
                    </div>
                  ))}
                  <div style={{padding:'8px 10px',background:T.amberLight,borderRadius:7,fontSize:8,color:T.amberText,fontWeight:600,lineHeight:1.4}}>🎁 In return you get your own analytics — no one else gives distributors this view</div>
                  <button style={{width:'100%',padding:'7px',background:T.teal,color:'#fff',border:'none',borderRadius:5,fontSize:9,fontWeight:700,cursor:'pointer',marginTop:'auto'}}>Do My First Log →</button>
                </div>
              </>
            )}
            {activeScreen===4 && !firstLogSubmitted && (
              <>
                <div style={{background:T.teal,padding:'8px 12px',display:'flex',justifyContent:'space-between',alignItems:'center',flexShrink:0}}>
                  <div>
                    <div style={{fontSize:7,color:'rgba(255,255,255,0.65)',fontWeight:700,textTransform:'uppercase',letterSpacing:'0.08em',marginBottom:1}}>multicommerce</div>
                    <div style={{fontSize:12,fontWeight:700,color:'#fff'}}>First Log 🎉</div>
                  </div>
                  <div style={{padding:'2px 7px',background:'rgba(255,255,255,0.2)',borderRadius:99,fontSize:7,color:'#fff',fontWeight:600}}>Today</div>
                </div>
                <div style={{flex:1,padding:'10px 12px',display:'flex',flexDirection:'column',gap:7,background:'#fff',overflowY:'auto'}}>
                  <div>
                    <div style={{fontSize:7,color:T.textDim,marginBottom:2,fontWeight:600,textTransform:'uppercase',letterSpacing:'0.05em'}}>SKU</div>
                    <div style={{padding:'5px 8px',border:`1px solid ${T.border}`,borderRadius:4,fontSize:9,color:T.navy,background:T.bg}}>Daily Glow Sunscreen SPF50 ▾</div>
                  </div>
                  <div>
                    <div style={{fontSize:7,color:T.textDim,marginBottom:2,fontWeight:600,textTransform:'uppercase',letterSpacing:'0.05em'}}>Units Sold Today</div>
                    <div style={{padding:'5px 8px',border:`1.5px solid ${T.teal}`,borderRadius:4,fontSize:11,color:T.navy,background:'#fff',fontWeight:700}}>148</div>
                  </div>
                  <div>
                    <div style={{fontSize:7,color:T.textDim,marginBottom:2,fontWeight:600,textTransform:'uppercase',letterSpacing:'0.05em'}}>Retailer / City</div>
                    <div style={{padding:'5px 8px',border:`1px solid ${T.border}`,borderRadius:4,fontSize:9,color:T.navy,background:T.bg}}>D-Mart, Malad West</div>
                  </div>
                  <div style={{fontSize:8,color:T.teal,fontWeight:600,cursor:'pointer'}}>+ Add another SKU</div>
                  <button onClick={()=>setFirstLogSubmitted(true)} style={{width:'100%',padding:'8px',background:T.teal,color:'#fff',border:'none',borderRadius:5,fontSize:9,fontWeight:700,cursor:'pointer',marginTop:'auto'}}>Submit My First Log ✓</button>
                  <div style={{fontSize:7,color:T.textDim,textAlign:'center',lineHeight:1.4}}>Your analytics unlock immediately after this</div>
                </div>
              </>
            )}
            {activeScreen===4 && firstLogSubmitted && (
              <div style={{flex:1,display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',padding:16,background:'#fff',gap:10,textAlign:'center'}}>
                <div style={{fontSize:40,lineHeight:1}}>✅</div>
                <div style={{fontSize:13,fontWeight:700,color:T.navy}}>Log Submitted!</div>
                <div style={{fontSize:9,color:T.textLight,lineHeight:1.5}}>You&apos;re officially part of Honasa Consumer&apos;s distribution intelligence network.</div>
                <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:7,width:'100%'}}>
                  <div style={{background:T.greenLight,borderRadius:7,padding:'8px',textAlign:'center'}}>
                    <div style={{fontSize:20,fontWeight:700,color:T.green,fontFamily:'Georgia,serif'}}>0.94</div>
                    <div style={{fontSize:7,color:T.greenText,marginTop:1}}>Sell-Through</div>
                  </div>
                  <div style={{background:T.tealLight,borderRadius:7,padding:'8px',textAlign:'center'}}>
                    <div style={{fontSize:20,fontWeight:700,color:T.teal,fontFamily:'Georgia,serif'}}>12d</div>
                    <div style={{fontSize:7,color:T.tealDark,marginTop:1}}>Inventory</div>
                  </div>
                </div>
                <div style={{padding:'7px 10px',background:T.greenLight,borderRadius:7,width:'100%'}}>
                  <div style={{fontSize:8,fontWeight:700,color:T.greenText,marginBottom:2}}>🏆 Top Performer</div>
                  <div style={{fontSize:7,color:T.greenText,lineHeight:1.4}}>Best sell-through in Maharashtra. Prioritised for SPF60 launch allocation.</div>
                </div>
                <button style={{width:'100%',padding:'7px',background:T.teal,color:'#fff',border:'none',borderRadius:5,fontSize:9,fontWeight:700,cursor:'pointer'}}>See My Analytics →</button>
              </div>
            )}
          </PhoneShell>

          <div style={{flex:1,display:'flex',flexDirection:'column',gap:12,paddingTop:4}}>
            {activeScreen===0 && (<>
              <div style={{fontSize:11,fontWeight:700,color:T.teal,textTransform:'uppercase',letterSpacing:'0.08em',marginBottom:2}}>Stage 1 — The Invite</div>
              <div style={{fontSize:15,fontWeight:700,color:T.navy,marginBottom:10,lineHeight:1.3}}>A single WhatsApp message. No app store. No login screen.</div>
              {[
                {title:'Magic link, pre-authenticated',   desc:'The link is unique to each distributor and logs them in automatically — no username or password.'},
                {title:'Works in the browser',            desc:'Opens as a Progressive Web App. Can be added to the home screen. No Play Store or App Store.'},
                {title:'Brand controls the invite',       desc:'Brand manager generates and sends the invite from the web dashboard in one click.'},
              ].map(item=>(<div key={item.title} style={{padding:'10px 12px',background:T.bg,borderRadius:8,borderLeft:`3px solid ${T.teal}`,marginBottom:8}}>
                <div style={{fontSize:12,fontWeight:600,color:T.navy,marginBottom:3}}>{item.title}</div>
                <div style={{fontSize:11,color:T.textLight,lineHeight:1.5}}>{item.desc}</div>
              </div>))}
            </>)}
            {activeScreen===1 && (<>
              <div style={{fontSize:11,fontWeight:700,color:T.teal,textTransform:'uppercase',letterSpacing:'0.08em',marginBottom:2}}>Stage 2a — Welcome</div>
              <div style={{fontSize:15,fontWeight:700,color:T.navy,marginBottom:10,lineHeight:1.3}}>Details pre-filled. One tap to confirm. Zero data entry.</div>
              {[
                {title:'Pre-populated from brand records', desc:"Name, city, and territory pulled from Unicommerce's distributor data — the brand already has this."},
                {title:'Editable if wrong',                desc:'Distributor can correct any field. Corrections flow back to the brand records automatically.'},
                {title:'One-time only',                   desc:'This screen appears once. Subsequent logins go straight to the daily log — no re-onboarding.'},
              ].map(item=>(<div key={item.title} style={{padding:'10px 12px',background:T.bg,borderRadius:8,borderLeft:`3px solid ${T.teal}`,marginBottom:8}}>
                <div style={{fontSize:12,fontWeight:600,color:T.navy,marginBottom:3}}>{item.title}</div>
                <div style={{fontSize:11,color:T.textLight,lineHeight:1.5}}>{item.desc}</div>
              </div>))}
            </>)}
            {activeScreen===2 && (<>
              <div style={{fontSize:11,fontWeight:700,color:T.teal,textTransform:'uppercase',letterSpacing:'0.08em',marginBottom:2}}>Stage 2b — SKU Catalogue</div>
              <div style={{fontSize:15,fontWeight:700,color:T.navy,marginBottom:10,lineHeight:1.3}}>Products pre-loaded. Distributor confirms what they stock.</div>
              {[
                {title:'Pulled from brand catalogue',     desc:"Honasa's full product list is in Multicommerce. Only this distributor's territory SKUs are shown."},
                {title:'Why this matters',                desc:'Confirming the catalogue upfront means the daily log only shows products this distributor actually sells — no irrelevant choices.'},
                {title:'First data quality gate',         desc:"A distributor can't log units for a product they don't carry. Prevents bad data at source."},
              ].map(item=>(<div key={item.title} style={{padding:'10px 12px',background:T.bg,borderRadius:8,borderLeft:`3px solid ${T.teal}`,marginBottom:8}}>
                <div style={{fontSize:12,fontWeight:600,color:T.navy,marginBottom:3}}>{item.title}</div>
                <div style={{fontSize:11,color:T.textLight,lineHeight:1.5}}>{item.desc}</div>
              </div>))}
            </>)}
            {activeScreen===3 && (<>
              <div style={{fontSize:11,fontWeight:700,color:T.teal,textTransform:'uppercase',letterSpacing:'0.08em',marginBottom:2}}>Stage 2c — Tutorial</div>
              <div style={{fontSize:15,fontWeight:700,color:T.navy,marginBottom:10,lineHeight:1.3}}>Sets the habit before the first log. 60 seconds of reading.</div>
              {[
                {title:'Sets expectations clearly',       desc:'Distributors know exactly what to do before they do it. 3 fields. Every evening. Offline works.'},
                {title:'Incentive is front and centre',   desc:'"In return, you get your own analytics." This drives adoption — not the brand mandate.'},
                {title:'One-time screen',                 desc:'After the tutorial, this screen never appears again. Returning users go straight to the log.'},
              ].map(item=>(<div key={item.title} style={{padding:'10px 12px',background:T.bg,borderRadius:8,borderLeft:`3px solid ${T.teal}`,marginBottom:8}}>
                <div style={{fontSize:12,fontWeight:600,color:T.navy,marginBottom:3}}>{item.title}</div>
                <div style={{fontSize:11,color:T.textLight,lineHeight:1.5}}>{item.desc}</div>
              </div>))}
            </>)}
            {activeScreen===4 && (<>
              <div style={{fontSize:11,fontWeight:700,color:firstLogSubmitted?T.green:T.teal,textTransform:'uppercase',letterSpacing:'0.08em',marginBottom:2}}>{firstLogSubmitted?'Onboarding Complete ✓':'Stage 3 — First Log'}</div>
              <div style={{fontSize:15,fontWeight:700,color:T.navy,marginBottom:10,lineHeight:1.3}}>{firstLogSubmitted?'Analytics unlock immediately. Data appears in the brand dashboard within 5 seconds.':'Three fields. Tap Submit. Done.'}</div>
              {(!firstLogSubmitted?[
                {title:'SKU picker (not freetext)',       desc:'Dropdown shows only confirmed products. No typos, no bad SKU names — clean data from the start.'},
                {title:'Units sold today',                desc:'One number. Combined with Unicommerce primary shipment data, this produces the sell-through ratio.'},
                {title:'Retailer / city',                 desc:'Tells the brand which retailers are moving stock. Optional — even without it, the ratio is calculable.'},
              ]:[
                {title:'Analytics unlock immediately',    desc:'The first log creates the baseline. Sell-through ratio, inventory days, and ranking are calculated instantly.'},
                {title:'Data in brand dashboard',         desc:"Within 5 seconds, this distributor's sell-through data is visible in Honasa Consumer's Multicommerce."},
                {title:'Retention loop starts here',      desc:'The distributor now has a reason to return every day — their analytics only stay fresh if they keep logging.'},
              ]).map(item=>(<div key={item.title} style={{padding:'10px 12px',background:firstLogSubmitted?T.greenLight:T.bg,borderRadius:8,borderLeft:`3px solid ${firstLogSubmitted?T.green:T.teal}`,marginBottom:8}}>
                <div style={{fontSize:12,fontWeight:600,color:T.navy,marginBottom:3}}>{item.title}</div>
                <div style={{fontSize:11,color:T.textLight,lineHeight:1.5}}>{item.desc}</div>
              </div>))}
            </>)}

            <div style={{display:'flex',alignItems:'center',gap:12,marginTop:'auto',paddingTop:8}}>
              <button onClick={()=>setActiveScreen(s=>Math.max(0,s-1))} disabled={activeScreen===0} style={{padding:'5px 16px',border:`1px solid ${T.border}`,borderRadius:6,background:T.white,color:activeScreen===0?T.textDim:T.navy,cursor:activeScreen===0?'default':'pointer',fontSize:12,fontWeight:500}}>← Prev</button>
              <div style={{display:'flex',gap:5}}>
                {[0,1,2,3,4].map(i=>(
                  <div key={i} onClick={()=>setActiveScreen(i)} style={{width:i===activeScreen?18:6,height:6,borderRadius:3,background:i===activeScreen?T.teal:T.border,cursor:'pointer',transition:'all 0.2s'}}/>
                ))}
              </div>
              <button onClick={()=>setActiveScreen(s=>Math.min(4,s+1))} disabled={activeScreen===4} style={{padding:'5px 16px',border:`1px solid ${T.border}`,borderRadius:6,background:activeScreen===4?T.white:T.teal,color:activeScreen===4?T.textDim:'#fff',cursor:activeScreen===4?'default':'pointer',fontSize:12,fontWeight:500}}>Next →</button>
              <span style={{fontSize:11,color:T.textDim,marginLeft:4}}>{activeScreen+1} / 5</span>
            </div>
          </div>
        </div>
      </Card>

      {/* SECTION 3: DAILY USAGE LOOP */}
      <Card>
        <div style={{fontSize:13,fontWeight:600,color:T.navy,marginBottom:2}}>Daily Usage Loop — What Happens Every Day After Onboarding</div>
        <div style={{fontSize:11,color:T.textLight,marginBottom:20}}>The recurring 60-second habit that keeps the intelligence engine running</div>
        <div style={{display:'grid',gridTemplateColumns:'1fr 24px 1fr 24px 1fr 24px 1fr 24px 1fr',gap:0,alignItems:'start',marginBottom:16}}>
          {[
            {icon:'📲',time:'6:00 PM',   label:'Reminder',       desc:"WhatsApp or push notification: \"Don't forget your daily log.\"",                color:T.amberLight, border:T.amber},
            {icon:'👆',time:'6:01 PM',   label:'Open App',       desc:'Tap the link. Opens instantly — no login, already authenticated.',                color:T.bg,         border:T.border},
            {icon:'✍️',time:'6:02 PM',   label:'Log Entries',    desc:'Select SKU, enter units, add retailer. Repeat for each product sold today.',     color:T.bg,         border:T.border},
            {icon:'✅',time:'6:03 PM',   label:'Submit',         desc:'"Synced ✓" if online. "Saved — syncing later" if offline.',                      color:T.tealLight,  border:T.teal},
            {icon:'🖥️',time:'< 30s',     label:'Dashboard Live', desc:"Brand's dashboard updates. Alert fires if any threshold crossed.",               color:T.greenLight, border:T.green},
          ].map((step,i,arr)=>(
            <React.Fragment key={step.label}>
              <div style={{display:'flex',flexDirection:'column',alignItems:'center',textAlign:'center',padding:'0 2px'}}>
                <div style={{width:44,height:44,borderRadius:12,background:step.color,border:`1.5px solid ${step.border}`,display:'flex',alignItems:'center',justifyContent:'center',fontSize:20,marginBottom:6}}>{step.icon}</div>
                <div style={{fontSize:9,fontWeight:700,color:T.textDim,textTransform:'uppercase',letterSpacing:'0.05em',marginBottom:2}}>{step.time}</div>
                <div style={{fontSize:11,fontWeight:700,color:T.navy,marginBottom:4}}>{step.label}</div>
                <div style={{fontSize:10,color:T.textLight,lineHeight:1.5}}>{step.desc}</div>
              </div>
              {i<arr.length-1 && <div style={{display:'flex',alignItems:'flex-start',justifyContent:'center',paddingTop:12}}><span style={{fontSize:14,color:T.border}}>→</span></div>}
            </React.Fragment>
          ))}
        </div>
        <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:10}}>
          <div style={{padding:'10px 14px',background:T.amberLight,borderRadius:8,borderLeft:`3px solid ${T.amber}`}}>
            <div style={{fontSize:11,fontWeight:700,color:T.amberText,marginBottom:4}}>📡 Offline scenario</div>
            <div style={{fontSize:11,color:T.amberText,lineHeight:1.5}}>No signal in the field? The log is saved locally. It syncs automatically next time the distributor has connectivity. The brand dashboard shows a "pending sync" indicator until the data arrives.</div>
          </div>
          <div style={{padding:'10px 14px',background:T.tealLight,borderRadius:8,borderLeft:`3px solid ${T.teal}`}}>
            <div style={{fontSize:11,fontWeight:700,color:T.tealDark,marginBottom:4}}>🔁 Multi-SKU in one session</div>
            <div style={{fontSize:11,color:T.tealDark,lineHeight:1.5}}>A distributor who sold 5 products taps "+ Add SKU" after each entry. All entries submit together. The app surfaces recently logged SKUs at the top to speed up repeat sessions.</div>
          </div>
        </div>
      </Card>

      {/* SECTION 4: DATA PIPELINE */}
      <Card>
        <div style={{fontSize:13,fontWeight:600,color:T.navy,marginBottom:2}}>Data Flow — Phone to Dashboard</div>
        <div style={{fontSize:11,color:T.textLight,marginBottom:20}}>Exact path a sell-through log takes from submission to brand intelligence — with timing and validation at each step</div>
        <div style={{display:'flex',gap:20}}>
          <div style={{display:'flex',flexDirection:'column',gap:0,flex:1}}>
            {[
              {t:'t = 0s',   color:T.teal,  icon:'📝', title:'Entry submitted on phone',           desc:'Log record created: SKU ID, units, retailer, distributor ID, timestamp, GPS if available.'},
              {t:'t = 0s',   color:T.amber, icon:'📡', title:'Online check',                       desc:'If connected → proceeds immediately. If offline → encrypted entry stored locally. Sync retried every 30 minutes automatically.'},
              {t:'t = 0–4h', color:T.navy,  icon:'☁️', title:'API receives log',                   desc:'Multicommerce API ingests the entry. Assigns a unique log ID. Deduplication check runs — prevents double-submission.'},
              {t:'t = +2s',  color:T.navy,  icon:'🔍', title:'Anomaly Validator runs',             desc:'Cross-references submitted quantity against Unicommerce primary data for this SKU and territory. Flags if secondary > primary (impossible — would mean selling stock never received).'},
              {t:'t = +3s',  color:T.green, icon:'✅', title:'Clean data → sell-through updated', desc:"Validated entry updates distributor's sell-through ratio. Dashboard ratios, risk scores, and inventory day estimates recalculate."},
              {t:'t = +3s',  color:T.amber, icon:'🚩', title:'Flagged data → held for review',    desc:"Anomalous entries quarantined — don't affect alerts or ratios until brand admin reviews. Distributor notified their log is under review."},
              {t:'t = +5s',  color:T.teal,  icon:'🖥️', title:'Brand dashboard refreshes',         desc:'Overview, Distributors, and SKU Intelligence views update in real-time. No manual refresh needed.'},
              {t:'t = +5s',  color:T.red,   icon:'🚨', title:'Alert fires if threshold crossed',  desc:'If this log pushes any distributor past a threshold (sell-through < 0.70 or inventory > 45 days), an alert is created and a notification dispatched.'},
            ].map((step,i,arr)=>(
              <div key={i} style={{display:'flex',gap:14}}>
                <div style={{display:'flex',flexDirection:'column',alignItems:'center',width:20,flexShrink:0}}>
                  <div style={{width:16,height:16,borderRadius:'50%',background:step.color,flexShrink:0,zIndex:1,marginTop:2}}/>
                  {i<arr.length-1 && <div style={{width:2,flex:1,background:T.border,minHeight:20,marginTop:2}}/>}
                </div>
                <div style={{paddingBottom:14,flex:1}}>
                  <div style={{display:'flex',alignItems:'center',gap:8,marginBottom:3}}>
                    <span style={{fontSize:13}}>{step.icon}</span>
                    <span style={{fontSize:11,fontWeight:700,color:T.navy}}>{step.title}</span>
                    <span style={{fontSize:9,fontWeight:600,color:step.color,padding:'1px 7px',borderRadius:99,background:step.color+'18',flexShrink:0}}>{step.t}</span>
                  </div>
                  <div style={{fontSize:11,color:T.textLight,lineHeight:1.55,paddingLeft:21}}>{step.desc}</div>
                </div>
              </div>
            ))}
          </div>
          <div style={{width:210,flexShrink:0,display:'flex',flexDirection:'column',gap:10}}>
            <div style={{padding:'12px 14px',background:T.navy,borderRadius:10}}>
              <div style={{fontSize:11,fontWeight:700,color:'#fff',marginBottom:6}}>Why the validator matters</div>
              <div style={{fontSize:10,color:T.textDim,lineHeight:1.55}}>Without cross-referencing Unicommerce primary data, a distributor could log more units sold than were ever shipped — inflating their ratio and hiding a real crisis.<br/><br/>The validator makes the data tamper-resistant without the distributor needing to understand why.</div>
            </div>
            <div style={{padding:'12px 14px',background:T.amberLight,borderRadius:10}}>
              <div style={{fontSize:11,fontWeight:700,color:T.amberText,marginBottom:6}}>Cold start (weeks 1–8)</div>
              <div style={{fontSize:10,color:T.amberText,lineHeight:1.55}}>Data accumulates and baselines form. AI alerts activate from Week 9 once enough history exists to distinguish signal from noise. Brands see raw tracking immediately — alerts come later.</div>
            </div>
          </div>
        </div>
      </Card>

      {/* SECTION 5: WHAT DISTRIBUTORS GET BACK */}
      <Card>
        <div style={{fontSize:13,fontWeight:600,color:T.navy,marginBottom:2}}>Why Distributors Keep Using It — The Retention Loop</div>
        <div style={{fontSize:11,color:T.textLight,marginBottom:16}}>The app stays valuable only if distributors keep logging. These four things make sure they do.</div>
        <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:12}}>
          {[
            {icon:'📊',title:'Their Own Analytics',   color:T.tealLight,  border:T.teal,  text:T.tealDark,  desc:"Sell-through ratio, inventory days, territory ranking. Before Multicommerce, distributors had zero visibility into their performance relative to peers.",                                  example:'"You\'re #2 in Maharashtra this month — up from #7 in November."'},
            {icon:'💡',title:'SKU-Level Tips',         color:T.amberLight, border:T.amber, text:T.amberText, desc:'Personalised recommendations based on their specific sell-through data. Not generic advice — calculated from actual numbers.',                                                             example:'"Onion Shampoo 600ml is moving slowly. Consider a 10% retailer push this week."'},
            {icon:'🚀',title:'Launch Priority',        color:T.greenLight, border:T.green, text:T.greenText, desc:'High-compliance distributors (>80% log rate) get first allocation on new product launches. Direct financial incentive — new launches are high-margin opportunities.',                    example:'"You qualify for first-batch SPF60 allocation. 23 other distributors don\'t."'},
            {icon:'📦',title:'Reorder Signal',         color:T.bg,         border:T.border,text:T.navy,      desc:'Based on daily sell-through velocity, the app predicts stock-out dates. Prevents running out of fast-moving products — the thing distributors hate most.',                               example:'"At current velocity, you\'ll stock out of Daily Glow SPF50 in ~6 days. Request a top-up."'},
          ].map(card=>(
            <div key={card.title} style={{background:card.color,border:`1.5px solid ${card.border}`,borderRadius:12,padding:16}}>
              <div style={{display:'flex',alignItems:'center',gap:8,marginBottom:8}}>
                <span style={{fontSize:22}}>{card.icon}</span>
                <div style={{fontSize:13,fontWeight:700,color:T.navy}}>{card.title}</div>
              </div>
              <div style={{fontSize:11,color:T.textLight,lineHeight:1.55,marginBottom:10}}>{card.desc}</div>
              <div style={{padding:'8px 10px',background:'rgba(255,255,255,0.55)',borderRadius:7,fontSize:10,color:card.text,fontStyle:'italic',lineHeight:1.5}}>{card.example}</div>
            </div>
          ))}
        </div>
      </Card>

      {/* Adoption tracker */}
      <Card style={{padding:0,overflow:'hidden'}}>
        <div style={{padding:'14px 20px 10px',borderBottom:`1px solid ${T.border}`,display:'flex',justifyContent:'space-between',alignItems:'center'}}>
          <div>
            <div style={{fontSize:13,fontWeight:600,color:T.navy}}>Adoption Status by Distributor</div>
            <div style={{fontSize:11,color:T.textLight,marginTop:2}}>
              <span style={{color:T.green,fontWeight:600}}>{active} active</span>{' · '}
              <span style={{color:T.amber,fontWeight:600}}>{inactive} inactive</span>{' · '}
              <span style={{color:T.red,fontWeight:600}}>{notInstalled} not installed</span>
            </div>
          </div>
          <button style={{padding:'5px 14px',background:T.amber,color:'#fff',border:'none',borderRadius:6,fontSize:11,fontWeight:600,cursor:'pointer',display:'flex',alignItems:'center',gap:5}}>
            <MessageCircle size={11}/> Nudge Inactive
          </button>
        </div>
        <div style={{display:'grid',gridTemplateColumns:'2fr 1fr 1fr 0.6fr 90px',padding:'8px 20px',background:T.bg,borderBottom:`1px solid ${T.border}`}}>
          {['Distributor','Status','Last Log','Logs/7d','Compliance'].map(h=>(
            <div key={h} style={{fontSize:10,fontWeight:600,color:T.textDim,textTransform:'uppercase',letterSpacing:'0.05em'}}>{h}</div>
          ))}
        </div>
        <div style={{maxHeight:280,overflowY:'auto'}}>
          {APP_STATUS.map(d=>(
            <div key={d.id} style={{display:'grid',gridTemplateColumns:'2fr 1fr 1fr 0.6fr 90px',padding:'9px 20px',borderBottom:`1px solid ${T.border}`,alignItems:'center'}}>
              <div>
                <div style={{fontSize:12,fontWeight:500,color:T.navy}}>{d.name}</div>
                <div style={{fontSize:10,color:T.textDim}}>{d.city}</div>
              </div>
              <div><span style={{fontSize:10,fontWeight:600,padding:'2px 7px',borderRadius:99,background:statusBg(d.appStatus),color:statusColor(d.appStatus)}}>{statusLabel(d.appStatus)}</span></div>
              <div style={{fontSize:11,color:d.appStatus==='not_installed'?T.textDim:d.lastLog==='Today'?T.green:T.text}}>{d.lastLog}</div>
              <div style={{fontSize:12,fontWeight:600,color:T.navy,textAlign:'center'}}>{d.logsThisWeek}</div>
              <div style={{display:'flex',alignItems:'center',gap:5}}>
                <div style={{flex:1,height:4,background:T.border,borderRadius:2}}>
                  <div style={{height:4,width:`${d.compliance}%`,background:d.compliance>=80?T.green:d.compliance>=50?T.amber:T.red,borderRadius:2}}/>
                </div>
                <span style={{fontSize:10,color:T.textDim,minWidth:24,textAlign:'right'}}>{d.compliance}%</span>
              </div>
            </div>
          ))}
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
    {id:'dashboard',    label:'Overview',         icon:LayoutDashboard},
    {id:'distributors', label:'Distributors',     icon:Users},
    {id:'skus',         label:'SKU Intelligence', icon:ShoppingBag},
    {id:'alerts',       label:'Alerts',           icon:Bell, badge:criticalCount},
    {id:'ai',           label:'AI Insights',      icon:Brain},
    {id:'mobileapp',    label:'Mobile App',       icon:Smartphone},
    {id:'integrations', label:'Integrations',     icon:Settings},
  ]

  return (
    <div style={{display:'flex',height:'100vh',width:'100%',background:T.bg,fontFamily:"'DM Sans','Helvetica Neue',system-ui,sans-serif",color:T.text}}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&display=swap'); @keyframes spin{to{transform:rotate(360deg)}} *{box-sizing:border-box;}`}</style>

      <div style={{width:220,flexShrink:0,background:T.white,borderRight:`1px solid ${T.border}`,display:'flex',flexDirection:'column',overflowY:'auto'}}>
        <Link href="/" style={{display:'flex',alignItems:'center',gap:5,padding:'12px 20px 0',fontSize:11,fontWeight:600,color:T.textDim,textDecoration:'none',letterSpacing:'0.01em'}}>
          ← Back to Pitch
        </Link>
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
          {view==='mobileapp'    && <MobileAppView/>}
          {view==='integrations' && <IntegrationsView/>}
        </div>
      </div>
    </div>
  )
}
