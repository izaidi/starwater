require(
  [
    'lib/ParticleSystem',
    'lib/Display',
    'lib/Vector'
  ],
  function(ParticleSystem, Display, Vector){
    "use strict";

    window.ParticleSystem = ParticleSystem;
    window.Display = Display;
    window.Vector = Vector;

    var canvas = document.getElementById('canvas');
    var ctx = canvas.getContext('2d');
    window.addEventListener('resize', resize); resize();

    var display = new Display(document.getElementById('canvas'));
    display.init();
    var particleSystem = new ParticleSystem().init(display);
    display.start();

    function resize() {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    }

    $(document).ready(function() {

      $('.title').fadeIn(1000).delay(2000).fadeOut(1000, function() {
        Music.init();
        Intro.init();
        System.init(display, particleSystem);
      });

    });

  }
);