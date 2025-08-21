"use client";
export class Sound {
  private ctx: AudioContext = new AudioContext();
  private buffer: AudioBuffer | null = null;

  constructor(url: string) {
    // @ts-expect-error the browser context will not be available in the server side
    this.ctx = new (window.AudioContext || window.webkitAudioContext)();
    fetch(url)
      .then((r) => r.arrayBuffer())
      .then((b) => this.ctx.decodeAudioData(b))
      .then((decoded) => (this.buffer = decoded));
  }

  play() {
    if (!this.buffer) return;
    const src = this.ctx.createBufferSource();
    src.buffer = this.buffer;
    src.connect(this.ctx.destination);
    src.start(0);
  }
}

export const likeSound = new Sound("/interaction_sounds/like.mp3");
export const cheerSound = new Sound("/interaction_sounds/cheer.mp3");
export const booSound = new Sound("/interaction_sounds/boo.mp3");
export const dislikeSound = new Sound("/interaction_sounds/dislike.mp3");
