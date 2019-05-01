var Utils = {
  
  makeButton: function(size, label) {
    var div = $('.button.dummy').clone();
    div.removeClass('dummy');
    div.addClass(size);
    $('.button-inner', div).html(label);
    div.appendTo('body');
    return div;
  }

}