import { useEffect, useRef, useState } from "react";
import CustomBulletButton from "../../componentes/CustomBulletButton/CustomBulletButton";
import ArrowBox from "../../componentes/ArrowBox/ArrowBox";
import ProfilePhotoRotator from "../../componentes/ProfilePhotoRotator/ProfilePhotoRotator";
import ProfileSectionRail from "../../componentes/ProfileSectionRail/ProfileSectionRail";
import CardBox from "../../componentes/CardBox/CardBox";
import type { InfoTexts, InfoTextsLanguage } from "../../utils/infoTextsCollection";
import profileImage from "../../assets/img-profile.jpg";
import arrow1 from "../../assets/arrow-1.png";
import "./ProfilePage.css";

type ProfilePageProps = {
  infoTexts: InfoTexts;
  languageKey: InfoTextsLanguage;
};

/**
 * Página de perfil (Sobre mim): hero, resumo profissional e habilidades gerais.
 *
 * @param props Textos por idioma e chave do idioma atual (para ajuste de tipografia).
 * @returns Bloco principal da seção Sobre mim.
 */
const ProfilePage: React.FC<ProfilePageProps> = ({ infoTexts, languageKey }) => {
  const hasResume = infoTexts.profile_page.professionalResume.length > 0;
  const hasSkills = infoTexts.profile_page.globalSkills.length > 0;
  const hasResumeBlock = hasResume || hasSkills;
  const skillsLine = infoTexts.profile_page.globalSkills.join("・");
  const aboutRef = useRef<HTMLDivElement>(null);
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
          <div className="hero-intro__main">
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
          </div>
        </section>

        <div className="profile-hero-triple-arrows-slot">
          <ArrowBox orientation="horizontal" />
        </div>
      </div>

      <CardBox
        ref={aboutRef}
        className={`profile-about ${aboutRevealed ? "is-revealed" : ""}`}
        aria-labelledby="profile-about-heading"
      >
        <ProfileSectionRail
          imageSrc={arrow1}
          showLine={false}
          className="profile-about-rail--header"
        >
          <div className="profile-about-heading-stack">
            <h2 id="profile-about-heading" className="profile-about-title">
              <span className="profile-about-title-text">{infoTexts.about}</span>
            </h2>
            <div className="profile-about-heading-rule" aria-hidden="true" />
          </div>
        </ProfileSectionRail>

        {hasResumeBlock ? (
          <ProfileSectionRail
            imageSrc={arrow1}
            showRing={false}
            className="profile-about-rail--resume"
          >
            <div className="profile-about-row">
              <div className="profile-about-visual">
                <ProfilePhotoRotator />
              </div>
              <div className="profile-about-copy">
                {hasResume &&
                  infoTexts.profile_page.professionalResume.map((paragraph, index) => (
                    <p key={index} className="profile-about-paragraph">
                      {paragraph}
                    </p>
                  ))}
              </div>
            </div>
          </ProfileSectionRail>
        ) : null}

        {hasSkills ? (
          <ProfileSectionRail
            imageSrc={arrow1}
            className="profile-about-rail--skills"
          >
            <div className="profile-about-heading-stack">
              <h2 id="profile-about-heading" className="profile-about-title">
                <span className="profile-about-title-text">{infoTexts.profile_page.second_title}</span>
              </h2>
              <div className="profile-about-heading-rule" aria-hidden="true" />
            </div>
            <p className="profile-global-skills">{skillsLine}</p>
          </ProfileSectionRail>
        ) : null}
      </CardBox>
    </div>
  );
};

export default ProfilePage;
