import React from 'react'
import { createRoot } from 'react-dom/client'

import { EditPollManagement } from './PollDashboard/EditPollManagement'

 export function renderPollManagement (el) {
      const pollId = el.dataset.pollId
      const root = createRoot(el)

      const reloadOnSuccess = JSON.parse(el.getAttribute('data-reloadOnSuccess'))

      root.render(
        <EditPollManagement pollId={pollId} reloadOnSuccess={reloadOnSuccess} />
      )
}
