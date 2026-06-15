export type { EducationActivity, EducationLeafLabels, EducationYearEntry } from "../Types";

import { globals } from "./globals";
import { profile_page } from "./profile_page";
import { experience_page } from "./experience_page";
import { education_page } from "./education_page";
import { skill_page } from "./skill_page";
import { certificate_page } from "./certificate_page";
import { projects_page } from "./projects_page";
import { contactme_page } from "./contactme_page";

export const infoTextsCollection = {
  br: {
    ...globals.br,
    profile_page: profile_page.br,
    experience_page: experience_page.br,
    education_page: education_page.br,
    skill_page: skill_page.br,
    certificate_page: certificate_page.br,
    projects_page: projects_page.br,
    contactme_page: contactme_page.br,
  },
  en: {
    ...globals.en,
    profile_page: profile_page.en,
    experience_page: experience_page.en,
    education_page: education_page.en,
    skill_page: skill_page.en,
    certificate_page: certificate_page.en,
    projects_page: projects_page.en,
    contactme_page: contactme_page.en,
  },
  ja: {
    ...globals.ja,
    profile_page: profile_page.ja,
    experience_page: experience_page.ja,
    education_page: education_page.ja,
    skill_page: skill_page.ja,
    certificate_page: certificate_page.ja,
    projects_page: projects_page.ja,
    contactme_page: contactme_page.ja,
  },
}

export type InfoTextsLanguage = keyof typeof infoTextsCollection;
export type InfoTexts = (typeof infoTextsCollection)[InfoTextsLanguage];
