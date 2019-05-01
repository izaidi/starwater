var Music = {

  loop: null, 
  triumph: null,
  loopVolume: 0,
  fadeInterval: null,
  playing: false,

  init: function() {
    var self = this;

    self.triumph = new Howl({
      src: ['audio/radiant.mp3'],
      preload: true,
      volume: 0
    });

    self.loop = new SeamlessLoop();
    self.loop.addUri('audio/infinity.mp3', 19334, "mainloop");
    self.loop.callback(loopLoaded);

    function loopLoaded() {
      self.loop.start("mainloop");
      self.loop.volume(self.loopVolume);
      self.fadeLoopIn(0.3);
    }

    self.triumph.on('end', function() {
      console.log('starting main loop');
      self.loop.start("mainloop");
      self.fadeLoopIn(0.3);
    });

    window.addEventListener('blur', function() {
      if (self.loopVolume == 0) return false;
      self.loop.stop();
      self.playing = false;
    });

    window.addEventListener('focus', function() {
      if (self.playing) return false;
      self.loop.start("mainloop");
      self.playing = true;
    });
  },

  fadeLoopIn: function(targetVolume) {
    console.log('fading loop in');
    var self = this;
    self.fadeInInterval = setInterval(function() {
      self.loopVolume += 0.01;
      if (self.loopVolume >= targetVolume) {
        self.loop.volume(targetVolume);
        clearInterval(self.fadeInInterval);
      } else {
        self.loop.volume(self.loopVolume);
      }
    }, 100);
    self.playing = true;
  },

  fadeLoopOut: function() {
    var self = this;
    self.fadeOutInterval = setInterval(function() {
      self.loopVolume -= 0.02;
      if (self.loopVolume <= 0) {
        self.loopVolume = 0;
        self.loop.volume(0);
        self.loop.stop();
        clearInterval(self.fadeOutInterval);
      } else {
        self.loop.volume(self.loopVolume);
      }
    }, 100);
    self.playing = false;
  },

  playTriumph: function() {
    var self = this;
    self.fadeLoopOut();
    self.triumph.play();
    self.playing = true;
    self.triumph.fade(0, 0.5, 1500);
    setTimeout(function() {
      self.playing = false
    }, 16250);
  }
}