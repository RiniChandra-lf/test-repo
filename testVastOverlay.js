(function() {
  var countdownElement;
  var countdownTime = 30; // Start countdown at 30 seconds

  // Create and append the countdown div
  function createCountdown() {
    countdownElement = document.createElement('div');
    countdownElement.id = 'countdown';
    countdownElement.style.position = 'absolute';
    countdownElement.style.top = '10px';
    countdownElement.style.right = '10px';
    countdownElement.style.background = 'rgba(0, 0, 0, 0.7)';
    countdownElement.style.color = 'red';
    countdownElement.style.padding = '10px 15px';
    countdownElement.style.fontSize = '32px';
    countdownElement.style.borderRadius = '5px';
    countdownElement.style.zIndex = 9999;
    document.body.appendChild(countdownElement);
    updateCountdown();
  }

  // Update countdown value
  function updateCountdown() {
    countdownElement.innerText = 'Ad ends in ' + countdownTime + ' seconds';

    if (countdownTime > 0) {
      countdownTime--;
      setTimeout(updateCountdown, 1000);
    } else {
      countdownElement.innerText = 'Ad Complete';
    }
  }

  // Initialize countdown on ad start
  createCountdown();
})();
