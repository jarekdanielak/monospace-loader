import { useEffect, useState } from 'react';

declare module 'react' {
  namespace JSX {
    interface IntrinsicElements {
      'monospace-loader': React.HTMLAttributes<HTMLElement> & {
        progress?: number;
        cols?: number;
        color?: string;
        'track-color'?: string;
        forever?: boolean;
      };
    }
  }
}

const styles = {
  page: { padding: '2rem', fontFamily: 'monospace', maxWidth: 640 },
  section: { marginTop: '2rem' },
  row: { display: 'flex', alignItems: 'center', gap: '1rem', margin: '0.6rem 0' },
  label: { color: '#888', fontSize: '0.8em', minWidth: 40 },
} satisfies Record<string, React.CSSProperties>;

const STATIC_VALUES = [0, 25, 50, 75, 100];

function AnimatedDemo({ trackColor }: { trackColor?: string }) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setProgress((p) => (p >= 100 ? 0 : p + 1)), 60);
    return () => clearInterval(id);
  }, []);

  return (
    <div style={styles.row}>
      <span style={{ ...styles.label, color: trackColor ? '#a3a3a3' : undefined }}>{progress}%</span>
      <monospace-loader progress={progress} track-color={trackColor} />
    </div>
  );
}

export default function App() {
  return (
    <div style={styles.page}>
      <h1 style={{ margin: 0 }}>monospace-loader</h1>

      <section style={styles.section}>
        <h2>Static</h2>
        {STATIC_VALUES.map((v) => (
          <div key={v} style={styles.row}>
            <span style={styles.label}>{v}%</span>
            <monospace-loader progress={v} />
          </div>
        ))}
      </section>

      <section style={styles.section}>
        <h2>Animated</h2>
        <AnimatedDemo />
      </section>

      <section style={styles.section}>
        <h2>Widths (cols)</h2>
        {([16, 24, 32, 48] as const).map((cols) => (
          <div key={cols} style={styles.row}>
            <span style={styles.label}>{cols}</span>
            <monospace-loader progress={50} cols={cols} />
          </div>
        ))}
      </section>

      <section style={styles.section}>
        <h2>Mouth color</h2>
        {(['#d35400', '#2980b9', '#27ae60'] as const).map((color) => (
          <div key={color} style={styles.row}>
            <span style={styles.label}>{color}</span>
            <monospace-loader progress={50} color={color} />
          </div>
        ))}
      </section>

      <section style={styles.section}>
        <h2>Track color</h2>
        {(['#bebebe', '#2980b9', '#27ae60'] as const).map((trackColor) => (
          <div key={trackColor} style={styles.row}>
            <span style={styles.label}>{trackColor}</span>
            <monospace-loader progress={50} track-color={trackColor} />
          </div>
        ))}
      </section>

      <section style={styles.section}>
        <h2>Forever</h2>
        <div style={styles.row}>
          <monospace-loader forever />
        </div>
      </section>

      <section style={styles.section}>
        <h2>Dark mode</h2>
        <div style={{ ...styles.row, background: '#333', padding: '1rem', borderRadius: 8, width: '50%' }}>
          <AnimatedDemo trackColor="#aaa" />
        </div>
      </section>
    </div>
  );
}
