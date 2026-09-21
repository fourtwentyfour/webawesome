import { expect, html } from '@open-wc/testing';
import { fixtures } from '../../internal/test/fixture.js';
import type WaTimelineItem from './timeline-item.js';

describe('<wa-timeline-item>', () => {
  for (const fixture of fixtures) {
    describe(`with "${fixture.type}" rendering`, () => {
      it('should render as a listitem', async () => {
        const el = await fixture<WaTimelineItem>(html`<wa-timeline-item>Ordered</wa-timeline-item>`);

        expect(el.getAttribute('role')).to.equal('listitem');
      });

      it('should be accessible', async () => {
        // <wa-timeline-item> renders role="listitem", which ARIA requires to live inside a role="list" container —
        // the job <wa-timeline> normally does. Provide one here since this test exercises the item in isolation.
        const wrapper = await fixture<HTMLDivElement>(
          html`<div role="list"><wa-timeline-item current>Shipped</wa-timeline-item></div>`,
        );

        await expect(wrapper).to.be.accessible();
      });

      it('should reflect the current attribute to the current custom state', async () => {
        const el = await fixture<WaTimelineItem>(html`<wa-timeline-item current>Shipped</wa-timeline-item>`);

        expect(el.customStates.has('current')).to.be.true;
      });

      it('should hide the opposite wrapper when the opposite slot is empty', async () => {
        const el = await fixture<WaTimelineItem>(html`<wa-timeline-item>Shipped</wa-timeline-item>`);

        expect(el.shadowRoot!.querySelector('[part~="opposite"]')).to.have.attribute('hidden');
      });

      it('should show the opposite wrapper when the opposite slot has content', async () => {
        const el = await fixture<WaTimelineItem>(html`
          <wa-timeline-item with-opposite>
            <time slot="opposite" datetime="2026-09-16">Sep 16</time>
            Shipped
          </wa-timeline-item>
        `);

        expect(el.shadowRoot!.querySelector('[part~="opposite"]')).to.not.have.attribute('hidden');
      });
    });
  }
});
