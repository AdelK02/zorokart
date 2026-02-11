"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronLeft, faChevronRight, faPaperPlane } from "@fortawesome/free-solid-svg-icons";

const slides = [
  {
    id: 1,
    title: "അമ്മയുടെ കൈപ്പുണ്യം, നിങ്ങളുടെ വാതിൽക്കൽ.",
    description: "ശുദ്ധവും മായംചേർക്കാത്തതുമായ വീട്ടുഭക്ഷണം സമീപവാസികളിൽ നിന്ന്",
    image: "/images/web 1.png",
    // buttons: [
    //   { label: "Register", href: "/register", type: "primary" },
    //   { label: "Learn More", href: "#about", type: "secondary" }
    // ]
  },
  {
    id: 2,
    title: "വീട്ടിലെ ഭക്ഷണം പോലെ സുരക്ഷിതം.",
    description: "ശുചിത്വത്തോടെ തയ്യാറാക്കിയ ചൂടേറിയ ഭക്ഷണം – വിശ്വാസത്തോടെ",
    image: "/images/web 2.png",
    // buttons: [
    //   { label: "Read More About Us", href: "#about", type: "primary" }
    // ]
  },
  {
    id: 3,
    title: "വീട്ടമ്മമാരുടെ പാചകമികവ്, സ്ഥിരവരുമാനമായി.",
    description: "സമൂഹകേന്ദ്രീകൃതമായൊരു ഭക്ഷണ വിപ്ലവം",
    image: "/images/web 3.png",
    buttons: [
      { label: "Register", href: "/register", type: "primary" }
    ]
  }
];

export default function Home() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [question, setQuestion] = useState("");

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const handleSendEmail = () => {
    if (!question.trim()) return;
    const subject = encodeURIComponent("Question from Akshayavahini Vendor Page");
    const body = encodeURIComponent(question);
    window.location.href = `mailto:Zorokartindia2025@gmail.com?subject=${subject}&body=${body}`;
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) =>
        prev === slides.length - 1 ? 0 : prev + 1
      );
    }, 5000); // 5 seconds

    return () => clearInterval(interval); // cleanup
  }, []);

  return (
    <main className="home-main">
      <section className="carousel-section">
        <div className="carousel-container">
          {slides.map((slide, index) => (
            <div
              key={slide.id}
              className={`carousel-slide ${index === currentSlide ? "active" : ""}`}
            >
              <div className="carousel-text-area">
                <div className="text-content">
                  <h1>{slide.title}</h1>
                  <p>{slide.description}</p>
                  {slide.buttons?.length > 0 && (
                    <div className="carousel-actions">
                      {slide.buttons.map((btn, bIdx) => (
                        <a key={bIdx} href={btn.href}>
                          <button className={`carousel-btn ${btn.type}`}>
                            {btn.label}
                          </button>
                        </a>
                      ))}
                    </div>
                  )}

                </div>

                <div className="carousel-nav">
                  <button onClick={prevSlide} className="nav-arrow" aria-label="Previous Slide">
                    <FontAwesomeIcon icon={faChevronLeft} />
                  </button>
                  <button onClick={nextSlide} className="nav-arrow" aria-label="Next Slide">
                    <FontAwesomeIcon icon={faChevronRight} />
                  </button>
                </div>
              </div>

              <div className="carousel-image-area">
                <div className="image-wrapper">
                  <Image
                    src={slide.image}
                    alt={slide.title}
                    fill
                    style={{ objectFit: "cover" }}
                    priority
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* about */}
      <section id="about" className="section">
        <article className="about-content">
          <h1>About Akshayavahini</h1>
          <p>
            Akshayavahini is bringing the 'Mother’s touch' to food delivery. While we prepare for our grand opening, we invite passionate home cooks to join our community early. Start your journey toward financial independence now so you’re ready to serve your first hot, home-cooked meal on day one.
          </p>
          <h2>Our Mission</h2>
          <p>
            To provide a seamless, clutter-free platform where quality meets simplicity. Every pixel
            in Akshayavahini is carefully placed to ensure you spend less time navigating and more time
            discovering.
          </p>
        </article>
      </section>

      {/* how to register */}
      <section id="how-to-register" className="how-register-section">
        <h1 className="how-title">How to register</h1>

        <div className="steps-wrapper">

          {/* STEP 1 */}
          <div className="step-card step-large">
            <div className="step-content">
              <div>
                <h3>Step 1</h3>
                <p>
                  Click the Register button to navigate to the screen in the image and fill the form.
                </p>
                <p>• Select whether you want to register as a Vendor or an Agent.</p>
                <p>• Enter your name, email and phone number.</p>
                <p>• Upload a short video introducing yourself.</p>
              </div>
              <Link href="/register">
                <button className="register-btn">Register</button>
              </Link>
            </div>
            <div className="step-image">
              <Image src="/images/ss3.png" alt="Step 1" width={450} height={400} />
            </div>
          </div>

          {/* STEP 2 */}
          <div className="step-card">
            <div className="step-content">
              <h3>Step 2</h3>
              <ul className="step-list">
                <li>Complete the payment via any UPI app</li>
                <li>Click the Pay via any UPI button if you're using a mobile device.</li>
                <li>If you're on a desktop, scan the QR code using your UPI app.</li>
              </ul>
            </div>
          </div>

          {/* STEP 3 */}
          <div className="step-card">
            <div className="step-content">
              <h3>Step 3</h3>
              <ul className="step-list">
                <li>Submit the form</li>
                <li>If you have completed the payment, please check the payment completion and submit</li>
                <li>If you didn't, leave the checkbox as it is and submit.</li>
              </ul>
            </div>
          </div>

        </div>
      </section>

      {/* questions */}
      <section id="questions" className="questions-section">
        <div className="questions-header">
          <h1 className="questions-title">Questions?</h1>
          <p className="questions-subtitle">Everything you need to know about becoming a vendor.</p>
        </div>

        <div className="faq-grid">
          <div className="faq-item">
            <h3>What's the registration fee?</h3>
            <p>There's a small fee to get started. Once you pay, your invoice goes straight to your WhatsApp. No hidden costs, no surprises.</p>
            <div className="faq-divider"></div>
            <h3>How do I get paid?</h3>
            <p>You keep the money from every order. No middleman taking a cut. Direct payment for your work.</p>
          </div>

          <div className="faq-vertical-divider"></div>

          <div className="faq-item">
            <h3>When can I start selling?</h3>
            <p>After registration and payment are complete, you're in. Customers will find you and orders will come. Start cooking.</p>
            <div className="faq-divider"></div>
            <h3>Can I upload a video later?</h3>
            <p>Upload it during registration. Show us what you cook best. That video is how customers get to know you.</p>
          </div>
        </div>

        <div className="still-questions">
          <h2>Still have questions?</h2>
          <p>Reach out to us anytime.</p>
          <div className="question-form">
            <input
              type="text"
              placeholder="Ask your Question here"
              aria-label="Ask your Question here"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSendEmail()}
            />
            <button
              className="send-btn"
              aria-label="Send"
              onClick={handleSendEmail}
            >
              <FontAwesomeIcon icon={faPaperPlane} />
            </button>
          </div>
        </div>
      </section>
    </main>
  );
}
