import { useForm, ValidationError } from "@formspree/react";
import { useEffect, useId, useRef, useState, type FormEvent } from "react";
import CustomBulletButton from "../../componentes/CustomBulletButton/CustomBulletButton";
import FormTextArea, { MESSAGE_MAX_LENGTH } from "../../componentes/FormTextArea/FormTextArea";
import FormTextField from "../../componentes/FormTextField/FormTextField";
import { ContactMeResponseModal } from "../../componentes/modal";
import ProfileSectionRail from "../../componentes/ProfileSectionRail/ProfileSectionRail";
import { formatE164PhoneInput, isValidE164Phone } from "../../utils/e164Phone";
import type { InfoTexts } from "../../utils/infoTextsCollection";
import arrow1 from "../../assets/arrow-1.png";
import gmailIcon from "../../assets/gmail.png";
import githubIcon from "../../assets/github.png";
import linkedinIcon from "../../assets/linkedin.png";
import localIcon from "../../assets/local.png";
import phoneIcon from "../../assets/phone.png";
import "./ContactMePage.css";

type ContactMePageProps = {
  title: string;
  infoTexts: InfoTexts;
};

type ContactFormFields = {
  name: string;
  email: string;
  yourContact: string;
  subject: string;
  message: string;
};

type FeedbackModalKind = "success" | "error" | "processing";

const FORMSPREE_FORM_ID = import.meta.env.VITE_FORMSPREE_FORM_ID ?? "";

/** Exibir botões de debug do modal (sem enviar ao Formspree). */
const SHOW_CONTACT_FORM_DEBUG = false;
const DEBUG_PROCESSING_MS = 5000;

/**
 * Página Contato: informações à esquerda e formulário à direita.
 */
