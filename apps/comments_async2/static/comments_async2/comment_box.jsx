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

const cyrb53 = (str, seed = 0) => {
    let h1 = 0xdeadbeef ^ seed, h2 = 0x41c6ce57 ^ seed;
    for(let i = 0, ch; i < str.length; i++) {
        ch = str.charCodeAt(i);
        h1 = Math.imul(h1 ^ ch, 2654435761);
        h2 = Math.imul(h2 ^ ch, 1597334677);
    }
    h1  = Math.imul(h1 ^ (h1 >>> 16), 2246822507);
    h1 ^= Math.imul(h2 ^ (h2 >>> 13), 3266489909);
    h2  = Math.imul(h2 ^ (h2 >>> 16), 2246822507);
    h2 ^= Math.imul(h1 ^ (h1 >>> 13), 3266489909);

    return 4294967296 * (2097151 & h2) + (h1 >>> 0);
};

const autoScrollThreshold = 500
let timer = 0


export const CommentBox = (props) => {
  const urlReplaces = {
    objectPk: props.subjectId,
    contentTypeId: props.subjectType
  }

  const [qualities, setQualities] = useState([])
  const [showQuestButtons, setShowQuestButtons] = useState(false)
  const [showStanceButtons, setShowStanceButtons] = useState(false)
  const [stanceParentId, setStanceParentId] = useState(0)
  const [stanceParentIdx, setStanceParentIdx] = useState(0)
  const [stanceCT, setStanceCT] = useState(0)
  const [stanceID, setStanceID] = useState(0)
  const [creatorName, setCreatorName] = useState(0)
  const [creatorId, setCreatorId] = useState(0)
  const [modalQuestState, setModalQuestState] = useState({isOpen: false})
  const [modalStanceState, setModalStanceState] = useState({isOpen: false})
  const [firstStanceAnswered, setFirstStanceAnswered] = useState({answered: false})
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

  useEffect(() => {
    window.addEventListener('scroll', handleScroll, { passive: true })
    window.addEventListener('agreedTos', handleTermsOfUse)

    console.log("FIRED")
    if (props.useModeratorMarked) {
      sorts.mom = django.gettext('Highlighted')
    }
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

    // Check table id for stance recommendation
    comments.forEach((comment, index) =>{
      if (comment.id == stanceParentId){
        setStanceParentIdx(index) // Set for table update
        console.log("STANCE PARENT COMMENT_CT: " + comment.content_type)
        console.log("STANCE PARENT COMMENT_CCT: " + comment.comment_content_type)
        // Set for database
        setStanceID(comment.comment_content_type)
        setStanceCT(stanceParentId) // same as comment_id
      }
    })
}, [comments]);


  function showQuestModal(){
    setModalQuestState({ isOpen: !modalQuestState.isOpen})
    if(showQuestButtons && !showStanceButtons){
          timer = setInterval(countDownStance, 2000);
    }
  }

  function showStanceModal(e){
    console.log(e)
    if (e != undefined) {
      if (e.target.className === "forButton" || e.target.className === "againstButton") {
        setFirstStanceAnswered({answered: true})
      } else if(e.target.className === "sprechblase-button" || e.target.className === "close") {
        setModalStanceState({isOpen: !modalStanceState.isOpen})
      }
    }
  }

  function saveUserStance(e) {
    if (e != undefined){
        const urlReplaces = {
          objectPk: props.subjectId,
          contentTypeId: props.subjectType
        }
      if (e.target.className === "forButton"){
        const stanceData = {
          urlReplaces: urlReplaces,
          content_type: props.subjectType,
          object_id: props.subjectId,
          user_stance: "Positiv",
          creator: creatorName,
          creator_id : creatorId
        }
        api.userstances.add(stanceData)
      }else{
        const stanceData = {
          urlReplaces: urlReplaces,
          content_type: props.subjectType,
          object_id: props.subjectId,
          user_stance: "Negativ",
          creator: creatorName,
          creator_id : creatorId
        }
        api.userstances.add(stanceData)
      }
    }
  }

  function openQuest(){
    window.open("https://google.com", "_blank", "noreferrer")
  }

  function countDown() {
    // Remove one second, set state so a re-render happens.
    console.log(modalQuestState.isOpen)
    setModalQuestState({isOpen: true})
    console.log("TIMER FIRED")

    // Check if we're at zero.
    if (modalQuestState) {
      setShowQuestButtons(true)
      clearInterval(timer)
    }
  }

  function countDownStance() {
    // Remove one second, set state so a re-render happens.
    console.log(modalStanceState.isOpen)
    setModalStanceState({isOpen: true})
    console.log("TIMER FIRED STANCE")

    // Check if we're at zero.
    if (modalStanceState) {
      console.log("SET STANCE BUTTONS")
      setShowStanceButtons(true)
      clearInterval(timer)
    }
  }

  function getRandomInt(min, max) {
      min = Math.ceil(min);
      max = Math.floor(max);
      return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  function chooseStanceComment (stances, user){
    let filteredStances = []
    console.log(stances)
    for (let i = 0; i < stances.length; i++) {      // Get first instance
      let stance = stances[i]
      if (stance.creator != user){
        filteredStances.push(stance)
        break
      }
    }
    console.log(filteredStances)
    if (filteredStances.length > 0){
      const random_index = getRandomInt(0, filteredStances.length - 1)
      setStanceText(filteredStances[random_index].comment_text)
      setUserText(filteredStances[random_index].creator)

      // This is the comment identifier
      setStanceParentId(filteredStances[random_index].comment_id)
      console.log("PARENT1: " + stanceParentId)
    }
    setCreatorName(user)
    setCreatorId(cyrb53(user))
    console.log("CREATOR: " + user)
    console.log("HASH: " + cyrb53(user))
  }

  function handleQualities(result){
    const data = result

    const urlReplaces = {
      objectPk: props.subjectId,
      contentTypeId: props.subjectType
    }
    const params = {}
    params.ordering = sort
    params.urlReplaces = urlReplaces

    setQualities(data)
  }

  function handleQualityFail(xhr, status, err){
    console.log(xhr)
    console.log(status)
    console.log(err)
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

    } else {
      console.log("NO CHILD!")

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
    console.log("PARENT"+parentIndex)
    console.log(comment)
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

    api.comments.get(params).done((result) => {
      const data = result
      setComments(data.results)
      setNextComments(data.next)
      setCommentCount(data.count)
      setSort(order)
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

  function renderButtons() {
   if (showQuestButtons && showStanceButtons) {
      return(
        <div className="buttonBox">
          <button className="questButton" onClick={showQuestModal}><img className="sprechblase-button" src={require("../../../../adhocracy-plus/static/stance_icons/comment-pen-white.png")} alt="Quest" /></button>
          <button className="stanceButton"  onClick={showStanceModal}> <img className="sprechblase-button" src={require("../../../../adhocracy-plus/static/stance_icons/sprechblase-white.png")} alt="Sprechblase" /> </button>
        </div>
      )
    } else if (showQuestButtons){
      return(
        <div className="buttonBox">
          <button className="questButton" onClick={showQuestModal}><img className="sprechblase-button" src={require("../../../../adhocracy-plus/static/stance_icons/comment-pen-white.png")} alt="Quest" /></button>
        </div>
      )
    }
  }

  function renderQuestModal() {
    return(
      <Modal show={modalQuestState.isOpen}>
            <div className="questModal" id="questModal">
              <img className="questblase" src={require("../../../../adhocracy-plus/static/stance_icons/comment-pen.png")} alt="Quest" />
              <button className="closedButton"> <img className="close" src={require("../../../../adhocracy-plus/static/stance_icons/close.png")} alt="Close" onClick={e => {showQuestModal(); console.log("CLOSED")}}/></button>
              <div style={{display: "flex", flexDirection: "column", padding: "20px", paddingLeft: "0px"}}>
                <div className="argumentText"> Wir bitten Sie an einer Umfrage teilzunehmen!</div>
                <button className="questButtonModal" onClick={openQuest}>Hier gehts zur Umfrage!</button>
              </div>
            </div>
      </Modal>
    )
  }

  function renderStanceModal() {
    if (!firstStanceAnswered.answered){
       return(
      <Modal show={modalStanceState.isOpen}>
       <div className="firstStanceModal" id="firstStanceModal">
         <img className="sprechblase" src={require("../../../../adhocracy-plus/static/stance_icons/sprechblase.png")} alt="Sprechblase" />
        <button className="closedButton" onClick={e => {showStanceModal(e); console.log("CLOSED")}}> <img className="close" src={require("../../../../adhocracy-plus/static/stance_icons/close.png")} alt="Close" /></button>
        <div style={{width: "90%", display: "flex", flexDirection: "column", marginLeft: "30px", paddingRight: "20px", paddingLeft: "20px", marginTop: "10px"}}>
          <div className="argumentText">  Wie stehen Sie zu folgendem Kommentar?</div>
          <div className="stanceBox">
              <div style={{fontSize: '16px'}}> Kommentar von {userText}:</div>
              <div className="stanceText"> {stanceText}</div>
              <div style={{width: "100%", display: "flex", justifyContent: "center"}}>
                <button className="forButton" onClick={e => {saveUserStance(e); console.log("CLOSED")}}>Dafür</button>
                <button className="againstButton" onClick={e => {saveUserStance(e); console.log("CLOSED")}}>Dagegen</button>
              </div>
              </div>
            </div>
           </div>
      </Modal>
    )
    }else {
      return (
        <Modal show={modalStanceState.isOpen}>
          <div className="stanceModal" id="stanceModal">
            <img className="sprechblase" src={require("../../../../adhocracy-plus/static/stance_icons/sprechblase.png")}
                 alt="Sprechblase"/>
            <button className="closedButton" onClick={e => {showStanceModal(e);console.log("CLOSED")}}>
              <img className="close" src={require("../../../../adhocracy-plus/static/stance_icons/close.png")} alt="Close" />
            </button>
            <div style={{
              width: "90%",
              display: "flex",
              flexDirection: "column",
              marginLeft: "30px",
              paddingRight: "20px",
              paddingLeft: "20px",
              marginTop: "10px"
            }}>
              <div className="argumentText"> Folgender Kommentar wurde bereits zur Diskussion beigetragen. Möchten Sie
                darauf antworten?
              </div>
              <div className="stanceBox">
                <div style={{fontSize: '16px'}}> Kommentar von {userText}:</div>
                <div className="stanceText"> {stanceText}</div>
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
            </div>
          </div>
        </Modal>
      )
    }
  }

  function onRenderFinished () {
    setAnchorRendered(true)
  }

  return (
    <div>
        {renderButtons()}
        {renderQuestModal()}
        {renderStanceModal()}
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
