import React from 'react'
import { createRoot } from 'react-dom/client'

import CommentBox from './comment_box'

 export function renderComment0 (el) {
  const props = JSON.parse(el.getAttribute('data-attributes'))
  const root = createRoot(el)
  root.render(<CommentBox {...props} />)
}