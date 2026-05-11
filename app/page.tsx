'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'

const CSS = `
  :root {
    --teal:       #0891B2;
    --teal-dark:  #065F73;
    --teal-light: #E0F7FA;
    --teal-mid:   #CCEEF5;
    --navy:       #1E293B;
    --text:       #334155;
    --light:      #64748B;
    --dim:        #94A3B8;
    --border:     #E2E8F0;
    --bg:         #F8FAFB;
    --white:      #FFFFFF;
    --red:        #DC2626;
    --red-light:  #FEE2E2;
    --amber:      #D97706;
    --amber-light:#FEF3C7;
    --green:      #059669;
    --green-light:#D1FAE5;
  }
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  html { scroll-behavior: smooth; }
  body {
    font-family: 'DM Sans', system-ui, sans-serif;
    color: var(--text);
    background: var(--white);
    line-height: 1.65;
    -webkit-font-smoothing: antialiased;
  }
  h1,h2,h3,h4 { font-family: 'Lora', Georgia, serif; color: var(--navy); line-height: 1.25; }
  nav {
    position: fixed; top: 0; left: 0; right: 0; z-index: 100;
    background: rgba(255,255,255,0.95);
    backdrop-filter: blur(12px);
    border-bottom: 1px solid var(--border);
    display: flex; align-items: center; justify-content: space-between;
    padding: 0 40px; height: 60px;
  }
  .nav-logo { display: flex; align-items: center; gap: 10px; text-decoration: none; }
  .nav-logo-mark {
    width: 32px; height: 32px; border-radius: 8px;
    background: var(--teal); display: flex; align-items: center; justify-content: center;
    font-family: 'Lora', serif; font-weight: 700; font-size: 16px; color: #fff;
  }
  .nav-logo-text { font-family: 'Lora', serif; font-weight: 700; font-size: 17px; color: var(--navy); }
  .nav-cta {
    background: var(--teal); color: #fff; padding: 8px 20px;
    border-radius: 8px; font-size: 13px; font-weight: 600;
    text-decoration: none; transition: background 0.2s;
    display: flex; align-items: center; gap: 6px;
  }
  .nav-cta:hover { background: var(--teal-dark); }
  .reveal { opacity: 0; transform: translateY(28px); transition: opacity 0.7s ease, transform 0.7s ease; }
  .reveal.visible { opacity: 1; transform: translateY(0); }
  .reveal-d1 { transition-delay: 0.1s; }
  .reveal-d2 { transition-delay: 0.2s; }
  .reveal-d3 { transition-delay: 0.3s; }
  .reveal-d4 { transition-delay: 0.4s; }
  section { padding: 100px 40px; max-width: 960px; margin: 0 auto; }
  .full-bleed { max-width: none; padding-left: 0; padding-right: 0; }
  #hero {
    min-height: 100vh; display: flex; flex-direction: column;
    justify-content: center; padding-top: 120px; padding-bottom: 80px;
    max-width: 960px; margin: 0 auto; padding-left: 40px; padding-right: 40px;
  }
  .hero-eyebrow { display: inline-flex; align-items: center; gap: 8px; font-size: 11px; font-weight: 600; color: var(--teal); text-transform: uppercase; letter-spacing: 0.1em; margin-bottom: 28px; }
  .hero-eyebrow-dot { width: 6px; height: 6px; border-radius: 50%; background: var(--teal); }
  .hero-number { font-family: 'Lora', serif; font-size: clamp(64px, 10vw, 108px); font-weight: 700; color: var(--red); line-height: 1; margin-bottom: 20px; letter-spacing: -2px; }
  .hero-title { font-family: 'Lora', serif; font-size: clamp(22px, 3.5vw, 34px); font-weight: 600; color: var(--navy); max-width: 640px; margin-bottom: 24px; line-height: 1.35; }
  .hero-sub { font-size: 16px; color: var(--light); max-width: 520px; line-height: 1.7; margin-bottom: 44px; }
  .hero-meta { display: flex; align-items: center; gap: 24px; padding-top: 28px; border-top: 1px solid var(--border); }
  .hero-meta-item { font-size: 12px; color: var(--dim); }
  .hero-meta-item strong { color: var(--navy); font-weight: 600; display: block; font-size: 14px; }
  .scroll-hint { margin-top: 48px; display: flex; align-items: center; gap: 8px; font-size: 11px; color: var(--dim); letter-spacing: 0.05em; }
  .scroll-arrow { animation: bounce 2s infinite; }
  @keyframes bounce { 0%,100%{transform:translateY(0)} 50%{transform:translateY(4px)} }
  .section-label { font-size: 10px; font-weight: 700; color: var(--teal); text-transform: uppercase; letter-spacing: 0.12em; margin-bottom: 14px; display: flex; align-items: center; gap: 8px; }
  .section-label::before { content:''; display:block; width:24px; height:2px; background:var(--teal); }
  .section-title { font-size: clamp(26px,3vw,38px); font-weight: 700; margin-bottom: 16px; }
  .section-sub { font-size: 15px; color: var(--light); max-width: 560px; line-height: 1.7; }
  .two-col { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-top: 40px; }
  .col-card { border-radius: 14px; padding: 28px; }
  .col-card.green { background: var(--green-light); }
  .col-card.red   { background: var(--red-light); }
  .col-card-title { font-size: 13px; font-weight: 700; margin-bottom: 16px; letter-spacing: 0.01em; }
  .col-card.green .col-card-title { color: #065F46; }
  .col-card.red   .col-card-title { color: var(--red); }
  .col-card ul { list-style: none; display: flex; flex-direction: column; gap: 10px; }
  .col-card ul li { font-size: 13px; color: var(--text); padding-left: 18px; position: relative; line-height: 1.5; }
  .col-card ul li::before { content: ''; position: absolute; left: 0; top: 7px; width: 6px; height: 6px; border-radius: 50%; }
  .col-card.green ul li::before { background: var(--green); }
  .col-card.red   ul li::before { background: var(--red); }
  .crisis-grid { display: grid; grid-template-columns: repeat(3,1fr); gap: 16px; margin-top: 44px; }
  .crisis-card { padding: 24px; border-radius: 12px; background: var(--bg); border: 1px solid var(--border); }
  .crisis-num { font-family:'Lora',serif; font-size: 32px; font-weight:700; color:var(--red); margin-bottom:6px; }
  .crisis-label { font-size: 12px; font-weight: 600; color: var(--navy); margin-bottom: 4px; }
  .crisis-desc { font-size: 11px; color: var(--light); line-height: 1.5; }
  .quote-stack { display: flex; flex-direction: column; gap: 16px; margin-top: 40px; }
  .quote-card { border-radius: 12px; padding: 24px 28px; border-left: 4px solid var(--teal); background: var(--bg); }
  .quote-card.highlight { background: var(--teal-light); border-color: var(--teal-dark); }
  .quote-text { font-size: 15px; font-weight: 600; color: var(--navy); font-style: italic; margin-bottom: 10px; line-height: 1.5; }
  .quote-context { font-size: 12px; color: var(--light); line-height: 1.6; margin-bottom: 8px; }
  .quote-source { font-size: 10px; font-weight: 700; color: var(--teal); text-transform: uppercase; letter-spacing: 0.08em; }
  .comp-table { width: 100%; border-collapse: collapse; margin-top: 40px; border-radius: 12px; overflow: hidden; border: 1px solid var(--border); }
  .comp-table th { background: var(--teal-light); color: var(--teal-dark); font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.06em; padding: 12px 16px; text-align: left; }
  .comp-table td { padding: 13px 16px; font-size: 12.5px; border-bottom: 1px solid var(--border); vertical-align: middle; }
  .comp-table tr:last-child td { border-bottom: none; }
  .comp-table tr.highlight-row td { background: var(--teal-light); font-weight: 600; }
  .tag { display: inline-block; padding: 2px 9px; border-radius: 99px; font-size: 10.5px; font-weight: 600; }
  .tag.red { background: var(--red-light); color: var(--red); }
  .tag.green { background: var(--green-light); color: #065F46; }
  .tag.amber { background: var(--amber-light); color: var(--amber); }
  .tag.teal { background: var(--teal-light); color: var(--teal-dark); }
  .feature-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-top: 40px; }
  .feature-card { border-radius: 14px; padding: 28px; border: 1px solid var(--border); background: var(--white); transition: box-shadow 0.2s, transform 0.2s; }
  .feature-card:hover { box-shadow: 0 8px 32px rgba(8,145,178,0.1); transform: translateY(-2px); }
  .feature-icon { width: 36px; height: 36px; border-radius: 10px; display: flex; align-items: center; justify-content: center; margin-bottom: 16px; font-size: 18px; }
  .feature-icon.teal   { background: var(--teal-light); }
  .feature-icon.amber  { background: var(--amber-light); }
  .feature-icon.green  { background: var(--green-light); }
  .feature-title { font-size: 15px; font-weight: 700; color: var(--navy); margin-bottom: 8px; }
  .feature-desc { font-size: 13px; color: var(--light); line-height: 1.6; }
  .flow-wrap { margin-top: 44px; }
  .flow-boxes { display: flex; align-items: center; gap: 0; margin-bottom: 24px; }
  .flow-box { flex: 1; border-radius: 12px; padding: 20px; border: 1.5px solid; }
  .flow-box.teal  { background: var(--teal-light); border-color: var(--teal); }
  .flow-box.navy  { background: var(--bg); border-color: var(--navy); }
  .flow-box-title { font-size: 12px; font-weight: 700; color: var(--navy); margin-bottom: 8px; }
  .flow-box.teal .flow-box-title { color: var(--teal-dark); }
  .flow-box-items { font-size: 11px; color: var(--light); line-height: 1.8; font-family: 'DM Mono', monospace; }
  .flow-arrow { font-size: 24px; color: var(--dim); padding: 0 12px; flex-shrink: 0; }
  .flow-new { border: 1.5px solid var(--amber); background: var(--amber-light); border-radius: 10px; padding: 14px 20px; margin-top: 12px; display: flex; align-items: flex-start; gap: 12px; }
  .flow-new-badge { background: var(--amber); color: #fff; font-size: 9px; font-weight: 700; padding: 2px 7px; border-radius: 99px; white-space: nowrap; margin-top: 2px; text-transform: uppercase; letter-spacing: 0.05em; }
  .flow-new-text { font-size: 12px; color: var(--amber); font-weight: 600; }
  .flow-new-sub { font-size: 11px; color: var(--light); margin-top: 2px; }
  .metrics-wrap { display: grid; grid-template-columns: 1fr 1fr; gap: 40px; margin-top: 40px; }
  .metric-group-title { font-size: 13px; font-weight: 700; color: var(--navy); margin-bottom: 16px; letter-spacing: 0.01em; }
  .metric-list { display: flex; flex-direction: column; gap: 10px; }
  .metric-row { display: flex; align-items: center; justify-content: space-between; padding: 10px 14px; background: var(--bg); border-radius: 8px; }
  .metric-name { font-size: 12px; color: var(--text); }
  .metric-val { font-size: 12px; font-weight: 700; color: var(--teal); font-family: 'DM Mono', monospace; }
  .pipeline-list { display: flex; flex-direction: column; gap: 10px; }
  .pipeline-item { display: flex; align-items: flex-start; gap: 12px; padding: 10px 14px; border-radius: 8px; background: var(--bg); }
  .pipeline-phase { font-size: 9px; font-weight: 700; color: #fff; padding: 2px 7px; border-radius: 99px; white-space: nowrap; margin-top: 1px; text-transform: uppercase; letter-spacing: 0.05em; }
  .pipeline-phase.p1 { background: var(--green); }
  .pipeline-phase.p2 { background: var(--teal); }
  .pipeline-phase.p3 { background: var(--amber); }
  .pipeline-text { font-size: 12px; color: var(--text); line-height: 1.5; }
  .slides-section { padding: 80px 40px; background: var(--bg); }
  .slides-inner { max-width: 960px; margin: 0 auto; }
  .slides-track-wrap { overflow: hidden; border-radius: 16px; margin-top: 36px; position: relative; }
  .slides-track { display: flex; transition: transform 0.45s cubic-bezier(.4,0,.2,1); }
  .slide-frame { min-width: 100%; border-radius: 16px; overflow: hidden; border: 1px solid var(--border); background: var(--white); box-shadow: 0 4px 24px rgba(0,0,0,0.06); }
  .slide-top-bar { height: 5px; background: var(--teal); }
  .slide-body { padding: 40px 48px; min-height: 380px; display: flex; flex-direction: column; }
  .slide-num { font-size: 10px; font-weight: 700; color: var(--dim); text-transform: uppercase; letter-spacing: 0.1em; margin-bottom: 20px; }
  .slide-h { font-family: 'Lora', serif; font-size: clamp(18px,2.5vw,26px); font-weight: 700; color: var(--navy); margin-bottom: 14px; line-height: 1.3; }
  .slide-sub { font-size: 13px; color: var(--light); margin-bottom: 24px; }
  .slide-content { flex: 1; }
  .slide-footer { font-size: 10px; color: var(--dim); margin-top: 24px; padding-top: 14px; border-top: 1px solid var(--border); }
  .slides-nav { display: flex; align-items: center; justify-content: center; gap: 16px; margin-top: 20px; }
  .slides-btn { width: 36px; height: 36px; border-radius: 50%; border: 1px solid var(--border); background: var(--white); cursor: pointer; font-size: 16px; color: var(--light); display: flex; align-items: center; justify-content: center; transition: all 0.15s; }
  .slides-btn:hover { background: var(--teal-light); color: var(--teal); border-color: var(--teal); }
  .slides-counter { font-size: 12px; color: var(--dim); font-family: 'DM Mono', monospace; min-width: 40px; text-align: center; }
  .slides-dots { display: flex; gap: 6px; align-items: center; }
  .slides-dot { width: 6px; height: 6px; border-radius: 50%; background: var(--border); cursor: pointer; transition: all 0.2s; }
  .slides-dot.active { background: var(--teal); width: 18px; border-radius: 3px; }
  .s-two { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
  .s-box { border-radius: 10px; padding: 16px; }
  .s-box.g { background: var(--green-light); }
  .s-box.r { background: var(--red-light); }
  .s-box.t { background: var(--teal-light); }
  .s-box.a { background: var(--amber-light); }
  .s-box-title { font-size: 11px; font-weight: 700; margin-bottom: 10px; }
  .s-box.g .s-box-title { color: #065F46; }
  .s-box.r .s-box-title { color: var(--red); }
  .s-box.t .s-box-title { color: var(--teal-dark); }
  .s-box.a .s-box-title { color: var(--amber); }
  .s-list { list-style: none; display: flex; flex-direction: column; gap: 6px; }
  .s-list li { font-size: 11px; color: var(--text); padding-left: 14px; position: relative; }
  .s-list li::before { content:'•'; position:absolute; left:0; }
  .s-stat-row { display: grid; grid-template-columns: repeat(4,1fr); gap: 10px; }
  .s-stat { border-radius: 10px; padding: 14px; text-align: center; }
  .s-stat.r { background: var(--red-light); }
  .s-stat.a { background: var(--amber-light); }
  .s-stat-n { font-family:'Lora',serif; font-size: 22px; font-weight: 700; }
  .s-stat.r .s-stat-n { color: var(--red); }
  .s-stat.a .s-stat-n { color: var(--amber); }
  .s-stat-l { font-size: 10px; color: var(--light); margin-top: 2px; }
  .s-quote { border-left: 3px solid var(--teal); padding: 12px 16px; background: var(--bg); border-radius: 0 8px 8px 0; margin-bottom: 10px; }
  .s-quote-t { font-size: 12px; font-style: italic; color: var(--navy); font-weight: 600; margin-bottom: 4px; }
  .s-quote-s { font-size: 10px; color: var(--teal); font-weight: 600; }
  .s-table { width: 100%; border-collapse: collapse; font-size: 11px; }
  .s-table th { background: var(--teal-light); color: var(--teal-dark); padding: 7px 10px; text-align: left; font-weight: 700; }
  .s-table td { padding: 7px 10px; border-bottom: 1px solid var(--border); color: var(--text); }
  .s-table tr:last-child td { border: none; font-weight: 700; }
  .s-table tr:last-child td:first-child { color: var(--teal); }
  .s-flow { display: flex; align-items: center; gap: 6px; margin-bottom: 16px; }
  .s-flow-box { flex:1; border-radius:8px; padding: 10px 12px; border: 1px solid; }
  .s-flow-box.t { background: var(--teal-light); border-color: var(--teal); }
  .s-flow-box.n { background: var(--bg); border-color: var(--navy); }
  .s-flow-box-t { font-size: 10px; font-weight: 700; color: var(--navy); margin-bottom: 3px; }
  .s-flow-box.t .s-flow-box-t { color: var(--teal-dark); }
  .s-flow-box-sub { font-size: 9px; color: var(--light); font-family:'DM Mono',monospace; line-height: 1.5; }
  .s-path-grid { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 10px; }
  .s-path { border-radius: 10px; padding: 14px; }
  .s-path.g { background: var(--green-light); }
  .s-path.n { background: var(--bg); border: 1px solid var(--border); }
  .s-path.a { background: var(--amber-light); }
  .s-path-letter { font-family:'Lora',serif; font-size: 22px; font-weight: 700; margin-bottom: 4px; }
  .s-path.g .s-path-letter { color: var(--green); }
  .s-path.n .s-path-letter { color: var(--navy); }
  .s-path.a .s-path-letter { color: var(--amber); }
  .s-path-title { font-size: 12px; font-weight: 700; color: var(--navy); margin-bottom: 4px; }
  .s-path-desc { font-size: 10.5px; color: var(--light); line-height: 1.5; }
  .s-ask-row { display: flex; align-items: center; gap: 12px; padding: 12px 16px; background: var(--bg); border-radius: 8px; margin-bottom: 8px; }
  .s-ask-num { font-family:'Lora',serif; font-size: 22px; font-weight: 700; color: var(--teal); min-width: 28px; }
  .s-ask-text { font-size: 12px; color: var(--navy); font-weight: 500; }
  .proto-section { background: var(--navy); padding: 100px 40px; text-align: center; }
  .proto-inner { max-width: 680px; margin: 0 auto; }
  .proto-label { font-size: 10px; font-weight: 700; color: var(--teal); text-transform: uppercase; letter-spacing: 0.12em; margin-bottom: 20px; }
  .proto-title { font-family: 'Lora', serif; font-size: clamp(28px,4vw,44px); font-weight: 700; color: #fff; margin-bottom: 20px; line-height: 1.25; }
  .proto-sub { font-size: 15px; color: #94A3B8; margin-bottom: 44px; line-height: 1.7; max-width: 480px; margin-left: auto; margin-right: auto; }
  .proto-features { display: grid; grid-template-columns: repeat(3,1fr); gap: 16px; margin-bottom: 44px; }
  .proto-feat { background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); border-radius: 10px; padding: 16px; }
  .proto-feat-icon { font-size: 20px; margin-bottom: 8px; }
  .proto-feat-title { font-size: 12px; font-weight: 600; color: #fff; margin-bottom: 4px; }
  .proto-feat-desc { font-size: 11px; color: #64748B; line-height: 1.5; }
  .proto-btn { display: inline-flex; align-items: center; gap: 10px; background: var(--teal); color: #fff; padding: 16px 36px; border-radius: 10px; font-size: 15px; font-weight: 700; text-decoration: none; transition: all 0.2s; letter-spacing: 0.01em; }
  .proto-btn:hover { background: var(--teal-dark); transform: translateY(-2px); box-shadow: 0 12px 32px rgba(8,145,178,0.35); }
  .proto-btn-arrow { font-size: 18px; transition: transform 0.2s; }
  .proto-btn:hover .proto-btn-arrow { transform: translateX(4px); }
  .proto-note { margin-top: 20px; font-size: 11px; color: #475569; }
  .ask-section { padding: 100px 40px; max-width: 960px; margin: 0 auto; text-align: center; }
  .ask-cards { display: flex; gap: 16px; justify-content: center; margin: 40px 0; }
  .ask-card { flex: 1; max-width: 260px; border-radius: 14px; padding: 24px; border: 1px solid var(--border); background: var(--white); }
  .ask-num { font-family: 'Lora', serif; font-size: 36px; font-weight: 700; color: var(--teal); margin-bottom: 10px; }
  .ask-text { font-size: 13px; color: var(--text); line-height: 1.6; }
  .ask-final { font-family: 'Lora', serif; font-size: 20px; color: var(--navy); font-style: italic; margin-top: 40px; }
  .ask-cta { display: inline-flex; align-items: center; gap: 8px; margin-top: 28px; background: var(--teal); color: #fff; padding: 14px 32px; border-radius: 8px; font-size: 14px; font-weight: 600; text-decoration: none; transition: all 0.2s; }
  .ask-cta:hover { background: var(--teal-dark); }
  footer { border-top: 1px solid var(--border); padding: 28px 40px; display: flex; align-items: center; justify-content: space-between; font-size: 11px; color: var(--dim); }
  footer strong { color: var(--navy); }
  @media (max-width: 700px) {
    section { padding: 70px 20px; }
    nav { padding: 0 20px; }
    .two-col,.feature-grid,.crisis-grid,.metrics-wrap,.s-two,.s-stat-row,.s-path-grid,.proto-features { grid-template-columns: 1fr; }
    .flow-boxes { flex-direction: column; }
    .flow-arrow { transform: rotate(90deg); }
    .ask-cards { flex-direction: column; align-items: center; }
    .slides-section { padding: 60px 20px; }
    .slide-body { padding: 28px; }
    .comp-table { font-size: 11px; }
    .comp-table th,.comp-table td { padding: 8px 10px; }
  }
`

