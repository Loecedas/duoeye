import { createContext, useContext, type ReactNode } from 'react';

export type EmojiIconMode = 'emoji' | 'svg';

export const EMOJI_ICON_MODE_STORAGE_KEY = 'duoeye_emoji_icon_mode';

const EmojiModeContext = createContext<EmojiIconMode>('emoji');

export function resolveEmojiIconMode(value: string | null): EmojiIconMode {
  return value === 'svg' ? 'svg' : 'emoji';
}

export function EmojiModeProvider({
  mode,
  children,
}: {
  mode: EmojiIconMode;
  children: ReactNode;
}) {
  return <EmojiModeContext.Provider value={mode}>{children}</EmojiModeContext.Provider>;
}

export function useEmojiIconMode(): EmojiIconMode {
  return useContext(EmojiModeContext);
}
