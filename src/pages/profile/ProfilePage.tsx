import { useEffect, useRef, useState } from "react";
import CustomBulletButton from "../../componentes/CustomBulletButton/CustomBulletButton";
import type { InfoTexts, InfoTextsLanguage } from "../../utils/infoTextsCollection";
import profileImage from "../../assets/img-profile.jpg";
import "./ProfilePage.css";

type ProfilePageProps = {
  infoTexts: InfoTexts;
  languageKey: InfoTextsLanguage;
};

/** Cores de exemplo até haver fotos reais em assets. */
const PHOTO_PLACEHOLDER_SWATCHES = [
  "#01689D",
  "#3FA874",
  "#6BBE68",
  "#9CD65D",
  "#17937C",
];

/**
 * Bloco que alterna slides visuais (placeholders coloridos por enquanto).
 *
 * @returns Área de fotos com transição suave entre “slides”.
 */
function ProfilePhotoRotator() {
  const [slideIndex, setSlideIndex] = useState(0);

  useEffect(() => {
    const id = window.setInterval(() => {
      setSlideIndex(
        (previous) => (previous + 1) % PHOTO_PLACEHOLDER_SWATCHES.length
      );
    }, 3500);
    return () => window.clearInterval(id);
  }, []);

  return (
    <div className="profile-photo-rotator" aria-hidden="true">
      {PHOTO_PLACEHOLDER_SWATCHES.map((color, index) => (
        <div
          key={color}
          className={`profile-photo-slide ${index === slideIndex ? "active" : ""}`}
          style={{ background: color }}
        />
      ))}
    </div>
  );
}

/**
 * Página de perfil (Sobre mim): hero, resumo profissional e habilidades gerais.
 *
 * @param props Textos por idioma e chave do idioma atual (para ajuste de tipografia).
 * @returns Bloco principal da seção Sobre mim.
 */
const ProfilePage: React.FC<ProfilePageProps> = ({ infoTexts, languageKey }) => {
  const hasResume = infoTexts.professionalResume.length > 0;
  const hasSkills = infoTexts.globalSkills.length > 0;
  const skillsLine = infoTexts.globalSkills.join("・");
  const aboutRef = useRef<HTMLElement>(null);
  const [aboutRevealed, setAboutRevealed] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (reduceMotion) {
      setAboutRevealed(true);
      return;
    }

    const node = aboutRef.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry) setAboutRevealed(entry.isIntersecting);
      },
      { threshold: 0.08, rootMargin: "0px 0px -6% 0px" }
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <div className="profile-page">
      <div className="profile-hero-stage">
        <section className="hero-intro" aria-labelledby="profile-hero-name">
          <div className="hero-avatar-ring">
            <img
              className="hero-avatar-image"
              src={profileImage}
              alt={infoTexts.name}
            />
          </div>

          <div className="hero-texts">
            <h1
              id="profile-hero-name"
              className={`hero-name ${languageKey === "ja" ? "hero-name-ja" : ""}`}
            >
              {infoTexts.name}
            </h1>
            <h2 className="hero-role">{infoTexts.role}</h2>
            <h2 className="hero-role">{infoTexts.techStack}</h2>
            <div className="hero-actions">
              <CustomBulletButton
                label={infoTexts.downloadCV}
                variant="primary"
                icon="download"
              />
              <CustomBulletButton
                label={infoTexts.contactMe}
                variant="outline"
                icon="paperPlane"
              />
            </div>
          </div>
        </section>
      </div>

      <section
        ref={aboutRef}
        className={`profile-about ${aboutRevealed ? "is-revealed" : ""}`}
        aria-labelledby="profile-about-heading"
      >
        <h2 id="profile-about-heading" className="profile-about-title">
          {infoTexts.about}
        </h2>

        {(hasResume || hasSkills) && (
          <>
            <div className="profile-about-row">
              <div className="profile-about-copy">
                {hasResume &&
                  infoTexts.professionalResume.map((paragraph, index) => (
                    <p key={index} className="profile-about-paragraph">
                      {paragraph}
                    </p>
                  ))}
              </div>
              <div className="profile-about-visual">
                <ProfilePhotoRotator />
              </div>
            </div>

            {hasSkills && (
              <p className="profile-global-skills">{skillsLine}</p>
            )}
          </>
        )}
      </section>
    </div>
  );
};

export default ProfilePage;
