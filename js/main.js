'use strict'

var _this = void 0
/** @jsx dom */

var indexSong = 0
var isLocked = false
var songsLength = null
var selectedSong = null
var songIsPlayed = false
var progress_elmnt = null
var songName_elmnt = null
var sliderImgs_elmnt = null
var singerName_elmnt = null
var progressBar_elmnt = null
var playlistSongs_elmnt = []
var musicPlayerInfo_elmnt = null
var progressBarIsUpdating = false
var broadcastGuarantor_elmnt = null
function App(_ref) {
  var songs = _ref.songs
  function handleChangeMusic(_ref2) {
    var _ref2$isPrev = _ref2.isPrev,
      isPrev = _ref2$isPrev === void 0 ? false : _ref2$isPrev,
      _ref2$playListIndex = _ref2.playListIndex,
      playListIndex =
        _ref2$playListIndex === void 0 ? null : _ref2$playListIndex
    if (isLocked || indexSong === playListIndex) return
    if (playListIndex || playListIndex === 0) {
      indexSong = playListIndex
    } else {
      indexSong = isPrev ? (indexSong -= 1) : (indexSong += 1)
    }
    if (indexSong < 0) {
      indexSong = 0
      return
    } else if (indexSong > songsLength) {
      indexSong = songsLength
      return
    }
    selectedSong.pause()
    selectedSong.currentTime = 0
    progressBarIsUpdating = false
    selectedSong = playlistSongs_elmnt[indexSong]
    selectedSong.paused && songIsPlayed
      ? selectedSong.play()
      : selectedSong.pause()
    setBodyBg(songs[indexSong].bg)
    setProperty(sliderImgs_elmnt, '--index', -indexSong)
    updateInfo(singerName_elmnt, songs[indexSong].artist)
    updateInfo(songName_elmnt, songs[indexSong].songName)
  }
  setBodyBg(songs[0].bg)
  return dom(
    'div',
    {
      class: 'music-player flex-column',
    },
    dom(Slider, {
      slides: songs,
      handleChangeMusic: handleChangeMusic,
    }),
    dom(Playlist, {
      list: songs,
      handleChangeMusic: handleChangeMusic,
    })
  )
}
fetch('../data.json')
  .then(function (respone) {
    return respone
  })
  .then(function (data) {
    return data.json()
  })
  .then(function (result) {
    var songs = result.songs
    function downloadTheFiles(media, input) {
      return Promise.all(
        input.map(function (song) {
          return new Promise(function (resolve) {
            var url = song.files[media]
            var req = new XMLHttpRequest()
            req.open('GET', url, true)
            req.responseType = 'blob'
            req.send()
            req.onreadystatechange = function () {
              if (req.readyState === 4) {
                if (req.status === 200) {
                  var blob = req.response
                  var file = URL.createObjectURL(blob)
                  song.files[media] = file
                  resolve(song)
                }
              }
            }
          })
        })
      )
    }
    downloadTheFiles('cover', songs).then(function (respone) {
      downloadTheFiles('song', respone).then(function (data) {
        querySelector('#root').appendChild(
          dom(App, {
            songs: data,
          })
        )
        songsLength = data.length - 1
        progress_elmnt = querySelector('.progress')
        playlistSongs_elmnt = querySelectorAll('audio')
        sliderImgs_elmnt = querySelector('.slider__imgs')
        songName_elmnt = querySelector('.music-player__subtitle')
        musicPlayerInfo_elmnt = querySelector('.music-player__info')
        singerName_elmnt = querySelector('.music-player__singer-name')
        selectedSong = playlistSongs_elmnt[indexSong]
        progressBar_elmnt = querySelector('.progress__bar')
        broadcastGuarantor_elmnt = querySelector(
          '.music-player__broadcast-guarantor'
        )
        controlSubtitleAnimation(musicPlayerInfo_elmnt, songName_elmnt)
        controlSubtitleAnimation(musicPlayerInfo_elmnt, singerName_elmnt)
      })
    })
  })
function controlSubtitleAnimation(parent, child) {
  if (child.classList.contains('animate')) return
  var element = child.firstChild
  if (child.clientWidth > parent.clientWidth) {
    child.appendChild(element.cloneNode(true))
    child.classList.add('animate')
  }
  setProperty(
    child.parentElement,
    'width',
    ''.concat(element.clientWidth, 'px')
  )
}
function handleResize() {
  var vH = window.innerHeight * 0.01
  setProperty(document.documentElement, '--vH', ''.concat(vH, 'px'))
}
function querySelector(target) {
  return document.querySelector(target)
}
function querySelectorAll(target) {
  return document.querySelectorAll(target)
}
function setProperty(target, prop) {
  var value =
    arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : ''
  target.style.setProperty(prop, value)
}
function setBodyBg(color) {
  setProperty(document.body, '--body-bg', color)
}
function updateInfo(target, value) {
  while (target.firstChild) {
    target.removeChild(target.firstChild)
  }
  var targetChild_elmnt = document.createElement('div')
  targetChild_elmnt.appendChild(document.createTextNode(value))
  target.appendChild(targetChild_elmnt)
  target.classList.remove('animate')
  controlSubtitleAnimation(musicPlayerInfo_elmnt, target)
}
function handleScrub(e) {
  var progressOffsetLeft = progress_elmnt.getBoundingClientRect().left
  var progressWidth = progress_elmnt.offsetWidth
  var duration = selectedSong.duration
  var currentTime = (e.clientX - progressOffsetLeft) / progressWidth
  selectedSong.currentTime = currentTime * duration
}
handleResize()
window.addEventListener('resize', handleResize)
window.addEventListener('orientationchange', handleResize)
window.addEventListener('transitionstart', function (_ref3) {
  var target = _ref3.target
  if (target === sliderImgs_elmnt) {
    isLocked = true
    setProperty(sliderImgs_elmnt, 'will-change', 'transform')
  }
})
window.addEventListener('transitionend', function (_ref4) {
  var target = _ref4.target,
    propertyName = _ref4.propertyName
  if (target === sliderImgs_elmnt) {
    isLocked = false
    setProperty(sliderImgs_elmnt, 'will-change', 'auto')
  }
  if (target.classList.contains('slider') && propertyName === 'height') {
    controlSubtitleAnimation(musicPlayerInfo_elmnt, songName_elmnt)
    controlSubtitleAnimation(musicPlayerInfo_elmnt, singerName_elmnt)
  }
})
window.addEventListener('pointerup', function () {
  if (progressBarIsUpdating) {
    selectedSong.muted = false
    progressBarIsUpdating = false
  }
})
window.addEventListener('pointermove', function (e) {
  if (progressBarIsUpdating) {
    handleScrub(e, _this)
    selectedSong.muted = true
  }
})
