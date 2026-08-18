"use client";

import { useEffect, useMemo, useState } from "react";
import { Home, Layers3, MessageCircle, ShoppingBag, UserRound, Sun, Moon, Bell, Search, Flame, Send, Share2, X, Heart, ArrowUp, Sparkles, Plus, Minus, ChevronRight, Settings, Package, Camera, ExternalLink, RotateCcw } from "lucide-react";
import { BagMark, Wordmark } from "./logo";
import { posts, products } from "@/lib/demo-data";
import type { Product, Tab } from "@/lib/types";

const money = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" });

export function HaulApp() {
  const [tab, setTab] = useState<Tab>("home");
  const [theme, setTheme] = useState<"ember" | "blackout">("ember");
  const [bag, setBag] = useState<Product[]>([products[2]]);
  const [saved, setSaved] = useState<Product[]>([products[1]]);
  const [notice, setNotice] = useState("");

  useEffect(() => { document.documentElement.dataset.theme = theme; }, [theme]);
  useEffect(() => { if (!notice) return; const timer = setTimeout(() => setNotice(""), 2200); return () => clearTimeout(timer); }, [notice]);

  const addToBag = (product: Product) => {
    if (!bag.some((item) => item.id === product.id)) setBag((items) => [...items, product]);
    setNotice(`${product.title} added to your bag`);
  };

  return (
    <main className="app-shell">
      <header className="topbar">
        <button className="brand" onClick={() => setTab("home")} aria-label="Go home"><BagMark /><Wordmark /></button>
        <div className="top-actions">
          <button className="icon-button" onClick={() => setTheme(theme === "ember" ? "blackout" : "ember")} aria-label="Toggle theme">{theme === "ember" ? <Moon /> : <Sun />}</button>
          <button className="icon-button"><Bell /><i className="unread" /></button>
        </div>
      </header>

      <section className="screen">
        {tab === "home" && <HomeScreen addToBag={addToBag} />}
        {tab === "swipe" && <SwipeScreen addToBag={addToBag} save={(p) => { setSaved((s) => [...s.filter(x => x.id !== p.id), p]); setNotice("Style DNA updated"); }} />}
        {tab === "stylist" && <StylistScreen addToBag={addToBag} />}
        {tab === "bag" && <BagScreen bag={bag} saved={saved} remove={(id) => setBag((b) => b.filter((p) => p.id !== id))} addToBag={addToBag} />}
        {tab === "profile" && <ProfileScreen saved={saved} />}
      </section>

      <nav className="bottom-nav" aria-label="Primary navigation">
        <NavItem icon={<Home />} label="Home" active={tab === "home"} onClick={() => setTab("home")} />
        <NavItem icon={<Layers3 />} label="Swipe" active={tab === "swipe"} onClick={() => setTab("swipe")} />
        <NavItem icon={<Sparkles />} label="Stylist" active={tab === "stylist"} onClick={() => setTab("stylist")} featured />
        <NavItem icon={<ShoppingBag />} label="Bag" active={tab === "bag"} onClick={() => setTab("bag")} badge={bag.length} />
        <NavItem icon={<UserRound />} label="Profile" active={tab === "profile"} onClick={() => setTab("profile")} />
      </nav>
      {notice && <div className="toast">{notice}</div>}
    </main>
  );
}

function NavItem({ icon, label, active, onClick, featured, badge }: { icon: React.ReactNode; label: string; active: boolean; onClick: () => void; featured?: boolean; badge?: number }) {
  return <button className={`nav-item ${active ? "active" : ""} ${featured ? "featured" : ""}`} onClick={onClick}><span className="nav-icon">{icon}{badge ? <b>{badge}</b> : null}</span><small>{label}</small></button>;
}

