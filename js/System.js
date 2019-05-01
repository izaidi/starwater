var System = {

  particleSystem: null,
  display: null,
  currentMap: 0,
  clearing: false,
  emitterVelocity: 4,
  maps: [
    {
      emitter: {x: 0, y: 30, angle: 0},
      pulsars: [{x: 60, y: 80}],
      numAttractors: 1
    },
    {
      emitter: {x: 50, y: 100, angle: -50},
      pulsars: [{x: 15, y: 40}],
      numAttractors: 2
    },
    {
      emitter: {x: 0, y: 50, angle: -30},
      pulsars: [{x: 60, y: 55}, {x: 80, y: 80}],
      numAttractors: 2
    },
    {
      emitter: {x: 50, y: 100, angle: -90},
      pulsars: [{x: 20, y: 90}, {x: 70, y: 50}],
      numAttractors: 3
    }
  ],

  init: function(display, particleSystem) {
    var self = this;

    self.particleSystem = particleSystem;
    self.display = display;
  },

  loadNextMap: function() {
    var self = this;

    if (self.currentMap >= self.maps.length) {
      alert("that's all for now!");
      return false;
    }

    var profile = self.maps[self.currentMap];

    self.addEmitter(profile.emitter, self.emitterVelocity);

    Pulsar.objects = [];
    profile.pulsars.forEach(function(pulsar) {
      Pulsar.add(pulsar);
    });
    Pulsar.init();

    Attractor.init(profile.numAttractors);
    
    self.currentMap++;
  },

  addEmitter: function(emitter, emitterVelocity) {
    var self = this;

    var emitterCoords = self.convertToPixels(emitter);

    self.particleSystem.addEmitter(
      new Vector(emitterCoords.x, emitterCoords.y),
      Vector.fromAngle(emitter.angle*(Math.PI/180), emitterVelocity)
    );
  },

  clear: function(duration) {
    var self = this;

    if (typeof(duration) === 'undefined') {
      duration = 1000;
    }

    $('.item:not(.dummy)').fadeOut(duration, function() {
      $(this).remove();
    });
  },

  reset: function() {
    var self = this;

    $('#canvas').show();
    self.display = new Display(document.getElementById('canvas'));
    self.display.init();
    self.particleSystem = new ParticleSystem().init(self.display);
    self.display.start();

    self.clearing = false;
    self.loadNextMap();
  },

  victoryScreen: function() {
    var self = this;

    if (self.clearing) return false;

    self.clear();
    self.clearing = true;

    $('.interstitial').fadeIn(1700, function() {
      $('#canvas').hide();
      $('#canvas').css({
        opacity: 1
      });
      self.display.stop();
      self.display.clear();
    });

    $('.replenished-text').delay(1000).fadeIn(1000).delay(2000).fadeOut(1000, function() {
      self.reset();
    });

    $('.interstitial').delay(4000).fadeOut(1000);
  },

  convertToPixels: function(position) {
    var self = this;
    var pixelCoords = {
      x: (position.x/100) * window.innerWidth,
      y: (position.y/100) * window.innerHeight
    }
    return pixelCoords;
  }

}