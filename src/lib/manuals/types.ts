// =============================================================================
// COLLABORATIVE MANUAL EDITING — Type Definitions
// =============================================================================

/** Supported languages for manual editing */
export type ManualLanguage = 'en' | 'pt' | 'es' | 'el' | 'ru' | 'uk';

export const MANUAL_LANGUAGES: { code: ManualLanguage; label: string }[] = [
  { code: 'en', label: 'English' },
  { code: 'pt', label: 'Portugues' },
  { code: 'es', label: 'Espanol' },
  { code: 'el', label: 'Ellinika' },
  { code: 'ru', label: 'Russkij' },
  { code: 'uk', label: "Ukrains'ka" },
];

/** Block types available in the manual editor */
export type BlockType = 'heading' | 'text' | 'image' | 'divider' | 'page-break' | 'image-row';

/** Content shape per block type */
export interface HeadingContent {
  text: string;
  level: 1 | 2 | 3;
}

export interface TextContent {
  html: string;
}

export interface ImageContent {
  src: string;
  alt: string;
  caption?: string;
}

export interface ImageRowItem {
  src: string;
  alt: string;
}

export interface ImageRowContent {
  images: ImageRowItem[]; // 2–4 images rendered side-by-side
  caption?: string;
}

// Divider and page-break have no content fields

export type BlockContent =
  | HeadingContent
  | TextContent
  | ImageContent
  | ImageRowContent
  | Record<string, never>;

/** A manual (e.g. "Rose Meditation Level 1") */
export interface Manual {
  id: string;
  slug: string;
  title: string;
  description: string | null;
  cover_image: string | null;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

/** A content block within a manual for a specific language */
export interface ManualBlock {
  id: string;
  manual_id: string;
  language: ManualLanguage;
  block_type: BlockType;
  content: BlockContent;
  position: number;
  updated_by: string | null;
  created_at: string;
  updated_at: string;
}

/** Role assigned after PIN verification */
export type ManualRole = 'editor' | 'teacher';

/** PIN verification response */
export interface PinVerifyResponse {
  success: boolean;
  role?: ManualRole;
  error?: string;
}

/** API response wrapper */
export interface ApiResponse<T> {
  data?: T;
  error?: string;
}
