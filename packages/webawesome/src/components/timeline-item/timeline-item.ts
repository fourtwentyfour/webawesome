import { html } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { HasSlotController } from '../../internal/slot.js';
import { watch } from '../../internal/watch.js';
import WebAwesomeElement from '../../internal/webawesome-element.js';
import variantStyles from '../../styles/component/variants.styles.js';
import styles from './timeline-item.styles.js';

// This component reads its layout (orientation, marker placement) entirely through CSS container style queries
// against custom properties the parent <wa-timeline> sets — see timeline-item.styles.ts. A timeline item's layout
// only ever depends on its own sibling index (`alternate`) and the parent's own attributes, both of which CSS can
// already see on its own, so no MutationObserver/ResizeObserver bridge is needed here.

/**
 * @summary Timeline items represent a single, dated entry inside a `<wa-timeline>`, such as one event in an order
 *  history or activity feed.
 * @documentation https://webawesome.com/docs/components/timeline-item
 * @status experimental
 * @since 3.15
 *
 * @slot - The item's main content, such as a title and description.
 * @slot opposite - Optional content shown on the opposite side of the rail from the main content, commonly a date or
 *  timestamp. Consider wrapping it in a `<time>` element.
 * @slot marker - Custom content, such as a `<wa-icon>` or `<wa-avatar>`, that replaces the default dot marker.
 *
 * @csspart timeline-item - The component's outer wrapper.
 * @csspart marker - The circular marker that marks the item's position on the timeline.
 * @csspart connector - The line connecting this item to the next one.
 * @csspart content - The wrapper around the default slot.
 * @csspart opposite - The wrapper around the `opposite` slot.
 *
 * @cssproperty [--marker-size=2em] - The size of the item's marker. Usually set on `<wa-timeline>` so every item
 *  matches.
 * @cssproperty [--connector-width=var(--wa-border-width-m)] - The thickness of the connector that follows this item.
 *  Usually set on `<wa-timeline>`; set it here to make one item's connector stand out.
 * @cssproperty [--connector-gap=0.35em] - The gap between this item's marker and its connector. Usually set on
 *  `<wa-timeline>`.
 *
 * @cssstate current - Applied when the `current` attribute is set.
 */
@customElement('wa-timeline-item')
export default class WaTimelineItem extends WebAwesomeElement {
  static css = [variantStyles, styles];

  private readonly hasSlotController = new HasSlotController(this, 'opposite');

  /** Colors the item's marker with a semantic color. */
  @property({ reflect: true }) variant: 'neutral' | 'brand' | 'success' | 'warning' | 'danger' | '' = '';

  /**
   * Marks this as the timeline's current or most-recent entry, e.g. the last-known status in an order history. Sets
   * `aria-current` on the item so assistive technology announces it. Setting it doesn't affect any other item.
   */
  @property({ type: Boolean, reflect: true }) current = false;

  /**
   * Only required for SSR. Set to `true` if you're slotting in an `opposite` element, so the server-rendered markup
   * includes it before the component hydrates on the client.
   */
  @property({ type: Boolean, attribute: 'with-opposite' }) withOpposite = false;

  @property({ reflect: true }) role = 'listitem';

  @watch('current')
  handleCurrentChange() {
    this.customStates.set('current', this.current);

    if (this.current) {
      this.setAttribute('aria-current', 'true');
    } else {
      this.removeAttribute('aria-current');
    }
  }

  render() {
    const hasOpposite = this.hasSlotController.test('opposite', 'withOpposite');

    return html`
      <div part="timeline-item" class="item">
        <span part="opposite" class="opposite" ?hidden=${!hasOpposite}>
          <slot name="opposite"></slot>
        </span>
        <span class="rail">
          <span part="marker" class="marker">
            <slot name="marker"></slot>
          </span>
          <span part="connector" class="connector"></span>
        </span>
        <span part="content" class="content">
          <slot></slot>
        </span>
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'wa-timeline-item': WaTimelineItem;
  }
}
