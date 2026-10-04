import { useEffect, useRef, useState } from "react";
import { trpc } from "@/providers/trpc";
import "../landing.css";

const PACKS = [
  { qty: 1, price: 199, unit: "199 درهم / الوحدة", save: null as string | null },
  { qty: 2, price: 349, unit: "174 درهم / الوحدة", save: "وفّر 49 درهم" },
  { qty: 3, price: 447, unit: "149 درهم / الوحدة", save: "وفّر 150 درهم" },
];

const REVIEWS = [
  { who: "سلمى — كازا", color: "#9b30a8", text: "وصلاتني الساعة لبارح، صراحة أحسن من التصويرة بزاف! الكريستال كيلمع بزاف", stars: true, time: "21:14" },
  { who: "خديجة — الرباط", color: "#0b7a6f", text: "خديت الروز غولد، صحباتي كلهم سولوني فين شريتها 😍 التوصيل كان سريع، نهارين ووصلات", stars: false, time: "21:20" },
  { out: true, text: "شكرا بزاف أختي خديجة 🌹 مرحبا بيك فأي وقت", time: "21:21" },
  { who: "مريم — مراكش", color: "#b0541e", text: "جودة مزيانة على الثمن، والسوار مرن كيجي مضبوط فالمعصم. عجباتني العلبة ديال الهدية", stars: true, time: "21:26" },
  { who: "ياسمين — طنجة", color: "#1a5fb4", text: "أنا كنت خايفة من الطلب أونلاين، ولكن الدفع عند الاستلام طمّني. الساعة وصلات سليمة وشقّالة 👌", stars: false, time: "21:32" },
  { who: "فاطمة الزهراء — فاس", color: "#7a3fbf", text: "شريت جوج، وحدة ليا ووحدة هدية لماما. عجباتها بزاف، الله يبارك 🥰", stars: true, time: "21:40" },
];

