// Every section kind the visual editor can show, in "Add section" order.
//
// To add or improve a kind, edit its component in this folder and its entry here.
// A component receives the section as a bindable `block` prop and reads shared
// editor data (class, characters, skill trees…) through `visualEditor()`.
// The `satisfies Record<BlockKind, …>` makes TypeScript fail if a kind is missing.
import type { Component } from 'svelte';
import { blockKinds, blockLabels, type BlockKind, type BuildBlock } from '#lib/builds.js';
import type { IconName } from '../ui/icons';
import TextSection from './TextSection.svelte';
import CalloutSection from './CalloutSection.svelte';
import ItemsSection from './ItemsSection.svelte';
import SkillsSection from './SkillsSection.svelte';
import EquipmentSection from './EquipmentSection.svelte';
import ImageSection from './ImageSection.svelte';
import VideoSection from './VideoSection.svelte';

export type SectionComponent = Component<{ block: BuildBlock }, Record<string, never>, 'block'>;
export interface SectionKind {
  /** Shown in menus; also the default title of a new section (see newBlock). */
  label: string;
  icon: IconName;
  /** One line for the "Add section" menu. */
  description: string;
  component: SectionComponent;
}

export const sectionKinds = {
  text: { label: blockLabels.text, icon: 'text', description: 'Headings, lists, tables and inline tooltips.', component: TextSection },
  callout: { label: blockLabels.callout, icon: 'callout', description: 'A coloured tip, warning, strengths or weaknesses card.', component: CalloutSection },
  items: { label: blockLabels.items, icon: 'items', description: 'Catalog items players can hover for details.', component: ItemsSection },
  skills: { label: blockLabels.skills, icon: 'skills', description: 'An interactive skill planner with your allocation.', component: SkillsSection },
  equipment: { label: blockLabels.equipment, icon: 'equipment', description: 'Gear from one of your characters, or built by hand.', component: EquipmentSection },
  image: { label: blockLabels.image, icon: 'image', description: 'A screenshot or diagram from an HTTPS link.', component: ImageSection },
  video: { label: blockLabels.video, icon: 'video', description: 'A YouTube video, embedded privately.', component: VideoSection }
} satisfies Record<BlockKind, SectionKind>;

export const sectionKindOrder: readonly BlockKind[] = blockKinds;
