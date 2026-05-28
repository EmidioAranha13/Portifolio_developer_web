import { useId, useState } from "react";
import FormTextArea from "../../componentes/FormTextArea/FormTextArea";
import FormTextField from "../../componentes/FormTextField/FormTextField";
import ProfileSectionRail from "../../componentes/ProfileSectionRail/ProfileSectionRail";
import type { InfoTexts } from "../../utils/infoTextsCollection";
import arrow1 from "../../assets/arrow-1.png";
import githubIcon from "../../assets/github.png";
import linkedinIcon from "../../assets/linkedin.png";
import localIcon from "../../assets/local.png";
import phoneIcon from "../../assets/phone.png";
import "./ContactMePage.css";

type ContactMePageProps = {
  title: string;
  infoTexts: InfoTexts;
};

/**
 * Página Contato: informações à esquerda e formulário à direita.
 */
const ContactMePage: React.FC<ContactMePageProps> = ({ title: _title, infoTexts }) => {
  const formId = useId();
  const page = infoTexts.contactme_page;

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");

  const nameId = `${formId}-name`;
  const emailId = `${formId}-email`;
  const subjectId = `${formId}-subject`;
  const messageId = `${formId}-message`;

  return (
    <div className="contact-me-page">
      <div className="contact-me-page__content glass-surface">
        <ProfileSectionRail imageSrc={arrow1} className="contact-me-page__rail">
          <div className="contact-me-page__heading-stack">
            <h2 className="contact-me-page__section-title">
              <span className="contact-me-page__section-title-text">{page.title}</span>
            </h2>
            <div className="contact-me-page__heading-rule" aria-hidden="true" />
          </div>

          <div className="contact-me-page__columns">
            <aside className="contact-me-page__info" aria-label="Informações de contato">
              <p className="contact-me-page__description">{page.description}</p>

              <div className="contact-me-page__info-item contact-me-page__info-item--with-icon">
                <img
                  className="contact-me-page__info-item-icon"
                  src={phoneIcon}
                  alt=""
                  aria-hidden
                  decoding="async"
                />
                <div className="contact-me-page__info-item-body">
                  <span className="contact-me-page__info-label">{page.phone_label}</span>
                  <a className="contact-me-page__info-link" href={`tel:${page.phone_href}`}>
                    {page.phone_link}
                  </a>
                </div>
              </div>

              <div className="contact-me-page__info-item contact-me-page__info-item--with-icon">
                <img
                  className="contact-me-page__info-item-icon"
                  src={linkedinIcon}
                  alt=""
                  aria-hidden
                  decoding="async"
                />
                <div className="contact-me-page__info-item-body">
                  <span className="contact-me-page__info-label">{page.linkedin_label}</span>
                  <a
                    className="contact-me-page__info-link"
                    href={page.linkedin_url}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {page.linkedin_link}
                  </a>
                </div>
              </div>

              <div className="contact-me-page__info-item contact-me-page__info-item--with-icon">
                <img
                  className="contact-me-page__info-item-icon"
                  src={githubIcon}
                  alt=""
                  aria-hidden
                  decoding="async"
                />
                <div className="contact-me-page__info-item-body">
                  <span className="contact-me-page__info-label">{page.github_label}</span>
                  <a
                    className="contact-me-page__info-link"
                    href={page.github}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {page.github_link}
                  </a>
                </div>
              </div>

              <div className="contact-me-page__info-item contact-me-page__info-item--with-icon">
                <img
                  className="contact-me-page__info-item-icon"
                  src={localIcon}
                  alt=""
                  aria-hidden
                  decoding="async"
                />
                <div className="contact-me-page__info-item-body">
                  <span className="contact-me-page__info-label">{page.location_label}</span>
                  <p className="contact-me-page__info-text">{page.location}</p>
                </div>
              </div>
            </aside>

            <form className="contact-me-page__form" noValidate>
              <div className="contact-me-page__field-row">
                <div className="contact-me-page__field">
                  <label className="contact-me-page__label" htmlFor={nameId}>
                    {page.name_label}
                  </label>
                  <FormTextField
                    id={nameId}
                    value={name}
                    onChange={setName}
                    placeholder={page.name_placeholder}
                    autoComplete="name"
                  />
                </div>

                <div className="contact-me-page__field">
                  <label className="contact-me-page__label" htmlFor={emailId}>
                    {page.email_label}
                  </label>
                  <FormTextField
                    id={emailId}
                    type="email"
                    value={email}
                    onChange={setEmail}
                    placeholder={page.email_placeholder}
                    autoComplete="email"
                  />
                </div>
              </div>

              <div className="contact-me-page__field">
                <label className="contact-me-page__label" htmlFor={subjectId}>
                  {page.subject_label}
                </label>
                <FormTextField
                  id={subjectId}
                  value={subject}
                  onChange={setSubject}
                  placeholder={page.subject_placeholder}
                />
              </div>

              <div className="contact-me-page__field">
                <label className="contact-me-page__label" htmlFor={messageId}>
                  {page.message_label}
                </label>
                <FormTextArea
                  id={messageId}
                  value={message}
                  onChange={setMessage}
                  placeholder={page.message_placeholder}
                />
              </div>
            </form>
          </div>
        </ProfileSectionRail>
      </div>
    </div>
  );
};

export default ContactMePage;
