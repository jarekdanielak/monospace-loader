function clamp(value: number): number {
  return Math.min(100, Math.max(0, value));
}

const DEFAULT_COLS = 32;
const DEFAULT_COLOR = '#d35400';

export class MonospaceLoader extends HTMLElement {
  static observedAttributes = ['progress', 'cols', 'color', 'track-color', 'forever'];

  private _mouthOpen = true;
  private _mouthTimer: ReturnType<typeof setInterval> | null = null;
  private _foreverTimer: ReturnType<typeof setInterval> | null = null;
  private _foreverProgress = 0;

  connectedCallback(): void {
    this.style.display = 'inline-block';
    this.style.fontFamily = 'monospace';
    this.style.whiteSpace = 'pre';
    this.render();
    this._mouthTimer = setInterval(() => {
      this._mouthOpen = !this._mouthOpen;
      this.render();
    }, 350);
    if (this.forever) this.startForever();
  }

  disconnectedCallback(): void {
    if (this._mouthTimer !== null) {
      clearInterval(this._mouthTimer);
      this._mouthTimer = null;
    }
    this.stopForever();
  }

  attributeChangedCallback(name: string): void {
    if (name === 'forever') {
      if (this.forever) this.startForever();
      else this.stopForever();
    }
    this.render();
  }

  get progress(): number {
    return clamp(parseFloat(this.getAttribute('progress') ?? '0'));
  }

  set progress(value: number) {
    this.setAttribute('progress', String(clamp(value)));
  }

  get cols(): number {
    const val = parseInt(this.getAttribute('cols') ?? String(DEFAULT_COLS), 10);
    return isNaN(val) ? DEFAULT_COLS : val;
  }

  set cols(value: number) {
    this.setAttribute('cols', String(value));
  }

  get color(): string {
    return this.getAttribute('color') ?? DEFAULT_COLOR;
  }

  set color(value: string) {
    this.setAttribute('color', value);
  }

  get trackColor(): string | null {
    return this.getAttribute('track-color');
  }

  set trackColor(value: string) {
    this.setAttribute('track-color', value);
  }

  get forever(): boolean {
    return this.hasAttribute('forever');
  }

  set forever(value: boolean) {
    if (value) this.setAttribute('forever', '');
    else this.removeAttribute('forever');
  }

  private startForever(): void {
    if (this._foreverTimer !== null) return;
    this._foreverTimer = setInterval(() => {
      this._foreverProgress = (this._foreverProgress + 1) % 101;
      this.render();
    }, 30);
  }

  private stopForever(): void {
    if (this._foreverTimer !== null) {
      clearInterval(this._foreverTimer);
      this._foreverTimer = null;
    }
    this._foreverProgress = 0;
  }

  private render(): void {
    if (!this.isConnected) return;

    this.style.color = this.trackColor ?? '';

    const innerWidth = this.cols - 2;
    const progress = this.forever ? this._foreverProgress : this.progress;
    const cPos = Math.round((progress / 100) * (innerWidth - 1));
    const mouthChar = this._mouthOpen ? 'C' : 'c';

    let before = '[' + '-'.repeat(cPos);
    let after = '';
    for (let i = cPos + 1; i < innerWidth; i++) {
      after += i % 3 === 2 ? 'o' : ' ';
    }
    after += ']';

    const span = document.createElement('span');
    span.textContent = mouthChar;
    span.style.color = this.color;

    this.replaceChildren(
      document.createTextNode(before),
      span,
      document.createTextNode(after),
    );
  }
}

if (!customElements.get('monospace-loader')) {
  customElements.define('monospace-loader', MonospaceLoader);
}

import { createElement, type HTMLAttributes } from 'react';

export interface MonospaceLoaderProps extends HTMLAttributes<HTMLElement> {
  progress?: number;
  cols?: number;
  color?: string;
  trackColor?: string;
  forever?: boolean;
}

export default function MonospaceLoaderReact({ trackColor, forever, ...props }: MonospaceLoaderProps) {
  return createElement('monospace-loader', {
    'track-color': trackColor,
    forever: forever ? '' : undefined,
    ...props,
  });
}
