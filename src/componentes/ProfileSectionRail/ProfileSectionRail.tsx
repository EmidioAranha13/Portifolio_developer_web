import type { ReactNode } from "react";
import "./ProfileSectionRail.css";

type ProfileSectionRailProps = {
  /** URL da imagem dentro do anel (ex.: seta). */
  imageSrc: string;
  imageAlt?: string;
  /** Retrato circular com borda em degradê (default: true). */
  showRing?: boolean;
  /** Linha vertical que acompanha a altura do conteúdo à direita (default: true). */
  showLine?: boolean;
  children: ReactNode;
  className?: string;
};

/**
 * Trilho lateral: anel com imagem + linha vertical em degradê do tema, alinhado ao conteúdo.
 * Útil para seções tipo timeline no perfil.
 */
const ProfileSectionRail: React.FC<ProfileSectionRailProps> = ({
  imageSrc,
  imageAlt = "",
  showRing = true,
  showLine = true,
  children,
  className,
}) => {
  const rootClass = [
    "profile-section-rail",
    !showRing && "profile-section-rail--no-ring",
    !showLine && "profile-section-rail--no-line",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div className={rootClass}>
      <div className="profile-section-rail__track" aria-hidden="true">
        {showRing ? (
          <div className="profile-section-rail__ring">
            <div className="profile-section-rail__inner">
              <img
                className="profile-section-rail__img"
                src={imageSrc}
                alt={imageAlt}
                width={22}
                height={22}
                decoding="async"
              />
            </div>
          </div>
        ) : null}
        {showLine ? <div className="profile-section-rail__line" /> : null}
      </div>
      <div className="profile-section-rail__body">{children}</div>
    </div>
  );
};

export default ProfileSectionRail;
