/**
 * Teachers Aid PDF — Per-page metadata
 *
 * Maps each page of the Teachers Aid PDF to a human-readable title
 * and section label, used by the per-page print UI.
 */

export interface TeachersAidPage {
  /** 0-based page index in the PDF */
  pageIndex: number;
  /** Display page number (matches the PDF footer) */
  displayPage: string;
  /** Section / level label */
  section: string;
  /** Page title */
  title: string;
}

export const teachersAidPages: TeachersAidPage[] = [
  { pageIndex: 0, displayPage: '1', section: 'Cover', title: 'Cover Page' },
  { pageIndex: 1, displayPage: '2', section: 'Contents', title: 'Table of Contents' },
  { pageIndex: 2, displayPage: '3', section: 'Opening', title: 'Agreements, Important to Know & History' },
  { pageIndex: 3, displayPage: '4', section: 'Level 1', title: 'Level 1 Divider \u2014 Foundational Practices' },
  { pageIndex: 4, displayPage: '5', section: 'Level 1', title: 'Slides 1 & 2' },
  { pageIndex: 5, displayPage: '6', section: 'Level 1', title: 'Slides 3 & 4' },
  { pageIndex: 6, displayPage: '7', section: 'Level 1', title: 'Slides 5 & 6' },
  { pageIndex: 7, displayPage: '8', section: 'Level 1', title: 'Slides 7 & 8' },
  { pageIndex: 8, displayPage: '9', section: 'Level 1', title: 'Slides 9 & 10' },
  { pageIndex: 9, displayPage: '10', section: 'Level 1', title: 'Slides 11 & 12' },
  { pageIndex: 10, displayPage: '11', section: 'Level 1', title: 'Slides 13 & 14' },
  { pageIndex: 11, displayPage: '12', section: 'Level 1', title: 'Slides 15, 16, 17 & 18' },
  { pageIndex: 12, displayPage: '13', section: 'Level 2', title: 'Level 2 Divider \u2014 Space Preparation & Chakra Activation' },
  { pageIndex: 13, displayPage: '14', section: 'Level 2', title: 'Slides 1 & 2 \u2014 Sacred Space' },
  { pageIndex: 14, displayPage: '15', section: 'Level 2', title: 'Slides 3 & 4 \u2014 Sacred Space' },
  { pageIndex: 15, displayPage: '16', section: 'Level 2', title: 'Lower Chakras \u2014 1st & 2nd' },
  { pageIndex: 16, displayPage: '17', section: 'Level 2', title: 'Middle Chakras \u2014 3rd & 4th' },
  { pageIndex: 17, displayPage: '18', section: 'Level 2', title: 'Upper Chakras \u2014 5th & 6th' },
  { pageIndex: 18, displayPage: '19', section: 'Level 2', title: '7th Chakra & Aura' },
  { pageIndex: 19, displayPage: '20', section: 'Level 2', title: 'Golden Sticky Roses \u2014 All Four Phases' },
  { pageIndex: 20, displayPage: '21', section: 'Level 2', title: 'Slides Overview \u2014 Space, Chakras & Cleansing' },
  { pageIndex: 21, displayPage: '22', section: 'Level 2', title: 'Slides 17, 18, 19 & 20' },
  { pageIndex: 22, displayPage: '23', section: 'Level 3', title: 'Level 3 Divider \u2014 Advanced Practice' },
  { pageIndex: 23, displayPage: '24', section: 'Level 3', title: 'Slides 1 & 2 \u2014 Advanced' },
  { pageIndex: 24, displayPage: '25', section: 'Level 3', title: 'Slides 3 & 4 \u2014 Advanced' },
  { pageIndex: 25, displayPage: '26', section: 'Level 3', title: 'Slides 5 & 6 \u2014 Advanced' },
  { pageIndex: 26, displayPage: '27', section: 'Closing', title: 'Closing Page' },
];
