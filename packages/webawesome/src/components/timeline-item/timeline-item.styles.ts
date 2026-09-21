import { css } from 'lit';

export default css`
  @layer wa-component {
    :host {
      /* Establishes this item as a style-query container so the rules below can branch on --_orientation/
         --_alignment, both inherited from the parent <wa-timeline> (or set per-item for "alternate" via its
         ::slotted() rules). Querying a container's own custom properties is valid for style queries, unlike size
         queries, so no wrapper element is needed. */
      container: wa-timeline-item / normal;

      --_marker-background: var(--wa-color-fill-normal, var(--wa-color-neutral-fill-normal));
      --_marker-color: var(--wa-color-on-normal, var(--wa-color-neutral-on-normal));
      --_connector-color: var(--wa-color-fill-normal, var(--wa-color-neutral-fill-normal));

      display: block;
    }

    :host(:state(current)) {
      --_marker-background: var(--wa-color-fill-loud, var(--wa-color-neutral-fill-loud));
      --_marker-color: var(--wa-color-on-loud, var(--wa-color-neutral-on-loud));
    }

    /* Layout. A 2-column grid by default: the rail (marker + connector) and the content, full width, no wasted
       space. "end" mirrors it (still 2 columns, no centering). "alternate" switches to a 3-column grid — content /
       rail / content — with each item only ever filling one of the two content columns, so the rail lands dead
       center and stays there across every item, the same shape as MUI's alternating Timeline. */
    .item {
      position: relative;
      display: grid;
      grid-template-columns: auto 1fr;
      align-items: start;
      gap: 1em;
    }

    .content {
      grid-column: 2;
      grid-row: 1;
      min-width: 0;
    }

    .marker {
      grid-column: 1;
      grid-row: 1;
      position: relative;
      z-index: 1;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: var(--marker-size, 2em);
      height: var(--marker-size, 2em);
      color: var(--_marker-color);
      background-color: var(--_marker-background);
      border-radius: var(--wa-border-radius-circle);
      transition:
        background-color var(--wa-transition-fast) var(--wa-transition-easing),
        color var(--wa-transition-fast) var(--wa-transition-easing);
    }

    .marker slot {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      font-size: calc(var(--marker-size, 2em) * 0.4);
    }

    @media (prefers-reduced-motion: reduce) {
      .marker {
        transition: none;
      }
    }

    /* Connector. Each item draws a single line from its own marker toward the next item's — there's no boundary
       color to negotiate with a neighbor the way <wa-step>'s two-half connector does, since a timeline entry's
       color is just its own variant, not a "reached/not reached" state relative to a moving active pointer.

       Centered on the marker with the same inset + translate(-50%) trick regardless of layout: in the 2-column
       "start" grid, the rail column is a known, fixed marker-size wide, so its center is calc(marker-size / 2) from
       the item's start edge. In the 3-column "alternate" grid the rail sits between two *equal* 1fr columns, so its
       center is always exactly 50% of the item's width — no need to know either column's actual width. */
    .connector {
      position: absolute;
      z-index: 0;
      inset-inline-start: calc(var(--marker-size, 2em) / 2);
      inset-block-start: calc(var(--marker-size, 2em) + var(--connector-gap, 0.35em));
      inset-block-end: calc(-1 * var(--gap, var(--wa-space-l)) + var(--connector-gap, 0.35em));
      width: var(--connector-width, var(--wa-border-width-m));
      translate: -50% 0;
      background-color: var(--_connector-color);
    }

    :host(:last-child) .connector {
      display: none;
    }

    /* Animate on scroll (opt-in via <wa-timeline animate-on-scroll>, vertical only — see timeline.styles.ts for how
       --_animate-on-scroll gets set). Each connector draws itself as it scrolls into view: animation-timeline:
       view() ties the keyframe's progress directly to the connector's own position in the nearest scrollable
       ancestor, so this needs no scroll listener or JS at all. Gated behind @supports so browsers without
       scroll-driven animations, and anyone with prefers-reduced-motion set, just get the connector's normal,
       fully-drawn appearance — never a connector stuck invisible.

       Uses the "cover" range, not "entry": "entry" only spans the connector's own (small) height, so the whole
       animation finishes within a few tens of pixels of scroll — done before the user has scrolled far enough to
       actually see it happen. "cover" spans the connector's entire pass through the viewport (viewport height plus
       its own), so tying the grow to the first half of that gives a scroll distance on the order of the viewport
       itself — long enough to actually read as an animation during a normal scroll. */
    @keyframes wa-timeline-connector-grow {
      from {
        scale: 1 0;
      }
      to {
        scale: 1 1;
      }
    }

    @supports (animation-timeline: view()) {
      @container wa-timeline-item style(--_animate-on-scroll: 1) {
        @media (prefers-reduced-motion: no-preference) {
          .connector {
            transform-origin: top;
            animation: wa-timeline-connector-grow linear both;
            animation-timeline: view();
            animation-range: cover 0% cover 50%;
          }
        }
      }
    }

    .opposite {
      font-size: var(--wa-font-size-smaller);
      line-height: var(--wa-line-height-condensed);
      color: var(--wa-color-text-quiet);
      margin-block-end: 0.25em;
    }

    .opposite[hidden] {
      display: none;
    }

    /* Horizontal orientation: items sit in a row (see <wa-timeline>'s .list), so each item stacks its marker above
       its content and the connector runs sideways to the next item's marker instead of downward — same centering
       trick, rotated 90deg onto the block axis. */
    @container wa-timeline-item style(--_orientation: horizontal) {
      .item {
        grid-template-columns: 1fr;
        grid-template-rows: auto auto;
        justify-items: center;
        text-align: center;
      }

      .marker {
        grid-row: 1;
      }

      .content {
        grid-row: 2;
      }

      .connector {
        inset-inline-start: calc(var(--marker-size, 2em) + var(--connector-gap, 0.35em));
        inset-inline-end: calc(-1 * var(--gap, var(--wa-space-l)) + var(--connector-gap, 0.35em));
        inset-block-start: calc(var(--marker-size, 2em) / 2);
        inset-block-end: auto;
        width: auto;
        height: var(--connector-width, var(--wa-border-width-m));
        translate: 0 -50%;
      }
    }

    /* Alignment: end mirrors the 2-column layout, marker on the far side, content still reading naturally from the
       start edge — there's no second side to balance against, so the content column stays full width. Vertical
       only; <wa-timeline> never sets --_alignment while horizontal, since a row of items has no side to flip. */
    @container wa-timeline-item style(--_alignment: end) {
      .item {
        grid-template-columns: 1fr auto;
      }

      .marker {
        grid-column: 2;
      }

      .content {
        grid-column: 1;
      }

      .connector {
        inset-inline-start: auto;
        inset-inline-end: calc(var(--marker-size, 2em) / 2);
        translate: 50% 0;
      }
    }

    /* Alternate flips each item to the opposite side of its sibling, with the rail re-centered every time (see
       <wa-timeline>'s ::slotted() rules for how each item picks alternate-start vs. alternate-end). Because each
       side's content column is only ~half the item's width instead of nearly all of it, right-aligning the
       alternate-start side actually reads as "hugging the rail," not as a stray floating block. */
    @container wa-timeline-item style(--_alignment: alternate-start) {
      .item {
        grid-template-columns: 1fr auto 1fr;
      }

      .marker {
        grid-column: 2;
      }

      .content {
        grid-column: 1;
        text-align: end;
      }

      .connector {
        inset-inline-start: 50%;
      }
    }

    @container wa-timeline-item style(--_alignment: alternate-end) {
      .item {
        grid-template-columns: 1fr auto 1fr;
      }

      .marker {
        grid-column: 2;
      }

      .content {
        grid-column: 3;
      }

      .connector {
        inset-inline-start: 50%;
      }
    }
  }
`;
