'use client';

import * as React from 'react';
import {
  AnimatePresence,
  motion,
  useReducedMotion,
  type HTMLMotionProps,
  type Transition,
  type Variants,
} from 'motion/react';

import {
  Highlight,
  HighlightItem,
  type HighlightItemProps,
  type HighlightProps,
} from '@/components/animate-ui/primitives/effects/highlight';
import {
  Accordion,
  AccordionItem,
  AccordionHeader,
  AccordionTrigger,
  AccordionPanel,
  type AccordionProps,
  type AccordionItemProps,
  type AccordionHeaderProps,
  type AccordionTriggerProps,
  type AccordionPanelProps,
} from '@/components/animate-ui/primitives/base/accordion';
import { getStrictContext } from '@/lib/get-strict-context';
import { useControlledState } from '@/hooks/use-controlled-state';

type FilesContextType = {
  open: string[];
  transition: Transition;
  /** Seconds between one row settling and the next starting. */
  stagger: number;
  reduceMotion: boolean;
};

type FolderContextType = {
  isOpen: boolean;
};

const [FilesProvider, useFiles] =
  getStrictContext<FilesContextType>('FilesContext');

const [FolderProvider, useFolder] =
  getStrictContext<FolderContextType>('FolderContext');

/**
 * One spring drives the panel height, the rows and the icon swap, so a folder
 * opening reads as a single gesture rather than three that happen to coincide.
 */
const SPRING: Transition = {
  type: 'spring',
  stiffness: 320,
  damping: 34,
  bounce: 0,
  restDelta: 0.005,
};

const DEFAULT_STAGGER = 0.035;

/** Rows fall in from the top on open and peel back off in reverse on close. */
const panelVariants = (stagger: number, reduceMotion: boolean): Variants => ({
  closed: {
    height: 0,
    opacity: 0,
    '--mask-stop': '0%',
    transition: {
      ...SPRING,
      staggerChildren: reduceMotion ? 0 : stagger,
      staggerDirection: -1,
    },
  },
  open: {
    height: 'auto',
    opacity: 1,
    '--mask-stop': '100%',
    transition: {
      ...SPRING,
      // The rows should not start moving before the panel has room for them.
      delayChildren: reduceMotion ? 0 : stagger,
      staggerChildren: reduceMotion ? 0 : stagger,
    },
  },
});

const rowVariants = (reduceMotion: boolean): Variants =>
  reduceMotion
    ? { closed: { opacity: 0 }, open: { opacity: 1 } }
    : {
        closed: { opacity: 0, y: -8, x: -6, filter: 'blur(2px)' },
        open: {
          opacity: 1,
          y: 0,
          x: 0,
          filter: 'blur(0px)',
          transition: SPRING,
        },
      };

type FilesProps = {
  children: React.ReactNode;
  defaultOpen?: string[];
  open?: string[];
  onOpenChange?: (open: string[]) => void;
  /** Overrides the spring shared by the panels, rows and icons. */
  transition?: Transition;
  /** Seconds between consecutive rows animating in. `0` disables the stagger. */
  stagger?: number;
} & Omit<AccordionProps, 'type' | 'defaultValue' | 'value' | 'onValueChange'>;

function Files({
  children,
  defaultOpen,
  open,
  onOpenChange,
  transition = SPRING,
  stagger = DEFAULT_STAGGER,
  style,
  ...props
}: FilesProps) {
  const [openValue, setOpenValue] = useControlledState({
    value: open,
    defaultValue: defaultOpen,
    onChange: onOpenChange,
  });

  const reduceMotion = useReducedMotion() ?? false;

  const context = React.useMemo<FilesContextType>(
    () => ({
      open: openValue ?? [],
      transition: reduceMotion ? { duration: 0 } : transition,
      stagger,
      reduceMotion,
    }),
    [openValue, transition, stagger, reduceMotion],
  );

  return (
    <FilesProvider value={context}>
      <Accordion
        data-slot="files"
        multiple
        defaultValue={defaultOpen}
        value={open}
        onValueChange={setOpenValue}
        style={{
          position: 'relative',
          overflow: 'auto',
          ...style,
        }}
        {...props}
      >
        {children}
      </Accordion>
    </FilesProvider>
  );
}

type FilesHighlightProps = Omit<HighlightProps, 'controlledItems' | 'mode'>;

function FilesHighlight({ hover = true, ...props }: FilesHighlightProps) {
  return (
    <Highlight
      data-slot="files-highlight"
      controlledItems
      mode="parent"
      hover={hover}
      {...props}
    />
  );
}

type FolderItemProps = AccordionItemProps;

function FolderItem({ value, ...props }: FolderItemProps) {
  const { open } = useFiles();

  return (
    <FolderProvider value={{ isOpen: open.includes(value) }}>
      <AccordionItem data-slot="folder-item" value={value} {...props} />
    </FolderProvider>
  );
}

