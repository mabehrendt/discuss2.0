import React, {useEffect, useRef, useState} from 'react'
import django from 'django'
import update from 'immutability-helper'
import Badge from '@mui/material/Badge';
import Spinner from '../../../../adhocracy-plus/static/Spinner.jsx';
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

  const stanceMap = {
    "Positiv": 1,
    "Negativ": 0
  }

  const [spinnerLoading, setSpinnerLoading] = useState(false)
  const [showQuestButtons, setShowQuestButtons] = useState(false)
  const [showFaqButtons, setShowFaqButtons] = useState(false)
  const [showStanceButtons, setShowStanceButtons] = useState(false)
  const [questBadgeInvisible, setQuestBadgeInvisible] = useState(false)
  const [faqBadgeInvisible, setFaqBadgeInvisible] = useState(false)

  const [openQuestClicked, setOpenQuestClicked] = useState(false)
  const [openFaqClicked, setOpenFaqClicked] = useState(false)
  const [questModalFirstTime, setQuestModalFirstTime] = useState(true)
  const [commentFromStanceModal, setCommentFromStanceModal] = useState(false)

  const [stanceParentId, setStanceParentId] = useState(0)
  const [stanceParentIdx, setStanceParentIdx] = useState(0)
  const [stanceCT, setStanceCT] = useState(0)
  const [stanceID, setStanceID] = useState(0)
  const [creatorId, setCreatorId] = useState(0)
  const [modalQuestState, setModalQuestState] = useState({isOpen: false})
  const [modalFaqState, setModalFaqState] = useState({isOpen: false})
  const [modalStanceState, setModalStanceState] = useState({isOpen: false})
  const [firstStanceAnswered, setFirstStanceAnswered] = useState({answered: false})

  const [stanceText, setStanceText] = useState("")
  const [userText, setUserText] = useState("")
  const [userStance, setUserStance] = useState("")
  const [noStancesFound, setNoStancesFound] = useState(false)

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

    if (props.useModeratorMarked) {
      sorts.mom = django.gettext('Highlighted')
    }

    const params = {}
    params.ordering = sort
    params.urlReplaces = urlReplaces
    if (props.anchoredCommentId) {
      params.commentID = props.anchoredCommentId
    }
    console.log("Plop")
    console.log(props)

    if (props.user.user_auth) {
      console.log("GETUSERSTANCES")
      api.userstances.get(params).done(handleUserstances).fail()
    }
    console.log("NEWLY RENDERED1")

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

  useEffect(() => {
    // Check comment list for stance recommendation
    comments.forEach((comment, index) =>{
      if (comment.id == stanceParentId){
        setStanceParentIdx(index) // Set for table update
        // Set for database
        setStanceID(comment.comment_content_type)
        setStanceCT(stanceParentId) // same as comment_id
        if(commentFromStanceModal) {
          console.log("SCROLL TO COMMENT")
          console.log(comment.id)
          const el = document.getElementById('comment_' + comment.id)
          if (el !== null) {
            const top = el.getBoundingClientRect().top
            console.log(top)
            console.log(window.scrollY)
            console.log(top + window.scrollY)
            window.scrollTo(0, top + window.scrollY)
          }
          setCommentFromStanceModal(false)
        }
      }
    })
  }, [comments, stanceParentId]);

  function refreshComments(){

  }

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

    api.userstances.change(u_stanceData).fail()
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
        setTimeout(countDownStance, 5000, "")
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

  function showStanceModal(e){
    console.log(e)
    if (e != undefined) {
      if (e.target.className === "forButton" || e.target.className === "againstButton") {
        setFirstStanceAnswered({answered: true})
      } else if(e.target.className === "sprechblase-button" || e.target.className === "close") {
        setModalStanceState({isOpen: !modalStanceState.isOpen})
      }
    }else{
      setModalStanceState({isOpen: !modalStanceState.isOpen})
    }
  }

  {
    /*
    SAVE USER STANCE
    Save the initial stance of a user. This is used to determine the stance of the user in the discussion.
    */
  }

  function saveUserStance(e) {
    if (e != undefined){
        const urlReplaces = {
          objectPk: props.subjectId,
          contentTypeId: props.subjectType
        }
      if (e.target.className === "forButton"){
        const payload = {
          user_stance: "Positiv"
        }

        const u_stanceData = {
          urlReplaces: urlReplaces,
          content_type: props.subjectType,
          object_id: props.subjectId,
          creator_id: creatorId,
          payload: payload
        }

        api.userstances.change(u_stanceData).done(handleUserStanceChange).fail()
      }else{
        const payload = {
          user_stance: "Negativ"
        }

        const u_stanceData = {
          urlReplaces: urlReplaces,
          content_type: props.subjectType,
          object_id: props.subjectId,
          creator_id: creatorId,
          payload: payload
        }

        api.userstances.change(u_stanceData).done(handleUserStanceChange).fail()
      }
    }
  }

  function handleUserStanceChange(result){
    // Get new stances from api
    console.log(result)
    const params = {}
    params.urlReplaces = urlReplaces
    api.stances.get(params).done((stanceResult) => {
      console.log(stanceResult)
      chooseStanceComment(stanceResult, props.user.user, result.user_stance)
      setUserStance(result.user_stance)
    })
    // Call chooseStanceComment with stances
  }

  function handleUserstances(result){
    const data = result
    console.log("USERSTANCE")
    console.log(data)
    let _userStance
    let _hasCreator = ""
    let _openQuestClicked = false
    let _stances = []
    let _usedStances = []

    setCreatorId(cyrb53(props.user.user))

    data.forEach((userstances, index) => {
      if (userstances.creator === props.user.user) {
        _userStance = userstances.user_stance
        setUserStance(_userStance)
        _hasCreator = userstances.creator_id
        _openQuestClicked = userstances.questionbox_clicked
        setOpenQuestClicked(_openQuestClicked)
      }
    })

    if(_hasCreator === "") {
      addCreatorData(urlReplaces, props)
    }

    if(_openQuestClicked){
      setQuestModalFirstTime(false)
    }
    setTimeout(countDown, 2000, _openQuestClicked, _userStance)


    // GET STANCES AND USED STANCES
    api.stances.get({urlReplaces: urlReplaces}).done((stanceResult) => {
      _stances = stanceResult
      api.usedstances.get({urlReplaces: urlReplaces}).done((usedstanceResult) => {
        _usedStances = usedstanceResult
        if (props.stances.length > 0 || _userStance !== "") {
          chooseStanceComment(_stances, _usedStances, props.user.user, _userStance)
        }
      }).fail((xhr, status, err) => {
        console.log("NO USEDSTANCES")
      })
    }).fail((xhr, status, err) => {
      console.log("NO STANCES")
    })
  }

   /*
    CHOOSE STANCE COMMENTS
  */
    function chooseStanceComment (stances, usedStances, user, _userStance){
      let filteredStances = []
      console.log("CHOOSE STANCE COMMENT")
      console.log(_userStance)
      console.log("STANCESRESULT")
      console.log(stances)
      console.log("USEDSTANCESRESULT")
      console.log(usedStances)
      if (_userStance !== "") {
        let filteredUsedStances = []
        for (let i = 0; i < usedStances.length; i++) {
          let usedstance = usedStances[i]
          if (usedstance.creator === user) {
            filteredUsedStances.push(usedstance)
          }
        }
        console.log("FILTERED USED STANCES")
        console.log(filteredUsedStances)

        for (let i = 0; i < stances.length; i++) {   
          let stance = stances[i]
          console.log(usedStances)
            if (stance.creator !== user 
              && stanceMap[stance.stance] !== stanceMap[_userStance]
              && !filteredUsedStances.some(usedstance => usedstance.comment_id === stance.comment_id)) {
                filteredStances.push(stance)            
            }
        }
      }
      
      {/* Choose a random stance from the filtered stances that is not from the user */}
      if (filteredStances.length > 0){
        console.log("STANCE FOUND")
        const random_index = getRandomInt(0, filteredStances.length - 1)
        console.log(filteredStances)
        setStanceText(filteredStances[random_index].comment_text)
        setUserText(filteredStances[random_index].creator)
  
        // This is the comment identifier
        setStanceParentId(filteredStances[random_index].comment_id)
      }else if(filteredStances.length === 0 && _userStance !== ""){
        console.log("NO STANCES FOUND")
        setNoStancesFound(true)
      }
  
    }

  {
    /*
    COUNTDOWN TIMER
    Countdown timers for Stance modal
    */
  }  

  function countDown(_openQuestClicked, _userStance) {
    console.log("TIMER FIRED")
    // Remove one second, set state so a re-render happens.
    console.log(modalQuestState.isOpen)
    console.log(_openQuestClicked)
    if(!_openQuestClicked) {
      showQuestModal()
    }else{
      if(!showStanceButtons){
        console.log("STARTED STANCE TIMER")
        setTimeout(countDownStance, 5000, _userStance);
      }
    }
    // Check if we're at zero.
    setShowQuestButtons(true)
  }

  function countDownStance(_userStance) {
    // Check if user's general stance has been asked
    if (userStance != "" || _userStance != ""){
      setFirstStanceAnswered({answered: true})
    }
    showStanceModal()
    // Check if we're at zero.
    setShowStanceButtons(true)
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
      //console.log(sort)
      //fetchSorted(sort)
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

  function handleCommentSubmit (comment, parentIndex, isStanceModal){
    setSpinnerLoading(true)

    // Check if posted comment comes from stanceModal
    if(isStanceModal){
      setCommentFromStanceModal(true)
    }else{
      setCommentFromStanceModal(false)
    }

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
        if(isStanceModal) {
          showStanceModal()
        }

        // GET STANCES HERE AGAIN AND CALL CHOOSE STANCES
        //if(isStanceModal){
          api.stances.get({urlReplaces: urlReplaces}).done((stanceResult) => {
            api.usedstances.get({urlReplaces: urlReplaces}).done((usedstanceResult) => {
              if (props.stances.length > 0 || userStance !== "") {
                chooseStanceComment(stanceResult, usedstanceResult, props.user.user, userStance)
              }
            }).fail((xhr, status, err) => {
              console.log("NO USEDSTANCES")
            })
          }).fail((xhr, status, err) => {
            console.log("NO STANCES")
          })
        //}
          
        
        // ADD TO USEDSTANCES
        if(isStanceModal){
          console.log("COMMENT ID", stanceParentId)
          const usedstance_Data = {
            urlReplaces: urlReplaces,
            content_type: props.subjectType,
            object_id: props.subjectId,
            comment_id: stanceParentId,
            creator: props.user.user,
            creator_id : cyrb53(props.user.user)
          }
          api.usedstances.add(usedstance_Data).done((result) => {
            console.log("USEDSTANCE ADDED")
          }).fail((xhr, status, err) => {
            console.log("USEDSTANCE FAILED")
          })
        }
        updateAgreedTOS()
        setSpinnerLoading(false)

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

        const delete_stanceData = {
          urlReplaces: urlReplaces,
          content_type: props.subjectType,
          object_id: props.subjectId,
        }

        // DELETE STANCES
        api.stances.delete(delete_stanceData, comment.id).done((result) => {
          console.log("STANCE DELETED")
        }).fail((xhr, status, err) => {
          const newErrorMessage = Object.values(xhr.responseJSON)[0]
          setEditError(index, parentIndex, newErrorMessage)
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
      console.log(data)
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

  {
    /*
    RENDER BUTTONS
    */
  }
  function renderButtons() {
   if (showQuestButtons && showStanceButtons) {
      return(
        <div>
          <div className="buttonBox">
            <Badge color="primary" badgeContent="Anleitung" invisible={questBadgeInvisible}>
              <button className="questButton" onClick={showQuestModal}><img className="sprechblase-button" src={require("../../../../adhocracy-plus/static/stance_icons/video.png")} alt="Quest" /></button>
            </Badge>
            <button className="stanceButton"  onClick={showStanceModal}> <img className="sprechblase-button" src={require("../../../../adhocracy-plus/static/stance_icons/sprechblase-white.png")} alt="Sprechblase" /> </button>
          </div>
          <div className="buttonBox2">
          <Badge anchorOrigin={{vertical: 'top', horizontal:"left"}} overlap="circular" color="primary" badgeContent="Infos" invisible={faqBadgeInvisible}>
            <button className="faqButton" onClick={showFaqModal}><img className="sprechblase-button" src={require("../../../../adhocracy-plus/static/stance_icons/faq-white.png")} alt="FAQ" /></button>
          </Badge>
          </div>
        </div>
      )
    } else if (showQuestButtons){
      return(
        <div>
          <div className="buttonBox">
            <Badge color="primary" badgeContent="Anleitung" invisible={questBadgeInvisible}>
              <button className="questButton" onClick={showQuestModal}><img className="sprechblase-button" src={require("../../../../adhocracy-plus/static/stance_icons/video.png")} alt="Quest" /></button>
            </Badge>
          </div> 
          <div className="buttonBox2">
            <Badge anchorOrigin={{vertical: 'top', horizontal:"left"}} overlap="circular" color="primary" badgeContent="Infos" invisible={faqBadgeInvisible}>
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
            <div className="questModal" id="questModal">
              <img className="questblase" src={require("../../../../adhocracy-plus/static/stance_icons/faq.png")} alt="Quest" />
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

  function renderStanceModal() {
    if (!firstStanceAnswered.answered){
       return(
      <Modal show={modalStanceState.isOpen}>
       <div className="firstStanceModal" id="firstStanceModal">
         <img className="sprechblase" src={require("../../../../adhocracy-plus/static/stance_icons/sprechblase.png")} alt="Sprechblase" />
        <button className="closedButton" onClick={e => {showStanceModal(e); console.log("CLOSED")}}> <img className="close" src={require("../../../../adhocracy-plus/static/stance_icons/close.png")} alt="Close" /></button>
        <div style={{width: "90%", display: "flex", flexDirection: "column", marginLeft: "30px", paddingRight: "20px", paddingLeft: "20px", marginTop: "10px"}}>
          <div className="argumentText">  Wie stehen Sie zum Diskussionsthema?</div>
          <div className="stanceBox">
              <div className="stanceText"> {props.debateStanceQuestion}</div>
              <div style={{width: "100%", display: "flex", justifyContent: "center"}}>
                <button className="forButton" onClick={e => {saveUserStance(e); showStanceModal(e); console.log("CLOSED")}}>Dafür</button>
                <button className="againstButton" onClick={e => {saveUserStance(e); showStanceModal(e); console.log("CLOSED")}}>Dagegen</button>
              </div>
              </div>
            </div>
           </div>
      </Modal>
    )
    }else {
      if(!noStancesFound){
        return (
          <Modal show={modalStanceState.isOpen}>
            <div className="stanceModal" id="stanceModal">
              <img className="sprechblase"
                   src={require("../../../../adhocracy-plus/static/stance_icons/sprechblase.png")}
                   alt="Sprechblase"/>
              <button className="closedButton" onClick={e => {
                showStanceModal(e);
                console.log("CLOSED")
              }}>
                <img className="close" src={require("../../../../adhocracy-plus/static/stance_icons/close.png")}
                     alt="Close"/>
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
                    stanceModal={true}
                  />
                </div>
              </div>
            </div>
          </Modal>
        )
      }else{
        return (
          <Modal show={modalStanceState.isOpen}>
            <div className="stanceModal" id="stanceModal">
              <img className="sprechblase"
                   src={require("../../../../adhocracy-plus/static/stance_icons/sprechblase.png")}
                   alt="Sprechblase"/>
              <button className="closedButton" onClick={e => {
                showStanceModal(e);
                console.log("CLOSED")
              }}>
                <img className="close" src={require("../../../../adhocracy-plus/static/stance_icons/close.png")}
                     alt="Close"/>
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
                <div className="argumentText"> Sobald genügend Teilnehmer an der Diskussion beteiligt sind, bekommen Sie hier einen Kommentar vorgeschlagen auf den Sie eingehen können!
                </div>
              </div>
            </div>
          </Modal>
        )
      }
    }
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
        {renderStanceModal()}
        {renderFaqModal()}
      
      <Spinner spinnerLoading={spinnerLoading} />
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
          stanceModal={false}
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
            stanceId={stanceParentId}
            prediction={props.prediction}
            stanceModal={commentFromStanceModal}
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
