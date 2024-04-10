import React, {useEffect, useRef, useState} from 'react'
import django from 'django'
import update from 'immutability-helper'
import Badge from '@mui/material/Badge';
import "../../../../adhocracy-plus/static/collapsible.css";

import CommentForm from './comment_form'
import CommentList from './comment_list'
import Modal from './stance_modal'
import { FilterCategory } from './filter_category'
import { FilterSearch } from './filter_search'
import { FilterSort } from './filter_sort'
import { getDocumentHeight } from '../util'
import {getRandomInt, cyrb53} from "./utils";
import {addCreatorData} from "./data_utils";

const api = require('../../../../adhocracy-plus/static/api')
const {Fragment} = React;

const sorts = {
  new: django.gettext('Newest'),
  pos: django.gettext('Most up votes'),
  neg: django.gettext('Most down votes'),
  ans: django.gettext('Most answers'),
  dis: django.gettext('Last discussed'),
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

export const CommentBox = (props) => {
  const urlReplaces = {
    objectPk: props.subjectId,
    contentTypeId: props.subjectType
  }

  const [showQuestButtons, setShowQuestButtons] = useState(true)
  const [showFaqButtons, setShowFaqButtons] = useState(true)
  const [showStanceButtons, setShowStanceButtons] = useState(false)
  const [questBadgeInvisible, setQuestBadgeInvisible] = useState(false)
  const [faqBadgeInvisible, setFaqBadgeInvisible] = useState(false)

  const [openQuestClicked, setOpenQuestClicked] = useState(false)
  const [openFaqClicked, setOpenFaqClicked] = useState(false)
  const [questModalFirstTime, setQuestModalFirstTime] = useState(true)

  const [creatorId, setCreatorId] = useState(0)
  const [modalQuestState, setModalQuestState] = useState({isOpen: false})
  const [modalFaqState, setModalFaqState] = useState({isOpen: false})

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
  const [topThreeCommentIds, setTopThreeCommentIds] = useState([])

  useEffect(() => {
    window.addEventListener('scroll', handleScroll, { passive: true })
    window.addEventListener('agreedTos', handleTermsOfUse)

    if (props.useModeratorMarked) {
      sorts.mom = django.gettext('Highlighted')
    }

    const params = {}
    params.ordering = sort
    params.objectPk = props.subjectId
    params.contentTypeId = props.subjectType
    params.urlReplaces = urlReplaces
    if (props.anchoredCommentId) {
      params.commentID = props.anchoredCommentId
    }

    //setTimer(setInterval(refreshComments, 5000))
    api.comments.get(params).done(handleComments).fail()

    return () => {
      window.removeEventListener('scroll', handleScroll)
      window.removeEventListener('agreedTos', handleTermsOfUse)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  /*useEffect(() => {
    const timer = window.setInterval(() => {
      console.log(sort)
      fetchSorted(sort)
    }, 30000)
    return () => {
      window.clearInterval(timer);
    };
  }, [sort]);*/

  useEffect(() => {
    if (anchorRendered === true) {
      const el = document.getElementById('comment_' + anchoredCommentId)
      if (el !== null) {
        const top = el.getBoundingClientRect().top
        window.scrollTo(0, top)
      }
    }
  }, [anchorRendered, anchoredCommentId])

  function videoWatched(){
    console.log("VIDEO WATCHED")
    const urlReplaces = {
      objectPk: props.subjectId,
      contentTypeId: props.subjectType
    }

    const payload = {
      questionbox_clicked: true
    }

    const u_stanceData = {
      urlReplaces: urlReplaces,
      content_type: props.subjectType,
      object_id: props.subjectId,
      creator_id: creatorId,
      payload: payload
    }
    setQuestBadgeInvisible(false)
    //showQuestModal()

  }

 {
    /*
      SHOW MODALS STANCE, VIDEO AND FAQ
    */
  }
  function showQuestModal(){
    console.log("QUEST MODAL")
    console.log(modalQuestState.isOpen)

    if(modalQuestState.isOpen){
      if(questModalFirstTime){
        console.log("STARTED STANCE TIMER")
        setQuestModalFirstTime(false)
        videoWatched()
      }

      console.log("CLICKED QUEST MODAL")
      setQuestBadgeInvisible(false)
    }else{
      setQuestBadgeInvisible(true)
    }

    setModalQuestState({isOpen: !modalQuestState.isOpen})
  }

  function showFaqModal(){
    if(modalFaqState.isOpen){
      console.log("CLICKED FAQ MODAL")
      setFaqBadgeInvisible(false)
    }else{
      setFaqBadgeInvisible(true)
    }

    setModalFaqState({isOpen: !modalFaqState.isOpen})
  }

  {
    /*
    COUNTDOWN TIMER
    Countdown timers for Stance modal
    */
  }

  function countDown(_openQuestClicked) {
    console.log("TIMER FIRED")
    // Remove one second, set state so a re-render happens.
    console.log(modalQuestState.isOpen)
    console.log(_openQuestClicked)
    if(!_openQuestClicked) {
      showQuestModal()
    }else{
      if(!showStanceButtons){
        console.log("STARTED STANCE TIMER")
        setTimeout(countDownStance, 5000);
      }
    }
    // Check if we're at zero.
    setShowQuestButtons(true)
  }

  function handleComments (result) {
    const data = result

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
      fetchSorted(sort)
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
      diff[parentIndex] = {
        child_comments: { $push: [comment] },
        $merge: {
          replyError: false,
          errorMessage: undefined
        }
      }

    } else {

      diff = { $unshift: [comment] }
      newCommentCount++
      setMainError(undefined)
    }
    setComments(update(comments, diff))
    setCommentCount(newCommentCount)
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
  function handleCommentSubmit (comment, parentIndex){
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
        fetchSorted(sort)

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
        fetchSorted(sort)
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
      objectPk: props.subjectId,
      contentTypeId: props.subjectType,
      search,
      urlReplaces
    }

    api.comments.get(params).done((result) => {
      const data = result
      setTopThreeCommentIds(data.results.slice(0,3).map(el => el.id))
      setComments(data.results)
      setNextComments(data.next)
      setCommentCount(data.count)
      console.log("Comments:")
      /*setSort(order)*/
      setLoadingFilter(false)
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

    {
    /*
    RENDER BUTTONS
    */
  }
  function renderButtons() {
   if (showQuestButtons) {
      return(
        <div>
          <div className="buttonBox">
            <Badge color="primary" badgeContent="Einführung!" invisible={questBadgeInvisible}>
              <button className="questButton" onClick={showQuestModal}><img className="sprechblase-button" src={require("../../../../adhocracy-plus/static/stance_icons/video.png")} alt="Quest" /></button>
            </Badge>
          </div>
          <div className="buttonBox2">
            <Badge anchorOrigin={{vertical: 'top', horizontal:"left"}} overlap="circular" color="primary" badgeContent="Infos!" invisible={faqBadgeInvisible}>
              <button className="faqButton" onClick={showFaqModal}><img className="sprechblase-button" src={require("../../../../adhocracy-plus/static/stance_icons/faq-white.png")} alt="FAQ" /></button>
            </Badge>
          </div>
        </div>
      )
    }
  }

 {
    /*
    RENDER MODALS
    */
  }

  function renderQuestModal() {
    return(
      <Modal show={modalQuestState.isOpen}>
            <div className="questModal" id="questModal">
              <img className="questblase" src={require("../../../../adhocracy-plus/static/stance_icons/video.png")} alt="Quest" />
              <button className="closedButton"> <img className="close" src={require("../../../../adhocracy-plus/static/stance_icons/close.png")} alt="Close" onClick={e => {showQuestModal(e); console.log("CLOSED")}}/></button>
              <div style={{display: "flex", flexDirection: "column", padding: "20px", paddingLeft: "0px"}}>
                {/* Embed video here */}
                <iframe class="introVideo" src="https://www.youtube.com/embed/aqz-KE-bpKQ" title="Big Buck Bunny 60fps 4K - Official Blender Foundation Short Film" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowFullScreen></iframe>
                {/* <video controls style={{ marginLeft: '5%' }}>
                  <source src="/static/stance_icons/BigBuckBunny.mp4" type="video/mp4" />
                  Your browser does not support the video tag.
                </video> */}
                 {/* <div className="argumentText"> Wir bitten Sie an einer Umfrage teilzunehmen!</div>
                <button className="questButtonModal" onClick={openQuest}>Hier gehts zur Umfrage!</button>  */}
              </div>
            </div>
      </Modal>
    )
  }

  function renderFaqModal() {
    return(
      <Modal show={modalFaqState.isOpen}>
            <div className="questModal" id="faqModal">
              <img className="questblase" src={require("../../../../adhocracy-plus/static/stance_icons/video.png")} alt="Quest" />
              <button className="closedButton"> <img className="close" src={require("../../../../adhocracy-plus/static/stance_icons/close.png")} alt="Close" onClick={e => {showFaqModal(e); console.log("CLOSED")}}/></button>
              <div style={{display: "flex", flexDirection: "column", padding: "20px", paddingLeft: "0px"}}>
                {/* Embed video here */}
                <iframe class="introVideo" src="https://www.youtube.com/embed/aqz-KE-bpKQ" title="Big Buck Bunny 60fps 4K - Official Blender Foundation Short Film" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowFullScreen></iframe>
                {/* <video controls style={{ marginLeft: '5%' }}>
                  <source src="/static/stance_icons/BigBuckBunny.mp4" type="video/mp4" />
                  Your browser does not support the video tag.
                </video> */}
                 {/* <div className="argumentText"> Wir bitten Sie an einer Umfrage teilzunehmen!</div>
                <button className="questButtonModal" onClick={openQuest}>Hier gehts zur Umfrage!</button>  */}
              </div>
            </div>
      </Modal>
    )
  }

  {
    /*
    RENDER MAIN THREAD
    */
  }
  function onRenderFinished () {
    setAnchorRendered(true)
  }

  return (
    <div>
        {renderButtons()}
        {renderQuestModal()}
        {renderFaqModal()}
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

 {/*           {!showFilters && commentCount > 0 && (
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
          )} */}

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
            topThreeCommentIds={topThreeCommentIds}
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