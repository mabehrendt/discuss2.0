import React, { useEffect, useState } from 'react'
import django from 'django'
import update from 'immutability-helper'

import CommentForm from './comment_form'
import CommentList from './comment_list'
import Collapse from './collapsible'
import Modal from './stance_modal'
import { FilterCategory } from './filter_category'
import { FilterSearch } from './filter_search'
import { FilterSort } from './filter_sort'
import { getDocumentHeight } from '../util'
const api = require('../../../../adhocracy-plus/static/api')
const {Fragment} = React;

const sorts = {
  new: django.gettext('Newest'),
  pos: django.gettext('Most up votes'),
  neg: django.gettext('Most down votes'),
  ans: django.gettext('Most answers'),
  dis: django.gettext('Last discussed'),
  qua: django.gettext('Highest quality')
}

const translated = {
  showFilters: django.gettext('Show filters'),
  filters: django.gettext('Filters'),
  hideFilters: django.gettext('Hide filters'),
  searchContrib: django.gettext('Search contributions'),
  clearSearch: django.gettext('Clear search'),
  display: django.gettext('display: '),
  all: django.gettext('all'),
  sortedBy: django.gettext('sorted by: ')
}

const autoScrollThreshold = 500
let timer = 0


export const CommentBox = (props) => {
  const urlReplaces = {
    objectPk: props.subjectId,
    contentTypeId: props.subjectType
  }

  const [qualities, setQualities] = useState([])
  const [showChildrenId, setShowChildrenId] = useState(0)

  const [commentUpdate, setCommentUpdated] = useState(false)
  const [isOpen, setIsOpen] = useState(false);

  const  [stanceParentId, setStanceParentId] = useState(0)
  const  [stanceParentIdx, setStanceParentIdx] = useState(0)
  const  [stanceCT, setStanceCT] = useState(0)
  const  [stanceID, setStanceID] = useState(0)

  const  [modalState, setModalState] = useState({isOpen: false})
  const  [collapseState, setCollapseState] = useState({isOpen: false})
  const [stanceText, setStanceText] = useState("")
  const [userText, setUserText] = useState("")
  const anchoredCommentId = props.anchoredCommentId
    ? parseInt(props.anchoredCommentId)
    : null
  const [comments, setComments] = useState([])
  const [nextComments, setNextComments] = useState(null)
  const [commentCount, setCommentCount] = useState(0)
  const [showFilters, setShowFilters] = useState(false)
  const [filter, setFilter] = useState([])
  const [filterDisplay, setFilterDisplay] = useState(django.gettext('all'))
  const [sort, setSort] = useState(props.useModeratorMarked ? 'mom' : 'new')
  /*const [sort, setSort] = useState(props.quality ? 'qua' : 'new')*/
  const [loading, setLoading] = useState(true)
  const [loadingFilter, setLoadingFilter] = useState(false)
  const [search, setSearch] = useState('')
  const [anchoredCommentParentId, setAnchoredCommentParentId] = useState(0)
  const [anchoredCommentFound, setAnchoredCommentFound] = useState(false)
  const [hasCommentingPermission, setHasCommentingPermission] = useState(false)
  const [wouldHaveCommentingPermission, setWouldHaveCommentingPermission] =
    useState(false)
  const [projectIsPublic, setProjectIsPublic] = useState(false)
  const [useTermsOfUse, setUseTermsOfUse] = useState(false)
  const [agreedTermsOfUse, setAgreedTermsOfUse] = useState(false)
  const [orgTermsUrl, setOrgTermsUrl] = useState('')
  const [error, setError] = useState(false)
  const [errorMessage, setErrorMessage] = useState(undefined)
  const [anchorRendered, setAnchorRendered] = useState(false)


  function showModal(){
    setModalState({ isOpen: !modalState.isOpen})
    console.log(qualities)
  };

  function openQuest(user, userid){
    window.open("https://google.com", "_blank", "noreferrer")
  }

  function toggle(){
    console.log("TOGGLED")
    setCollapseState({ isOpen: !collapseState.isOpen})
    console.log(collapseState)
  }

  useEffect(() => {
    window.addEventListener('scroll', handleScroll, { passive: true })
    window.addEventListener('agreedTos', handleTermsOfUse)

    console.log("FIRED")
    if (props.useModeratorMarked) {
      sorts.mom = django.gettext('Highlighted')
    }
 /*   if (props.quality) {
      sorts.qua = django.gettext('Highest quality')
    }*/
    const params = {}
    params.ordering = sort
    params.urlReplaces = urlReplaces
    if (props.anchoredCommentId) {
      params.commentID = props.anchoredCommentId
    }

    console.log(props.stances)
    console.log(props.user)

    timer = setInterval(countDown, 2000);
    if (props.stances.length > 0){
      chooseStanceComment(props.stances, props.user)
    }
    console.log("NEWLY RENDERED1")

    console.log(params)
    api.qualities.get(params).done(handleQualities).fail()
    api.comments.get(params).done(handleComments).fail()

    return () => {
      window.removeEventListener('scroll', handleScroll)
      window.removeEventListener('agreedTos', handleTermsOfUse)
    }


    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    console.log("NEWLY RENDERED2")
    if (anchorRendered === true) {
      console.log(anchoredCommentId)
      const el = document.getElementById('comment_' + anchoredCommentId)
      if (el !== null) {
        const top = el.getBoundingClientRect().top
        window.scrollTo(0, top)
      }
    }
  }, [anchorRendered, anchoredCommentId])

  useEffect(() => {
    console.log(comments); // Output: 'bla bla bla...'
    console.log(stanceParentId)
    comments.forEach((comment, index) =>{
      if (comment.id == stanceParentId){
        setStanceParentIdx(index)
        console.log(comment.content_type)
        console.log(comment.comment_content_type)

        setStanceID(comment.comment_content_type)
        setStanceCT(stanceParentId)
      }
    })
}, [comments]);

  function countDown() {
    // Remove one second, set state so a re-render happens.
    console.log(modalState.isOpen)
    setModalState({isOpen: true})
    console.log("TIMER FIRED")

    // Check if we're at zero.
    if (modalState) {
      clearInterval(timer);
    }
  }

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

  function chooseStanceComment (stances, user){
    let filteredStances = []
    stances.forEach((stance, index) => {
      if (stance.creator != user){
        filteredStances.push(stance)
      }
    })

    console.log(filteredStances)
    if (filteredStances.length > 0){
      const random_index = getRandomInt(0, filteredStances.length - 1)
      setStanceText(filteredStances[random_index].comment_text)
      setUserText(filteredStances[random_index].creator)
      setStanceParentId(filteredStances[random_index].comment_id)
      console.log(comments)
      console.log("PARENT1: " + stanceParentId)
    }
    /*stances.forEach((stance, index)=> {
      console.log(stance)
      console.log(index)
    });*/
  }

  function handleQualities(result){
    console.log("QUALITIES")
    console.log(result)
    const data = result

          const urlReplaces = {
        objectPk: props.subjectId,
        contentTypeId: props.subjectType
        }
        const params = {}
        params.ordering = sort
        params.urlReplaces = urlReplaces

    console.log(data)
    console.log("TEST")
    setQualities(data)
  }

  function handleComments (result) {
    const data = result
    console.log(data)
    translated.entries = django.ngettext('entry', 'entries', data.count)
    setComments(data.results)
    setNextComments(data.next)
    setCommentCount(data.count)
    setHasCommentingPermission(data.has_commenting_permission)
    setProjectIsPublic(data.project_is_public)
    setUseTermsOfUse(data.use_org_terms_of_use)
    setAgreedTermsOfUse(data.user_has_agreed)
    setOrgTermsUrl(data.org_terms_url)
    if (props.anchoredCommentId && data.comment_found) {
      setAnchoredCommentParentId(data.comment_parent)
      if (findAnchoredComment(data.results, data.comment_parent)) {
        setLoading(false)
      } else {
        fetchComments()
      }
    } else {
      if (props.anchoredCommentId) {
        /* display something like: django.gettext('We are sorry, this comment does not exist.')
         * probably using a modal
         */
      }
      setLoading(false)
      setWouldHaveCommentingPermission(data.would_have_commenting_permission)
    }
  }



  // handles update of the comment state
  // called in handleCommentSubmit, handleCommentModify, handleCommentDelete,
  // handleHideReplyError, handleHideEditeError
  function updateStateComment (index, parentIndex, updatedComment) {
    const diff = {}
    if (parentIndex !== undefined) {
      diff[parentIndex] = { child_comments: {} }
      diff[parentIndex].child_comments[index] = { $merge: updatedComment }
    } else {
      diff[index] = { $merge: updatedComment }
    }
    setComments(update(comments, diff))
  }

  function addComment (parentIndex, comment) {
    let diff = {}
    let newCommentCount = commentCount
    if (parentIndex !== undefined) {
      console.log("CHILD!")
      diff[parentIndex] = {
        child_comments: { $push: [comment] },
        $merge: {
          replyError: false,
          errorMessage: undefined
        }
      }
      setShowChildrenId(stanceParentId)

    } else {
      console.log("NO CHILD!")

      diff = { $unshift: [comment] }
      newCommentCount++
      setMainError(undefined)
    }
    setComments(update(comments, diff))
    setCommentCount(newCommentCount)

       console.log("COMMENTSADD")
              console.log(showChildrenId)

        console.log(comments)
  }

  function setReplyError (parentIndex, index, message) {
    updateError(parentIndex, index, message, 'replyError')
  }

  function setEditError (parentIndex, index, message) {
    updateError(parentIndex, index, message, 'editError')
  }

  function setMainError (message) {
    updateError(undefined, undefined, message, undefined)
  }

  function updateError (parentIndex, index, message, type) {
    if (parentIndex !== undefined) {
      updateStateComment(parentIndex, index, {
        [type]: message !== undefined,
        errorMessage: message
      })
    } else {
      setError(message !== undefined)
      setErrorMessage(message)
    }
  }

  function handleQualityFail(xhr, status, err){
    console.log(xhr)
    console.log(status)
    console.log(err)
  }

  function handleCommentSubmit (comment, parentIndex){
    console.log("PARENT"+parentIndex)
    return api.comments
      .add(comment)
      .done((comment) => {
        const params = {}
         const urlReplaces = {
        objectPk: props.subjectId,
        contentTypeId: props.subjectType
        }
        params.ordering = sort
        params.urlReplaces = urlReplaces

        api.qualities.get(params).done(handleQualities).fail(handleQualityFail)

        comment.displayNotification = true
        addComment(parentIndex, comment)

        updateAgreedTOS()

      })
      .fail((xhr, status, err) => {
        const newErrorMessage = Object.values(xhr.responseJSON)[0]
        setReplyError(parentIndex, undefined, newErrorMessage)
      })
  }

  function handleCommentModify (modifiedComment, index, parentIndex) {
    let comment = comments[index]
    if (parentIndex !== undefined) {
      comment = comments[parentIndex].child_comments[index]
    }

    const urlReplaces = {
    objectPk: props.subjectId,
    contentTypeId: props.subjectType
    }
    const params = {}
    params.ordering = sort
    params.urlReplaces = urlReplaces

    return api.comments
      .change(modifiedComment, comment.id)
      .done((changed) => {
        updateStateComment(index, parentIndex, {
          ...changed,
          editError: false,
          errorMessage: undefined
        })
        updateAgreedTOS()
        console.log("TEST")
        api.qualities.get(params).done(handleQualities).fail(handleQualityFail)

      })
      .fail((xhr, status, err) => {
        const newErrorMessage = Object.values(xhr.responseJSON)[0]
        setEditError(index, parentIndex, newErrorMessage)
      })
  }

  function handleCommentDelete (index, parentIndex) {
    const newComments = comments
    let comment = newComments[index]
    if (parentIndex !== undefined) {
      comment = newComments[parentIndex].child_comments[index]
    }

    const data = {
      urlReplaces: {
        contentTypeId: comment.content_type,
        objectPk: comment.object_pk
      }
    }
    return api.comments
      .delete(data, comment.id)
      .done((changed) => {
        updateStateComment(index, parentIndex, {
          ...changed,
          editError: false,
          errorMessage: undefined
        })
      })
      .fail((xhr, status, err) => {
        const newErrorMessage = Object.values(xhr.responseJSON)[0]
        setEditError(index, parentIndex, newErrorMessage)
      })
  }

  function hideNewError () {
    setMainError(undefined)
  }

  function handleHideReplyError (index, parentIndex) {
    setReplyError(index, parentIndex, undefined)
  }

  function handleHideEditError (index, parentIndex) {
    setEditError(index, parentIndex, undefined)
  }

  function handleToggleFilters (e) {
    e.preventDefault()
    setShowFilters(!showFilters)
  }

  function handleClickFilter (e) {
    e.preventDefault()
    const filter = e.target.id
    fetchFiltered(filter)
    setLoadingFilter(true)
  }

  function fetchFiltered (filter) {
    console.log("FILTER")
    let commentCategory = filter
    let displayFilter = props.commentCategoryChoices[filter]
    if (filter === 'all') {
      displayFilter = django.gettext('all')
      commentCategory = ''
    }
    const params = {
      comment_category: commentCategory,
      ordering: sort,
      search,
      urlReplaces
    }
    api.comments.get(params).done((result) => {
      const data = result
      setComments(data.results)
      setNextComments(data.next)
      setCommentCount(data.count)
      setFilter(filter)
      setFilterDisplay(displayFilter)
      setLoadingFilter(false)
      console.log(stanceParentId)
    })
  }

  function handleClickSorted (e) {
    e.preventDefault()
    const order = e.target.id
    fetchSorted(order)
    setLoadingFilter(true)
  }

  function fetchSorted (order) {
    let commentCategory = filter
    if (commentCategory === 'all') {
      commentCategory = ''
    }
    const params = {
      ordering: order,
      comment_category: commentCategory,
      search,
      urlReplaces
    }
    console.log(stanceParentId)

    api.comments.get(params).done((result) => {
      const data = result
      setComments(data.results)
      setNextComments(data.next)
      setCommentCount(data.count)
      setSort(order)
      setLoadingFilter(false)
      console.log(stanceParentId)
    })
  }

  function handleSearch (search) {
    fetchSearch(search)
    setLoadingFilter(true)
  }

  function fetchSearch (search) {
    let commentCategory = filter
    if (commentCategory === 'all') {
      commentCategory = ''
    }
    const params = {
      search,
      ordering: sort,
      comment_category: commentCategory,
      urlReplaces
    }
    api.comments.get(params).done((result) => {
      const data = result
      setComments(data.results)
      setNextComments(data.next)
      setCommentCount(data.count)
      setSearch(search)
      setLoadingFilter(false)
    })
  }

  function findAnchoredComment (newComments, parentId) {
    if (props.anchoredCommentId && !anchoredCommentFound) {
      let found = false

      for (const comment of newComments) {
        if (comment.id === anchoredCommentId || comment.id === parentId) {
          setAnchoredCommentFound(true)
          found = true
          break
        }
      }
      return found
    }
    return true
  }

  function fetchComments () {
    fetch(nextComments)
      .then((response) => response.json())
      .then((data) => {
        const newComments = comments.concat(data.results)
        setComments(newComments)
        setNextComments(data.next)
        setCommentCount(data.count)

        if (findAnchoredComment(newComments, anchoredCommentParentId)) {
          setLoading(false)
        } else {
          fetchComments()
        }
        return null
      }).catch(error => {
        console.warn(error)
      })
  }

  function handleScroll () {
    const html = document.documentElement
    if (
      html.scrollTop + html.clientHeight >
      getDocumentHeight() - autoScrollThreshold
    ) {
      if (nextComments && !loading) {
        setLoading(true)
        fetchComments()
      }
    }
  }

  function commentCategoryChoices () {
    if (props.withCategories === true) {
      return props.commentCategoryChoices
    }
  }

  function translatedEntriesFound (entriesFound) {
    return django.ngettext(
      'entry found for ',
      'entries found for ',
      entriesFound
    )
  }

  function handleTermsOfUse () {
    if (!agreedTermsOfUse) {
      setAgreedTermsOfUse(true)
    }
  }

  function updateAgreedTOS () {
    if (useTermsOfUse && !agreedTermsOfUse) {
      setAgreedTermsOfUse(true)
      const event = new Event('agreedTos')
      dispatchEvent(event)
    }
  }

  function onRenderFinished () {
    setAnchorRendered(true)
  }

  return (

    <div>
      <div className="buttonBox">
         <button className="questButton" onClick={openQuest}><img className="sprechblase-button" src={require("../../../../adhocracy-plus/static/stance_icons/comment-pen-white.png")} alt="Quest" /></button>
      <button className="stanceButton"  onClick={e => {showModal();}}> <img className="sprechblase-button" src={require("../../../../adhocracy-plus/static/stance_icons/sprechblase-white.png")} alt="Sprechblase" /> </button>
    </div>
      <Modal onClose={showModal} show={modalState.isOpen}> <div className="stanceBox">
              <div style={{fontSize: '16px'}}> Kommentar von {userText}:</div>
              <div className="stanceText"> {stanceText}</div>
              <div className="a4-comments__commentbox__form">
                <CommentForm
                  subjectType={stanceID}
                  subjectId={stanceCT}
                  onCommentSubmit={handleCommentSubmit}
                  rows="1"
                  parentIndex={stanceParentIdx}
                  error={error}
                  errorMessage={errorMessage}
                  handleErrorClick={hideNewError}
                  commentCategoryChoices={commentCategoryChoices()}
                  withCategories={props.withCategories}
                  hasCommentingPermission={hasCommentingPermission}
                  wouldHaveCommentingPermission={wouldHaveCommentingPermission}
                  projectIsPublic={projectIsPublic}
                  useTermsOfUse={useTermsOfUse}
                  agreedTermsOfUse={agreedTermsOfUse}
                  orgTermsUrl={orgTermsUrl}
                  quality={qualities}
                />
              </div>
            </div></Modal>
      {/* <Fragment>
          <Collapse isOpen={collapseState.isOpen}>
            <div className="stanceBox">
              <div style={{fontSize: '16px'}}> Kommentar von {userText}:</div>
              <div style={{fontSize: '24px'}}> {stanceText}</div>
              <div className="a4-comments__commentbox__form">
                <CommentForm
                  subjectType={props.subjectType}
                  subjectId={props.subjectId}
                  onCommentSubmit={handleCommentSubmit}
                  rows="5"
                  error={error}
                  errorMessage={errorMessage}
                  handleErrorClick={hideNewError}
                  commentCategoryChoices={commentCategoryChoices()}
                  withCategories={props.withCategories}
                  hasCommentingPermission={hasCommentingPermission}
                  wouldHaveCommentingPermission={wouldHaveCommentingPermission}
                  projectIsPublic={projectIsPublic}
                  useTermsOfUse={useTermsOfUse}
                  agreedTermsOfUse={agreedTermsOfUse}
                  orgTermsUrl={orgTermsUrl}
                />
              </div>
            </div>
        </Collapse>
      </Fragment> */}
      <div className="a4-comments__commentbox__form">
        <CommentForm
          subjectType={props.subjectType}
          subjectId={props.subjectId}
          onCommentSubmit={handleCommentSubmit}
          rows="5"
          error={error}
          errorMessage={errorMessage}
          handleErrorClick={hideNewError}
          commentCategoryChoices={commentCategoryChoices()}
          withCategories={props.withCategories}
          hasCommentingPermission={hasCommentingPermission}
          wouldHaveCommentingPermission={wouldHaveCommentingPermission}
          projectIsPublic={projectIsPublic}
          useTermsOfUse={useTermsOfUse}
          agreedTermsOfUse={agreedTermsOfUse}
          orgTermsUrl={orgTermsUrl}
        />
      </div>

      <div
        className={
          comments.length === 0 && loading
            ? 'd-none'
            : 'a4-comments__filters__parent'
        }
      >
        <div className="a4-comments__filters__parent--closed">
          <div
            className={search === '' ? 'a4-comments__filters__text' : 'd-none'}
          >
            {commentCount + ' ' + translated.entries}
          </div>

          <div
            className={search !== '' ? 'a4-comments__filters__text' : 'd-none'}
          >
            <span className="a4-comments__filters__span">
              {commentCount + ' ' + translatedEntriesFound(commentCount)}
              {search}
            </span>
          </div>

          {!showFilters && commentCount > 0 && (
            <button
              className="btn a4-comments__filters__show-btn"
              type="button"
              onClick={handleToggleFilters}
            >
              <i
                className="fas fa-sliders-h ms-2"
                aria-label={translated.showFilters}
              />
              {translated.filters}
            </button>
          )}

          {showFilters && commentCount > 0 && (
            <button
              className="btn a4-comments__filters__show-btn"
              type="button"
              onClick={handleToggleFilters}
            >
              <i
                className="fas fa-times ms-2"
                aria-label={translated.hideFilters}
              />
              {translated.hideFilters}
            </button>
          )}
        </div>

        {showFilters && (
          <div className="a4-comments__filters">
            <FilterSearch
              search={search}
              translated={translated}
              onSearch={handleSearch}
            />
            {props.withCategories
              ? (
                <FilterCategory
                  translated={translated}
                  filter={filter}
                  filterDisplay={filterDisplay}
                  onClickFilter={handleClickFilter}
                  commentCategoryChoices={props.commentCategoryChoices}
                />
                )
              : (
                <div className="col-lg-3" />
                )}
            <FilterSort
              translated={translated}
              sort={sort}
              sorts={sorts}
              onClickSorted={handleClickSorted}
            />
          </div>
        )}

        <div className={loadingFilter ? 'u-spinner__container' : 'd-none'}>
          <i className="fa fa-spinner fa-pulse" aria-hidden="true" />
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>

      <div className="a4-comments__box">
        <div className="a4-comments__list">
          <CommentList
            comments={comments}
            anchoredCommentId={anchoredCommentId}
            anchoredCommentParentId={anchoredCommentParentId}
            onCommentDelete={handleCommentDelete}
            onCommentSubmit={handleCommentSubmit}
            onCommentModify={handleCommentModify}
            commentCategoryChoices={commentCategoryChoices()}
            onReplyErrorClick={handleHideReplyError}
            onEditErrorClick={handleHideEditError}
            onRenderFinished={onRenderFinished}
            withCategories={props.withCategories}
            hasCommentingPermission={hasCommentingPermission}
            wouldHaveCommentingPermission={wouldHaveCommentingPermission}
            projectIsPublic={projectIsPublic}
            useTermsOfUse={useTermsOfUse}
            agreedTermsOfUse={agreedTermsOfUse}
            orgTermsUrl={orgTermsUrl}
            stanceId={stanceParentId}
            quality={qualities}
            prediction={props.prediction}
          />
        </div>
      </div>
      <div className={loading ? 'u-spinner__container' : 'd-none'}>
        <i className="fa fa-spinner fa-pulse" aria-hidden="true" />
        <span className="visually-hidden">Loading...</span>
      </div>
    </div>
  )
}

export default CommentBox
