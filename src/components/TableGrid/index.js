import React, {useEffect, useRef, useState} from 'react';
import styles from './styles.module.css';

const Columns = ['kw', 'day', 'description'];

// Checks that each cell is placed in its named grid column
function checkLayout(grid) {
  const cells = Columns.map((column) =>
    grid.querySelector(`[data-column="${column}"]`),
  );
  const rects = cells.map((cell) => cell.getBoundingClientRect());
  const sameRow = rects.every((rect) => rect.top === rects[0].top);
  const ordered = rects[0].left < rects[1].left && rects[1].left < rects[2].left;
  const gridColumns = cells
    .map((cell) => getComputedStyle(cell).gridColumnStart)
    .join(', ');
  return sameRow && ordered
    ? `Layout OK (grid-column: ${gridColumns})`
    : `Layout BROKEN (grid-column: ${gridColumns})`;
}

export default function TableGrid() {
  const gridRef = useRef(null);
  const [result, setResult] = useState('Checking layout...');
  useEffect(() => {
    setResult(checkLayout(gridRef.current));
  }, []);
  return (
    <>
      <div ref={gridRef} className={styles.grid}>
        <div data-column="kw" className={styles.kw}>
          14
        </div>
        <div data-column="day" className={styles.day}>
          Mo
        </div>
        <div data-column="description" className={styles.description}>
          Description
        </div>
      </div>
      <p id="result">{result}</p>
    </>
  );
}
