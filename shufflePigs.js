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


$('#docuSend').on('click', function() {
	$.ajax({
    url: 'https://demo.docusign.net/restapi/v2/accounts/ae4854ca-c3ee-422d-81c2-0938615a48a4/envelopes',
    type: 'POST',
    headers: {
		'x-DocuSign-Authentication': '<DocuSignCredentials><Username>c78cf69c-6448-4c87-a6af-7ca8eb35e66c</Username><Password>JtaBTDC7b1piFrK2FgdAcy14iUI=</Password><IntegratorKey>51252b97-d4d0-4d62-9d19-65f2b3c778e3</IntegratorKey></DocuSignCredentials>',
	  'Accept': 'application/json',
	  'Content-Type': 'application/json',
	  'Cache-Control': 'no-cache'},
  	body: {
    "emailSubject": "API Test Subject",
    "emailBlurb": "API Test Blurb bloopbloopbloop",
    "templateId": "2777d495-56be-4ca0-aecc-851b3e07e731",
    "templateRoles": [
      {
        "emailNotification": {
          "emailSubject": "API Test Subject",
          "emailBody": "API Test Body"
        },
        "roleName": "Signer1",
        "name": "Gene API Test",
        "email": "glocdocusign@gmail.com"
      }
    ],
    "status": "sent",
    "messageLock": "false"
  }
  });
});
