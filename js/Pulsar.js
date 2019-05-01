var Pulsar = {

  objects: [],
  size: 100,
  fullHealth: 1000,
  pulseRadius: 1000,
  maxPulses: 2,

  collision: function(particle) {
    var self = this;
    var collision = false;
    self.objects.forEach(function(pulsar) {
      var pulsarPos = pulsar.position;
      if (particle.withinBounds(pulsarPos, self.size)) { // inside box
        if (particle.withinCircle(pulsarPos, self.size+4)) {
          collision = true;
          if (!pulsar.alive) { // bring to life
            pulsar.health += 5;
            if (pulsar.health > self.fullHealth) {
              pulsar.health = self.fullHealth;
              self.checkHealthOfAll();
            }
          }
        }
      };
    });
    return collision;
  },

  checkHealthOfAll: function() {
    var self = this;
    var numRevived = 0;
    self.objects.forEach(function(pulsar) {
      if (pulsar.health >= self.fullHealth) {
        numRevived++;
      }
    });
    if (numRevived == self.objects.length) {
      self.objects.forEach(function(pulsar) {
        pulsar.alive = true;
        self.radiate(pulsar);
      });
      if (!Intro.running) {
        Music.playTriumph();
      }
    }
  },

  add: function(relativePosition) {
    var self = this;

    var id = 'pulsar' + self.objects.length;
    var position = System.convertToPixels(relativePosition);
    self.objects.push({
      id: id,
      position: position,
      relativePosition: relativePosition,
      health: 0,
      alive: false
    });

    var div = $('.pulsar.dummy').clone();
    div.removeClass('dummy');
    div.attr('id', id);
    div.css({
      left: position.x+'px',
      top: position.y+'px'
    });
    $('body').append(div);
  },

  clearAll: function() {
    var self = this;

    $('.pulsar:not(.dummy)').remove();
    self.objects = [];
  },

  update: function(pulsar) {
    var self = this;

    if (pulsar.alive) return;

    pulsar.health -= 5;
    if (pulsar.health > 0) {
      var heartSize = (pulsar.health / self.fullHealth) * (self.size / 2);
      var opacity = 0.6 + (pulsar.health / self.fullHealth) * 0.4;
      $('#'+pulsar.id).css({
        opacity: opacity
      });
      $('.pulsar-heart', '#'+pulsar.id).css({
        width: heartSize+'px',
        height: heartSize+'px'
      });
    } else {
      pulsar.health = 0;
    }
  },

  animateWave: function(pulsar, wave) {
    var self = this;

    var size = self.pulseRadius;
    var duration = 1700;
    var opacity = 0;

    var endFunction = function() {
      wave.css({
        width: 0,
        height: 0,
        opacity: 1
      });
    }

    if (pulsar.numWaves == self.maxPulses) {

      clearInterval(pulsar.waveInterval);

      if (!Intro.running) {
        System.victoryScreen();
      }

      endFunction = function() {
        wave.remove();
      }

    }

    var css = {
      width: size+'px',
      height: size+'px',
      opacity: opacity
    }
    wave.animate(css, duration, 'linear', endFunction);

    pulsar.numWaves++;
  },

  radiate: function(pulsar) {
    var self = this;

    var wave = $('<div class="pulsar-wave" id="pulsar'+pulsar.id+'-wave"></div>');
    wave.css({
      left: pulsar.position.x+'px',
      top: pulsar.position.y+'px'
    });
    wave.appendTo('body');

    var coreDuration = 2500;
    var core = $('.pulsar-core', '#'+pulsar.id);
    core.addClass('alive');
    core.animate({
      width: self.size+'px',
      height: self.size+'px',
      opacity: 0.9
    }, coreDuration);

    if (!Intro.running) {
      $('body').css({
        background: 'linear-gradient(45deg, #4a1363 0%,#3457ba 100%)'
      });
      $('#canvas').animate({
        opacity: 0.4
      }, 1700);
    }

    pulsar.numWaves = 0;
    pulsar.waveInterval = setInterval(function() {
      self.animateWave(pulsar, wave);
    }, 1700);

    if (Intro.running) {
      Intro.pulses.push(pulsar.waveInterval);
    }
  },

  shrink: function(pulsar) {
    var self = this;

    var heart = $('.pulsar-heart', '#'+pulsar.id);
    heart.animate({
      width: 0,
      height: 0 
    }, 500, function() {
      heart.css({
        width: self.size+'px',
        height: self.size+'px',
        background: '#ffef33'
      });

      var core = $('.pulsar-core', '#'+pulsar.id);
      core.removeClass('alive');

      heart.animate({
        width: '50px',
        height: '50px',
        opacity: 0
      }, 2000);

      core.animate({
        width: '50px',
        height: '50px',
        opacity: 1
      }, 2000);

      $('#'+pulsar.id).animate({
        opacity: 0.6
      }, 2000);
    })
  },

  init: function() {
    var self = this;
    setInterval(function() {
      Pulsar.objects.forEach(function(pulsar) {
        Pulsar.update(pulsar);
      });
    }, 40);
  }

}