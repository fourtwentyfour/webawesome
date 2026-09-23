import { html } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import WebAwesomeElement from '../../internal/webawesome-element.js';
import '../timeline-item/timeline-item.js';
import styles from './timeline.styles.js';

/**
 * @summary Timelines lay out a chronological list of events, such as an order history, activity feed, or changelog.
 *  Unlike `<wa-stepper>`, a timeline doesn't track a current position or gate navigation — every entry is an
 *  independent, already-happened (or planned) event.
 * @documentation https://webawesome.com/docs/components/timeline
 * @status experimental
 * @since 3.14
 *
 * @dependency wa-timeline-item
 *
 * @slot - One or more `<wa-timeline-item>` elements.
 *
 * @csspart timeline - The component's outer wrapper.
 * @csspart list - The `<ol>` that lays out the items.
 *
 * @cssproperty [--gap=var(--wa-space-l)] - The space between items.
 * @cssproperty [--marker-size=2em] - The size of each item's marker. Usually set here so every item matches.
 * @cssproperty [--connector-width=var(--wa-border-width-m)] - The thickness of the connector line, in either
 *  orientation.
 * @cssproperty [--connector-gap=0.35em] - The gap between a marker's edge and the connector line.
 */
@customElement('wa-timeline')
export default class WaTimeline extends WebAwesomeElement {
  static css = [styles];

  /** The timeline's layout direction. */
  @property({ reflect: true }) orientation: 'vertical' | 'horizontal' = 'vertical';

  /**
   * Which side of the timeline each item's marker sits on. `start` and `end` put every marker on that edge, with the
   * item's content on the other side of the rail. `alternate` flips every other item to the opposite side of its
   * sibling so the rail runs down the middle. Only applies when `orientation` is `vertical`.
   */
  @property({ attribute: 'marker-placement', reflect: true }) markerPlacement: 'start' | 'end' | 'alternate' = 'start';

  /**
   * Draws each item's connector progressively as it scrolls into view, instead of showing it fully drawn up front.
   * Only applies when `orientation` is `vertical`. Pure CSS (a scroll-driven animation, tied to the connector's own
   * position in the nearest scrollable ancestor) — browsers without support, and anyone with `prefers-reduced-motion`
   * set, just get the connector's normal, fully-drawn appearance.
   */
  @property({ type: Boolean, attribute: 'animate-on-scroll', reflect: true }) animateOnScroll = false;

  render() {
    return html`
      <div part="timeline" class="timeline">
        <ol part="list" class="list" role="list">
          <slot></slot>
        </ol>
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'wa-timeline': WaTimeline;
  }
}
