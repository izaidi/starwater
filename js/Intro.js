var Intro = {

  running: false,
  queue: [],
  pulses: [],

  init: function() {
    var self = this;

    self.running = true;
    
    var delay = 0;
    var introSection = 0;
    $('.intro-text-segment').each(function() {
      var div = $(this);
      var timeout = setTimeout(function() {
        div.prev('.intro-text-segment').animate({
          opacity: 0.2
        }, 1000);
        div.animate({
          opacity: 1
        }, 1000);
        self.showSection(div.data('section'));
      }, delay)
      delay += parseInt(div.data('duration'));
      self.queue.push(timeout);
    });

    var skipButton = Utils.makeButton('medium', 'skip intro');
    skipButton.css({
      position: 'absolute',
      display: 'none',
      top: '6%',
      left: '6%',
      transform: 'translate(0, 0)',
      opacity: 0.6
    });
    skipButton.addClass('skip-intro');
    skipButton.delay(1000).fadeIn(500);
    skipButton.click(function() {
      self.skip();
    });
  },

  end: function() {
    var self = this;

    $('.interstitial').fadeIn(200, function() {
      self.running = false;
      $('*').stop(true);
      $('.pulsar-wave').remove();
      $('.intro').hide();
      $('.button:not(.dummy)').remove();
      System.clear(0);
      System.reset();
      $(this).fadeOut(1500);
    });
  },

  skip: function() {
    var self = this;

    System.display.stop();
    System.display.clear();
    
    self.queue.forEach(function(timeout) {
      clearTimeout(timeout);
    });
    self.pulses.forEach(function(interval) {
      clearInterval(interval);
    });
    self.end();
  },

  showSection: function(section) {
    var self = this;

    var pulsar = {x: 50, y: 25};

    if (section == 'pulsars') {
      Pulsar.add(pulsar);
      var pulsarDiv = $('#pulsar0');
      pulsarDiv.hide();
      pulsarDiv.css({opacity: 1});
      $('.pulsar-heart', pulsarDiv).css({
        width: '50px',
        height: '50px'
      });
      pulsarDiv.delay(1500).fadeIn(1000);
      Pulsar.radiate(Pulsar.objects[0]);
    }

    if (section == 'darkness') {
      setTimeout(function() {
        Pulsar.shrink(Pulsar.objects[0]);
      }, 1000);
    }

    if (section == 'starwater') {
      Pulsar.clearAll();
      Pulsar.add(pulsar);
      Pulsar.init();
      System.addEmitter({x: 100, y: 25, angle: -180}, 4)
    }

    if (section == 'attractors') {
      Attractor.add(500);
      var attractorDiv = $('#attractor0');
      attractorDiv.css({
        position: 'absolute',
        top: '40%',
        left: '80%',
        display: 'none'
      });
      attractorDiv.fadeIn(1000, function() {
        Attractor.activate(attractorDiv);
        $('#pulsar0').fadeOut(2000, function() {
          Pulsar.objects = [];
        });
      });
    }

    if (section == 'revive') {
      $('#canvas').delay(1000).fadeOut(2000, function() {
        System.display.stop();
        System.display.clear();
      });
      $('#attractor0').delay(1000).fadeOut(2000);
      $('.intro-text-segment:not(:last)').fadeOut(2000);
      $('.skip-intro').fadeOut(500, function() {
        $(this).remove();
      })
      setTimeout(function() {
        var startButton = Utils.makeButton('large', 'start');
        startButton.css({
          position: 'absolute',
          display: 'none',
          top: '50%',
          left: '50%'
        });
        startButton.fadeTo(500, 0.9, function() {
          startButton.addClass('pulse');
        });
        startButton.click(function() {
          self.end();
        });
      }, 3000);
    }
  }

}