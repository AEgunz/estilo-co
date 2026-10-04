import { useEffect, useRef, useState } from "react";
import { trpc } from "@/providers/trpc";
import "../landing.css";

const PACKS = [
  { qty: 1, price: 199, unit: "199 درهم / الوحدة", save: null as string | null },
  { qty: 2, price: 349, unit: "174 درهم / الوحدة", save: "وفّر 49 درهم" },
  { qty: 3, price: 447, unit: "149 درهم / الوحدة", save: "وفّر 150 درهم" },
];

const WATCH_COLORS = [
  { name: "روز غولد", img: "/watch-rosegold.jpg" },
  { name: "ذهبي", img: "/watch-gold.jpg" },
  { name: "فضي", img: "/watch-silver.jpg" },
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
  const [itemColors, setItemColors] = useState<string[]>(["روز غولد"]);
  const [done, setDone] = useState(false);
  const chatRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setItemColors((prev) => {
      const defaultColors = ["روز غولد", "ذهبي", "فضي"];
      const newArray = [];
      for (let i = 0; i < pack.qty; i++) {
        newArray.push(prev[i] || defaultColors[i % defaultColors.length]);
      }
      return newArray;
    });
  }, [pack.qty]);

  const updateWatchColor = (index: number, colorName: string) => {
    setItemColors((prev) => {
      const copy = [...prev];
      copy[index] = colorName;
      return copy;
    });
  };

  const getSelectedColorSummary = () => {
    if (pack.qty === 1) return itemColors[0] || "روز غولد";

    const counts: Record<string, number> = {};
    for (let i = 0; i < pack.qty; i++) {
      const c = itemColors[i] || "روز غولد";
      counts[c] = (counts[c] || 0) + 1;
    }

    const entries = Object.entries(counts);
    if (entries.length === 1) {
      return `${pack.qty} × ${entries[0][0]}`;
    }

    return itemColors.map((c, i) => `ساعة ${i + 1}: ${c}`).join(" | ");
  };

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
    const finalColor = getSelectedColorSummary();
    createOrder.mutate({
      name: name.trim(),
      phone: phone.trim(),
      city: city.trim(),
      address: address.trim(),
      color: finalColor,
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
          {["01","02","03","04","05","06","07","08"].map((n) => (
            <span key={n}>{n}</span>
          ))}
        </div>
        <div className="content">
          <span className="eyebrow">جديد 2026</span>
          <h1>ساعة الحية…<br />الأناقة اللي كتلوى على المعصم ديالك</h1>
          <p>ساعة نسائية بتصميم الثعبان الفاخر، مرصّعة بالكريستال، متوفرة بثلاثة ألوان: الذهبي، الروز غولد والفضي. كوارتز ياباني أصلي.</p>
          <div className="cta-row">
            <a className="btn btn-solid" href="#quickorder">
              اطلبي الآن
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
            <span className="num">01 / 04</span>
          </div>
          <div className="gallery">
            <div className="g-item"><img src="/watch-rosegold.jpg" alt="روز غولد" /><span className="g-tag">روز غولد</span></div>
            <div className="g-item"><img src="/watch-gold.jpg" alt="ذهبي" /><span className="g-tag">ذهبي</span></div>
            <div className="g-item"><img src="/watch-silver.jpg" alt="فضي" /><span className="g-tag">فضي</span></div>
            <div className="g-item"><img src="/watch-side.jpg" alt="منظر جانبي" /><span className="g-tag">التفاصيل</span></div>
          </div>
        </div>
      </section>

      {/* BANNER IMAGE */}
      <section className="banner-section" style={{ padding: "40px 0 20px", background: "#f8f6f3" }}>
        <div className="wrap" style={{ maxWidth: 1100, margin: "0 auto", padding: "0 20px" }}>
          <div style={{ borderRadius: 12, overflow: "hidden", boxShadow: "0 8px 30px rgba(0,0,0,0.08)" }}>
            <img
              src="/watch-lifestyle.png"
              alt="ساعة الحية النسائية - Estilo-Co"
              style={{ width: "100%", height: "auto", display: "block", objectFit: "cover" }}
            />
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section className="dark">
        <div className="wrap">
          <div className="sec-head">
            <h2>علاش غادي تعجبك؟</h2>
            <span className="num">02 / 04</span>
          </div>
          <div className="feats">
            <div className="feat">
              <div className="f-num">01</div>
              <h3>تصميم الثعبان الأيقوني</h3>
              <p>سوار مرن كيلتف على المعصم بلا مشبك، شكل فاخر مستوحى من أرقى دور المجوهرات العالمية.</p>
            </div>
            <div className="feat">
              <div className="f-num">02</div>
              <h3>ترصيع بالكريستال</h3>
              <p>إطار الميناء مرصّع بأحجار كريستالية لامعة كتزيد الساعة بريق ولمعة فأي مناسبة.</p>
            </div>
            <div className="feat">
              <div className="f-num">03</div>
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
            <span className="num">03 / 04</span>
          </div>
          <div className="offer">
            <div className="o-img"><img src="/watch-gold.jpg" alt="ساعة الحية الذهبية" /></div>
            <div>
              <span className="badge">تخفيض 40% — اليوم فقط</span>
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
                اطلبي الآن
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

              <div className="color-selection-group" style={{ margin: "22px 0 10px" }}>
                <label style={{ display: "block", fontWeight: 700, fontSize: 15, marginBottom: 12 }}>
                  {pack.qty === 1 ? "اختر لون الساعة *" : `اختر ألوان الساعات (${pack.qty} ساعات) *`}
                </label>

                {Array.from({ length: pack.qty }).map((_, idx) => {
                  const selectedColor = itemColors[idx] || "روز غولد";
                  return (
                    <div
                      key={idx}
                      style={{
                        marginBottom: pack.qty > 1 ? 16 : 0,
                        background: pack.qty > 1 ? "#faf8f5" : "transparent",
                        padding: pack.qty > 1 ? "14px 16px" : 0,
                        borderRadius: 12,
                        border: pack.qty > 1 ? "1px solid #e8e2dc" : "none"
                      }}
                    >
                      {pack.qty > 1 && (
                        <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 10, color: "#111", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                          <span>الساعة رقم {idx + 1}</span>
                          <span style={{ color: "#b0541e", fontSize: 13, fontWeight: 800 }}>{selectedColor}</span>
                        </div>
                      )}

                      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 10 }}>
                        {WATCH_COLORS.map((c) => {
                          const isSelected = selectedColor === c.name;
                          return (
                            <button
                              key={c.name}
                              type="button"
                              onClick={() => updateWatchColor(idx, c.name)}
                              style={{
                                border: isSelected ? "2px solid #000" : "1px solid #e2ddd6",
                                borderRadius: 10,
                                padding: "8px 6px",
                                background: isSelected ? "#fff" : "#fcfbfa",
                                cursor: "pointer",
                                textAlign: "center",
                                transition: "all 0.2s ease",
                                boxShadow: isSelected ? "0 4px 14px rgba(0,0,0,0.12)" : "none",
                                position: "relative",
                                transform: isSelected ? "translateY(-1px)" : "none",
                              }}
                            >
                              {isSelected && (
                                <span style={{
                                  position: "absolute",
                                  top: 6,
                                  right: 6,
                                  background: "#000",
                                  color: "#fff",
                                  borderRadius: "50%",
                                  width: 18,
                                  height: 18,
                                  fontSize: 11,
                                  display: "grid",
                                  placeItems: "center",
                                  fontWeight: 800,
                                }}>
                                  ✓
                                </span>
                              )}
                              <img
                                src={c.img}
                                alt={c.name}
                                style={{
                                  width: "100%",
                                  aspectRatio: "1/1",
                                  objectFit: "cover",
                                  borderRadius: 7,
                                  marginBottom: 6,
                                  display: "block",
                                }}
                              />
                              <span style={{
                                fontSize: 13,
                                fontWeight: isSelected ? 800 : 500,
                                color: isSelected ? "#000" : "#555",
                                display: "block",
                              }}>
                                {c.name}
                              </span>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>

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
            <span className="num">04 / 04</span>
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
          اطلبي الآن
        </a>
      </div>

      <footer>
        <span>© 2026 ESTILO-CO — جميع الحقوق محفوظة</span>
        <span>الدفع عند الاستلام · توصيل لجميع المدن</span>
      </footer>
    </>
  );
}
