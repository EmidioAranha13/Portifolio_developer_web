import "./CarouselPhoto.css";

type CarouselPhotoProps = {
  photos: string[];
};

const CarouselPhoto: React.FC<CarouselPhotoProps> = ({ photos }) => {
  if (photos.length === 0) return null;

  const minCardsPerGroup = 8;
  const repeatCount = Math.max(1, Math.ceil(minCardsPerGroup / photos.length));
  const repeatedPhotos = Array.from({ length: repeatCount }, () => photos).flat();

  return (
    <div className="carousel-photo" aria-label="Galeria de fotos da experiência">
      <div className="carousel-photo__group">
        {repeatedPhotos.map((photo, index) => (
          <div key={`photo-a-${index}`} className="carousel-photo__card">
            <img src={photo} alt="" className="carousel-photo__image" />
          </div>
        ))}
      </div>
      <div className="carousel-photo__group" aria-hidden="true">
        {repeatedPhotos.map((photo, index) => (
          <div key={`photo-b-${index}`} className="carousel-photo__card">
            <img src={photo} alt="" className="carousel-photo__image" />
          </div>
        ))}
      </div>
    </div>
  );
};

export default CarouselPhoto;
