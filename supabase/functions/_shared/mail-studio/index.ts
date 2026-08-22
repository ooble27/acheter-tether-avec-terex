// Terex Mail Studio — public API
export { T, BASE_URL, LOGO_URL, SUPPORT_EMAIL } from './tokens.ts';
export {
  BrandHeader,
  HeroImage,
  BigTitle,
  FeatureRow,
  CTAButton,
  TransactionReceipt,
  QuietDivider,
  Footer,
  TextBlock,
  HighlightBox,
  BLOCK_REGISTRY,
} from './blocks.ts';
export type {
  BrandHeaderProps,
  HeroImageProps,
  BigTitleProps,
  FeatureRowProps,
  FeatureItem,
  CTAButtonProps,
  TransactionReceiptProps,
  ReceiptLine,
  QuietDividerProps,
  FooterProps,
  TextBlockProps,
  HighlightBoxProps,
} from './blocks.ts';
export { renderEmail, renderBlocks, wrapMailStudio } from './renderer.ts';
export type { BlockSpec, MailTemplate } from './renderer.ts';