function HomeScreen({ addToBag }: { addToBag: (p: Product) => void }) {
  const [liked, setLiked] = useState<string[]>(["post1"]);
  const [selected, setSelected] = useState<Product | null>(null);
  return <div className="home-screen">
    <div className="feed-heading"><div><p className="eyebrow">TUESDAY’S EDIT</p><h1>Your feed</h1></div><button className="search-pill"><Search /> Search</button></div>
    <div className="stories"><div className="story add"><span><Plus /></span><small>Your look</small></div>{["Nia", "Ana", "Jamie", "Zoe", "Alex"].map((name, i) => <div className="story" key={name}><span style={{ background: `linear-gradient(135deg, hsl(${20 + i * 52} 80% 65%), hsl(${40 + i * 42} 50% 35%))` }}>{name[0]}</span><small>{name}</small></div>)}</div>
    <div className="feed-grid">{posts.map((post) => <article className="post-card" key={post.id}>
      <div className="post-author"><span className="avatar">{post.avatar}</span><div><strong>{post.author}</strong><small>{post.handle}</small></div><button>•••</button></div>
      <div className="post-image"><img src={post.image} alt={post.caption} /><button className="product-tag" onClick={() => setSelected(post.product)}><ShoppingBag /> {post.product.brand}</button></div>
      <div className="post-actions"><button className={liked.includes(post.id) ? "fired" : ""} onClick={() => setLiked((x) => x.includes(post.id) ? x.filter(v => v !== post.id) : [...x, post.id])}><Flame /> {post.likes + (liked.includes(post.id) ? 1 : 0).toLocaleString()}</button><button><MessageCircle /> 84</button><button><Send /></button><button className="push"><Share2 /></button></div>
      <p className="caption"><strong>{post.handle}</strong> {post.caption}</p>
    </article>)}</div>
    {selected && <QuickBuy product={selected} close={() => setSelected(null)} add={() => { addToBag(selected); setSelected(null); }} />}
  </div>;
}

function QuickBuy({ product, close, add }: { product: Product; close: () => void; add: () => void }) {
  return <div className="sheet-backdrop" onClick={close}><div className="quick-sheet" onClick={(e) => e.stopPropagation()}><div className="sheet-handle"/><button className="close" onClick={close}><X /></button><img src={product.image} alt=""/><div><p className="eyebrow">{product.brand}</p><h2>{product.title}</h2><p>{money.format(product.price)}</p><div className="color-row">{product.colors.map(c => <i key={c} style={{background:c}} />)}</div><button className="primary" onClick={add}>Add to bag <ShoppingBag /></button><p className="fine">{product.source === "native" ? "Checkout securely in HAUL" : "Sold by partner • affiliate item"}</p></div></div></div>;
}

function SwipeScreen({ addToBag, save }: { addToBag: (p: Product) => void; save: (p: Product) => void }) {
  const [index, setIndex] = useState(0); const product = products[index % products.length];
  const next = () => setIndex(i => i + 1);
  return <div className="swipe-screen"><div className="swipe-title"><p className="eyebrow">DISCOVER</p><h1>Made for your vibe</h1><span>{product.match}% match</span></div>
    <div className="swipe-card"><img src={product.image} alt={product.title}/><div className="image-shade"/><div className="match">{product.match}%<small>match</small></div><div className="swipe-info"><p>{product.brand}</p><h2>{product.title}</h2><strong>{money.format(product.price)}</strong><div>{product.colors.map(c => <i key={c} style={{background:c}} />)}</div></div></div>
    <div className="swipe-actions"><button onClick={next} className="pass"><X /></button><button onClick={() => { save(product); next(); }} className="love"><Heart /></button><button onClick={() => { addToBag(product); next(); }} className="bag-up"><ArrowUp /><small>BAG</small></button></div>
    <p className="swipe-hint"><span>← Pass</span><span>Save →</span><span>↑ Add to bag</span></p>
    <button className="undo" onClick={() => setIndex(i => Math.max(0, i - 1))}><RotateCcw /> Undo</button>
  </div>;
}

function StylistScreen({ addToBag }: { addToBag: (p: Product) => void }) {
  const [messages, setMessages] = useState<{role:"user"|"assistant"; text:string; products?:Product[]}[]>([{ role:"assistant", text:"Hey, I’m your HAUL stylist. I know your style leans minimal, sporty, and neutral. What are we dressing for?" }]);
  const [input, setInput] = useState(""); const [loading, setLoading] = useState(false);
  const send = async (text = input) => { if (!text.trim()) return; setMessages(m => [...m,{role:"user",text}]); setInput(""); setLoading(true); try { const res = await fetch("/api/stylist",{method:"POST",headers:{"content-type":"application/json"},body:JSON.stringify({message:text,history:messages.slice(-6)})}); const data=await res.json(); setMessages(m=>[...m,{role:"assistant",text:data.message,products:data.productIds?.map((id:string)=>products.find(p=>p.id===id)).filter(Boolean)}]); } catch { setMessages(m=>[...m,{role:"assistant",text:"I pulled a few versatile pieces that fit your Style DNA.",products:products.slice(0,3)}]); } finally {setLoading(false);} };
  return <div className="stylist-screen"><div className="stylist-header"><span><Sparkles /></span><div><p className="eyebrow">HAUL AI</p><h1>Your Stylist</h1></div><i>ONLINE</i></div><div className="dna-strip"><div><strong>YOUR STYLE DNA</strong><small>Quiet luxe · Sporty · 90s minimal</small></div><span>94% tuned</span></div>
    <div className="chat">{messages.map((m,i)=><div className={`message ${m.role}`} key={i}>{m.role==="assistant"&&<span className="mini-logo"><BagMark size={24}/></span>}<div><p>{m.text}</p>{m.products&&<div className="recommendations">{m.products.map(p=><article key={p.id}><img src={p.image} alt=""/><div><small>{p.brand}</small><strong>{p.title}</strong><span>{money.format(p.price)}</span></div><button onClick={()=>addToBag(p)}><Plus /></button></article>)}</div>}</div></div>)}{loading&&<div className="typing"><i/><i/><i/></div>}</div>
    <div className="prompt-chips">{["Vacation fits", "Under $150", "Date night"].map(x=><button key={x} onClick={()=>send(x)}>{x}</button>)}</div><form className="chat-box" onSubmit={e=>{e.preventDefault();send();}}><button type="button"><Camera /></button><input value={input} onChange={e=>setInput(e.target.value)} placeholder="Ask your stylist anything…"/><button type="submit" className="send" disabled={loading}><Send /></button></form>
  </div>;
}

