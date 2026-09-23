import { css } from 'lit';

export default css`
  @layer wa-component {
    :host {
      /* A style-query container so the rules below can branch on --_orientation and --_marker-placement, both
         inherited from the parent <wa-timeline> (or set per item for "alternate" via its ::slotted() rules). */
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

    /* Layout. <wa-timeline> owns the column tracks (opposite / rail / content) and this wrapper subgrids into them,
       so the rail stays straight across every item regardless of how wide each item's opposite content is. */
    .item {
      display: grid;
      grid-template-columns: subgrid;
      grid-column: 1 / -1;
    }

    /* The rail holds the marker and the connector below it. It stretches to the full row so the connector can reach
       the next item's marker. */
    .rail {
      grid-column: rail;
      grid-row: 1;
      position: relative;
      display: flex;
      flex-direction: column;
      align-items: center;
    }

    .content {
      grid-column: content;
      grid-row: 1;
      align-self: start;
      min-width: 0;
      margin-inline-start: 1em;
    }

    .opposite {
      grid-column: opposite;
      grid-row: 1;
      align-self: start;
      min-width: 0;
      margin-inline-end: 1em;
      font-size: var(--wa-font-size-smaller);
      line-height: var(--wa-line-height-condensed);
      color: var(--wa-color-text-quiet);
      text-align: end;
    }

    .marker {
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

    /* Connector. A single line from this item's marker toward the next one's, centered on the rail. It runs from just
       below the marker to just above the next item's marker, reaching across the list's row gap. */
    .connector {
      position: absolute;
      z-index: 0;
      inset-inline-start: 50%;
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

    /* Horizontal orientation: the item subgrids into <wa-timeline>'s three rows instead of its columns, stacking
       opposite content above the marker and the main content below it. The connector runs sideways from this
       marker to the next item's, which works because the list gives every item the same width. */
    @container wa-timeline-item style(--_orientation: horizontal) {
      .item {
        grid-template-columns: none;
        grid-template-rows: subgrid;
        grid-column: auto;
        grid-row: 1 / -1;
        text-align: center;
      }

      .opposite {
        grid-column: auto;
        grid-row: opposite;
        margin-inline: 0;
        margin-block-end: 1em;
        text-align: center;
      }

      .rail {
        grid-column: auto;
        grid-row: rail;
      }

      .content {
        grid-column: auto;
        grid-row: content;
        margin-inline: 0;
        margin-block-start: 1em;
      }

      .connector {
        inset-inline-start: calc(50% + var(--marker-size, 2em) / 2 + var(--connector-gap, 0.35em));
        inset-inline-end: calc(
          -50% - var(--gap, var(--wa-space-l)) + var(--marker-size, 2em) / 2 + var(--connector-gap, 0.35em)
        );
        inset-block-start: calc(var(--marker-size, 2em) / 2);
        inset-block-end: auto;
        width: auto;
        height: var(--connector-width, var(--wa-border-width-m));
        translate: 0 -50%;
      }
    }

    /* End placement mirrors the columns: content, then the rail, then opposite content on the far side. */
    @container wa-timeline-item style(--_marker-placement: end) {
      .content {
        margin-inline: 0 1em;
      }

      .opposite {
        margin-inline: 1em 0;
        text-align: start;
      }
    }

    /* Alternate flips each item to the opposite side of its sibling (see <wa-timeline>'s ::slotted() rules for how
       each item picks alternate-start vs. alternate-end). Whichever of content or opposite sits before the rail is
       end-aligned so it hugs the rail rather than floating at the far edge. */
    @container wa-timeline-item style(--_marker-placement: alternate-start) {
      .content {
        grid-column: 1;
        margin-inline: 0 1em;
        text-align: end;
      }

      .opposite {
        grid-column: 3;
        margin-inline: 1em 0;
        text-align: start;
      }
    }

    @container wa-timeline-item style(--_marker-placement: alternate-end) {
      .content {
        grid-column: 3;
      }

      .opposite {
        grid-column: 1;
      }
    }
  }
`;
