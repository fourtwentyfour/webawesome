---
title: Timeline Item
layout: component
category: Layout
parent: timeline
synonyms:
  - timeline entry
  - event
use-cases:
  - order status
  - changelog entry
---

This component is meant to be used as a child of [`<wa-timeline>`](/docs/components/timeline). See the [Timeline docs](/docs/components/timeline) for examples of it in action.

```html {.example}
<wa-timeline>
  <wa-timeline-item current>
    <strong>Out for delivery</strong>
    <p>Your package is on the truck and should arrive today.</p>
  </wa-timeline-item>
</wa-timeline>
```
