import type { FlowEdge, FlowNode } from "@/lib/projects";

/**
 * Architecture diagram, laid out from lane numbers.
 *
 * Drawn as inline SVG rather than an image so it inherits the theme tokens,
 * scales without resampling, and keeps its labels as real text for search and
 * screen readers. Nodes are placed by lane (a column) and by their order
 * within that lane, so adding a node never requires re-measuring coordinates.
 */
export default function FlowDiagram({
  title,
  caption,
  nodes,
  edges,
}: {
  title: string;
  caption: string;
  nodes: FlowNode[];
  edges: FlowEdge[];
}) {
  const lanes = [...new Set(nodes.map((n) => n.lane))].sort((a, b) => a - b);

  const NODE_W = 168;
  const NODE_H = 62;
  const GAP_Y = 22;
  const GAP_X = 74;

  const laneMembers = new Map<number, FlowNode[]>();
  for (const lane of lanes) {
    laneMembers.set(
      lane,
      nodes.filter((n) => n.lane === lane),
    );
  }

  const tallest = Math.max(...lanes.map((l) => laneMembers.get(l)!.length));
  const height = tallest * NODE_H + (tallest - 1) * GAP_Y;
  const width = lanes.length * NODE_W + (lanes.length - 1) * GAP_X;

  const pos = new Map<string, { x: number; y: number }>();
  lanes.forEach((lane, li) => {
    const members = laneMembers.get(lane)!;
    const laneHeight = members.length * NODE_H + (members.length - 1) * GAP_Y;
    const offsetY = (height - laneHeight) / 2;
    members.forEach((n, ni) => {
      pos.set(n.id, {
        x: li * (NODE_W + GAP_X),
        y: offsetY + ni * (NODE_H + GAP_Y),
      });
    });
  });

  const PAD = 8;
  // Stable across server and client: derived from content, not a counter.
  const titleId = `flow-${title.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`;

  return (
    <figure className="flow">
      <figcaption className="flow-head">
        <p className="label label-accent">{title}</p>
        <p className="flow-caption muted">{caption}</p>
      </figcaption>

      {/* Focusable because it pans: 559px of the diagram is off-screen at
          375px wide, and a sighted keyboard-only user needs to reach it. */}
      <div
        className="flow-scroll"
        tabIndex={0}
        role="group"
        aria-label={`${title} — scrollable diagram`}
      >
        <svg
          viewBox={`${-PAD} ${-PAD} ${width + PAD * 2} ${height + PAD * 2}`}
          width={width}
          height={height}
          className="flow-svg"
          aria-labelledby={titleId}
        >
          <title id={titleId}>{`${title}. ${caption}`}</title>
          <defs>
            <marker
              id="flow-arrow"
              viewBox="0 0 10 10"
              refX="9"
              refY="5"
              markerWidth="5"
              markerHeight="5"
              orient="auto-start-reverse"
            >
              <path d="M 0 1 L 9 5 L 0 9 z" fill="var(--accent-large)" />
            </marker>
          </defs>

          {/* Edges first, so nodes paint over the joins */}
          {edges.map((e) => {
            const a = pos.get(e.from);
            const b = pos.get(e.to);
            if (!a || !b) return null;

            const x1 = a.x + NODE_W;
            const y1 = a.y + NODE_H / 2;
            const x2 = b.x;
            const y2 = b.y + NODE_H / 2;
            const mx = (x1 + x2) / 2;

            // Same-lane links would render as a zero-length line; bow them out.
            const sameLane = Math.abs(x2 - x1) < 4;
            const d = sameLane
              ? `M ${a.x + NODE_W / 2} ${a.y + NODE_H} C ${a.x + NODE_W / 2 + 46} ${
                  a.y + NODE_H + 18
                }, ${b.x + NODE_W / 2 + 46} ${b.y - 18}, ${b.x + NODE_W / 2} ${b.y}`
              : `M ${x1} ${y1} C ${mx} ${y1}, ${mx} ${y2}, ${x2} ${y2}`;

            return (
              <g key={`${e.from}-${e.to}`}>
                <path
                  d={d}
                  fill="none"
                  stroke="var(--accent-large)"
                  strokeWidth="1"
                  markerEnd="url(#flow-arrow)"
                  opacity="0.85"
                />
                {e.label && (
                  <text
                    // Nudged off the exact midpoint: a label centred between
                    // two adjacent lanes overlaps both node boxes by ~17px.
                    x={sameLane ? a.x + NODE_W / 2 + 52 : x1 + (x2 - x1) * 0.42}
                    y={
                      sameLane
                        ? (a.y + NODE_H + b.y) / 2
                        : (y1 + y2) / 2 + (y2 > y1 ? -9 : 13)
                    }
                    textAnchor="middle"
                    className="flow-edge-label"
                  >
                    {e.label}
                  </text>
                )}
              </g>
            );
          })}

          {/* Nodes */}
          {nodes.map((n) => {
            const p = pos.get(n.id)!;
            return (
              <g key={n.id} transform={`translate(${p.x} ${p.y})`}>
                <rect
                  width={NODE_W}
                  height={NODE_H}
                  rx="3"
                  fill="var(--card)"
                  stroke="var(--border)"
                  strokeWidth="1"
                />
                <rect width={NODE_W} height="2" fill="var(--accent-large)" opacity="0.85" />
                <text x="12" y="25" className="flow-node-label">
                  {n.label}
                </text>
                {n.sub && (
                  <text x="12" y="43" className="flow-node-sub">
                    {n.sub}
                  </text>
                )}
              </g>
            );
          })}
        </svg>
      </div>
    </figure>
  );
}
