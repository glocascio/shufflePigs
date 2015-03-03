$('#shufflePigs').on('click', function() {
  var shuffle = function(m) {
    var rand, $rand;
    rand = Math.floor(Math.random() * m--);
    $('img:eq(' + m + ')').
      after($('img:eq(' + rand + ')')).
      insertBefore($('img:eq(' + rand + ')'))
    if(m) {
      setTimeout(shuffle, 200, m);
    }
  };

  shuffle($('img').length);
});

$.fn.animateAppendTo = function(sel, speed) {
    var $this = this,
        newEle = $this.clone(true).appendTo(sel),
        newPos = newEle.position();
    newEle.hide();
    $this.css('position', 'absolute').animate(newPos, speed, function() {
        newEle.show();
        $this.remove();
    });
    return newEle;
};

$('#pigSort').on('click', function() {
  $('.bulldog').animateAppendTo('#bullDogs').show('slow');
  $('.bullpup').animateAppendTo('#bullPups').show('slow');
  $('.pig').animateAppendTo('#Pigs').show('slow');
  $('.bigpig').animateAppendTo('#bigPigs').show('slow');
  $('.BOTH').animateAppendTo('#both').show('slow');
});