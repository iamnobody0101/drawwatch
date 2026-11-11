import { useId, useRef, useState } from "react";
import type { KeyboardEvent } from "react";
import { useElementWidth } from "../../hooks/useElementWidth.ts";
import { barLength, niceMax, ticks } from "./scale.ts";
import styles from "./BarChart.module.css";

export type BarGroup = "hot" | "cold";

export type BarItem = {
  label: string;
  value: number;
  group?: BarGroup;
};

type BarChartProps = {
  title: string;
  items: BarItem[];
  labelName: string; // what the labels are, for example "Number"
  valueName: string; // what the values are, for example "Times drawn"
  summary?: string; // one or two sentences that say what the chart shows
};

// Sizes in pixels.
const ROW_HEIGHT = 24; // one bar per row; 24px is a big enough target to point at
const BAR_HEIGHT = 16;
const AXIS_HEIGHT = 28; // space at the top for the axis numbers
const LABEL_WIDTH = 40; // space on the left for the labels (1 to 50)
const VALUE_WIDTH = 80; // space on the right for the value and the word Hot or Cold
const FALLBACK_WIDTH = 600; // used until the browser has measured the chart

const GROUP_NAMES: Record<BarGroup, string> = { hot: "Hot", cold: "Cold" };

export function BarChart({ title, items, labelName, valueName, summary }: BarChartProps) {
  const titleId = useId();
  const summaryId = useId();
  const patternId = useId();
  const [showTable, setShowTable] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0); // the bar that Tab goes to
  const [focusedIndex, setFocusedIndex] = useState<number | null>(null);
  const [tooltipIndex, setTooltipIndex] = useState<number | null>(null);
  const barRefs = useRef<(SVGGElement | null)[]>([]);
  const [plotRef, measuredWidth] = useElementWidth();

  const width = measuredWidth > 0 ? measuredWidth : FALLBACK_WIDTH;
  const height = AXIS_HEIGHT + items.length * ROW_HEIGHT;
  const barAreaWidth = Math.max(width - LABEL_WIDTH - VALUE_WIDTH, 0);
  const top = niceMax(Math.max(0, ...items.map((item) => item.value)));
  // On a narrow screen there is only room for the first and the last axis number.
  const tickCount = barAreaWidth < 240 ? 1 : 5;

  function describe(item: BarItem): string {
    const group = item.group ? `, ${GROUP_NAMES[item.group]}` : "";
    return `${labelName} ${item.label}, ${valueName}: ${item.value}${group}`;
  }

  function moveFocus(index: number) {
    const next = Math.min(Math.max(index, 0), items.length - 1);
    setActiveIndex(next);
    barRefs.current[next]?.focus();
  }

  function handleKeyDown(event: KeyboardEvent<SVGSVGElement>) {
    const keys: Record<string, number> = {
      ArrowDown: activeIndex + 1,
      ArrowRight: activeIndex + 1,
      ArrowUp: activeIndex - 1,
      ArrowLeft: activeIndex - 1,
      Home: 0,
      End: items.length - 1,
    };
    if (event.key === "Escape") {
      setTooltipIndex(null);
      return;
    }
    const target = keys[event.key];
    if (target !== undefined) {
      event.preventDefault(); // stop the page from scrolling
      moveFocus(target);
    }
  }

  const tooltipItem = tooltipIndex === null ? undefined : items[tooltipIndex];

  return (
    <section className={styles.chart} aria-labelledby={titleId}>
      <div className={styles.header}>
        <h2 id={titleId} className={styles.title}>
          {title}
        </h2>
        <button type="button" className={styles.toggle} onClick={() => setShowTable(!showTable)}>
          {showTable ? "Show as chart" : "Show as table"}
        </button>
      </div>
      {summary ? (
        <p id={summaryId} className={styles.summary}>
          {summary}
        </p>
      ) : null}

      {showTable ? (
        <div className={styles.tableWrap}>
          <table className={styles.table} aria-labelledby={titleId}>
            <thead>
              <tr>
                <th scope="col">{labelName}</th>
                <th scope="col">{valueName}</th>
                <th scope="col">Group</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr key={item.label}>
                  <th scope="row">{item.label}</th>
                  <td>{item.value}</td>
                  <td>{item.group ? GROUP_NAMES[item.group] : ""}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <>
          <ul className={styles.legend} aria-label="Legend">
            <li>
              <svg className={styles.swatch} viewBox="0 0 16 16" aria-hidden="true">
                <rect className={styles.hot} width="16" height="16" />
              </svg>
              Hot: among the most drawn
            </li>
            <li>
              <svg className={styles.swatch} viewBox="0 0 16 16" aria-hidden="true">
                <rect className={styles.cold} width="16" height="16" fill={`url(#${patternId})`} />
              </svg>
              Cold: among the least drawn
            </li>
            <li>
              <svg className={styles.swatch} viewBox="0 0 16 16" aria-hidden="true">
                <rect className={styles.other} width="16" height="16" />
              </svg>
              Other numbers
            </li>
          </ul>
          <p className={styles.axisName} aria-hidden="true">
            {valueName}
          </p>
          <div ref={plotRef} className={styles.plot} onPointerLeave={() => setTooltipIndex(null)}>
            <svg
              width={width}
              height={height}
              role="group"
              aria-labelledby={titleId}
              aria-describedby={summary ? summaryId : undefined}
              onKeyDown={handleKeyDown}
            >
              <defs>
                <pattern
                  id={patternId}
                  width="6"
                  height="6"
                  patternUnits="userSpaceOnUse"
                  patternTransform="rotate(45)"
                >
                  <rect width="6" height="6" fill="white" />
                  <line className={styles.stripe} x1="0" y1="0" x2="0" y2="6" />
                </pattern>
              </defs>

              <g aria-hidden="true">
                {ticks(top, tickCount).map((tick) => {
                  const x = LABEL_WIDTH + barLength(tick, top, barAreaWidth);
                  return (
                    <g key={tick}>
                      <line
                        className={styles.grid}
                        x1={x}
                        x2={x}
                        y1={AXIS_HEIGHT - 4}
                        y2={height}
                      />
                      <text className={styles.tick} x={x} y={AXIS_HEIGHT - 10} textAnchor="middle">
                        {tick}
                      </text>
                    </g>
                  );
                })}
              </g>

              {items.map((item, index) => {
                const y = AXIS_HEIGHT + index * ROW_HEIGHT;
                const length = barLength(item.value, top, barAreaWidth);
                const groupClass = item.group ? styles[item.group] : styles.other;
                return (
                  <g
                    key={item.label}
                    ref={(element) => {
                      barRefs.current[index] = element;
                    }}
                    className={styles.bar}
                    role="img"
                    aria-label={describe(item)}
                    tabIndex={index === activeIndex ? 0 : -1}
                    onFocus={() => {
                      setActiveIndex(index);
                      setFocusedIndex(index);
                      setTooltipIndex(index);
                    }}
                    onBlur={() => {
                      setFocusedIndex(null);
                      setTooltipIndex(null);
                    }}
                    onPointerEnter={() => setTooltipIndex(index)}
                  >
                    {/* An invisible rectangle over the whole row, so the pointer can find small bars. */}
                    <rect
                      className={styles.hitArea}
                      x={0}
                      y={y}
                      width={width}
                      height={ROW_HEIGHT}
                    />
                    {focusedIndex === index ? (
                      <rect
                        className={styles.focusRing}
                        x={1}
                        y={y + 1}
                        width={width - 2}
                        height={ROW_HEIGHT - 2}
                        rx={4}
                      />
                    ) : null}
                    <text
                      className={styles.label}
                      x={LABEL_WIDTH - 8}
                      y={y + ROW_HEIGHT / 2}
                      textAnchor="end"
                      dominantBaseline="central"
                    >
                      {item.label}
                    </text>
                    <rect
                      className={groupClass}
                      x={LABEL_WIDTH}
                      y={y + (ROW_HEIGHT - BAR_HEIGHT) / 2}
                      width={length}
                      height={BAR_HEIGHT}
                      fill={item.group === "cold" ? `url(#${patternId})` : undefined}
                    />
                    <text
                      className={styles.value}
                      x={LABEL_WIDTH + length + 6}
                      y={y + ROW_HEIGHT / 2}
                      dominantBaseline="central"
                    >
                      {item.value}
                      {item.group ? ` ${GROUP_NAMES[item.group]}` : ""}
                    </text>
                  </g>
                );
              })}
            </svg>

            {tooltipItem && tooltipIndex !== null ? (
              <div
                className={styles.tooltip}
                style={{ top: AXIS_HEIGHT + (tooltipIndex + 1) * ROW_HEIGHT, left: LABEL_WIDTH }}
                aria-hidden="true"
              >
                <strong>
                  {labelName} {tooltipItem.label}
                </strong>
                <br />
                {valueName}: {tooltipItem.value}
                {tooltipItem.group ? (
                  <>
                    <br />
                    {GROUP_NAMES[tooltipItem.group]}
                  </>
                ) : null}
              </div>
            ) : null}
          </div>
        </>
      )}
    </section>
  );
}
