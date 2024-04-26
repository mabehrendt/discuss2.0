import React from 'react'
import { createRoot } from 'react-dom/client'

import PollQuestions from './PollDetail/PollQuestions'

 export function renderPolls (el) {
      const pollId = el.dataset.pollId
      const container = el
      const root = createRoot(container)
      root.render(
        <PollQuestions pollId={pollId} />
      )
}

// document.addEventListener('DOMContentLoaded', init, false)
