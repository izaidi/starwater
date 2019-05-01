var Attractor = {

  size: 60,
  defaultStrength: 800,
  fields: [],
  numAdded: 0,

  getCenter: function(id) {
    var self = this;
    var div = $('#'+id);
    if (div.length == 0) return null;
    var diagonal = Math.sqrt(self.size*self.size*2);
    var position = div.offset();
    var x = position.left + diagonal/2;
    var y = position.top + diagonal/2;
    return {x: x, y: y};
  },

  init: function(numAttractors) {
    var self = this;

    self.numAdded = 0;
    for (var i = 0; i < numAttractors; i++) {
      self.add();
    }

    var attractors = $('.attractor:not(.dummy)');

    attractors.draggable({
      stop: function(event, ui) {
        System.particleSystem.display.trigger('mouseUp', event);
        if ($(this).hasClass('inactive')) {
          self.activate($(this));
        }
      }
    });

    attractors.mousemove(function(event) {
      System.particleSystem.display.trigger('mouseMove', event);
    })

    attractors.mousedown(function(event) {
      System.particleSystem.display.trigger('mouseDown', event);
    })
  },

  activate: function(div) {
    var self = this;

    div.removeClass('inactive');
    var id = div.attr('id');
    var center = self.getCenter(id);
    var strength = parseInt(div.data('strength'));
    var field = System.particleSystem.addField(
      new Vector(center.x,center.y), strength
    );
    self.fields[id] = field;
  },

  add: function(strength) {
    var self = this;

    if (typeof strength === 'undefined') {
      strength = self.defaultStrength;
    }

    var id = 'attractor' + self.numAdded;
    var div = $('.attractor.dummy').clone();
    div.removeClass('dummy');
    div.attr('id', id);
    div.data('strength', strength);

    var leftPos = 30 + 40*(self.numAdded);
    div.css({
      left: leftPos+'px'
    });

    $('body').append(div);

    self.numAdded++;
  }

}