import "./ProfileHeroTripleArrowsDown.css";

const ARROW_ROWS = (
  <>
    <span className="profile-hero-triple-arrows-down__arrow" />
    <span className="profile-hero-triple-arrows-down__arrow" />
    <span className="profile-hero-triple-arrows-down__arrow" />
  </>
);

const ProfileHeroTripleArrowsDown: React.FC = () => (
  <div className="profile-hero-triple-arrows-down" aria-hidden="true">
    <div className="profile-hero-triple-arrows-down__panel">
      <div className="profile-hero-triple-arrows-down__viewport">
        <div className="profile-hero-triple-arrows-down__track">
          {ARROW_ROWS}
          {ARROW_ROWS}
        </div>
      </div>
    </div>
  </div>
);

export default ProfileHeroTripleArrowsDown;
