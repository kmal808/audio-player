'use strict'

/** @jsx dom */

function Playlist(_ref) {
  var list = _ref.list,
    handleChangeMusic = _ref.handleChangeMusic
  function loadedAudio() {
    var duration = this.duration
    var target = this.parentElement.querySelector(
      '.music-player__song-duration'
    )
    var min = parseInt(duration / 60)
    if (min < 10) min = '0' + min
    var sec = parseInt(duration % 60)
    if (sec < 10) sec = '0' + sec
    target.appendChild(document.createTextNode(''.concat(min, ':').concat(sec)))
  }
  function timeupdate() {
    var duration = this.duration
    var currentTime = this.currentTime
    var progressBarWidth = (currentTime / duration) * 100
    setProperty(progressBar_elmnt, '--width', ''.concat(progressBarWidth, '%'))
    if (songIsPlayed && currentTime === duration) {
      handleChangeMusic({})
    }
    if (
      indexSong === songsLength &&
      this === selectedSong &&
      currentTime === duration
    ) {
      songIsPlayed = false
      broadcastGuarantor_elmnt.classList.remove('click')
    }
  }
  return dom(
    'ul',
    {
      class: 'music-player__playlist list',
    },
    list.map(function (_ref2, index) {
      var songName = _ref2.songName,
        artist = _ref2.artist,
        _ref2$files = _ref2.files,
        cover = _ref2$files.cover,
        song = _ref2$files.song
      return dom(
        'li',
        {
          class: 'music-player__song',
          onClick: function onClick() {
            return handleChangeMusic({
              isPrev: false,
              playListIndex: index,
            })
          },
        },
        dom(
          'div',
          {
            class: 'flex-row _align_center',
          },
          dom('img', {
            src: cover,
            class: 'img music-player__song-img',
          }),
          dom(
            'div',
            {
              class: 'music-player__playlist-info  text_trsf-cap',
            },
            dom(
              'b',
              {
                class: 'text_overflow',
              },
              songName
            ),
            dom(
              'div',
              {
                class: 'flex-row _justify_space-btwn',
              },
              dom(
                'span',
                {
                  class: 'music-player__subtitle',
                },
                artist
              ),
              dom('span', {
                class: 'music-player__song-duration',
              })
            )
          )
        ),
        dom('audio', {
          src: song,
          onTimeupdate: timeupdate,
          onLoadeddata: loadedAudio,
        })
      )
    })
  )
}
