export interface ThemeDef {
  id: string;
  name: string;
  previewColor: string;
  bgHex: string;
  surfaceHex: string;
  raisedHex: string;
  insetHex: string;
  description: string;
  isLight?: boolean;
}

export const GAME_THEMES: ThemeDef[] = [
  {
    id: 'graphite',
    name: 'Than chì mặc định',
    previewColor: '#141416',
    bgHex: '#141416',
    surfaceHex: '#1b1c1f',
    raisedHex: '#242529',
    insetHex: '#101113',
    description: 'Nền than chì trung tính, tập trung vào lá bài và đề toán',
    isLight: false,
  },
  {
    id: 'slate_ink',
    name: 'Mực đen dịu mắt',
    previewColor: '#16181d',
    bgHex: '#16181d',
    surfaceHex: '#1d2026',
    raisedHex: '#262a32',
    insetHex: '#111318',
    description: 'Sắc xám than lạnh nhẹ cho phiên luyện tập ban đêm',
    isLight: false,
  },
  {
    id: 'warm_study',
    name: 'Gỗ tối phòng đọc',
    previewColor: '#181614',
    bgHex: '#181614',
    surfaceHex: '#211e1b',
    raisedHex: '#2b2723',
    insetHex: '#12100e',
    description: 'Tông nâu than ấm, gợi cảm giác mặt bàn học',
    isLight: false,
  },
  {
    id: 'light_pure',
    name: 'Giấy trắng học thuật',
    previewColor: '#f6f5f1',
    bgHex: '#f6f5f1',
    surfaceHex: '#ffffff',
    raisedHex: '#efede7',
    insetHex: '#eae7df',
    description: 'Nền sáng như trang giấy thi, chữ đậm dễ đọc ban ngày',
    isLight: true,
  },
  {
    id: 'light_ivory',
    name: 'Giấy ngà cổ điển',
    previewColor: '#f4f0e6',
    bgHex: '#f4f0e6',
    surfaceHex: '#fcfaf4',
    raisedHex: '#ebe5d7',
    insetHex: '#e4dece',
    description: 'Nền ngà dịu mắt, giảm chói khi đọc đề toán dài',
    isLight: true,
  },
];

const LEGACY_MAP: Record<string, string> = {
  void: 'graphite',
  violet: 'slate_ink',
  emerald: 'graphite',
  crimson: 'warm_study',
  ocean: 'slate_ink',
  amber: 'warm_study',
};

export const getSavedTheme = (): ThemeDef => {
  if (typeof window === 'undefined') return GAME_THEMES[0];
  const savedId = localStorage.getItem('mathrune_theme_id');
  const mappedId = savedId ? (LEGACY_MAP[savedId] || savedId) : 'graphite';
  const found = GAME_THEMES.find(t => t.id === mappedId);
  const theme = found || GAME_THEMES[0];
  applyThemeToDom(theme);
  return theme;
};

export const applyThemeToDom = (theme: ThemeDef) => {
  if (typeof window === 'undefined') return;
  const root = document.documentElement;
  if (theme.isLight) {
    root.classList.remove('dark');
    root.classList.add('light-theme');
  } else {
    root.classList.add('dark');
    root.classList.remove('light-theme');
  }
  root.style.setProperty('--bg-canvas', theme.bgHex);
  root.style.setProperty('--bg-surface', theme.surfaceHex);
  root.style.setProperty('--bg-raised', theme.raisedHex);
  root.style.setProperty('--bg-inset', theme.insetHex);
  document.body.style.backgroundColor = theme.bgHex;
};

export const saveTheme = (themeId: string): ThemeDef => {
  const theme = GAME_THEMES.find(t => t.id === themeId) || GAME_THEMES[0];
  if (typeof window !== 'undefined') {
    localStorage.setItem('mathrune_theme_id', theme.id);
    applyThemeToDom(theme);
  }
  return theme;
};