const TOTAL = 13

export default function PitchPage() {
  const [slide, setSlide] = useState(0)
  const startXRef = useRef(0)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => entries.forEach(e => { if(e.isIntersecting) e.target.classList.add('visible') }),
      { threshold: 0.12 }
    )
    document.querySelectorAll('.reveal').forEach(el => observer.observe(el))
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if(e.key === 'ArrowLeft')  setSlide(c => Math.max(0, c-1))
      if(e.key === 'ArrowRight') setSlide(c => Math.min(TOTAL-1, c+1))
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [])

  const [isMobile, setIsMobile] = useState(false)
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768)
    check()
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])

  const goTo = (n: number) => setSlide(Math.max(0, Math.min(TOTAL-1, n)))

  return (
    <>
      <style>{CSS}</style>

      {isMobile && (
        <div style={{position:'fixed',inset:0,zIndex:9999,background:'#1E293B',display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',padding:'40px 28px',textAlign:'center'}}>
          <div style={{width:48,height:48,borderRadius:12,background:'#0891B2',display:'flex',alignItems:'center',justifyContent:'center',marginBottom:24}}>
            <span style={{color:'#fff',fontWeight:800,fontSize:22,fontFamily:'Georgia,serif'}}>m</span>
          </div>
          <div style={{fontFamily:'Georgia,serif',fontSize:22,fontWeight:700,color:'#fff',marginBottom:12,lineHeight:1.3}}>Best experienced on a laptop</div>
          <div style={{fontSize:14,color:'#94A3B8',lineHeight:1.7,marginBottom:32,maxWidth:300}}>The Multicommerce pitch and prototype are designed for desktop. Please open this link on your laptop or computer for the full experience.</div>
          <div style={{background:'rgba(255,255,255,0.06)',border:'1px solid rgba(255,255,255,0.12)',borderRadius:10,padding:'12px 20px',marginBottom:12,width:'100%',maxWidth:320}}>
            <div style={{fontSize:10,color:'#64748B',fontWeight:600,textTransform:'uppercase',letterSpacing:'0.08em',marginBottom:6}}>Copy this link</div>
            <div style={{fontSize:13,color:'#E2E8F0',fontFamily:'monospace',wordBreak:'break-all',lineHeight:1.5}}>multicommerce-pitch.vercel.app</div>
          </div>
          <div style={{fontSize:12,color:'#475569'}}>Open on Chrome, Safari, or any desktop browser</div>
        </div>
      )}

      {/* NAV */}
      <nav>
        <a className="nav-logo" href="#hero">
          <div className="nav-logo-mark">m</div>
          <span className="nav-logo-text">multicommerce</span>
        </a>
        <Link href="/prototype" className="nav-cta">See Live Prototype <span>→</span></Link>
      </nav>

      {/* HERO */}
      <div id="hero">
        <div className="hero-eyebrow reveal"><span className="hero-eyebrow-dot"></span>A Pitch for Unicommerce</div>
        <div className="hero-number reveal reveal-d1">₹300 Cr</div>
        <h1 className="hero-title reveal reveal-d2">Lost by one of your clients — because your platform couldn&apos;t see past the warehouse door.</h1>
        <p className="hero-sub reveal reveal-d3">This is not a criticism. Unicommerce solved the hardest part of D2C operations brilliantly. But the moment a product leaves your warehouse and hits a distributor, visibility goes to zero. That blind spot is where ₹300 Crore disappeared.</p>
        <div className="hero-meta reveal reveal-d4">
          <div className="hero-meta-item"><strong>Honasa Consumer</strong>Mamaearth · Derma Co · Aqualogica</div>
          <div className="hero-meta-item"><strong>Q2 FY25</strong>First post-IPO loss</div>
          <div className="hero-meta-item"><strong>200+ distributors</strong>Damaged relationships</div>
          <div className="hero-meta-item"><strong>₹19 Crore</strong>Net loss in one quarter</div>
        </div>
        <div className="scroll-hint reveal"><span className="scroll-arrow">↓</span> Scroll to see the full picture</div>
      </div>

      {/* THE BLIND SPOT */}
      <section>
        <div className="section-label reveal">The Problem</div>
        <h2 className="section-title reveal">Unicommerce&apos;s Blind Spot</h2>
        <p className="section-sub reveal">99.99% visibility inside the warehouse. 0% outside it.</p>
        <div className="two-col">
          <div className="col-card green reveal">
            <div className="col-card-title">✓ What Unicommerce tracks</div>
            <ul>
              <li>Orders across 350+ marketplace integrations</li>
              <li>Real-time inventory across 10,300+ warehouses</li>
              <li>Fulfillment, dispatch, and returns</li>
              <li>E-invoicing and compliance</li>
              <li>99.99% order fulfillment accuracy</li>
            </ul>
          </div>
          <div className="col-card red reveal reveal-d2">
            <div className="col-card-title">✗ What disappears after shipment</div>
            <ul>
              <li>Is the distributor selling to retail?</li>
              <li>Days of stock sitting at each distributor?</li>
              <li>Which SKUs are stuck in which territory?</li>
              <li>Is the brand overshipping vs. actual demand?</li>
              <li>When does this inventory buildup become a crisis?</li>
            </ul>
          </div>
        </div>
      </section>

      {/* THE CRISIS */}
      <section style={{paddingTop:0}}>
        <div className="section-label reveal">What Happened</div>
        <h2 className="section-title reveal">The Mamaearth Crisis — In Your Blind Spot</h2>
        <p className="section-sub reveal">Primary sales grew every quarter inside Unicommerce — it looked like success. Distributors were accumulating 90 days of unsold stock. Nobody saw it until it was too late.</p>
        <div className="crisis-grid">
          <div className="crisis-card reveal"><div className="crisis-num">₹300 Cr</div><div className="crisis-label">Distributor inventory burden</div><div className="crisis-desc">200+ distributors holding unsellable stock across Maharashtra, Gujarat, and beyond</div></div>
          <div className="crisis-card reveal reveal-d1"><div className="crisis-num">₹19 Cr</div><div className="crisis-label">Net loss — Q2 FY25</div><div className="crisis-desc">Honasa&apos;s first post-IPO loss. Revenue dropped 7% to ₹462 Crore in a single quarter</div></div>
          <div className="crisis-card reveal reveal-d2"><div className="crisis-num">₹100 Cr+</div><div className="crisis-label">Stock returned from distributors</div><div className="crisis-desc">Products absorbed back, near-expiry write-offs, damaged distributor trust — across two quarters</div></div>
          <div className="crisis-card reveal reveal-d3"><div className="crisis-num">₹5,000 Cr</div><div className="crisis-label">Market cap eroded</div><div className="crisis-desc">Stock crashed from ₹440 to ₹260 as the scale of the distribution failure became public</div></div>
          <div className="crisis-card reveal reveal-d4"><div className="crisis-num">90 days</div><div className="crisis-label">Distributor inventory days</div><div className="crisis-desc">Standard is 30 days. The buildup crossed 3× before anyone inside Honasa or Unicommerce noticed</div></div>
          <div className="crisis-card reveal"><div className="crisis-num">0%</div><div className="crisis-label">Visibility into the cause</div><div className="crisis-desc">No system tracked distributor sell-through. The crisis was invisible in every dashboard they had</div></div>
        </div>
      </section>

      {/* WHY NOW */}
      <section>
        <div className="section-label reveal">Why This Matters to You</div>
        <h2 className="section-title reveal">In Your Own Words, Kapil</h2>
        <p className="section-sub reveal">Three things you said publicly in the last 6 months — and what they mean for this conversation.</p>
        <div className="quote-stack">
          <div className="quote-card reveal">
            <div className="quote-text">&ldquo;Every layer of complexity strengthens our relevance.&rdquo;</div>
            <div className="quote-context">D2C brands now manage 8-12 channels vs. 3-4 five years ago. Offline distribution is the fastest-growing channel — and it has zero intelligence layer in Unicommerce today. That&apos;s the next layer of complexity your clients need you to solve.</div>
            <div className="quote-source">Q4 FY26 Earnings Call</div>
          </div>
          <div className="quote-card reveal reveal-d1">
            <div className="quote-text">&ldquo;AI enables brands to reduce revenue leakage while improving customer experience.&rdquo;</div>
            <div className="quote-context">You launched Catalyst for abandoned cart recovery. That&apos;s smart. But the biggest leakage — ₹300 Crore at one client — happens in offline distribution where you have no product. Catalyst solves the last mile to the customer. This solves the last mile to the retailer.</div>
            <div className="quote-source">Catalyst Launch, January 2026</div>
          </div>
          <div className="quote-card highlight reveal reveal-d2">
            <div className="quote-text">&ldquo;We will look to acquire businesses with strong AI elements at reasonable valuations.&rdquo;</div>
            <div className="quote-context">You acquired Shipway for last-mile intelligence — extending Unicommerce forward toward the customer. Multicommerce extends Unicommerce forward toward the retail shelf via distributors. Same strategic logic. The precedent is already set. The next acquisition writes itself.</div>
            <div className="quote-source">Q4 FY26 Earnings Call</div>
          </div>
        </div>
      </section>

      {/* MARKET GAP */}
      <section style={{paddingTop:0}}>
        <div className="section-label reveal">The Opportunity</div>
        <h2 className="section-title reveal">The Gap Nobody Fills</h2>
        <p className="section-sub reveal">Enterprise DMS tools serve HUL and ITC. Unicommerce serves D2C brands. Nobody serves D2C brands going offline.</p>
        <table className="comp-table reveal">
          <thead>
            <tr>
              <th>Solution</th><th>For Whom</th><th>Distributor Tracking</th><th>AI Intelligence</th><th>Annual Cost</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><strong>Bizom / FieldAssist</strong></td>
              <td>HUL, ITC, Dabur<br/><small style={{color:'var(--dim)'}}>5,000+ distributors</small></td>
              <td><span className="tag green">Yes — full DMS</span></td>
              <td><span className="tag amber">Basic</span></td>
              <td><span className="tag red">₹20L – ₹2Cr</span></td>
            </tr>
            <tr>
              <td><strong>Unicommerce</strong></td>
              <td>D2C brands<br/><small style={{color:'var(--dim)'}}>200-500 distributors</small></td>
              <td><span className="tag red">None</span></td>
              <td><span className="tag red">None</span></td>
              <td><span className="tag green">₹2-6L</span></td>
            </tr>
            <tr className="highlight-row">
              <td><strong style={{color:'var(--teal)'}}>Multicommerce</strong></td>
              <td>D2C brands<br/><small>Purpose-built</small></td>
              <td><span className="tag teal">Yes — AI-first</span></td>
              <td><span className="tag teal">Full intelligence layer</span></td>
              <td><span className="tag green">₹3-5L</span></td>
            </tr>
          </tbody>
        </table>
        <div className="quote-card reveal" style={{marginTop:'20px',background:'var(--amber-light)',borderColor:'var(--amber)'}}>
          <div className="quote-text" style={{color:'var(--amber)'}}>Cost of inaction</div>
          <div className="quote-context">EasyEcom or Vinculum builds this first → your clients get distribution intelligence elsewhere → switching costs weaken → churn rises. The window to own this category is 18-24 months.</div>
        </div>
      </section>

      {/* INTRODUCING */}
      <section>
        <div className="section-label reveal">The Solution</div>
        <h2 className="section-title reveal">Introducing Multicommerce</h2>
        <p className="section-sub reveal">Extends Unicommerce&apos;s visibility from warehouse to retail shelf. Not a replacement — the missing layer that makes your platform complete.</p>
        <div className="feature-grid">
          <div className="feature-card reveal"><div className="feature-icon teal">📊</div><div className="feature-title">Sell-Through Monitor</div><div className="feature-desc">Primary vs. secondary sales ratio per distributor, per SKU, per geography. The single metric that would have caught the ₹300 Crore crisis at ₹30 Crore.</div></div>
          <div className="feature-card reveal reveal-d1"><div className="feature-icon amber">🎯</div><div className="feature-title">AI Alert Engine</div><div className="feature-desc">Auto-triggers when any distributor crosses 45-day inventory threshold or sell-through drops below 0.70. Specific actions, not generic dashboards.</div></div>
          <div className="feature-card reveal reveal-d2"><div className="feature-icon green">📦</div><div className="feature-title">SKU Intelligence</div><div className="feature-desc">Which products are moving at retail vs. stuck at distributors. Dead stock detection before expiry. Territory vs. product-specific issue identification.</div></div>
          <div className="feature-card reveal reveal-d3"><div className="feature-icon teal">🧠</div><div className="feature-title">Predictive AI Chat</div><div className="feature-desc">Natural language queries across your distribution network. &ldquo;Which 5 distributors need attention this week?&rdquo; Get data-backed answers instantly.</div></div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section style={{paddingTop:0}}>
        <div className="section-label reveal">Architecture</div>
        <h2 className="section-title reveal">Zero Changes to Unicommerce Core</h2>
        <p className="section-sub reveal">Multicommerce reads from Unicommerce&apos;s existing REST APIs. No backend changes. No new infrastructure for your team. One new data source — the distributor mobile app.</p>
        <div className="flow-wrap reveal">
          <div className="flow-boxes">
            <div className="flow-box teal"><div className="flow-box-title">Unicommerce APIs</div><div className="flow-box-items">GET /orders<br/>GET /inventory-snapshot<br/>GET /return<br/>GET /products</div></div>
            <div className="flow-arrow">→</div>
            <div className="flow-box navy"><div className="flow-box-title">Multicommerce Engine</div><div className="flow-box-items">Sell-through calculation<br/>Anomaly detection<br/>AI alert generation<br/>Demand signal analysis</div></div>
            <div className="flow-arrow">→</div>
            <div className="flow-box teal"><div className="flow-box-title">Brand Dashboard</div><div className="flow-box-items">Health overview<br/>Distributor drill-down<br/>SKU intelligence<br/>AI insights chat</div></div>
          </div>
          <div className="flow-new reveal">
            <span className="flow-new-badge">New</span>
            <div>
              <div className="flow-new-text">Distributor Mobile App — the missing data source</div>
              <div className="flow-new-sub">Daily sell-through logging from field distributors. 3 fields: SKU · Quantity · Retailer. Dead simple. Brand mandates it. Distributor gets their own analytics in return.</div>
            </div>
          </div>
        </div>
      </section>

      {/* METRICS & PIPELINE */}
      <section>
        <div className="section-label reveal">What&apos;s Built & What&apos;s Next</div>
        <h2 className="section-title reveal">MVP Today — Intelligence Platform Tomorrow</h2>
        <p className="section-sub reveal">Phase 1 is live. The data foundation it builds enables Phases 2 and 3 to become dramatically more powerful.</p>
        <div className="metrics-wrap">
          <div className="reveal">
            <div className="metric-group-title">Success Metrics — Phase 1</div>
            <div className="metric-list">
              <div className="metric-row"><span className="metric-name">Distributor inventory days (target)</span><span className="metric-val">≤30d</span></div>
              <div className="metric-row"><span className="metric-name">Sell-through ratio (healthy threshold)</span><span className="metric-val">≥0.80</span></div>
              <div className="metric-row"><span className="metric-name">Crisis alert lead time vs. no system</span><span className="metric-val">6-8 weeks earlier</span></div>
              <div className="metric-row"><span className="metric-name">Overall RTO rate target (BPC)</span><span className="metric-val">≤12%</span></div>
              <div className="metric-row"><span className="metric-name">System loss per 10,000 units</span><span className="metric-val">≤3.7%</span></div>
              <div className="metric-row"><span className="metric-name">RTO repackage recovery rate</span><span className="metric-val">≥75%</span></div>
            </div>
          </div>
          <div className="reveal reveal-d2">
            <div className="metric-group-title">Build Pipeline</div>
            <div className="pipeline-list">
              <div className="pipeline-item"><span className="pipeline-phase p1">Live</span><div className="pipeline-text">Distributor sell-through tracker · AI alert engine · SKU intelligence · Brand dashboard · Unicommerce API integration</div></div>
              <div className="pipeline-item"><span className="pipeline-phase p2">Phase 2</span><div className="pipeline-text">Demand forecasting on secondary sales data · Inter-warehouse redistribution recommendations · COD risk scoring model</div></div>
              <div className="pipeline-item"><span className="pipeline-phase p3">Phase 3</span><div className="pipeline-text">NPD decision engine · Launch confidence scores · Cannibalisation analysis · TAM estimation from first-party data</div></div>
            </div>
          </div>
        </div>
      </section>

      {/* SLIDES CAROUSEL */}
      <div className="slides-section">
        <div className="slides-inner">
          <div className="section-label reveal" style={{marginBottom:'8px'}}>Full Pitch Deck</div>
          <h2 className="section-title reveal">The Complete Case</h2>
          <p className="section-sub reveal">13 slides. The problem, the market gap, the product, the integration, the revenue opportunity, and the ask — all in one place.</p>
          <div className="slides-track-wrap reveal">
            <div
              className="slides-track"
              style={{transform:`translateX(-${slide * 100}%)`}}
              onTouchStart={(e) => { startXRef.current = e.touches[0].clientX }}
              onTouchEnd={(e) => {
                const diff = startXRef.current - e.changedTouches[0].clientX
                if(Math.abs(diff) > 50) goTo(slide + (diff > 0 ? 1 : -1))
              }}
            >
              {/* SLIDE 1 */}
              <div className="slide-frame">
                <div className="slide-top-bar"></div>
                <div className="slide-body">
                  <div className="slide-num">01 / 13</div>
                  <div className="slide-h">₹300 Crore. Lost by one of your clients — because of a problem Unicommerce doesn&apos;t track today.</div>
                  <div className="slide-sub">This isn&apos;t a Mamaearth problem. It&apos;s a visibility gap that affects every brand scaling offline through your platform.</div>
                  <div className="slide-content" style={{display:'flex',flexDirection:'column',justifyContent:'flex-end'}}>
                    <div style={{padding:'16px',background:'var(--bg)',borderRadius:'8px',borderLeft:'3px solid var(--teal)'}}>
                      <div style={{fontSize:'13px',fontWeight:700,color:'var(--teal)',marginBottom:'4px'}}>multicommerce</div>
                      <div style={{fontSize:'11px',color:'var(--light)'}}>Sell-Through Intelligence Layer · Confidential · May 2026</div>
                    </div>
                  </div>
                </div>
                <div className="slide-footer">Multicommerce · Confidential · May 2026</div>
              </div>

              {/* SLIDE 2 */}
              <div className="slide-frame">
                <div className="slide-top-bar"></div>
                <div className="slide-body">
                  <div className="slide-num">02 / 13</div>
                  <div className="slide-h">The Blind Spot</div>
                  <div className="slide-sub">99.99% visibility inside the warehouse. 0% after shipment.</div>
                  <div className="slide-content">
                    <div className="s-two">
                      <div className="s-box g"><div className="s-box-title">✓ What Unicommerce Sees</div><ul className="s-list"><li>Orders from all channels</li><li>Real-time inventory (9 warehouses)</li><li>Fulfillment &amp; dispatch</li><li>Returns processing</li><li>99.99% accuracy</li></ul></div>
                      <div className="s-box r"><div className="s-box-title">✗ What Disappears</div><ul className="s-list"><li>Distributor sell-through?</li><li>Days of stock per distributor?</li><li>Which SKUs are stuck?</li><li>Brand overshipping?</li><li>When does this become a crisis?</li></ul></div>
                    </div>
                  </div>
                </div>
                <div className="slide-footer">Multicommerce · Confidential · May 2026</div>
              </div>

              {/* SLIDE 3 */}
              <div className="slide-frame">
                <div className="slide-top-bar"></div>
                <div className="slide-body">
                  <div className="slide-num">03 / 13</div>
                  <div className="slide-h">The Mamaearth Crisis — Inside Your Blind Spot</div>
                  <div className="slide-sub">Primary sales grew inside Unicommerce. Secondary sales were collapsing. Nobody noticed.</div>
                  <div className="slide-content">
                    <div className="s-stat-row">
                      <div className="s-stat r"><div className="s-stat-n">₹300Cr</div><div className="s-stat-l">Distributor burden</div></div>
                      <div className="s-stat r"><div className="s-stat-n">₹19Cr</div><div className="s-stat-l">Net loss Q2 FY25</div></div>
                      <div className="s-stat a"><div className="s-stat-n">90 days</div><div className="s-stat-l">Inventory held</div></div>
                      <div className="s-stat r"><div className="s-stat-n">200+</div><div className="s-stat-l">Distributors hit</div></div>
                    </div>
                  </div>
                </div>
                <div className="slide-footer">Source: AICPDF, Business Standard, Honasa Q2 FY25 Earnings</div>
              </div>

              {/* SLIDE 4 */}
              <div className="slide-frame">
                <div className="slide-top-bar"></div>
                <div className="slide-body">
                  <div className="slide-num">04 / 13</div>
                  <div className="slide-h">Why Now — In Your Own Words</div>
                  <div className="slide-sub">Three things Kapil Makhija said in the last 6 months.</div>
                  <div className="slide-content">
                    <div className="s-quote"><div className="s-quote-t">&ldquo;Every layer of complexity strengthens our relevance.&rdquo;</div><div className="s-quote-s">Q4 FY26 Earnings Call</div></div>
                    <div className="s-quote"><div className="s-quote-t">&ldquo;AI enables brands to reduce revenue leakage while improving customer experience.&rdquo;</div><div className="s-quote-s">Catalyst Launch, Jan 2026</div></div>
                    <div className="s-quote" style={{background:'var(--teal-light)',borderColor:'var(--teal)'}}><div className="s-quote-t">&ldquo;We will look to acquire businesses with strong AI elements at reasonable valuations.&rdquo;</div><div className="s-quote-s">Q4 FY26 Earnings Call</div></div>
                  </div>
                </div>
                <div className="slide-footer">Multicommerce · Confidential · May 2026</div>
              </div>

              {/* SLIDE 5 */}
              <div className="slide-frame">
                <div className="slide-top-bar"></div>
                <div className="slide-body">
                  <div className="slide-num">05 / 13</div>
                  <div className="slide-h">The Gap Nobody Fills</div>
                  <div className="slide-sub">Your 7,500+ clients sit between enterprise DMS (too expensive) and nothing (what Unicommerce offers today).</div>
                  <div className="slide-content">
                    <table className="s-table">
                      <thead><tr><th>Solution</th><th>Dist. Tracking</th><th>AI Layer</th><th>Cost</th></tr></thead>
                      <tbody>
                        <tr><td>Bizom / FieldAssist</td><td style={{color:'var(--green)'}}>Yes</td><td style={{color:'var(--amber)'}}>Basic</td><td style={{color:'var(--red)'}}>₹20L-2Cr/yr</td></tr>
                        <tr><td>Unicommerce</td><td style={{color:'var(--red)',fontWeight:700}}>None</td><td style={{color:'var(--red)',fontWeight:700}}>None</td><td style={{color:'var(--green)'}}>₹2-6L/yr</td></tr>
                        <tr><td>Multicommerce</td><td style={{color:'var(--teal)',fontWeight:700}}>Yes — AI-first</td><td style={{color:'var(--teal)',fontWeight:700}}>Full layer</td><td style={{color:'var(--green)'}}>₹3-5L/yr</td></tr>
                      </tbody>
                    </table>
                  </div>
                </div>
                <div className="slide-footer">Multicommerce · Confidential · May 2026</div>
              </div>

              {/* SLIDE 6 */}
              <div className="slide-frame">
                <div className="slide-top-bar"></div>
                <div className="slide-body">
                  <div className="slide-num">06 / 13</div>
                  <div className="slide-h">Introducing Multicommerce</div>
                  <div className="slide-sub">Extends Unicommerce from warehouse to retail shelf. Not a replacement — the missing layer.</div>
                  <div className="slide-content">
                    <div className="s-two">
                      <div className="s-box t"><div className="s-box-title">📊 Sell-Through Monitor</div><div style={{fontSize:'11px',color:'var(--teal-dark)'}}>Primary vs. secondary ratio per distributor, SKU, geography. One number that catches crises early.</div></div>
                      <div className="s-box a"><div className="s-box-title">🎯 AI Alert Engine</div><div style={{fontSize:'11px',color:'var(--amber)'}}>Auto-triggers at 45-day inventory threshold. Specific recommendations, not generic alerts.</div></div>
                    </div>
                    <div className="s-two" style={{marginTop:'10px'}}>
                      <div className="s-box g"><div className="s-box-title">📦 SKU Intelligence</div><div style={{fontSize:'11px',color:'#065F46'}}>Dead stock detection before expiry. Territory vs. product issue diagnosis.</div></div>
                      <div className="s-box t"><div className="s-box-title">🧠 Predictive AI Chat</div><div style={{fontSize:'11px',color:'var(--teal-dark)'}}>Ask anything. Get data-backed answers about your entire distributor network instantly.</div></div>
                    </div>
                  </div>
                </div>
                <div className="slide-footer">Multicommerce · Confidential · May 2026</div>
              </div>

              {/* SLIDE 7 */}
              <div className="slide-frame">
                <div className="slide-top-bar"></div>
                <div className="slide-body">
                  <div className="slide-num">07 / 13</div>
                  <div className="slide-h">Zero Changes to Unicommerce Core</div>
                  <div className="slide-sub">Reads from existing Unicommerce REST APIs. One new data source added.</div>
                  <div className="slide-content">
                    <div className="s-flow">
                      <div className="s-flow-box t"><div className="s-flow-box-t">Unicommerce APIs</div><div className="s-flow-box-sub">GET /orders<br/>GET /inventory<br/>GET /return</div></div>
                      <span style={{fontSize:'20px',color:'var(--dim)',padding:'0 6px'}}>→</span>
                      <div className="s-flow-box n"><div className="s-flow-box-t">Multicommerce Engine</div><div className="s-flow-box-sub">Sell-through calc<br/>AI alerts<br/>Anomaly detect</div></div>
                      <span style={{fontSize:'20px',color:'var(--dim)',padding:'0 6px'}}>→</span>
                      <div className="s-flow-box t"><div className="s-flow-box-t">Brand Dashboard</div><div className="s-flow-box-sub">Health · Alerts<br/>SKU Intel · AI</div></div>
                    </div>
                    <div style={{background:'var(--amber-light)',borderRadius:'8px',padding:'12px 16px',border:'1px solid var(--amber)',fontSize:'11px',color:'var(--amber)',fontWeight:600}}>
                      NEW → Distributor Mobile App: daily sell-through logs. 3 fields. Dead simple. The missing data source.
                    </div>
                    <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:'8px',marginTop:'12px'}}>
                      <div style={{background:'var(--bg)',borderRadius:'6px',padding:'8px',fontSize:'10px',textAlign:'center',color:'var(--text)'}}>No backend<br/>changes</div>
                      <div style={{background:'var(--bg)',borderRadius:'6px',padding:'8px',fontSize:'10px',textAlign:'center',color:'var(--text)'}}>White-label<br/>ready</div>
                      <div style={{background:'var(--bg)',borderRadius:'6px',padding:'8px',fontSize:'10px',textAlign:'center',color:'var(--text)'}}>Claude AI<br/>powered</div>
                      <div style={{background:'var(--bg)',borderRadius:'6px',padding:'8px',fontSize:'10px',textAlign:'center',color:'var(--text)'}}>OMS-<br/>agnostic</div>
                    </div>
                  </div>
                </div>
                <div className="slide-footer">Multicommerce · Confidential · May 2026</div>
              </div>

              {/* SLIDE 8 */}
              <div className="slide-frame">
                <div className="slide-top-bar"></div>
                <div className="slide-body">
                  <div className="slide-num">08 / 13 — Prototype</div>
                  <div className="slide-h">Working Prototype — Overview Dashboard</div>
                  <div className="slide-sub">The screen that would have caught the ₹300Cr crisis 6 months earlier.</div>
                  <div className="slide-content" style={{background:'var(--bg)',borderRadius:'10px',padding:'16px',border:'1px solid var(--border)'}}>
                    <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:'8px',marginBottom:'12px'}}>
                      <div style={{background:'var(--white)',border:'1px solid var(--border)',borderRadius:'8px',padding:'10px'}}><div style={{fontSize:'8px',color:'var(--dim)',textTransform:'uppercase',letterSpacing:'0.05em'}}>Sell-Through</div><div style={{fontFamily:"'Lora',serif",fontSize:'20px',fontWeight:700,color:'var(--amber)'}}>0.78</div></div>
                      <div style={{background:'var(--white)',border:'1px solid var(--border)',borderRadius:'8px',padding:'10px'}}><div style={{fontSize:'8px',color:'var(--dim)',textTransform:'uppercase',letterSpacing:'0.05em'}}>Critical</div><div style={{fontFamily:"'Lora',serif",fontSize:'20px',fontWeight:700,color:'var(--red)'}}>4</div></div>
                      <div style={{background:'var(--white)',border:'1px solid var(--border)',borderRadius:'8px',padding:'10px'}}><div style={{fontSize:'8px',color:'var(--dim)',textTransform:'uppercase',letterSpacing:'0.05em'}}>Avg Days</div><div style={{fontFamily:"'Lora',serif",fontSize:'20px',fontWeight:700,color:'var(--amber)'}}>34d</div></div>
                      <div style={{background:'var(--white)',border:'1px solid var(--border)',borderRadius:'8px',padding:'10px'}}><div style={{fontSize:'8px',color:'var(--dim)',textTransform:'uppercase',letterSpacing:'0.05em'}}>Distributors</div><div style={{fontFamily:"'Lora',serif",fontSize:'20px',fontWeight:700,color:'var(--teal)'}}>30</div></div>
                    </div>
                    <div style={{background:'var(--white)',border:'1px solid var(--border)',borderRadius:'8px',padding:'12px'}}>
                      <div style={{fontSize:'9px',color:'var(--dim)',marginBottom:'8px'}}>Primary vs Secondary Sales — the widening gap is the crisis</div>
                      <div style={{position:'relative',height:'48px'}}>
                        <svg width="100%" height="48" viewBox="0 0 400 48" preserveAspectRatio="none">
                          <polyline points="0,38 80,32 160,26 240,18 320,22 400,28" fill="none" stroke="#DC2626" strokeWidth="2"/>
                          <polyline points="0,40 80,40 160,42 240,44 320,46 400,42" fill="none" stroke="#0891B2" strokeWidth="2"/>
                        </svg>
                      </div>
                      <div style={{display:'flex',gap:'16px',marginTop:'6px'}}>
                        <div style={{display:'flex',alignItems:'center',gap:'4px',fontSize:'9px',color:'var(--red)'}}><span style={{width:'16px',height:'2px',background:'var(--red)',display:'inline-block'}}></span>Primary (shipped — looks like growth)</div>
                        <div style={{display:'flex',alignItems:'center',gap:'4px',fontSize:'9px',color:'var(--teal)'}}><span style={{width:'16px',height:'2px',background:'var(--teal)',display:'inline-block'}}></span>Secondary (sold at retail — the truth)</div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="slide-footer">Live prototype available at the link shared · Built with real Mamaearth data</div>
              </div>

              {/* SLIDE 9 */}
              <div className="slide-frame">
                <div className="slide-top-bar"></div>
                <div className="slide-body">
                  <div className="slide-num">09 / 13 — Prototype</div>
                  <div className="slide-h">Distributor Drill-Down &amp; AI Engine</div>
                  <div className="slide-sub">Every distributor ranked by risk. Ask anything in plain language.</div>
                  <div className="slide-content">
                    <div className="s-two">
                      <div style={{background:'var(--bg)',border:'1px solid var(--border)',borderRadius:'10px',padding:'12px'}}>
                        <div style={{fontSize:'10px',fontWeight:700,color:'var(--navy)',marginBottom:'8px'}}>Distributor Health</div>
                        <div style={{fontSize:'10px',display:'flex',flexDirection:'column',gap:'4px'}}>
                          <div style={{display:'grid',gridTemplateColumns:'2fr 1fr 1fr 1fr',gap:'4px',padding:'5px 6px',background:'var(--red-light)',borderRadius:'4px'}}><span style={{color:'var(--navy)',fontWeight:600}}>Sharma, Pune</span><span style={{color:'var(--red)',fontWeight:700}}>0.38</span><span style={{color:'var(--red)'}}>78d</span><span style={{color:'var(--red)',fontWeight:600}}>Critical</span></div>
                          <div style={{display:'grid',gridTemplateColumns:'2fr 1fr 1fr 1fr',gap:'4px',padding:'5px 6px',background:'var(--red-light)',borderRadius:'4px'}}><span style={{color:'var(--navy)',fontWeight:600}}>Patel, Ahmedabad</span><span style={{color:'var(--red)',fontWeight:700}}>0.52</span><span style={{color:'var(--red)'}}>65d</span><span style={{color:'var(--red)',fontWeight:600}}>Critical</span></div>
                          <div style={{display:'grid',gridTemplateColumns:'2fr 1fr 1fr 1fr',gap:'4px',padding:'5px 6px',background:'var(--amber-light)',borderRadius:'4px'}}><span style={{color:'var(--navy)'}}>Singh, Delhi</span><span style={{color:'var(--amber)',fontWeight:700}}>0.61</span><span style={{color:'var(--amber)'}}>42d</span><span style={{color:'var(--amber)'}}>At Risk</span></div>
                          <div style={{display:'grid',gridTemplateColumns:'2fr 1fr 1fr 1fr',gap:'4px',padding:'5px 6px',background:'var(--white)',borderRadius:'4px'}}><span style={{color:'var(--navy)'}}>Joshi, Mumbai</span><span style={{color:'var(--green)',fontWeight:700}}>0.94</span><span style={{color:'var(--green)'}}>12d</span><span style={{color:'var(--green)'}}>Healthy</span></div>
                          <div style={{display:'grid',gridTemplateColumns:'2fr 1fr 1fr 1fr',gap:'4px',padding:'5px 6px',background:'var(--white)',borderRadius:'4px'}}><span style={{color:'var(--navy)'}}>Nair, Chennai</span><span style={{color:'var(--green)',fontWeight:700}}>0.88</span><span style={{color:'var(--green)'}}>18d</span><span style={{color:'var(--green)'}}>Healthy</span></div>
                        </div>
                      </div>
                      <div style={{background:'var(--bg)',border:'1px solid var(--border)',borderRadius:'10px',padding:'12px',display:'flex',flexDirection:'column',gap:'8px'}}>
                        <div style={{fontSize:'10px',fontWeight:700,color:'var(--navy)'}}>🧠 AI Insights Engine</div>
                        <div style={{background:'var(--teal-light)',borderRadius:'6px',padding:'8px',fontSize:'10px',color:'var(--teal-dark)',fontStyle:'italic'}}>&ldquo;Which distributors need attention?&rdquo;</div>
                        <div style={{background:'var(--white)',border:'1px solid var(--border)',borderRadius:'6px',padding:'8px',fontSize:'9.5px',color:'var(--text)',lineHeight:1.5}}>Sharma Distribution in Pune is critical — 78 days inventory at 0.38 sell-through. Recommend pausing next shipment. Patel Enterprises is next at 65 days...</div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="slide-footer">Live prototype · Ask anything · Powered by Claude AI</div>
              </div>

              {/* SLIDE 10 */}
              <div className="slide-frame">
                <div className="slide-top-bar"></div>
                <div className="slide-body">
                  <div className="slide-num">10 / 13</div>
                  <div className="slide-h">We&apos;ve Thought Through the Hard Parts</div>
                  <div className="slide-sub">Four real challenges — and how they&apos;re solved.</div>
                  <div className="slide-content" style={{display:'flex',flexDirection:'column',gap:'8px'}}>
                    <div style={{display:'flex',gap:'12px',padding:'10px 14px',background:'var(--bg)',borderRadius:'8px',borderLeft:'3px solid var(--red)'}}><div style={{minWidth:'100px',fontSize:'10.5px',fontWeight:700,color:'var(--red)'}}>Distributor Adoption</div><div style={{fontSize:'10.5px',color:'var(--light)'}}>3-field app. Brand mandates it. Distributor gets their own analytics in return.</div></div>
                    <div style={{display:'flex',gap:'12px',padding:'10px 14px',background:'var(--bg)',borderRadius:'8px',borderLeft:'3px solid var(--red)'}}><div style={{minWidth:'100px',fontSize:'10.5px',fontWeight:700,color:'var(--red)'}}>Data Gaming</div><div style={{fontSize:'10.5px',color:'var(--light)'}}>Triangulate with Unicommerce shipment data + marketplace regional sales. AI flags anomalies.</div></div>
                    <div style={{display:'flex',gap:'12px',padding:'10px 14px',background:'var(--bg)',borderRadius:'8px',borderLeft:'3px solid var(--red)'}}><div style={{minWidth:'100px',fontSize:'10.5px',fontWeight:700,color:'var(--red)'}}>Cold Start (90d)</div><div style={{fontSize:'10.5px',color:'var(--light)'}}>Seed from Unicommerce primary data. Raw tracking weeks 1-8. AI alerts from week 9. Free pilot.</div></div>
                    <div style={{display:'flex',gap:'12px',padding:'10px 14px',background:'var(--teal-light)',borderRadius:'8px',borderLeft:'3px solid var(--teal)'}}><div style={{minWidth:'100px',fontSize:'10.5px',fontWeight:700,color:'var(--teal)'}}>&ldquo;Not Our Core&rdquo;</div><div style={{fontSize:'10.5px',color:'var(--teal-dark)'}}>Exactly. Acquire, don&apos;t build. Clients need it. Competitors will offer it. 18 months to build in-house.</div></div>
                  </div>
                </div>
                <div className="slide-footer">Multicommerce · Confidential · May 2026</div>
              </div>

              {/* SLIDE 11 */}
              <div className="slide-frame">
                <div className="slide-top-bar"></div>
                <div className="slide-body">
                  <div className="slide-num">11 / 13</div>
                  <div className="slide-h">Revenue Opportunity</div>
                  <div className="slide-sub">₹15 Crore ARR in Year 1. ₹108 Crore by Year 3. Against Unicommerce&apos;s current ₹204 Crore revenue.</div>
                  <div className="slide-content">
                    <div className="s-two">
                      <div style={{display:'flex',flexDirection:'column',gap:'8px'}}>
                        <div style={{background:'var(--bg)',borderRadius:'8px',padding:'10px 14px',display:'flex',justifyContent:'space-between'}}><span style={{fontSize:'11px',color:'var(--navy)',fontWeight:600}}>Year 1 (500 clients)</span><span style={{fontSize:'11px',color:'var(--teal)',fontWeight:700,fontFamily:"'DM Mono',monospace"}}>₹15 Cr ARR</span></div>
                        <div style={{background:'var(--bg)',borderRadius:'8px',padding:'10px 14px',display:'flex',justifyContent:'space-between'}}><span style={{fontSize:'11px',color:'var(--navy)',fontWeight:600}}>Year 2 (1,500 clients)</span><span style={{fontSize:'11px',color:'var(--teal)',fontWeight:700,fontFamily:"'DM Mono',monospace"}}>₹45 Cr ARR</span></div>
                        <div style={{background:'var(--teal-light)',borderRadius:'8px',padding:'10px 14px',display:'flex',justifyContent:'space-between'}}><span style={{fontSize:'11px',color:'var(--teal-dark)',fontWeight:700}}>Year 3 (3,000 clients)</span><span style={{fontSize:'11px',color:'var(--teal-dark)',fontWeight:700,fontFamily:"'DM Mono',monospace"}}>₹108 Cr ARR</span></div>
                      </div>
                      <div style={{display:'flex',flexDirection:'column',gap:'6px'}}>
                        <div style={{display:'flex',justifyContent:'space-between',fontSize:'11px',padding:'6px 0',borderBottom:'1px solid var(--border)'}}><span style={{color:'var(--navy)',fontWeight:600}}>Your clients</span><span style={{color:'var(--light)'}}>7,500+ brands</span></div>
                        <div style={{display:'flex',justifyContent:'space-between',fontSize:'11px',padding:'6px 0',borderBottom:'1px solid var(--border)'}}><span style={{color:'var(--navy)',fontWeight:600}}>Offline-expanding</span><span style={{color:'var(--light)'}}>~40% (3,000)</span></div>
                        <div style={{display:'flex',justifyContent:'space-between',fontSize:'11px',padding:'6px 0',borderBottom:'1px solid var(--border)'}}><span style={{color:'var(--navy)',fontWeight:600}}>Pricing</span><span style={{color:'var(--light)'}}>₹25-40K/mo add-on</span></div>
                        <div style={{display:'flex',justifyContent:'space-between',fontSize:'11px',padding:'6px 0',borderBottom:'1px solid var(--border)'}}><span style={{color:'var(--navy)',fontWeight:600}}>Gross margin</span><span style={{color:'var(--green)',fontWeight:700}}>85%+</span></div>
                        <div style={{display:'flex',justifyContent:'space-between',fontSize:'11px',padding:'6px 0'}}><span style={{color:'var(--navy)',fontWeight:600}}>Precedent</span><span style={{color:'var(--teal)',fontWeight:600}}>Shipway acquisition</span></div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="slide-footer">Multicommerce · Confidential · May 2026</div>
              </div>

              {/* SLIDE 12 */}
              <div className="slide-frame">
                <div className="slide-top-bar"></div>
                <div className="slide-body">
                  <div className="slide-num">12 / 13</div>
                  <div className="slide-h">Three Paths Forward</div>
                  <div className="slide-sub">Pick the one that fits your strategy.</div>
                  <div className="slide-content">
                    <div className="s-path-grid">
                      <div className="s-path g"><div className="s-path-letter">A</div><div className="s-path-title">Acquire</div><div className="s-path-desc">Full IP transfer. We become your distribution intelligence team. Fastest path to market.</div></div>
                      <div className="s-path n"><div className="s-path-letter">B</div><div className="s-path-title">Partner</div><div className="s-path-desc">Independent product, deep Unicommerce integration. Revenue share. Joint GTM.</div></div>
                      <div className="s-path a"><div className="s-path-letter">C</div><div className="s-path-title">White-Label</div><div className="s-path-desc">Ship as &ldquo;Unicommerce Distribution Intelligence.&rdquo; Your branding, our engine.</div></div>
                    </div>
                  </div>
                </div>
                <div className="slide-footer">Multicommerce · Confidential · May 2026</div>
              </div>

              {/* SLIDE 13 */}
              <div className="slide-frame">
                <div className="slide-top-bar"></div>
                <div className="slide-body" style={{textAlign:'center',justifyContent:'center',alignItems:'center'}}>
                  <div className="slide-num" style={{textAlign:'center'}}>13 / 13</div>
                  <div className="slide-h" style={{textAlign:'center',maxWidth:'400px',margin:'0 auto 16px'}}>The Ask</div>
                  <div className="slide-content" style={{display:'flex',flexDirection:'column',gap:'8px',maxWidth:'440px',width:'100%'}}>
                    <div className="s-ask-row"><span className="s-ask-num">1</span><span className="s-ask-text">30-day pilot with 2-3 clients scaling offline distribution</span></div>
                    <div className="s-ask-row"><span className="s-ask-num">2</span><span className="s-ask-text">Sandbox API access to Unicommerce&apos;s Uniware REST APIs</span></div>
                    <div className="s-ask-row"><span className="s-ask-num">3</span><span className="s-ask-text">Partnership decision within 60 days of pilot results</span></div>
                  </div>
                  <div style={{marginTop:'24px',fontSize:'13px',color:'var(--teal)',fontFamily:"'Lora',serif",fontStyle:'italic'}}>The product is built. The data proves the need.<br/>The only question is: who fills this gap first?</div>
                </div>
                <div className="slide-footer">multicommerce · May 2026</div>
              </div>

            </div>
          </div>

          <div className="slides-nav reveal">
            <button className="slides-btn" onClick={() => goTo(slide - 1)}>←</button>
            <div className="slides-dots">
              {Array.from({length: TOTAL}, (_, i) => (
                <div key={i} className={`slides-dot${i === slide ? ' active' : ''}`} onClick={() => goTo(i)} />
              ))}
            </div>
            <span className="slides-counter">{slide + 1} / {TOTAL}</span>
            <button className="slides-btn" onClick={() => goTo(slide + 1)}>→</button>
          </div>
        </div>
      </div>

      {/* PROTOTYPE CTA */}
      <div className="proto-section" id="prototype">
        <div className="proto-inner">
          <div className="proto-label reveal">Working Product</div>
          <h2 className="proto-title reveal">This isn&apos;t a mockup.<br/>See it working live.</h2>
          <p className="proto-sub reveal">Real Mamaearth data. Real distributor sell-through ratios. Real AI-generated risk assessments. Built and functional today.</p>
          <div className="proto-features reveal">
            <div className="proto-feat"><div className="proto-feat-icon">📊</div><div className="proto-feat-title">Live Distribution Health</div><div className="proto-feat-desc">30 distributors, real sell-through ratios, crisis alerts active</div></div>
            <div className="proto-feat"><div className="proto-feat-icon">🧠</div><div className="proto-feat-title">AI Insights Engine</div><div className="proto-feat-desc">Ask anything in plain language. Get data-backed answers instantly</div></div>
            <div className="proto-feat"><div className="proto-feat-icon">📦</div><div className="proto-feat-title">SKU Intelligence</div><div className="proto-feat-desc">10 Mamaearth SKUs ranked by sell-through and dead stock risk</div></div>
          </div>
          <Link href="/prototype" className="proto-btn reveal">
            Launch Live Prototype <span className="proto-btn-arrow">→</span>
          </Link>
          <div className="proto-note reveal">Built on React · Unicommerce brand colors · Claude AI powered · No login required</div>
        </div>
      </div>

      {/* THE ASK */}
      <div className="ask-section">
        <div className="section-label reveal" style={{justifyContent:'center'}}>The Ask</div>
        <h2 className="section-title reveal" style={{textAlign:'center'}}>One conversation.<br/>30 minutes.</h2>
        <div className="ask-cards">
          <div className="ask-card reveal"><div className="ask-num">1</div><div className="ask-text">30-day pilot with 2-3 of your clients scaling offline distribution</div></div>
          <div className="ask-card reveal reveal-d1"><div className="ask-num">2</div><div className="ask-text">Sandbox API access to Unicommerce&apos;s Uniware REST APIs for integration</div></div>
          <div className="ask-card reveal reveal-d2"><div className="ask-num">3</div><div className="ask-text">A decision on path forward within 60 days of pilot results</div></div>
        </div>
        <p className="ask-final reveal">&ldquo;The product is built. The data proves the need.<br/>The question is: who fills this gap first?&rdquo;</p>
        <a href="mailto:chirag.mewara.18@gmail.com?subject=Multicommerce%20%E2%80%94%20Partnership%20Conversation&body=Hi%20Chirag%2C%0A%0AI%20reviewed%20the%20Multicommerce%20pitch%20and%20would%20like%20to%20explore%20this%20further.%0A%0ABest%2C" className="ask-cta reveal">
          Request a Conversation →
        </a>
      </div>

      {/* FOOTER */}
      <footer>
        <div><strong>multicommerce</strong> · Sell-Through Intelligence Layer</div>
        <div>Confidential · May 2026 · Built for Unicommerce</div>
      </footer>
    </>
  )
}
