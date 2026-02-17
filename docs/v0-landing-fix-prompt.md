# v0 Landing Page Fix Prompt

> v0のチャットにそのまま貼り付けてください。

---

```
The current output has major visual quality issues. Please fix ALL of the following:

## 1. METRICS CARDS: Fix the grid layout
The 4 metric cards are stacking vertically even on desktop. Fix:
- Use `grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4` on the container
- Each card MUST be a glass card: `backdrop-blur-xl bg-white/[0.04] border border-white/[0.08] rounded-2xl p-5`
- Sparkline charts are WAY too big. They must be tiny: `<ResponsiveContainer width={60} height={24}>` — NOT full-width

## 2. GLASS-MORPHISM: Add frosted glass to ALL cards
Every card on the page needs this treatment — currently they look like plain dark boxes:
```css
backdrop-blur-xl bg-white/[0.04] border border-white/[0.08] rounded-2xl shadow-[0_8px_32px_rgba(0,0,0,0.3)]
```
Apply to: metric cards, engine cards, governance proof columns, AI insight card, proof bar.

## 3. NAVBAR: Rebuild completely
Current nav is broken. It should be:
```jsx
<nav className="sticky top-0 z-50 backdrop-blur-xl bg-white/[0.03] border-b border-white/[0.06]">
  <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
    {/* Left: logo */}
    <div className="flex items-center gap-2 font-bold text-lg text-white">
      <Waves className="h-5 w-5 text-teal-400" />
      Poseidon.AI
    </div>
    {/* Center: links (hidden on mobile) */}
    <div className="hidden md:flex items-center gap-8 text-sm text-slate-400">
      <span className="hover:text-white cursor-pointer transition-colors">Product</span>
      <span className="hover:text-white cursor-pointer transition-colors">Trust</span>
      <span className="hover:text-white cursor-pointer transition-colors">Pricing</span>
    </div>
    {/* Right: buttons */}
    <div className="flex items-center gap-3">
      <button className="text-sm text-slate-400 hover:text-white transition-colors">Sign in</button>
      <button className="text-sm font-medium px-5 py-2 rounded-xl bg-gradient-to-r from-teal-500 to-cyan-400 text-slate-950 hover:brightness-110 transition-all">
        Get Started
      </button>
    </div>
  </div>
</nav>
```

## 4. HERO: Add background glow and fix spacing
- Add a radial gradient glow behind the hero text:
```jsx
<div className="absolute inset-0 pointer-events-none">
  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] rounded-full bg-teal-500/[0.07] blur-[120px]" />
</div>
```
- Headline: `text-5xl md:text-6xl lg:text-7xl font-bold text-white leading-tight`
- Remove the teal color from "in one place" — keep the entire headline white
- Subtitle: `text-lg md:text-xl text-slate-400 max-w-2xl mx-auto`
- Buttons container: `flex items-center justify-center gap-4 mt-8`
- "Open Dashboard" button: `px-8 py-4 rounded-xl bg-gradient-to-r from-teal-500 to-cyan-400 text-slate-950 font-semibold text-lg shadow-[0_0_30px_rgba(13,217,180,0.3)] hover:shadow-[0_0_40px_rgba(13,217,180,0.4)] transition-all`
- "Watch Demo" button: `px-8 py-4 rounded-xl border border-white/[0.1] text-white hover:bg-white/[0.05] transition-all flex items-center gap-2`
- Trust badges: `flex items-center justify-center gap-8 mt-6 text-xs text-slate-500`
- Hero section padding: `py-24 md:py-32`

## 5. ENGINE CARDS: Fix grid and add hover effects
- Container: `grid grid-cols-1 md:grid-cols-2 gap-4 max-w-4xl mx-auto`
- Each card: `group backdrop-blur-xl bg-white/[0.03] border border-white/[0.06] rounded-2xl p-6 transition-all duration-300 hover:-translate-y-1 hover:border-white/[0.12] hover:shadow-[0_8px_40px_rgba(0,0,0,0.3)]`
- Engine icon container: `w-12 h-12 rounded-full flex items-center justify-center` with `bg-{engineColor}/10`
- Confidence badge: `text-xs font-mono px-2.5 py-1 rounded-full` with `bg-{engineColor}/10 text-{engineColor}`

## 6. SPACING: Add proper padding and gaps
The entire page feels cramped. Fix:
- Page wrapper: `min-h-screen bg-[#070d1a] text-white`
- Max-width content container: `max-w-7xl mx-auto px-6`
- Section gaps: `space-y-20 md:space-y-28` between major sections
- Hero: `pt-24 md:pt-32 pb-16`
- Section headers: `text-3xl md:text-4xl font-bold text-white text-center mb-12`

## 7. PROOF BAR: Style as monospace glass strip
```jsx
<div className="backdrop-blur-xl bg-white/[0.03] border border-white/[0.06] rounded-xl px-6 py-3 mt-8">
  <p className="text-xs font-mono text-slate-500 text-center">
    System uptime 99.97% · Last audit: 4m ago · Model version: v3.2.1 · Decisions today: 47
  </p>
</div>
```

## 8. FOOTER: Center and style properly
```jsx
<footer className="border-t border-white/[0.06] py-12 mt-20">
  <div className="flex flex-col items-center gap-3 text-center">
    <div className="flex items-center gap-2 text-slate-400">
      <Shield className="h-4 w-4" />
      <span className="text-sm font-medium">MIT Sloan CTO Program · Group 7 · March 2026</span>
    </div>
    <div className="flex gap-6 text-xs text-slate-600">
      <span className="hover:text-slate-400 cursor-pointer">Privacy Policy</span>
      <span className="hover:text-slate-400 cursor-pointer">Terms of Service</span>
    </div>
  </div>
</footer>
```

## SUMMARY OF REQUIRED CHANGES:
1. ✅ 4-column responsive grid for metrics (NOT vertical stack)
2. ✅ Tiny sparklines (60x24px) — NOT full-width charts
3. ✅ Glass-morphism on ALL cards (backdrop-blur + translucent bg + subtle border)
4. ✅ Proper navbar with glass background, center links, gradient button
5. ✅ Hero background glow (radial gradient, blurred, low opacity)
6. ✅ Proper button styling with gradients and shadows
7. ✅ Engine cards in 2x2 grid with hover lift effect
8. ✅ Generous spacing between all sections (space-y-20)
9. ✅ Monospace proof bar with glass treatment
10. ✅ All headline text pure white (no colored words)

The page should feel like Linear.app or Vercel's landing page — premium, calm, information-dense. NOT like a basic HTML page with no styling.
```
