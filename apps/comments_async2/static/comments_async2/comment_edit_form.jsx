import React from 'react'
import django from 'django'

import Alert from '../../../../adhocracy-plus/static/Alert'
import { TermsOfUseCheckbox } from '../../../../adhocracy-plus/static/TermsOfUseCheckbox'

const translated = {
  yourComment: django.gettext('Your comment'),
  yourReply: django.gettext('Your reply'),
  saveChanges: django.gettext('save changes'),
  cancel: django.gettext('cancel')
}

export default class CommentEditForm extends React.Component {
  constructor (props) {
    super(props)

    this.state = {
      comment: this.props.comment,
      agreedTermsOfUse: props.agreedTermsOfUse
    }
  }

  componentDidUpdate (prevProps) {
    if (this.props.agreedTermsOfUse !== prevProps.agreedTermsOfUse) {
      this.setState({
        agreedTermsOfUse: this.props.agreedTermsOfUse
      })
    }
  }

  handleTextChange (e) {
    this.setState({ comment: e.target.value })
  }

  handleSubmit (e) {
    e.preventDefault()
    const comment = this.state.comment.trim()
    const data = {
      comment,
      urlReplaces: {
        objectPk: this.props.subjectId,
        contentTypeId: this.props.subjectType
      }
    }
    if (this.props.useTermsOfUse && !this.props.agreedTermsOfUse && this.state.checkedTermsOfUse) {
      data.agreed_terms_of_use = true
    }
    if (!comment) {
      return
    }
    this.props.onCommentSubmit(data).then(() => {
      if (this.props.useTermsOfUse && !this.props.agreedTermsOfUse && this.state.checkedTermsOfUse) {
        this.setState({ agreedTermsOfUse: true })
      }
      return null
    }).catch(error => console.warn(error))
  }

  render () {
    const hasParent = this.props.parentIndex !== undefined
    return (
      <form className="general-form" onSubmit={this.handleSubmit.bind(this)}>
        {this.props.error &&
          <Alert type="danger" message={this.props.errorMessage} onClick={this.props.handleErrorClick} />}
        <div className="form-group">
          <textarea
            rows={this.props.rows}
            className="a4-comments__textarea form-group"
            placeholder={hasParent ? translated.yourReply : translated.yourComment}
            onChange={this.handleTextChange.bind(this)}
            required="required"
            defaultValue={this.state.comment}
          />
        </div>
        {this.props.useTermsOfUse && !this.props.agreedTermsOfUse &&
          <TermsOfUseCheckbox
            id={'terms-of-use-' + this.props.commentId}
            onChange={val => this.setState({ checkedTermsOfUse: val })}
            orgTermsUrl={this.props.orgTermsUrl}
          />}
        <button
          type="submit"
          value={translated.saveChanges}
          className="submit-button"
          disabled={this.props.useTermsOfUse && !this.props.agreedTermsOfUse && !this.state.checkedTermsOfUse}
        >
          {translated.saveChanges}
        </button>
        &nbsp;
        <button
          type="submit" value={translated.cancel} className="btn btn--light cancel-button"
          onClick={this.props.handleCancel}
        >
          {translated.cancel}
        </button>
      </form>
    )
  }
}