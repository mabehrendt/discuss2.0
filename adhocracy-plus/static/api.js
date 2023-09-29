const $ = require('jquery')
const cookie = require('js-cookie')

function init () {
  $.ajaxSetup({
    headers: { 'X-CSRFToken': cookie.get('csrftoken') }
  })
}

document.addEventListener('DOMContentLoaded', init, false)
document.addEventListener('a4.embed.ready', init, false)

const baseURL = '/api/'

const api = (function () {
  const urls = {
    report: baseURL + 'reports/',
    document: baseURL + 'modules/$moduleId/documents/',
    poll: baseURL + 'polls/',
    pollvote: baseURL + 'polls/$pollId/vote/',
    follow: baseURL + 'follows/',
    comment: baseURL + 'contenttypes/$contentTypeId/objects/$objectPk/comments/',
    qualities: baseURL + 'contenttypes/$contentTypeId/objects/$objectPk/qualities/',
    userstances: baseURL + 'contenttypes/$contentTypeId/objects/$objectPk/userstances/',
    commentmoderate: baseURL + 'contenttypes/$contentTypeId/objects/$objectPk/comment-moderate/',
    stance: baseURL + 'contenttypes/$contentTypeId/objects/$objectPk/a4_candy_stance/',
    rating: baseURL + 'contenttypes/$contentTypeId/objects/$objectPk/ratings/',
    moderatorremark: baseURL + 'contenttypes/$contentTypeId/objects/$objectPk/moderatorremarks/'
  }

  function _sendRequest (endpoint, id, options, data, contentType) {
    const $body = $('body')

    if (typeof id === 'object') {
      // there's no id, switch parameters
      data = options
      options = id
      id = null
    }
    console.log(urls)
    let url = urls[endpoint]
    if (data.urlReplaces) {
      url = url.replace(/\$(\w+?)\b/g, (match, group) => {
        return data.urlReplaces[group]
      })
      data = $.extend({}, data)
      delete data.urlReplaces
    }

    if (typeof id === 'number' || typeof id === 'string') {
      url = url + id + '/'
    }
    const defaultParams = {
      url,
      dataType: 'json',
      data,
      error: function (xhr, status, err) {
        console.error(url, status, err.toString())
      },
      complete: function () {
        $body.removeClass('loading')
      }
    }
    const params = $.extend(defaultParams, options)

    if (typeof params.data !== 'undefined') {
      if (params.type === 'PUT' || params.type === 'POST' ||
          params.type === 'PATCH'
      ) {
        params.contentType = 'application/json; charset=utf-8'
        params.data = JSON.stringify(params.data)
      }
    }
    console.log(params)
    console.log(params)
    $body.addClass('loading')
    return $.ajax(params)
  }

  return {
    userstances: {
      get: function (data) {
        return _sendRequest('userstances', {
          type: 'GET'
        }, data)
      },
      add: function (data) {
        console.log(data)
        return _sendRequest('userstances', {
          type: 'POST'
        }, data)
      },

      change: function (data, id) {
        return _sendRequest('userstances', id, {
          type: 'PATCH'
        }, data)
      },

      delete: function (data, id) {
        return _sendRequest('userstances', id, {
          type: 'DELETE'
        }, data)
      }
    },
    qualities: {
      get: function (data) {
        return _sendRequest('qualities', {
          type: 'GET'
        }, data)
      },
      add: function (data) {
        return _sendRequest('qualities', {
          type: 'POST'
        }, data)
      },

      change: function (data, id) {
        return _sendRequest('qualities', id, {
          type: 'PATCH'
        }, data)
      },

      delete: function (data, id) {
        return _sendRequest('qualities', id, {
          type: 'DELETE'
        }, data)
      }
    },
    comments: {
      get: function (data) {
        console.log(data)
        return _sendRequest('comment', {
          type: 'GET'
        }, data)
      },
      add: function (data) {
        console.log("MOIN")
        console.log(data)
        return _sendRequest('comment', {
          type: 'POST'
        }, data)
      },

      change: function (data, id) {
        return _sendRequest('comment', id, {
          type: 'PATCH'
        }, data)
      },

      delete: function (data, id) {
        return _sendRequest('comment', id, {
          type: 'DELETE'
        }, data)
      }
    },
    commentmoderate: {
      change: function (data, id) {
        return _sendRequest('commentmoderate', id, {
          type: 'PATCH'
        }, data)
      }
    },
    rating: {
      add: function (data) {
        return _sendRequest('rating', {
          type: 'POST'
        }, data)
      },
      change: function (data, id) {
        return _sendRequest('rating', id, {
          type: 'PATCH'
        }, data)
      }
    },
    report: {
      submit: function (data) {
        return _sendRequest('report', {
          type: 'POST'
        }, data)
      }
    },
    document: {
      add: function (data) {
        return _sendRequest('document', {
          type: 'POST'
        }, data)
      },
      change: function (data, id) {
        return _sendRequest('document', id, {
          type: 'PUT'
        }, data)
      }
    },
    follow: {
      get: function (slug) {
        return _sendRequest('follow', slug, {
          type: 'GET'
        }, {})
      },
      change: function (data, slug) {
        return _sendRequest('follow', slug, {
          type: 'PUT'
        }, data)
      }
    },
    poll: {
      get: function (id) {
        return _sendRequest('poll', id, {
          type: 'GET'
        }, {})
      },
      change: function (data, id) {
        return _sendRequest('poll', id, {
          type: 'PUT'
        }, data)
      },
      vote: function (data) {
        return _sendRequest('pollvote', {
          type: 'POST'
        }, data)
      }
    },
    moderatorremark: {
      add: function (data) {
        return _sendRequest('moderatorremark', {
          type: 'POST'
        }, data)
      },
      change: function (data, id) {
        return _sendRequest('moderatorremark', id, {
          type: 'PUT'
        }, data)
      }
    }
  }
}())
module.exports = api