type FolderHeaderProps = AccordionHeaderProps;

function FolderHeader(props: FolderHeaderProps) {
  return <AccordionHeader data-slot="folder-header" {...props} />;
}

type FolderTriggerProps = AccordionTriggerProps;

function FolderTrigger(props: FolderTriggerProps) {
  return <AccordionTrigger data-slot="folder-trigger" {...props} />;
}

type FolderPanelProps = AccordionPanelProps;

/**
 * The panel animates by variant label rather than by a literal target, so the
 * rows inside it inherit `open`/`closed` and can be staggered from here. The
 * label also stops at a nested panel, which drives itself from its own state.
 */
function FolderPanel({ transition, ...props }: FolderPanelProps) {
  const { transition: filesTransition, stagger, reduceMotion } = useFiles();
  const { isOpen } = useFolder();

  const variants = React.useMemo(
    () => panelVariants(stagger, reduceMotion),
    [stagger, reduceMotion],
  );

  return (
    <AccordionPanel
      data-slot="folder-panel"
      transition={transition ?? filesTransition}
      variants={variants}
      initial="closed"
      animate={isOpen ? 'open' : 'closed'}
      exit="closed"
      {...props}
    />
  );
}

type FileHighlightProps = HighlightItemProps;

function FileHighlight(props: FileHighlightProps) {
  return <HighlightItem data-slot="file-highlight" {...props} />;
}

type FileProps = HTMLMotionProps<'div'>;

function File(props: FileProps) {
  const { reduceMotion } = useFiles();
  const variants = React.useMemo(() => rowVariants(reduceMotion), [reduceMotion]);

  return <motion.div data-slot="file" variants={variants} {...props} />;
}

type FileIconProps = React.ComponentProps<'span'>;

function FileIcon(props: FileIconProps) {
  return <span data-slot="file-icon" {...props} />;
}

type FileLabelProps = React.ComponentProps<'span'>;

function FileLabel(props: FileLabelProps) {
  return <span data-slot="file-label" {...props} />;
}

type FolderHighlightProps = HighlightItemProps;

function FolderHighlight(props: FolderHighlightProps) {
  return <HighlightItem data-slot="folder-highlight" {...props} />;
}

type FolderProps = HTMLMotionProps<'div'>;

function Folder(props: FolderProps) {
  const { reduceMotion } = useFiles();
  const variants = React.useMemo(() => rowVariants(reduceMotion), [reduceMotion]);

  return <motion.div data-slot="folder" variants={variants} {...props} />;
}

type FolderIconProps = HTMLMotionProps<'span'> & {
  closeIcon: React.ReactNode;
  openIcon: React.ReactNode;
};

/**
 * The two icons cross over in place: the outgoing one shrinks and fades while
 * the incoming one grows into it, rather than the previous hard cut.
 */
function FolderIcon({ closeIcon, openIcon, transition, ...props }: FolderIconProps) {
  const { transition: filesTransition, reduceMotion } = useFiles();
  const { isOpen } = useFolder();

  return (
    <span
      data-slot="folder-icon"
      style={{ display: 'inline-grid', placeItems: 'center' }}
    >
      <AnimatePresence initial={false} mode="popLayout">
        <motion.span
          key={isOpen ? 'open' : 'close'}
          style={{ gridArea: '1 / 1', display: 'inline-flex' }}
          initial={
            reduceMotion
              ? { opacity: 0 }
              : { opacity: 0, scale: 0.6, rotate: isOpen ? -25 : 25 }
          }
          animate={
            reduceMotion
              ? { opacity: 1 }
              : { opacity: 1, scale: 1, rotate: 0 }
          }
          exit={
            reduceMotion
              ? { opacity: 0 }
              : { opacity: 0, scale: 0.6, rotate: isOpen ? 25 : -25 }
          }
          transition={transition ?? filesTransition}
          {...props}
        >
          {isOpen ? openIcon : closeIcon}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}

type FolderLabelProps = React.ComponentProps<'span'>;

function FolderLabel(props: FolderLabelProps) {
  return <span data-slot="folder-label" {...props} />;
}

export {
  Files,
  FilesHighlight,
  FolderItem,
  FolderHeader,
  FolderTrigger,
  FolderPanel,
  FileHighlight,
  File,
  FileIcon,
  FileLabel,
  FolderHighlight,
  Folder,
  FolderIcon,
  FolderLabel,
  useFiles,
  useFolder,
  type FilesProps,
  type FilesHighlightProps,
  type FolderItemProps,
  type FolderHeaderProps,
  type FolderTriggerProps,
  type FolderPanelProps,
  type FileHighlightProps,
  type FileProps,
  type FileIconProps,
  type FileLabelProps,
  type FolderHighlightProps,
  type FolderProps,
  type FolderIconProps,
  type FolderLabelProps,
  type FilesContextType,
  type FolderContextType,
};
