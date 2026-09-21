import { expect, html } from '@open-wc/testing';
import { fixtures } from '../../internal/test/fixture.js';
import type WaTimeline from './timeline.js';

describe('<wa-timeline>', () => {
  for (const fixture of fixtures) {
    describe(`with "${fixture.type}" rendering`, () => {
      it('should render a role="list"', async () => {
        const el = await fixture<WaTimeline>(html`
          <wa-timeline>
            <wa-timeline-item>First</wa-timeline-item>
            <wa-timeline-item>Second</wa-timeline-item>
          </wa-timeline>
        `);

        expect(el.shadowRoot!.querySelector('[part~="list"]')!.getAttribute('role')).to.equal('list');
      });

      it('should be accessible', async () => {
        const el = await fixture<WaTimeline>(html`
          <wa-timeline label="Order history">
            <wa-timeline-item>Ordered</wa-timeline-item>
            <wa-timeline-item current>Shipped</wa-timeline-item>
          </wa-timeline>
        `);

        await expect(el).to.be.accessible();
      });

      it('should default to a vertical orientation and start alignment', async () => {
        const el = await fixture<WaTimeline>(html`<wa-timeline></wa-timeline>`);

        expect(el.orientation).to.equal('vertical');
        expect(el.alignment).to.equal('start');
        expect(el.animateOnScroll).to.be.false;
      });

      it('should reflect animate-on-scroll', async () => {
        const el = await fixture<WaTimeline>(html`<wa-timeline animate-on-scroll></wa-timeline>`);

        expect(el.animateOnScroll).to.be.true;
        expect(el.hasAttribute('animate-on-scroll')).to.be.true;
      });
    });
  }
});