const ContactMePage: React.FC<ContactMePageProps> = ({ title: _title, infoTexts }) => {
  const formId = useId();
  const formRef = useRef<HTMLFormElement>(null);
  const pendingSubmissionRef = useRef(false);
  const page = infoTexts.contactme_page;
  const formspreeEnabled = FORMSPREE_FORM_ID.length > 0;

  const [state, handleSubmit, resetFormspree] = useForm<ContactFormFields>(
    formspreeEnabled ? FORMSPREE_FORM_ID : "contact-form-not-configured"
  );

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [yourContact, setYourContact] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [feedbackModal, setFeedbackModal] = useState<FeedbackModalKind | null>(null);
  const debugProcessingTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const nameId = `${formId}-name`;
  const emailId = `${formId}-email`;
  const yourContactId = `${formId}-your-contact`;
  const subjectId = `${formId}-subject`;
  const messageId = `${formId}-message`;
  const messageCountId = `${formId}-message-count`;

  const resetFormFields = () => {
    setName("");
    setEmail("");
    setYourContact("");
    setSubject("");
    setMessage("");
    syncPhoneFieldValidity("");
  };

  const syncPhoneFieldValidity = (value: string) => {
    const input = document.getElementById(yourContactId) as HTMLInputElement | null;
    if (!input) return;

    if (!value.trim() || isValidE164Phone(value)) {
      input.setCustomValidity("");
      return;
    }

    input.setCustomValidity(page.form_phone_invalid_message);
  };

  const handleYourContactChange = (value: string) => {
    const formatted = formatE164PhoneInput(value);
    setYourContact(formatted);
    syncPhoneFieldValidity(formatted);
  };

  const closeFeedbackModal = () => {
    if (debugProcessingTimerRef.current) {
      clearTimeout(debugProcessingTimerRef.current);
      debugProcessingTimerRef.current = null;
    }
    setFeedbackModal(null);
    resetFormspree();
  };

  useEffect(
    () => () => {
      if (debugProcessingTimerRef.current) clearTimeout(debugProcessingTimerRef.current);
    },
    [],
  );

  const openDebugModal = (result: "success" | "error") => {
    if (debugProcessingTimerRef.current) {
      clearTimeout(debugProcessingTimerRef.current);
    }
    setFeedbackModal("processing");
    debugProcessingTimerRef.current = setTimeout(() => {
      debugProcessingTimerRef.current = null;
      setFeedbackModal(result);
    }, DEBUG_PROCESSING_MS);
  };

  useEffect(() => {
    if (!pendingSubmissionRef.current || state.submitting) return;

    pendingSubmissionRef.current = false;

    if (state.succeeded) {
      resetFormFields();
      setFeedbackModal("success");
      return;
    }

    if (state.errors) {
      setFeedbackModal("error");
    }
  }, [state.succeeded, state.errors, state.submitting]);

  const onFormSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!formspreeEnabled) return;

    const form = formRef.current ?? event.currentTarget;

    syncPhoneFieldValidity(yourContact);
    if (!form.reportValidity()) return;

    pendingSubmissionRef.current = true;
    setFeedbackModal("processing");
    void handleSubmit(event);
  };

  const isSubmitDisabled = state.submitting || !formspreeEnabled;
  const submitLabel = state.submitting ? page.form_submitting_label : page.form_submit_label;

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
                  src={gmailIcon}
                  alt=""
                  aria-hidden
                  decoding="async"
                />
                <div className="contact-me-page__info-item-body">
                  <span className="contact-me-page__info-label">{page.myEmail_label}</span>
                  <a className="contact-me-page__info-link" href={`mailto:${page.myEmail}`}>
                    {page.myEmail_link}
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

            <form
              ref={formRef}
              className="contact-me-page__form"
              onSubmit={onFormSubmit}
              noValidate
            >
              <div className="contact-me-page__field-row">
                <div className="contact-me-page__field">
                  <label className="contact-me-page__label" htmlFor={nameId}>
                    {page.name_label}
                  </label>
                  <FormTextField
                    id={nameId}
                    name="name"
                    value={name}
                    onChange={setName}
                    placeholder={page.name_placeholder}
                    autoComplete="name"
                    required
                    disabled={state.submitting}
                  />
                  <ValidationError
                    prefix={page.name_label}
                    field="name"
                    errors={state.errors}
                    className="contact-me-page__field-error"
                  />
                </div>

                <div className="contact-me-page__field">
                  <label className="contact-me-page__label" htmlFor={yourContactId}>
                    {page.yourContact}
                  </label>
                  <FormTextField
                    id={yourContactId}
                    name="yourContact"
                    type="tel"
                    value={yourContact}
                    onChange={handleYourContactChange}
                    placeholder={page.yourContact_placeholder}
                    autoComplete="tel"
                    inputMode="tel"
                    required
                    disabled={state.submitting}
                  />
                  <ValidationError
                    prefix={page.yourContact}
                    field="yourContact"
                    errors={state.errors}
                    className="contact-me-page__field-error"
                  />
                </div>
              </div>

              <div className="contact-me-page__field">
                <label className="contact-me-page__label" htmlFor={emailId}>
                  {page.email_label}
                </label>
                <FormTextField
                  id={emailId}
                  name="email"
                  type="email"
                  value={email}
                  onChange={setEmail}
                  placeholder={page.email_placeholder}
                  autoComplete="email"
                  required
                  disabled={state.submitting}
                />
                <ValidationError
                  prefix={page.email_label}
                  field="email"
                  errors={state.errors}
                  className="contact-me-page__field-error"
                />
              </div>

              <div className="contact-me-page__field">
                <label className="contact-me-page__label" htmlFor={subjectId}>
                  {page.subject_label}
                </label>
                <FormTextField
                  id={subjectId}
                  name="subject"
                  value={subject}
                  onChange={setSubject}
                  placeholder={page.subject_placeholder}
                  required
                  disabled={state.submitting}
                />
                <ValidationError
                  prefix={page.subject_label}
                  field="subject"
                  errors={state.errors}
                  className="contact-me-page__field-error"
                />
              </div>

              <div className="contact-me-page__field">
                <div className="contact-me-page__field-label-row">
                  <label className="contact-me-page__label" htmlFor={messageId}>
                    {page.message_label}
                  </label>
                  <span
                    id={messageCountId}
                    className="contact-me-page__char-count"
                    aria-live="polite"
                  >
                    {message.length}/{MESSAGE_MAX_LENGTH}
                  </span>
                </div>
                <FormTextArea
                  id={messageId}
                  name="message"
                  value={message}
                  onChange={setMessage}
                  placeholder={page.message_placeholder}
                  ariaDescribedBy={messageCountId}
                  maxLength={MESSAGE_MAX_LENGTH}
                  required
                  disabled={state.submitting}
                />
                <ValidationError
                  prefix={page.message_label}
                  field="message"
                  errors={state.errors}
                  className="contact-me-page__field-error"
                />
              </div>

              {!formspreeEnabled ? (
                <p
                  className="contact-me-page__form-feedback contact-me-page__form-feedback--warning"
                  role="status"
                >
                  {page.form_config_missing_message}
                </p>
              ) : null}

              <div
                className={`contact-me-page__form-actions${
                  SHOW_CONTACT_FORM_DEBUG ? " contact-me-page__form-actions--debug" : ""
                }`}
              >
                <CustomBulletButton
                  type="submit"
                  label={submitLabel}
                  variant="primary"
                  icon="paperPlane"
                  disabled={isSubmitDisabled}
                  aria-disabled={isSubmitDisabled}
                />
                {SHOW_CONTACT_FORM_DEBUG ? (
                  <>
                    <button
                      type="button"
                      className="contact-me-page__debug-btn contact-me-page__debug-btn--success"
                      onClick={() => openDebugModal("success")}
                    >
                      {page.form_debug_success_label}
                    </button>
                    <button
                      type="button"
                      className="contact-me-page__debug-btn contact-me-page__debug-btn--error"
                      onClick={() => openDebugModal("error")}
                    >
                      {page.form_debug_error_label}
                    </button>
                  </>
                ) : null}
              </div>
            </form>
          </div>
        </ProfileSectionRail>
      </div>

      {feedbackModal ? (
        <ContactMeResponseModal
          isOpen
          onClose={closeFeedbackModal}
          variant={feedbackModal}
          closeLabel={page.form_modal_close_label}
          processingTitle={page.form_modal_processing_title}
          processingMessage={page.form_modal_processing_message}
          successTitle={page.form_modal_success_title}
          successMessage={page.form_success_message}
          errorTitle={page.form_modal_error_title}
          errorMessage={page.form_error_message}
        />
      ) : null}
    </div>
  );
};

export default ContactMePage;
