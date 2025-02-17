// src/components/Home.jsx
import { useEffect, useState } from "react";
import styles from "./Home.module.css";

const Home = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const parallaxText = document.querySelector("[data-parallax]");
      if (parallaxText) {
        parallaxText.style.transform = `translateY(${window.scrollY * 0.3}px)`;
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <section 
      id="home"
      className={`${styles["hero-section"]} relative h-screen flex items-center justify-center`}
    >
      <ParticleBackground /> {/* Effet de particules */}

      <div className={`${styles["hero-overlay"]} absolute inset-0`}></div>
      <div className="relative z-10 text-center px-4" data-parallax>
        <h1 className={`${styles["hero-title"]} text-5xl md:text-6xl font-bold mb-4`}>
          Trouve la mission de tes rêves
        </h1>
        <p className={`${styles["hero-subtitle"]} text-xl md:text-2xl mb-8`}>
          Connecte-toi avec les meilleures entreprises et freelances.
        </p>
        <button className={styles["cta-button"]}>Explorer les Missions</button>
      </div>

      {/* Séparateur SVG */}
      <div className={styles["svg-separator"]}>
        <svg viewBox="0 0 1200 120" preserveAspectRatio="none">
          <path d="M0,0V46.29c47.65,22,104,29.17,158,15,70-20,135-55.5,210-55.5,74,0,139,35.5,210,55.5,54,14.29,110.33,7.14,158-15V0Z" className={styles["shape-fill"]}></path>
        </svg>
      </div>
    </section>
  );
};

export default Home;
