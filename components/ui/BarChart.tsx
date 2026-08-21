/**
 * Horizontal bar chart, rendered as semantic HTML rather than SVG or canvas.
 *
 * Bars are divs scaled against the series maximum, so the whole thing inherits
 * theme tokens and reflows at any width without a resize observer. Values are
 * printed as text next to every bar — the chart never relies on length alone,
 * and never on colour alone, to communicate a number.
 */
export default function BarChart({
  title,
  caption,
  unit,
  series,
}: {
  title: string;
  caption: string;
  unit: string;
  series: { label: string; value: number; highlight?: boolean }[];
}) {
  const max = Math.max(...series.map((s) => s.value));

  return (
    <figure className="chart">
      <figcaption className="chart-head">
        <p className="label label-accent">{title}</p>
        <p className="chart-caption muted">{caption}</p>
      </figcaption>

      <table className="chart-table">
        <caption className="sr-only">
          {title} — {caption} Values in {unit}.
        </caption>
        <thead className="sr-only">
          <tr>
            <th scope="col">Item</th>
            <th scope="col">{unit}</th>
          </tr>
        </thead>
        <tbody>
          {series.map((s) => (
            <tr key={s.label} className={s.highlight ? "is-highlight" : undefined}>
              <th scope="row" className="chart-label">
                {s.label}
              </th>
              <td className="chart-cell">
                {/* The bar is sized inside its own track so a 100% bar cannot
                    push the value label off the edge of the cell. */}
                <span className="chart-track" aria-hidden="true">
                  <span
                    className="chart-bar"
                    style={{ width: `${Math.max(2, (s.value / max) * 100)}%` }}
                  />
                </span>
                <span className="chart-value mono">{s.value}</span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </figure>
  );
}
