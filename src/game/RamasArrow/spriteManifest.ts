import type { SpriteAssets, SpriteClipDefinition, SpriteClipName } from './types';

export const LPC_BASE_FRAME_SIZE = 128;
export const LPC_AIM_HOLD_FRAME = 6;

export const LPC_CLIPS: Record<SpriteClipName, SpriteClipDefinition> = {
  idle: {
    src: '/assets/lpc/idle.png',
    frameWidth: 64,
    frameHeight: 64,
    frameCount: 2,
    fps: 3,
    loop: true,
    rowIndex: 3,
    normalizedFrameSize: LPC_BASE_FRAME_SIZE,
    anchor: { x: 84, y: 72 },
  },
  walk: {
    src: '/assets/lpc/walk_128.png',
    frameWidth: 128,
    frameHeight: 128,
    frameCount: 9,
    fps: 10,
    loop: true,
    rowIndex: 3,
    normalizedFrameSize: LPC_BASE_FRAME_SIZE,
    anchor: { x: 90, y: 70 },
  },
  shoot: {
    src: '/assets/lpc/shoot.png',
    frameWidth: 64,
    frameHeight: 64,
    frameCount: 13,
    fps: 16,
    loop: false,
    rowIndex: 3,
    normalizedFrameSize: LPC_BASE_FRAME_SIZE,
    anchor: { x: 96, y: 68 },
  },
  run: {
    src: '/assets/lpc/run.png',
    frameWidth: 64,
    frameHeight: 64,
    frameCount: 8,
    fps: 12,
    loop: true,
    rowIndex: 3,
    normalizedFrameSize: LPC_BASE_FRAME_SIZE,
    anchor: { x: 88, y: 70 },
  },
};

export function getClipDefinition(clipName: SpriteClipName): SpriteClipDefinition {
  return LPC_CLIPS[clipName];
}

export function getClipSourceScale(clipName: SpriteClipName): number {
  const clip = getClipDefinition(clipName);
  return clip.normalizedFrameSize / clip.frameWidth;
}

export function getClipDrawSize(clipName: SpriteClipName, displayScale: number) {
  const clip = getClipDefinition(clipName);
  const sourceScale = getClipSourceScale(clipName);

  return {
    width: clip.frameWidth * sourceScale * displayScale,
    height: clip.frameHeight * sourceScale * displayScale,
  };
}

export function getClipAnchor(clipName: SpriteClipName, displayScale: number) {
  const clip = getClipDefinition(clipName);
  return {
    x: clip.anchor.x * displayScale,
    y: clip.anchor.y * displayScale,
  };
}

export function getPlayerDisplayScale(height: number): number {
  const desiredFrameSize = Math.max(128, Math.min(192, height * 0.22));
  return desiredFrameSize / LPC_BASE_FRAME_SIZE;
}

export function loadSpriteAssets(): Promise<SpriteAssets> {
  const entries = Object.entries(LPC_CLIPS) as Array<[SpriteClipName, SpriteClipDefinition]>;

  return Promise.all(entries.map(([clipName, clip]) => loadImage(clip.src).then((image) => [clipName, image] as const)))
    .then((loadedEntries) => Object.fromEntries(loadedEntries));
}

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = () => reject(new Error(`Failed to load ${src}`));
    image.src = src;
  });
}