$(document).ready(function(){
    $(".bg").hide();
    var result = null
    window.addEventListener('message', function(event){
        if (event.data.action == "open") {
            $(".bg").fadeIn(500);  
        }
    })

    const card = document.getElementById('card');
    const reader = document.getElementById('reader');
    let active = false;
    let initialX;
    let timeStart, timeEnd;
    const soundAccepted = new Audio('https://thomaspark.co/projects/among-us-card-swipe/audio/CardAccepted.mp3');
    const soundDenied = new Audio('https://thomaspark.co/projects/among-us-card-swipe/audio/CardDenied.mp3');
    
    document.addEventListener('mousedown', dragStart);
    document.addEventListener('mouseup', dragEnd);
    document.addEventListener('mousemove', drag);
    document.addEventListener('touchstart', dragStart);
    document.addEventListener('touchend', dragEnd);
    document.addEventListener('touchmove', drag);
    
    function dragStart(e) {
      if (e.target !== card) return;
    
      if (e.type === 'touchstart') {
        initialX = e.touches[0].clientX;
      } else {
        initialX = e.clientX;
      }
    
      timeStart = performance.now();
      card.classList.remove('slide');
      active = true;
    }
    
    function dragEnd(e) {
      if (!active) return;
    
      e.preventDefault();
      let x;
      let status;
    
      if (e.type === 'touchend') {
        x = e.touches[0].clientX - initialX;
      } else {
        x = e.clientX - initialX;
      }
    
      if (x < reader.offsetWidth) {
        status = 'invalid';
      }
    
      timeEnd = performance.now();
      card.classList.add('slide');
      active = false;
    
      setTranslate(0);
      setStatus(status);
    }
    
    function drag(e) {
      if (!active) return;
    
      e.preventDefault();
      let x;
    
      if (e.type === 'touchmove') {
        x = e.touches[0].clientX - initialX;
      } else {
        x = e.clientX - initialX;
      }
    
      setTranslate(x);
    }
    
    function setTranslate(x) {
      if (x < 0) {
        x = 0;
      } else if (x > reader.offsetWidth) {
        x = reader.offsetWidth;
      }
    
      x -= (card.offsetWidth / 2);
    
      card.style.transform = 'translateX(' + x + 'px)';
    }
    
    function close() { 
      $.post('https://magni-cardswipe/close', JSON.stringify({display: false}));
      $(".bg").fadeOut(500);
  }

    document.addEventListener('keyup', function (data) {
      if (data.which == 27) {
         close();
      }
    });


    function setStatus(status) {
      if (typeof status === 'undefined') {
        let duration = timeEnd - timeStart;
    
        if (duration > 700) {
          status = 'slow';
        } else if (duration < 400) {
          status = 'fast';
        } else {
          status = 'valid';
          result = true
          setTimeout(() => {  $(".bg").hide();; }, 1000);
          fetch('https://magni-cardswipe/callback', {
            method: 'POST', 
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                success: result
            }) 
          });
        }


      }
    
      reader.dataset.status = status;
      playAudio(status);
    }
    
    function playAudio(status) {
      soundDenied.pause();
      soundAccepted.pause();
      soundDenied.currentTime = 0;
      soundAccepted.currentTime = 0;
    
      if (status === 'valid') {
        soundAccepted.play();

      } else {
        soundDenied.play();
      }


    }
})    