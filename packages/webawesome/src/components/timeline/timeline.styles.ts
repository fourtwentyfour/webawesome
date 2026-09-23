import { css } from 'lit';

export default css`
  @layer wa-component {
    :host {
      --gap: var(--wa-space-l);
      --marker-size: 2em;
      --connector-width: var(--wa-border-width-m);
      --connector-gap: 0.35em;
      --_marker-placement: start;
      --_orientation: vertical;
      --_animate-on-scroll: 0;

      display: block;
    }

    :host([marker-placement='end']) {
      --_marker-placement: end;
    }

    :host([orientation='horizontal']) {
      --_orientation: horizontal;
    }

    /* Vertical only — a row of horizontal items all enter the viewport together, so there's no per-item scroll
       progress to animate against. */
    :host([animate-on-scroll]:not([orientation='horizontal'])) {
      --_animate-on-scroll: 1;
    }

    .timeline {
      display: block;
    }

    /* The list owns the column tracks (opposite / rail / content) and every item subgrids into them, so the rail stays
       straight and the opposite column is sized by the widest opposite content across all items. When no item slots
       opposite content, that column collapses to nothing. Items add their own spacing beside the rail (see
       timeline-item.styles.ts), so the grid has no column gap of its own. */
    .list {
      display: grid;
      grid-template-columns: [opposite-start] auto [opposite-end rail-start] auto [rail-end content-start] 1fr [content-end];
      row-gap: var(--gap);
      margin: 0;
      padding: 0;
      list-style: none;
    }

    :host([marker-placement='end']) .list {
      grid-template-columns: [content-start] 1fr [content-end rail-start] auto [rail-end opposite-start] auto [opposite-end];
    }

    /* Alternate: content / rail / content, so the rail lands dead center. Each item picks its side below. */
    :host([marker-placement='alternate']) .list {
      grid-template-columns: 1fr [rail-start] auto [rail-end] 1fr;
    }

    ::slotted(wa-timeline-item) {
      display: grid;
      grid-template-columns: subgrid;
      grid-column: 1 / -1;
    }

    :host(:not([orientation='horizontal'])[marker-placement='alternate']) ::slotted(wa-timeline-item:nth-child(odd)) {
      --_marker-placement: alternate-start;
    }

    :host(:not([orientation='horizontal'])[marker-placement='alternate']) ::slotted(wa-timeline-item:nth-child(even)) {
      --_marker-placement: alternate-end;
    }

    /* Horizontal: items sit in equal-width columns and subgrid into three rows (opposite / rail / content), so every
       marker lines up no matter how tall each item's opposite content is. */
    :host([orientation='horizontal']) .list {
      grid-auto-flow: column;
      grid-auto-columns: 1fr;
      grid-template-columns: none;
      grid-template-rows: [opposite-start] auto [opposite-end rail-start] auto [rail-end content-start] auto [content-end];
      row-gap: 0;
      column-gap: var(--gap);
    }

    :host([orientation='horizontal']) ::slotted(wa-timeline-item) {
      grid-template-columns: none;
      grid-template-rows: subgrid;
      grid-column: auto;
      grid-row: 1 / -1;
    }
  }
`;