function BagScreen({ bag, saved, remove, addToBag }: { bag: Product[]; saved: Product[]; remove: (id:string)=>void; addToBag:(p:Product)=>void }) {
  const total = useMemo(()=>bag.filter(p=>p.source==="native").reduce((s,p)=>s+p.price,0),[bag]);
  return <div className="bag-screen"><div className="page-title"><div><p className="eyebrow">YOUR PICKS</p><h1>Bag <span>{bag.length}</span></h1></div><ShoppingBag /></div>{bag.length===0?<div className="empty"><ShoppingBag/><h2>Your bag is waiting</h2><p>Swipe up on something you love.</p></div>:<div className="bag-layout"><div className="bag-list">{bag.map(p=><article className="bag-item" key={p.id}><img src={p.image} alt=""/><div><p className="eyebrow">{p.brand}</p><h3>{p.title}</h3><small>Size: M · Qty: 1</small><strong>{money.format(p.price)}</strong><span className={`source ${p.source}`}>{p.source==="native"?"HAUL CHECKOUT":"PARTNER LINK"}</span></div><button onClick={()=>remove(p.id)}><X/></button></article>)}</div><aside className="checkout-card"><div><span>Native subtotal</span><strong>{money.format(total)}</strong></div><div><span>Shipping</span><strong>Free</strong></div><hr/><div className="total"><span>Total</span><strong>{money.format(total)}</strong></div><button className="primary" disabled={!total}>Checkout native items <ChevronRight/></button><p className="fine">Partner items open securely on the retailer’s site.</p>{bag.some(p=>p.source!=="native")&&<button className="affiliate">Shop partner items <ExternalLink/></button>}</aside></div>}
    <div className="saved-section"><h2>Saved for later</h2><div className="saved-row">{saved.map(p=><article key={p.id}><img src={p.image} alt=""/><strong>{p.title}</strong><span>{money.format(p.price)}</span><button onClick={()=>addToBag(p)}><Plus/></button></article>)}</div></div>
  </div>;
}

function ProfileScreen({ saved }: { saved: Product[] }) {
  return <div className="profile-screen"><div className="profile-top"><button className="settings"><Settings/></button><div className="profile-avatar">AP<i/></div><h1>Avery Parker</h1><p>@averyedit · New York</p><div className="profile-stats"><div><strong>24</strong><span>Looks</span></div><div><strong>8.4K</strong><span>Followers</span></div><div><strong>312</strong><span>Following</span></div></div><button className="outline">Edit profile</button></div>
    <section className="dna-card"><div className="dna-orbit"><span>YOUR<br/><strong>STYLE</strong></span><i/><i/><i/></div><div><p className="eyebrow">STYLE DNA</p><h2>Minimal edge</h2><p>Clean lines, tactile layers, and one unexpected detail. Your palette lives in oat, black, oxblood, and sky.</p><div className="tags"><span>Quiet luxe</span><span>Sporty</span><span>90s</span></div></div></section>
    <div className="profile-tabs"><button className="active"><Layers3/> Looks</button><button><Heart/> Saved ({saved.length})</button><button><Package/> Orders</button></div><div className="look-grid">{products.slice(0,4).map(p=><img src={p.image} alt={p.title} key={p.id}/>)}</div>
  </div>;
}
