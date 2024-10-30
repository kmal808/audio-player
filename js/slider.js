'use strict'

/** @jsx dom */

function Slider(_ref) {
  var slides = _ref.slides,
    handleChangeMusic = _ref.handleChangeMusic
  function handleResizeSlider(_ref2) {
    var target = _ref2.target
    if (isLocked) {
      return
    } else if (target.classList.contains('music-player__info')) {
      this.classList.add('resize')
      setProperty(this, '--controls-animate', 'down running')
      return
    } else if (target.classList.contains('music-player__playlist-button')) {
      this.classList.remove('resize')
      setProperty(this, '--controls-animate', 'up running')
      return
    }
  }
  function handlePlayMusic() {
    if (selectedSong.currentTime === selectedSong.duration) {
      handleChangeMusic({})
    }
    this.classList.toggle('click')
    songIsPlayed = !songIsPlayed
    selectedSong.paused ? selectedSong.play() : selectedSong.pause()
  }
  return dom(
    'div',
    {
      class: 'slider center',
      onClick: handleResizeSlider,
    },
    dom(
      'div',
      {
        class: 'slider__content center',
      },
      dom(
        'button',
        {
          class: 'music-player__playlist-button center button',
        },
        dom('i', {
          class: 'icon-playlist',
        })
      ),
      dom(
        'button',
        {
          onClick: handlePlayMusic,
          class: 'music-player__broadcast-guarantor center button',
        },
        dom('i', {
          class: 'icon-play',
        }),
        dom('i', {
          class: 'icon-pause',
        })
      ),
      dom(
        'div',
        {
          class: 'slider__imgs flex-row',
        },
        slides.map(function (_ref3) {
          var songName = _ref3.songName,
            cover = _ref3.files.cover
          return dom('img', {
            src: cover,
            class: 'img',
            alt: songName,
          })
        })
      )
    ),
    dom(
      'div',
      {
        class: 'slider__controls center',
      },
      dom(
        'button',
        {
          class: 'slider__switch-button flex-row button',
          onClick: function onClick() {
            return handleChangeMusic({
              isPrev: true,
            })
          },
        },
        dom('i', {
          class: 'icon-back',
        })
      ),
      dom(
        'div',
        {
          class: 'music-player__info text_trsf-cap',
        },
        dom(
          'div',
          null,
          dom(
            'div',
            {
              class: 'music-player__singer-name',
            },
            dom('div', null, slides[0].artist)
          )
        ),
        dom(
          'div',
          null,
          dom(
            'div',
            {
              class: 'music-player__subtitle',
            },
            dom('div', null, slides[0].songName)
          )
        )
      ),
      dom(
        'button',
        {
          class: 'slider__switch-button flex-row button',
          onClick: function onClick() {
            return handleChangeMusic({
              isPrev: false,
            })
          },
        },
        dom('i', {
          class: 'icon-next',
        })
      ),
      dom(
        'div',
        {
          class: 'progress center',
          onPointerdown: function onPointerdown(e) {
            handleScrub(e)
            progressBarIsUpdating = true
          },
        },
        dom(
          'div',
          {
            class: 'progress__wrapper',
          },
          dom('div', {
            class: 'progress__bar center',
          })
        )
      )
    )
  )
}
