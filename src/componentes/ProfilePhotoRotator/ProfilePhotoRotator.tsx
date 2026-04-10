import { useEffect, useState } from "react";
import photoRotator1 from "../../assets/photo-rotator-1.jpg";
import photoRotator2 from "../../assets/photo-rotator-2.jpg";
import photoRotator3 from "../../assets/photo-rotator-3.jpg";
import "./ProfilePhotoRotator.css";

const PROFILE_PHOTO_ROTATOR_IMAGES = [
  photoRotator1,
  photoRotator2,
  photoRotator3,
];

/**
 * Alterna fotos da seção de perfil em transição suave.
 *
 * @returns Galeria rotativa de fotos.
 */
const ProfilePhotoRotator: React.FC = () => {
  const [slideIndex, setSlideIndex] = useState(0);

  useEffect(() => {
    const id = window.setInterval(() => {
      setSlideIndex(
        (previous) => (previous + 1) % PROFILE_PHOTO_ROTATOR_IMAGES.length
      );
    }, 3500);
    return () => window.clearInterval(id);
  }, []);

  return (
    <div className="profile-photo-rotator" aria-hidden="true">
      {PROFILE_PHOTO_ROTATOR_IMAGES.map((photoSrc, index) => (
        <img
          key={photoSrc}
          className={`profile-photo-slide ${index === slideIndex ? "active" : ""}`}
          src={photoSrc}
          alt=""
          aria-hidden="true"
        />
      ))}
    </div>
  );
};

export default ProfilePhotoRotator;
