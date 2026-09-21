import { css } from 'lit';

export default css`
  @layer wa-component {
    :host {
      --gap: var(--wa-space-l);
      --marker-size: 2em;
      --connector-width: var(--wa-border-width-m);
      --connector-gap: 0.35em;
      --_alignment: start;
      --_orientation: vertical;
      --_animate-on-scroll: 0;

      display: block;
    }

    :host([alignment='end']) {
      --_alignment: end;
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

    .list {
      display: flex;
      flex-direction: column;
      gap: var(--gap);
      margin: 0;
      padding: 0;
      list-style: none;
    }

    :host([orientation='horizontal']) .list {
      flex-direction: row;
      align-items: flex-start;
    }

    /* Alignment. start/end just set which side of the rail content renders on for every item; alternate flips
       it per item via nth-child (and re-centers the rail — see timeline-item.styles.ts), which only makes sense
       for the vertical (column) layout. */
    :host(:not([orientation='horizontal'])[alignment='alternate']) ::slotted(wa-timeline-item:nth-child(odd)) {
      --_alignment: alternate-start;
    }

    :host(:not([orientation='horizontal'])[alignment='alternate']) ::slotted(wa-timeline-item:nth-child(even)) {
      --_alignment: alternate-end;
    }
  }
`;