export default function Home() {
  const [pack, setPack] = useState(PACKS[0]);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [city, setCity] = useState("");
  const [address, setAddress] = useState("");
  const [color, setColor] = useState("روز غولد");
  const [done, setDone] = useState(false);
  const chatRef = useRef<HTMLDivElement>(null);

  const createOrder = trpc.orders.create.useMutation({
    onSuccess: () => setDone(true),
  });

  useEffect(() => {
    const chat = chatRef.current;
    if (!chat) return;
    const bubbles = chat.querySelectorAll<HTMLElement>(".bubble");
    bubbles.forEach((b) => (b.style.animationPlayState = "paused"));
    const obs = new IntersectionObserver(
      (es) => {
        es.forEach((e) => {
          if (e.isIntersecting) {
            bubbles.forEach((b) => (b.style.animationPlayState = "running"));
            obs.disconnect();
          }
        });
      },
      { threshold: 0.25 },
    );
    obs.observe(chat);
    return () => obs.disconnect();
  }, []);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    createOrder.mutate({
      name: name.trim(),
      phone: phone.trim(),
      city: city.trim(),
      address: address.trim(),
      color,
      qty: pack.qty,
      total: pack.price,
    });
  };

  return (
    <>
      <header>
        <div className="brand">ESTILO-CO</div>
        <nav>
          <a href="#gallery">التشكيلة</a>
          <a href="#offer">العرض</a>
          <a href="#reviews">آراء الناس</a>
        </nav>
      </header>

      {/* HERO */}
      <div className="hero">
        <div className="bg">
          <img src="/watch_design_gold.png" alt="ساعة الحية الذهبية" />
        </div>
        <div className="spine">
          {["٠١","٠٢","٠٣","٠٤","٠٥","٠٦","٠٧","٠٨"].map((n) => (
            <span key={n}>{n}</span>
          ))}
        </div>
        <div className="content">
          <span className="eyebrow">جديد ٢٠٢٦</span>
          <h1>ساعة الحية…<br />الأناقة اللي كتلوى على المعصم ديالك</h1>
          <p>ساعة نسائية بتصميم الثعبان الفاخر، مرصّعة بالكريستال، متوفرة بثلاثة ألوان: الذهبي، الروز غولد والفضي. كوارتز ياباني أصلي.</p>
          <div className="cta-row">
            <a className="btn btn-solid" href="#quickorder">
              طلب سريع — الدفع عند الاستلام
            </a>
            <a className="btn" href="#gallery">شوف التشكيلة</a>
          </div>
        </div>
      </div>

      {/* MARQUEE */}
      <div className="marquee">
        <div className="marquee-track">
          {[0, 1].map((i) => (
            <span key={i}>
              توصيل مجاني لجميع المدن <i>✦</i> الدفع عند الاستلام <i>✦</i> كوارتز ياباني <i>✦</i> ضمان سنة كاملة <i>✦</i> توصيل فـ 24/48 ساعة <i>✦</i>
            </span>
          ))}
        </div>
      </div>

      {/* GALLERY */}
      <section id="gallery">
        <div className="wrap">
          <div className="sec-head">
            <h2>التشكيلة كاملة</h2>
            <span className="num">٠١ / ٠٤</span>
          </div>
          <div className="gallery">
            <div className="g-item"><img src="/watch-rosegold.jpg" alt="روز غولد" /><span className="g-tag">روز غولد</span></div>
            <div className="g-item"><img src="/watch-gold.jpg" alt="ذهبي" /><span className="g-tag">ذهبي</span></div>
            <div className="g-item"><img src="/watch-silver.jpg" alt="فضي" /><span className="g-tag">فضي</span></div>
            <div className="g-item"><img src="/watch-side.jpg" alt="منظر جانبي" /><span className="g-tag">التفاصيل</span></div>
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section className="dark">
        <div className="wrap">
          <div className="sec-head">
            <h2>علاش غادي تعجبك؟</h2>
            <span className="num">٠٢ / ٠٤</span>
          </div>
          <div className="feats">
            <div className="feat">
              <div className="f-num">٠١</div>
              <h3>تصميم الثعبان الأيقوني</h3>
              <p>سوار مرن كيلتف على المعصم بلا مشبك، شكل فاخر مستوحى من أرقى دور المجوهرات العالمية.</p>
            </div>
            <div className="feat">
              <div className="f-num">٠٢</div>
              <h3>ترصيع بالكريستال</h3>
              <p>إطار الميناء مرصّع بأحجار كريستالية لامعة كتزيد الساعة بريق ولمعة فأي مناسبة.</p>
            </div>
            <div className="feat">
              <div className="f-num">٠٣</div>
              <h3>ميناء عرق اللؤلؤ</h3>
              <p>وجه الساعة من عرق اللؤلؤ الطبيعي بأرقام رومانية، مع موتور كوارتز ياباني دقيق وعمري.</p>
            </div>
          </div>
        </div>
      </section>

      {/* OFFER */}
      <section id="offer">
        <div className="wrap">
          <div className="sec-head">
            <h2>عرض خاص محدود</h2>
            <span className="num">٠٣ / ٠٤</span>
          </div>
          <div className="offer">
            <div className="o-img"><img src="/watch-gold.jpg" alt="ساعة الحية الذهبية" /></div>
            <div>
              <span className="badge">تخفيض ٤٠٪ — اليوم فقط</span>
              <div style={{ display: "flex", alignItems: "baseline", gap: 16, marginBottom: 6 }}>
                <div className="price-new">199 <small>درهم</small></div>
                <div className="price-old">329 درهم</div>
              </div>
              <ul>
                <li>الدفع عند الاستلام — ما كتخلص حتى توصلك الساعة ليديك</li>
                <li>توصيل مجاني لجميع المدن المغربية (24 حتى 48 ساعة)</li>
                <li>علبة هدية فاخرة + ضمان سنة كاملة</li>
                <li>إمكانية الاستبدال فـ 7 أيام إلا ما عجباتكش</li>
              </ul>
              <a className="btn btn-wa" href="#quickorder" style={{ background: "#000", borderColor: "#000" }}>
                طلب سريع — الدفع عند الاستلام
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* QUICK ORDER */}
      <section className="quick" id="quickorder">
        <div className="wrap">
          <div className="sec-head" style={{ borderColor: "rgba(0,0,0,.15)" }}>
            <h2>طلب سريع</h2>
            <span className="num">الدفع عند الاستلام</span>
          </div>
          {done ? (
            <div className="q-form" style={{ textAlign: "center", padding: "60px 28px" }}>
              <div style={{ fontSize: 52 }}>✅</div>
              <h3 style={{ fontSize: 24, margin: "14px 0 10px" }}>توصلنا بالطلب ديالك!</h3>
              <p style={{ color: "#6B6B6B", lineHeight: 1.9 }}>
                شكرا {name}! غادي نتواصلو معاك فأقرب وقت فالرقم <b style={{ direction: "ltr", display: "inline-block" }}>{phone}</b> باش نأكدو التوصيل.
              </p>
            </div>
          ) : (
            <form className="q-form" onSubmit={submit}>
              <div className="packs">
                {PACKS.map((p) => (
                  <label key={p.qty} className={"pack" + (pack.qty === p.qty ? " active" : "")}>
                    <input
                      type="radio"
                      name="qty"
                      checked={pack.qty === p.qty}
                      onChange={() => setPack(p)}
                    />
                    {p.save && <span className="p-save">{p.save}</span>}
                    <span className="p-qty">{p.qty === 1 ? "1 ساعة" : p.qty + " ساعات"}</span>
                    <div className="p-price">{p.price} <small>درهم</small></div>
                    <div className="p-unit">{p.unit}</div>
                  </label>
                ))}
              </div>

              <label htmlFor="fname">الاسم الكامل *</label>
              <input id="fname" type="text" placeholder="مثال: سلمى العلوي" required value={name} onChange={(e) => setName(e.target.value)} />

              <label htmlFor="fphone">رقم الهاتف *</label>
              <input id="fphone" type="tel" placeholder="مثال: 0612345678" required pattern="[0-9+ ]{9,15}" value={phone} onChange={(e) => setPhone(e.target.value)} />

              <label htmlFor="fcity">المدينة *</label>
              <input id="fcity" type="text" placeholder="مثال: الدار البيضاء" required value={city} onChange={(e) => setCity(e.target.value)} />

              <label htmlFor="faddr">العنوان الكامل *</label>
              <input id="faddr" type="text" placeholder="الحي، الزنقة، رقم الدار…" required value={address} onChange={(e) => setAddress(e.target.value)} />

              <label htmlFor="fcolor">اللون</label>
              <select id="fcolor" value={color} onChange={(e) => setColor(e.target.value)}>
                <option>روز غولد</option>
                <option>ذهبي</option>
                <option>فضي</option>
                <option>ميكس (فحال الطلبات ديال 2 ولا 3)</option>
              </select>

              <div className="q-total">
                <span>المجموع (توصيل مجاني)</span>
                <span className="t-price">{pack.price} درهم</span>
              </div>

              {createOrder.isError && (
                <p style={{ color: "#c00", fontSize: 13, marginTop: 12, textAlign: "center" }}>
                  وقع مشكل، عاود المحاولة من فضلك.
                </p>
              )}

              <button type="submit" className="q-submit" disabled={createOrder.isPending}>
                {createOrder.isPending ? "كنصيفطو الطلب…" : "أكّد الطلب"}
              </button>
              <div className="q-note">ما كتخلص والو دابا — الخلاص ملي توصلك الساعة ليديك</div>
            </form>
          )}
        </div>
      </section>

      {/* WHATSAPP REVIEWS */}
      <section className="wa-section" id="reviews">
        <div className="wrap">
          <div className="sec-head">
            <h2>آراء الناس فـ واتساب</h2>
            <span className="num">٠٤ / ٠٤</span>
          </div>
          <div className="phone">
            <div className="wa-header">
              <div className="wa-avatar">S</div>
              <div>
                <div className="name">زبائن Estilo-Co</div>
                <div className="status">متصل الآن</div>
              </div>
            </div>
            <div className="chat" ref={chatRef}>
              {REVIEWS.map((r, i) => (
                <div key={i} className={"bubble " + (r.out ? "out" : "in")} style={{ animationDelay: 0.1 + i * 0.2 + "s" }}>
                  {r.who && <div className="who" style={{ color: r.color }}>{r.who}</div>}
                  {r.text} {r.stars && <span className="stars">★★★★★</span>}
                  <div className="meta">
                    {r.time} {r.out && <span className="ticks">✓✓</span>}
                  </div>
                </div>
              ))}
            </div>
            <div className="wa-input">
              <div className="field">كتب الرسالة ديالك…</div>
              <div className="send">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="#fff"><path d="M2 21l21-9L2 3v7l15 2-15 2z" /></svg>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ORDER STRIP */}
      <div className="order">
        <h2>جاهزة تلبسيها؟</h2>
        <p>عمّر الفورم وصيفط الطلب ديالك، وحنا نتواصلو معاك ونوصّلوها ليك حتى لباب الدار.</p>
        <a className="btn btn-solid" href="#quickorder">
          طلب سريع — الدفع عند الاستلام
        </a>
      </div>

      <footer>
        <span>© 2026 ESTILO-CO — جميع الحقوق محفوظة</span>
        <span>الدفع عند الاستلام · توصيل لجميع المدن</span>
      </footer>
    </>
  );
}
