/**
 * Isometric blueprint illustration — hand-built SVG (per design.md: SVG/CSS,
 * not WebGL). Extruded blocks for the five pipeline stages rise from a
 * blueprint grid; lines draw themselves in, nodes pop, one idea-cube floats.
 */

type Pt = [number, number];

const U = 30;
const CX = 300;
const CY = 176;
const N = 6; // ground grid size

const project = (x: number, y: number, z: number): Pt => [
  (x - y) * U * 0.92 + CX,
  (x + y) * U * 0.52 - z * U * 0.82 + CY,
];

const pts = (arr: Pt[]) => arr.map((p) => `${p[0].toFixed(1)},${p[1].toFixed(1)}`).join(" ");

type Block = { x: number; y: number; h: number; accent?: boolean };

// Five ascending stages: idea → validation → tree → PRD → tasks
const BLOCKS: Block[] = [
  { x: 0.6, y: 4.2, h: 1.1 },
  { x: 1.7, y: 3.4, h: 1.7, accent: true },
  { x: 2.8, y: 2.6, h: 2.4 },
  { x: 3.9, y: 1.8, h: 3.0, accent: true },
  { x: 5.0, y: 1.0, h: 3.7 },
];

const S = 0.82; // footprint

function blockFaces(b: Block) {
  const { x, y, h } = b;
  return {
    top: [
      project(x, y, h),
      project(x + S, y, h),
      project(x + S, y + S, h),
      project(x, y + S, h),
    ] as Pt[],
    right: [
      project(x + S, y, h),
      project(x + S, y + S, h),
      project(x + S, y + S, 0),
      project(x + S, y, 0),
    ] as Pt[],
    left: [
      project(x, y + S, h),
      project(x + S, y + S, h),
      project(x + S, y + S, 0),
      project(x, y + S, 0),
    ] as Pt[],
    center: project(x + S / 2, y + S / 2, h),
  };
}

export function IsometricBlueprint({ className = "" }: { className?: string }) {
  const gridLines: Pt[][] = [];
  for (let i = 0; i <= N; i++) {
    gridLines.push([project(i, 0, 0), project(i, N, 0)]);
    gridLines.push([project(0, i, 0), project(N, i, 0)]);
  }

  const faces = BLOCKS.map(blockFaces);
  const connector = faces.map((f) => f.center);
  const ideaCube = ((): { top: Pt[]; left: Pt[]; right: Pt[]; center: Pt } => {
    const b = { x: 0.75, y: 4.35, h: 4.9 };
    const s = 0.5;
    return {
      top: [
        project(b.x, b.y, b.h),
        project(b.x + s, b.y, b.h),
        project(b.x + s, b.y + s, b.h),
        project(b.x, b.y + s, b.h),
      ],
      right: [
        project(b.x + s, b.y, b.h),
        project(b.x + s, b.y + s, b.h),
        project(b.x + s, b.y + s, b.h - s),
        project(b.x + s, b.y, b.h - s),
      ],
      left: [
        project(b.x, b.y + s, b.h),
        project(b.x + s, b.y + s, b.h),
        project(b.x + s, b.y + s, b.h - s),
        project(b.x, b.y + s, b.h - s),
      ],
      center: project(b.x + s / 2, b.y + s / 2, b.h),
    };
  })();

  return (
    <svg
      viewBox="0 0 600 400"
      className={className}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label="Isometric blueprint of the idea-to-spec pipeline"
    >
      <defs>
        <filter id="bp-glow" x="-40%" y="-40%" width="180%" height="180%">
          <feGaussianBlur stdDeviation="3" result="b" />
          <feMerge>
            <feMergeNode in="b" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* ground grid */}
      <g stroke="var(--border)" strokeWidth="1" opacity="0.5">
        {gridLines.map((l, i) => (
          <polyline
            key={`g${i}`}
            points={pts(l)}
            pathLength={1}
            className="draw-line"
            style={{ animationDelay: `${i * 30}ms` }}
          />
        ))}
      </g>

      {/* blocks */}
      {faces.map((f, i) => {
        const stroke = BLOCKS[i].accent ? "var(--accent)" : "var(--primary-hover)";
        const delay = 300 + i * 160;
        return (
          <g key={`b${i}`} filter="url(#bp-glow)">
            <polygon points={pts(f.left)} fill="var(--primary)" fillOpacity="0.08" />
            <polygon points={pts(f.right)} fill="var(--accent)" fillOpacity="0.1" />
            <polygon points={pts(f.top)} fill="var(--primary-hover)" fillOpacity="0.16" />
            {[f.left, f.right, f.top].map((face, j) => (
              <polygon
                key={j}
                points={pts(face)}
                stroke={stroke}
                strokeWidth="1.5"
                pathLength={1}
                className="draw-line"
                style={{ animationDelay: `${delay + j * 60}ms` }}
              />
            ))}
          </g>
        );
      })}

      {/* connector over the tops */}
      <polyline
        points={pts(connector)}
        stroke="var(--accent)"
        strokeWidth="1.5"
        strokeDasharray="1 4"
        pathLength={1}
        className="draw-line"
        style={{ animationDelay: "1200ms", filter: "url(#bp-glow)" }}
      />

      {/* nodes */}
      {connector.map((c, i) => (
        <circle
          key={`n${i}`}
          cx={c[0]}
          cy={c[1]}
          r="3.5"
          fill="var(--accent)"
          className="node-pop"
          style={{ animationDelay: `${900 + i * 160}ms`, filter: "url(#bp-glow)" }}
        />
      ))}

      {/* floating idea cube */}
      <g className="float" filter="url(#bp-glow)">
        <polygon points={pts(ideaCube.left)} fill="var(--primary)" fillOpacity="0.12" />
        <polygon points={pts(ideaCube.right)} fill="var(--accent)" fillOpacity="0.14" />
        <polygon points={pts(ideaCube.top)} fill="var(--primary-hover)" fillOpacity="0.22" />
        {[ideaCube.left, ideaCube.right, ideaCube.top].map((face, j) => (
          <polygon
            key={j}
            points={pts(face)}
            stroke="var(--accent)"
            strokeWidth="1.5"
            pathLength={1}
            className="draw-line"
            style={{ animationDelay: `${200 + j * 80}ms` }}
          />
        ))}
      </g>
    </svg>
  );
}
