function clamp(value: number): number {
  return Math.min(100, Math.max(0, value));
}

const DEFAULT_COLS = 32;
const DEFAULT_COLOR = '#d35400';

export class MonospaceLoader extends HTMLElement {
  static observedAttributes = ['progress', 'cols', 'color', 'track-color'];

  private _mouthOpen = true;
  private _timer: ReturnType<typeof setInterval> | null = null;

  connectedCallback(): void {
    this.style.display = 'inline-block';
    this.style.fontFamily = 'monospace';
    this.style.whiteSpace = 'pre';

    this.render();
    
    this._timer = setInterval(() => {
      this._mouthOpen = !this._mouthOpen;
      this.render();
    }, 350);
  }

  disconnectedCallback(): void {
    if (this._timer !== null) {
      clearInterval(this._timer);
      this._timer = null;
    }
  }

  attributeChangedCallback(): void {
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

  private render(): void {
    if (!this.isConnected) return;

    this.style.color = this.trackColor ?? '';

    const innerWidth = this.cols - 2;
    const cPos = Math.round((this.progress / 100) * (innerWidth - 1));
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
