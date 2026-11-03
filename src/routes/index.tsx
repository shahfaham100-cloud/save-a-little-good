import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";
import heroImg from "@/assets/hero-gift.jpg";
import janeImg from "@/assets/story-jane.jpg";
import logoAsset from "@/assets/logo.png.asset.json";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Save Me, Save You — Save for yourself. Give hope to someone else." },
      {
        name: "description",
        content:
          "Save Me, Save You memberships unlock everyday savings and cashback, while helping families, elderly people and single parents in need.",
      },
      { property: "og:title", content: "Save Me, Save You — Save more. Give more." },
      {
        property: "og:description",
        content: "Premium memberships that turn your everyday savings into hope for someone else.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

const NAV = [
  ["How it works", "how"],
  ["Memberships", "plans"],
  ["Our story", "story"],
  ["Who we help", "help"],
  ["FAQ", "faq"],
] as const;

function Logo({ className = "" }: { className?: string }) {
  return (
    <img src={logoAsset.url} alt="Save Me, Save You" className={`block h-auto w-auto ${className}`} />
  );
}

function Index() {
  const root = useRef<HTMLDivElement>(null);
  const lenisRef = useRef<Lenis | null>(null);
  const [loaded, setLoaded] = useState(false);
  const [menu, setMenu] = useState(false);

  // Preloader
  useEffect(() => {
    const ctx = gsap.context(() => {
      const counter = { v: 0 };
      const tl = gsap.timeline({ onComplete: () => setLoaded(true) });
      tl.from(".pl-logo", { scale: 0.6, opacity: 0, duration: 0.9, ease: "power3.out" })
        .from(".pl-letter", { yPercent: 110, stagger: 0.06, duration: 0.9, ease: "power4.out" }, "-=0.45")
        .to(counter, {
          v: 100,
          duration: 1.6,
          ease: "power2.inOut",
          onUpdate: () => {
            const el = document.querySelector(".pl-count");
            if (el) el.textContent = String(Math.round(counter.v)).padStart(3, "0");
          },
        }, "<")
        .to(".pl-bar", { scaleX: 1, duration: 1.6, ease: "power2.inOut" }, "<")
        .to(".pl-inner", { yPercent: -30, opacity: 0, duration: 0.6, ease: "power3.in" })
        .to(".pl-panel", { yPercent: -100, stagger: 0.08, duration: 0.9, ease: "power4.inOut" }, "-=0.2")
        .set(".preloader", { display: "none" });
    });
    return () => ctx.revert();
  }, []);

  // Smooth scroll + scroll animations
  useEffect(() => {
    if (!loaded) return;
    gsap.registerPlugin(ScrollTrigger);
    const lenis = new Lenis({ duration: 1.2, smoothWheel: true });
    lenisRef.current = lenis;
    lenis.on("scroll", ScrollTrigger.update);
    const raf = (t: number) => lenis.raf(t * 1000);
    gsap.ticker.add(raf);
    gsap.ticker.lagSmoothing(0);

    const ctx = gsap.context(() => {
      gsap.from(".hero-line > span", { yPercent: 115, stagger: 0.12, duration: 1.3, ease: "power4.out" });
      gsap.from(".hero-fade", { opacity: 0, y: 30, stagger: 0.1, duration: 1, delay: 0.6, ease: "power3.out" });
      gsap.from(".hero-img", { scale: 1.25, duration: 2.4, ease: "power3.out" });
      gsap.to(".hero-img", {
        yPercent: 18, ease: "none",
        scrollTrigger: { trigger: ".hero", start: "top top", end: "bottom top", scrub: true },
      });
      gsap.utils.toArray<HTMLElement>(".reveal").forEach((el) => {
        gsap.from(el, {
          y: 60, opacity: 0, duration: 1.2, ease: "power3.out",
          scrollTrigger: { trigger: el, start: "top 88%" },
        });
      });
      gsap.utils.toArray<HTMLElement>(".split").forEach((el) => {
        gsap.from(el.querySelectorAll(".w > span"), {
          yPercent: 110, stagger: 0.04, duration: 1.1, ease: "power4.out",
          scrollTrigger: { trigger: el, start: "top 85%" },
        });
      });
      gsap.utils.toArray<HTMLElement>(".clip").forEach((el) => {
        gsap.fromTo(el, { clipPath: "inset(100% 0 0 0)" }, {
          clipPath: "inset(0% 0 0 0)", duration: 1.6, ease: "power4.inOut",
          scrollTrigger: { trigger: el, start: "top 80%" },
        });
      });
      const mm = gsap.matchMedia();
      mm.add("(min-width: 1024px)", () => {
        const track = document.querySelector<HTMLElement>(".help-track");
        if (!track) return;
        const dist = () => track.scrollWidth - window.innerWidth;
        gsap.to(track, {
          x: () => -dist(), ease: "none",
          scrollTrigger: { trigger: ".help-pin", start: "top top", end: () => `+=${dist()}`, pin: true, scrub: 1, invalidateOnRefresh: true },
        });
      });
      gsap.to(".marquee-track", { xPercent: -50, duration: 30, ease: "none", repeat: -1 });
      gsap.utils.toArray<HTMLElement>(".parallax").forEach((el) => {
        gsap.to(el, { yPercent: -15, ease: "none", scrollTrigger: { trigger: el, scrub: true } });
      });
    }, root);

    return () => {
      ctx.revert();
      gsap.ticker.remove(raf);
      lenis.destroy();
    };
  }, [loaded]);

  // Custom cursor + magnetic buttons
  useEffect(() => {
    if (window.matchMedia("(pointer: coarse)").matches) return;
    const dot = document.querySelector<HTMLElement>(".cursor");
    if (!dot) return;
    const xTo = gsap.quickTo(dot, "x", { duration: 0.35, ease: "power3" });
    const yTo = gsap.quickTo(dot, "y", { duration: 0.35, ease: "power3" });
    const move = (e: MouseEvent) => {
      xTo(e.clientX); yTo(e.clientY);
      const t = (e.target as HTMLElement).closest("a,button,[data-hover]");
      dot.classList.toggle("scale-[3.5]", !!t);
    };
    window.addEventListener("mousemove", move);
    const mags = document.querySelectorAll<HTMLElement>("[data-magnetic]");
    const handlers: Array<[HTMLElement, (e: MouseEvent) => void, () => void]> = [];
    mags.forEach((m) => {
      const mm = (e: MouseEvent) => {
        const r = m.getBoundingClientRect();
        gsap.to(m, { x: (e.clientX - r.left - r.width / 2) * 0.3, y: (e.clientY - r.top - r.height / 2) * 0.3, duration: 0.4 });
      };
      const ml = () => gsap.to(m, { x: 0, y: 0, duration: 0.7, ease: "elastic.out(1,0.4)" });
      m.addEventListener("mousemove", mm); m.addEventListener("mouseleave", ml);
      handlers.push([m, mm, ml]);
    });
    return () => {
      window.removeEventListener("mousemove", move);
      handlers.forEach(([m, mm, ml]) => { m.removeEventListener("mousemove", mm); m.removeEventListener("mouseleave", ml); });
    };
  }, []);

  // Curtain page transition to a section
  const go = (id: string) => {
    setMenu(false);
    const tl = gsap.timeline();
    tl.set(".transition", { display: "flex" })
      .fromTo(".tr-panel", { yPercent: 100 }, { yPercent: 0, stagger: 0.06, duration: 0.6, ease: "power4.inOut" })
      .add(() => { lenisRef.current?.scrollTo(`#${id}`, { immediate: true, offset: -40 }); })
      .to(".tr-panel", { yPercent: -100, stagger: 0.06, duration: 0.6, ease: "power4.inOut" }, "+=0.15")
      .set(".transition", { display: "none" });
  };

  return (
    <div ref={root} className="grain bg-background text-foreground overflow-x-clip">
      {/* Preloader */}
      <div className="preloader fixed inset-0 z-[100] flex">
        {[0, 1, 2, 3].map((i) => <div key={i} className="pl-panel h-full flex-1 bg-ink" />)}
        <div className="pl-inner absolute inset-0 flex flex-col items-center justify-center gap-6 md:gap-8">
          <img src={logoAsset.url} alt="" className="pl-logo h-24 w-24 md:h-32 md:w-32" />
          <div className="overflow-hidden px-6 text-center font-display text-5xl md:text-8xl">
            {"Save Me,".split("").map((c, i) => <span key={i} className="pl-letter inline-block whitespace-pre">{c}</span>)}
            {" Save You".split("").map((c, i) => <span key={`m${i}`} className="pl-letter inline-block whitespace-pre text-gold italic">{c}</span>)}
          </div>
          <div className="h-px w-56 bg-border">
            <div className="pl-bar h-full origin-left scale-x-0 bg-gold" />
          </div>
          <span className="pl-count font-sans text-xs tracking-[0.4em] text-muted-foreground">000</span>
        </div>
      </div>

      {/* Transition curtain */}
      <div className="transition pointer-events-none fixed inset-0 z-[90] hidden">
        {[0, 1, 2, 3, 4].map((i) => (
          <div key={i} className={`tr-panel h-full flex-1 ${i === 2 ? "bg-gold" : "bg-ink"}`} />
        ))}
      </div>

      <div className="cursor pointer-events-none fixed left-0 top-0 z-[80] -ml-1.5 -mt-1.5 hidden h-3 w-3 rounded-full bg-primary mix-blend-difference transition-transform duration-300 md:block" />

      {/* Nav */}
      <header className="fixed inset-x-0 top-0 z-50 mix-blend-difference">
        <div className="mx-auto flex max-w-[1400px] items-center justify-between px-6 py-6 md:px-12">
          <button onClick={() => go("top")} className="text-2xl"><Logo /></button>
          <nav className="hidden gap-10 lg:flex">
            {NAV.map(([l, id]) => (
              <button key={id} onClick={() => go(id)} className="group relative text-xs uppercase tracking-[0.25em]">
                {l}
                <span className="absolute -bottom-1 left-0 h-px w-full origin-right scale-x-0 bg-primary transition-transform duration-500 group-hover:origin-left group-hover:scale-x-100" />
              </button>
            ))}
          </nav>
          <button onClick={() => go("plans")} className="hidden text-xs uppercase tracking-[0.25em] text-primary lg:block">Join now →</button>
          <button onClick={() => setMenu(!menu)} className="text-xs uppercase tracking-[0.25em] lg:hidden">{menu ? "Close" : "Menu"}</button>
        </div>
      </header>
      {menu && (
        <div className="fixed inset-0 z-40 flex flex-col justify-center gap-6 bg-ink px-8">
          {NAV.map(([l, id]) => (
            <button key={id} onClick={() => go(id)} className="text-left font-display text-5xl">{l}</button>
          ))}
        </div>
      )}

      {/* Hero */}
      <section id="top" className="hero relative flex min-h-[100svh] items-center overflow-hidden">
        <img src={heroImg} alt="A black gift box with gold ribbon passed between two hands" width={1600} height={1008}
          className="hero-img absolute inset-0 h-[120%] w-full object-cover opacity-70" />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-background/20" />
        <div className="relative mx-auto w-full max-w-[1400px] px-6 pb-16 pt-36 md:px-12 md:pb-20 md:pt-44">
          <p className="hero-fade mb-8 text-xs uppercase tracking-[0.4em] text-primary">Membership · Savings · Giving</p>
          <h1 className="font-display text-[min(13vw,11vh)] font-light leading-[0.92] md:text-[min(8.5vw,13vh)]">
            <span className="hero-line block overflow-hidden"><span className="block">Save for yourself.</span></span>
            <span className="hero-line block overflow-hidden"><span className="block italic text-gold">Give hope</span></span>
            <span className="hero-line block overflow-hidden"><span className="block">to someone else.</span></span>
          </h1>
          <div className="mt-12 flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
            <p className="hero-fade max-w-md text-muted-foreground">
              A premium membership that rewards your everyday spending — and quietly lifts the people who need it most.
            </p>
            <button data-magnetic onClick={() => go("plans")}
              className="hero-fade group relative flex h-36 w-36 items-center justify-center overflow-hidden rounded-full border border-primary text-xs uppercase tracking-[0.3em]">
              <span className="absolute inset-0 translate-y-full rounded-full bg-gold transition-transform duration-700 ease-[cubic-bezier(.7,0,.2,1)] group-hover:translate-y-0" />
              <span className="relative transition-colors duration-500 group-hover:text-ink">Join now</span>
            </button>
          </div>
        </div>
      </section>

      {/* Marquee */}
      <div className="overflow-hidden border-y border-border py-6">
        <div className="marquee-track flex w-max gap-16 whitespace-nowrap font-display text-4xl italic text-muted-foreground md:text-6xl">
          {Array.from({ length: 2 }).flatMap((_, k) =>
            ["Save more", "✦", "Earn cashback", "✦", "Gift a membership", "✦", "Give hope", "✦"].map((t, i) => (
              <span key={`${k}${i}`} className={t === "✦" ? "text-primary" : ""}>{t}</span>
            )),
          )}
        </div>
      </div>

      {/* How it works */}
      <section id="how" className="mx-auto max-w-[1400px] px-6 py-32 md:px-12 md:py-44">
        <SectionLabel n="01" t="How it works" />
        <SplitHeading text="Four simple steps to saving that means more." />
        <div className="mt-20 grid gap-px bg-border md:grid-cols-2 lg:grid-cols-4">
          {[
            ["Choose", "Pick the membership that suits your lifestyle — Everyday or Value."],
            ["Save", "Unlock exclusive discounts with our partners, every single day."],
            ["Earn", "Collect cashback on purchases straight back into your pocket."],
            ["Gift", "Gift a membership to someone who needs a helping hand."],
          ].map(([t, d], i) => (
            <div key={t} data-hover className="reveal group relative overflow-hidden bg-background p-10 transition-colors duration-700 hover:bg-card">
              <span className="font-display text-6xl text-muted-foreground/40 transition-colors duration-500 group-hover:text-primary">0{i + 1}</span>
              <h3 className="mt-16 font-display text-4xl">{t}</h3>
              <p className="mt-4 text-sm leading-relaxed text-muted-foreground">{d}</p>
              <span className="absolute bottom-0 left-0 h-px w-full origin-left scale-x-0 bg-gold transition-transform duration-700 group-hover:scale-x-100" />
            </div>
          ))}
        </div>
      </section>

      {/* Plans */}
      <section id="plans" className="bg-card py-32 md:py-44">
        <div className="mx-auto max-w-[1400px] px-6 md:px-12">
          <SectionLabel n="02" t="Memberships" />
          <SplitHeading text="Choose your pass." />
          <div className="mt-20 grid gap-8 lg:grid-cols-2">
            <Plan name="Everyday Pass" price="9.99" tag="Essential"
              perks={["Access to partner discounts", "Cashback on everyday purchases", "Monthly promotional draw entry", "Cancel anytime"]} />
            <Plan featured name="Value Pass" price="19.99" tag="Most loved"
              perks={["Everything in Everyday", "Higher cashback rates", "Gift one membership each year", "Double draw entries", "Priority member support"]} />
          </div>
        </div>
      </section>

      {/* Story */}
      <section id="story" className="mx-auto grid max-w-[1400px] gap-16 px-6 py-32 md:px-12 md:py-44 lg:grid-cols-2 lg:items-center">
        <div className="clip overflow-hidden">
          <img src={janeImg} alt="Jane, founder of Save Me, Save You" width={1008} height={1264} loading="lazy"
            className="parallax h-[115%] w-full object-cover transition-transform duration-[1.5s] hover:scale-105" />
        </div>
        <div>
          <SectionLabel n="03" t="Our story" />
          <SplitHeading text="It started with one simple question." />
          <div className="reveal mt-10 space-y-6 text-lg leading-relaxed text-muted-foreground">
            <p>“I watched people around me — friends, neighbours, single parents — stretch every dollar. I wondered: what if saving money could also help someone else?”</p>
            <p>That question became Save Me, Save You. A membership where every saving you make helps create hope for someone who needs it.</p>
          </div>
          <p className="reveal mt-10 font-display text-3xl italic text-gold">— Jane, Founder</p>
        </div>
      </section>

      {/* Who we help */}
      <section id="help" className="help-pin relative overflow-hidden border-t border-border">
        <div className="flex min-h-screen flex-col justify-center py-24 lg:h-screen lg:pb-8 lg:pt-28">
          <div className="mx-auto mb-14 flex w-full max-w-[1400px] flex-col gap-6 px-6 md:px-12 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <SectionLabel n="04" t="Who we help" />
              <SplitHeading text="Hope, shared with the people who matter." />
            </div>
            <p className="reveal hidden max-w-xs text-sm text-muted-foreground lg:block">Scroll to meet the people your membership quietly supports →</p>
          </div>
          <div className="help-track flex flex-col gap-6 px-6 md:px-12 lg:w-max lg:flex-row lg:pr-[20vw]">
            {[
              ["Friends", "A small gift that says “I’m thinking of you.”", "✦"],
              ["Families", "Making the weekly shop stretch a little further.", "❖"],
              ["Elderly people", "Comfort and dignity for those who raised us.", "✧"],
              ["Single parents", "A helping hand for those carrying it all alone.", "◈"],
              ["People in need", "Hope delivered, quietly and with respect.", "✺"],
            ].map(([w, d, g], i) => (
              <article key={w} data-hover
                className="help-card group relative flex h-[52vh] min-h-[340px] shrink-0 flex-col justify-between overflow-hidden rounded-[2px] border border-border bg-card p-10 transition-[border-color,transform] duration-700 hover:-translate-y-3 hover:border-primary lg:w-[26rem]"
                style={{ transform: `rotate(${i % 2 ? 1.5 : -1.5}deg)` }}>
                <span className="absolute inset-0 origin-bottom scale-y-0 bg-gold transition-transform duration-700 ease-[cubic-bezier(.7,0,.2,1)] group-hover:scale-y-100" />
                <span className="pointer-events-none absolute -bottom-10 -right-4 font-display text-[16rem] leading-none text-foreground/[0.04] transition-colors duration-700 group-hover:text-ink/10">0{i + 1}</span>
                <div className="relative flex items-center justify-between text-xs tracking-[0.3em] text-muted-foreground transition-colors duration-500 group-hover:text-ink">
                  <span>0{i + 1} / 05</span>
                  <span className="text-3xl text-primary transition-all duration-700 group-hover:rotate-180 group-hover:text-ink">{g}</span>
                </div>
                <div className="relative">
                  <h3 className="font-display text-5xl leading-none transition-colors duration-500 group-hover:text-ink md:text-6xl">{w}</h3>
                  <p className="mt-6 max-w-[16rem] text-sm leading-relaxed text-muted-foreground transition-colors duration-500 group-hover:text-ink/80">{d}</p>
                  <span className="mt-8 inline-block h-px w-12 bg-primary transition-all duration-700 group-hover:w-full group-hover:bg-ink" />
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="mx-auto grid max-w-[1400px] gap-16 px-6 py-32 md:px-12 md:py-44 lg:grid-cols-[1fr_1.4fr]">
        <div>
          <SectionLabel n="05" t="FAQ" />
          <SplitHeading text="Questions, answered." />
        </div>
        <div className="reveal border-t border-border">
          {[
            ["How do subscriptions work?", "Your membership renews monthly. You'll get immediate access to partner savings and cashback from the day you join."],
            ["Can I gift a membership?", "Yes. You can gift a membership to a friend, family member or someone in need — we'll handle the rest with a beautiful welcome."],
            ["How much can I save?", "Savings depend on how you shop, but members typically recover their membership cost within the first few purchases."],
            ["Can I cancel anytime?", "Absolutely. Cancel anytime from your account — no lock-in contracts, no hidden fees."],
          ].map(([q, a]) => <Faq key={q} q={q ?? ""} a={a ?? ""} />)}
        </div>
      </section>

      {/* Final CTA */}
      <section className="relative overflow-hidden bg-ivory py-40 text-ink md:py-56">
        <div className="mx-auto max-w-[1400px] px-6 text-center md:px-12">
          <p className="reveal text-xs uppercase tracking-[0.4em]">Join the movement</p>
          <h2 className="split mt-8 font-display text-6xl font-light leading-[0.95] md:text-[7vw]">
            <Words text="Together, we can make" /><br />
            <span className="italic"><Words text="saving mean more." /></span>
          </h2>
          <button data-magnetic onClick={() => go("plans")}
            className="reveal group relative mt-16 inline-flex overflow-hidden rounded-full bg-ink px-14 py-6 text-xs uppercase tracking-[0.3em] text-ivory">
            <span className="absolute inset-0 -translate-x-full bg-gold transition-transform duration-700 ease-[cubic-bezier(.7,0,.2,1)] group-hover:translate-x-0" />
            <span className="relative transition-colors group-hover:text-ink">Become a member</span>
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="mx-auto max-w-[1400px] px-6 pb-10 pt-24 md:px-12">
        <div className="grid gap-12 md:grid-cols-4">
          <div className="md:col-span-2">
            <Logo className="text-5xl md:text-7xl" />
            <p className="mt-6 max-w-sm text-sm text-muted-foreground">Save for yourself. Give hope to someone else.</p>
          </div>
          <div className="space-y-3 text-sm">
            <p className="text-xs uppercase tracking-[0.3em] text-primary">Contact</p>
            <a href="mailto:hello@saveme.com" className="block text-muted-foreground transition-colors hover:text-foreground">hello@saveme.com</a>
            <a href="#" className="block text-muted-foreground transition-colors hover:text-foreground">Privacy Policy</a>
            <a href="#" className="block text-muted-foreground transition-colors hover:text-foreground">Terms & Conditions</a>
          </div>
          <div className="space-y-3 text-sm">
            <p className="text-xs uppercase tracking-[0.3em] text-primary">Promotional draw</p>
            <p className="text-muted-foreground">Every active member is automatically entered into our monthly promotional draw. Terms and conditions apply.</p>
          </div>
        </div>
        <div className="mt-20 flex flex-col justify-between gap-4 border-t border-border pt-8 text-xs text-muted-foreground md:flex-row">
          <span>© {new Date().getFullYear()} Save Me, Save You. All rights reserved.</span>
          <button onClick={() => go("top")} className="uppercase tracking-[0.3em] hover:text-primary">Back to top ↑</button>
        </div>
      </footer>
    </div>
  );
}

function SectionLabel({ n, t }: { n: string; t: string }) {
  return (
    <div className="reveal mb-8 flex items-center gap-4 text-xs uppercase tracking-[0.35em] text-primary">
      <span>{n}</span><span className="h-px w-12 bg-primary" /><span>{t}</span>
    </div>
  );
}

function Words({ text }: { text: string }) {
  return (
    <>
      {text.split(" ").map((w, i) => (
        <span key={i} className="w inline-block overflow-hidden pb-[0.08em] align-bottom">
          <span className="inline-block">{w}&nbsp;</span>
        </span>
      ))}
    </>
  );
}

function SplitHeading({ text }: { text: string }) {
  return (
    <h2 className="split max-w-4xl font-display text-5xl font-light leading-[1] md:text-7xl">
      <Words text={text} />
    </h2>
  );
}

function Plan({ name, price, tag, perks, featured }: { name: string; price: string; tag: string; perks: string[]; featured?: boolean }) {
  return (
    <div data-hover className={`reveal group relative overflow-hidden border p-10 transition-all duration-700 hover:-translate-y-2 md:p-14 ${featured ? "border-primary bg-background" : "border-border bg-background/40"}`}>
      <div className="absolute -right-24 -top-24 h-64 w-64 rounded-full bg-gold opacity-0 blur-3xl transition-opacity duration-1000 group-hover:opacity-20" />
      <div className="relative flex items-center justify-between">
        <span className="text-xs uppercase tracking-[0.3em] text-primary">{tag}</span>
        {featured && <span className="bg-gold px-3 py-1 text-[10px] uppercase tracking-[0.2em] text-ink">Recommended</span>}
      </div>
      <h3 className="relative mt-10 font-display text-5xl">{name}</h3>
      <div className="relative mt-6 flex items-baseline gap-2">
        <span className="font-display text-7xl text-gold">${price}</span>
        <span className="text-sm text-muted-foreground">/ month</span>
      </div>
      <ul className="relative mt-10 space-y-4 border-t border-border pt-10">
        {perks.map((p) => (
          <li key={p} className="flex gap-4 text-sm"><span className="text-primary">✦</span>{p}</li>
        ))}
      </ul>
      <button className={`relative mt-12 w-full overflow-hidden py-5 text-xs uppercase tracking-[0.3em] transition-colors duration-500 ${featured ? "bg-gold text-ink" : "border border-border hover:border-primary hover:text-primary"}`}>
        Join {name}
      </button>
    </div>
  );
}

function Faq({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  const body = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (body.current) gsap.to(body.current, { height: open ? "auto" : 0, opacity: open ? 1 : 0, duration: 0.6, ease: "power3.inOut" });
  }, [open]);
  return (
    <div className="border-b border-border">
      <button onClick={() => setOpen(!open)} className="group flex w-full items-center justify-between py-8 text-left">
        <span className="font-display text-2xl transition-colors group-hover:text-primary md:text-3xl">{q}</span>
        <span className={`text-2xl text-primary transition-transform duration-500 ${open ? "rotate-45" : ""}`}>+</span>
      </button>
      <div ref={body} className="h-0 overflow-hidden opacity-0">
        <p className="max-w-xl pb-8 text-muted-foreground">{a}</p>
      </div>
    </div>
  );
}
