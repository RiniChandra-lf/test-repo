/**
 * @fileoverview A sample non-linear VPAID ad useful for testing a VPAID JS
 * enabled player. This ad will show a non-linear ad which can also enter linear
 * mode.
 */

/** @unrestricted */
const VpaidNonLinear = class {
  constructor() {
    /**
     * The slot is the div element on the main page that the ad is supposed to
     * occupy.
     * @private {Object}
     */
    this.slot_ = null;

    /**
     * The video slot is the video element used by the ad to render video
     * content.
     * @private {Object}
     */
    this.videoSlot_ = null;

    /**
     * An object containing all registered events. These events are all
     * callbacks for use by the VPAID ad.
     * @private {Object}
     */
    this.eventsCallbacks_ = {};

    /**
     * Current index of the displayed overlay image
     * @private {number}
     */
    this.currentOverlayIndex_ = 0;

    /**
     * Interval ID for the image carousel
     * @private {number}
     */
    this.carouselInterval_ = null;
    this.overlayImages_ = [];

    /**
     * A list of getable and setable attributes.
     * @private {Object}
     */
    this.attributes_ = {
      'companions': '',
      'desiredBitrate': 256,
      'duration': 10,
      'expanded': false,
      'height': 0,
      'icons': '',
      'linear': false,
      'viewMode': 'normal',
      'width': 0,
      'volume': 1.0,
      'countdownTime': 10,  // The countdown duration in seconds.
      'currentTime': 0,     // Current time of the countdown.
      'linear': false,      // Linear ad state.
      'skippableState': true, // Skippable state of the ad.
      'volume': 1.0,         // Volume of the ad.
      'carouselInterval': 3000, // Transition every 3 seconds by default
    };

    /**
     * When the ad was started.
     * @private {number}
     */
    this.startTime_ = 0;

    /**
     * A set of ad playback events to be reported.
     * @private {Object}
     */
    this.quartileEvents_ = [
      {event: 'AdImpression', value: 0}, {event: 'AdVideoStart', value: 0},
      {event: 'AdVideoFirstQuartile', value: 25},
      {event: 'AdVideoMidpoint', value: 50},
      {event: 'AdVideoThirdQuartile', value: 75},
      {event: 'AdVideoComplete', value: 100}
    ];

    /**
     * @private {number} An index into what quartile was last reported.
     */
    this.nextQuartileIndex_ = 0;

    /**
     * Parameters passed in from the AdParameters section of the VAST.
     * Used for video URL and MIME type.
     * @private {!Object}
     */
    this.parameters_ = {};
  }

  /**
   * Returns the supported VPAID verion.
   * @param {string} version
   * @return {string}
   */
  handshakeVersion(version) {
    return ('2.0');
  }

  /**
   * Initializes all attributes in the ad. The ad will not start until startAd
   * is called.
   * @param {number} width The ad width.
   * @param {number} height The ad height.
   * @param {string} viewMode The ad view mode.
   * @param {number} desiredBitrate The chosen bitrate.
   * @param {Object} creativeData Data associated with the creative.
   * @param {Object} environmentVars Runtime variables associated with the
   *     creative like the slot and video slot.
   */
  initAd(
      width, height, viewMode, desiredBitrate, creativeData, environmentVars) {
    this.attributes_['width'] = width;
    this.attributes_['height'] = height;
    this.attributes_['viewMode'] = viewMode;
    this.attributes_['desiredBitrate'] = desiredBitrate;

    // slot and videoSlot are passed as part of the environmentVars
    this.slot_ = environmentVars.slot;
    this.videoSlot_ = environmentVars.videoSlot;

    // Parse the incoming ad parameters.
    this.parameters_ = JSON.parse(creativeData['AdParameters']);

    this.log(
        'initAd ' + width + 'x' + height + ' ' + viewMode + ' ' +
        desiredBitrate);
    this.callEvent_('AdLoaded');
  }

  /**
   * Helper function to update the size of the video player.
   * @private
   */
  updateVideoPlayerSize_() {
    this.videoSlot_.setAttribute('width', this.attributes_['width']);
    this.videoSlot_.setAttribute('height', this.attributes_['height']);
  }

  /**
   * Called by the wrapper to start the ad.
   */
startAd() {
  this.log('Starting ad');

  const date = new Date();
  this.startTime_ = date.getTime();

  // Create a div to contain our ad elements.
  const overlays = this.parameters_.overlays || [];

  const container = document.createElement('div');
  container.style.display = 'block';
  container.style.position = 'absolute';
  container.style.width = '100%';
  container.style.bottom = '0%';
  this.slot_.appendChild(container);

  // Countdown display
  const countdownDisplay = document.createElement('div');
  countdownDisplay.style.fontSize = this.parameters_.countdown?.fontSize || '24px';
  countdownDisplay.style.textAlign = 'center';
  countdownDisplay.style.color = this.parameters_.countdown?.color || '#fff';
  container.appendChild(countdownDisplay);

  // Parse target time from parameters
  const targetTime = new Date(this.parameters_.targetTime); // ISO 8601 format

  if (isNaN(targetTime.getTime())) {
    this.log('Invalid targetTime parameter.');
    countdownDisplay.textContent = 'Invalid Countdown Time';
    return;
  }

  
  // Create image container for carousel
  const imageContainer = document.createElement('div');
  imageContainer.style.margin = 'auto';
  imageContainer.style.display = 'block';
  imageContainer.style.position = 'relative';
  imageContainer.style.width = '80%';
  container.appendChild(imageContainer);

  /*const img = document.createElement('img');
    img.src = overlays[1] || '';
    img.style.display = 'block';
    img.style.margin = 'auto';*/
    //img.style.position = 'absolute';
    //img.style.left = '50%';
    //img.style.transform = 'translateX(-50%)';
    //img.style.width = '60%';
    //img.style.height = '20%';
    //imageContainer.addEventListener('click', this.adClick_.bind(this), false);
    //imageContainer.appendChild(img);

  
  // Create and setup overlay images
  //const overlays = this.parameters_.overlays || [];
  this.overlayImages_ = overlays.map((overlay, index) => {
    const img = document.createElement('img');
    img.src = overlay.imageUrl || overlay;
    img.style.margin = 'auto';
    img.style.display = index === 0 ? 'block' : 'none';
    //img.style.position = 'absolute';
    //img.style.left = '50%';
    //img.style.transform = 'translateX(-50%)';
    img.style.width = '60%';
    img.style.height = '20%';
    //img.addEventListener('click', this.adClick_.bind(this), false);
    img.addEventListener('click', () => {
      this.adClick_(overlay.clickThrough);
    }, false);
    imageContainer.appendChild(img);
    return img;
  });

  // Setup carousel interval if multiple images exist
  if (this.overlayImages_.length > 1) {
    this.carouselInterval_ = setInterval(() => {
      this.updateOverlayImage_();
    }, this.attributes_['carouselInterval']);
  }

  // Update countdown every second
  this.countdownInterval_ = setInterval(() => {
    const now = new Date();
    const diffMs = targetTime - now;

    if (diffMs <= 0) {
      clearInterval(this.countdownInterval_);
      countdownDisplay.textContent = '00:00:00';
      this.callEvent_('AdCompleted');
      return;
    }

    const hours = String(Math.floor(diffMs / 3600000)).padStart(2, '0');
    const minutes = String(Math.floor((diffMs % 3600000) / 60000)).padStart(2, '0');
    const seconds = String(Math.floor((diffMs % 60000) / 1000)).padStart(2, '0');

    countdownDisplay.textContent = `${hours}:${minutes}:${seconds}`;
  }, 1000);

  // Create a div to serve as a button to go from a non-linear ad to linear.
  /*const linearButton = document.createElement('div');
  linearButton.style.background = 'green';
  linearButton.style.display = 'block';
  linearButton.style.margin = 'auto';
  linearButton.style.textAlign = 'center';
  linearButton.style.color = 'white';
  linearButton.style.width = '480px';
  linearButton.style.fontFamily = 'sans-serif';
  linearButton.textContent = 'Click here to switch to a linear ad';
  linearButton.addEventListener(
      'click', this.linearButtonClick_.bind(this), false);
  container.appendChild(linearButton);*/

  // Create an img tag and populate it with the image passed in to the ad
  // parameters.
  /*const adImg = document.createElement('img');
  adImg.src = overlays[0] || '';
  adImg.style.margin = 'auto';
  adImg.style.display = 'block';
  adImg.addEventListener('click', this.adClick_.bind(this), false);
  container.appendChild(adImg);*/

  // Create a Skip Ad button
  const skipButton = document.createElement('button');
  skipButton.textContent = 'Skip Ad';
  skipButton.style.position = 'absolute';
  skipButton.style.top = '10px';
  skipButton.style.right = '10px';
  skipButton.style.padding = '5px 10px';
  skipButton.style.backgroundColor = '#f00';
  skipButton.style.color = '#fff';
  skipButton.style.border = 'none';
  skipButton.style.borderRadius = '5px';
  skipButton.style.cursor = 'pointer';
  skipButton.style.zIndex = '1000';

  if (this.attributes_['skippableState']) {
    skipButton.addEventListener('click', () => {
      this.log('Ad skipped by user');
      clearInterval(this.countdownInterval_);
      this.callEvent_('AdSkipped');
      this.stopAd();
    });
    container.appendChild(skipButton);
  }

  // Start a video.
  const videos = this.parameters_.videos || [];
  for (let i = 0; i < videos.length; i++) {
    if (this.videoSlot_.canPlayType(videos[i].mimetype) != '') {
      this.videoSlot_.setAttribute('src', videos[i].url);

      this.videoSlot_.addEventListener('timeupdate', this.timeUpdateHandler_.bind(this), false);
      this.videoSlot_.addEventListener('loadedmetadata', this.loadedMetadata_.bind(this), false);
      this.videoSlot_.addEventListener('ended', this.stopAd.bind(this), false);

      this.videoSlot_.play();
      return;
    }
  }
  this.callEvent_('AdError');

  this.callEvent_('AdStarted');
  this.callEvent_('AdImpression');
}

  /**
   * Updates the currently displayed overlay image
   * @private
   */
  updateOverlayImage_() {
    if (!this.overlayImages_ || this.overlayImages_.length <= 1) return;

    // Hide current image
    this.overlayImages_[this.currentOverlayIndex_].style.display = 'none';
    
    // Update index
    this.currentOverlayIndex_ = (this.currentOverlayIndex_ + 1) % this.overlayImages_.length;
    
    // Show next image
    this.overlayImages_[this.currentOverlayIndex_].style.display = 'block';
  }

  /**
   * Called when an overlay image is clicked with its specific URL.
   * @param {string} clickThrough The URL to navigate to (optional)
   * @private
   */
  adClick_(clickThrough) {
    if ('AdClickThru' in this.eventsCallbacks_) {
      // If specific URL provided, use it, otherwise use default
      const url = clickThrough || '';
      this.eventsCallbacks_['AdClickThru'](url, '0', true);
    }
  }

  /**
   * Called when the linear overlay is clicked.  Plays the video passed in the
   * parameters.
   * @private
   */
  linearButtonClick_() {
    this.log('Linear Button Click');
    // This will turn the ad into a linear ad.
    this.attributes_.linear = true;
    this.callEvent_('AdLinearChange');
    // Remove all elements.
    while (this.slot_.firstChild) {
      this.slot_.removeChild(this.slot_.firstChild);
    }

    this.updateVideoPlayerSize_();

    // Start a video.
    const videos = this.parameters_.videos || [];
    for (let i = 0; i < videos.length; i++) {
      // Choose the first video with a supported mimetype.
      if (this.videoSlot_.canPlayType(videos[i].mimetype) != '') {
        this.videoSlot_.setAttribute('src', videos[i].url);

        // Set start time of linear ad to calculate remaining time.
        const date = new Date();
        this.startTime_ = date.getTime();

        this.videoSlot_.addEventListener(
            'timeupdate', this.timeUpdateHandler_.bind(this), false);
        this.videoSlot_.addEventListener(
            'loadedmetadata', this.loadedMetadata_.bind(this), false);
        this.videoSlot_.addEventListener(
            'ended', this.stopAd.bind(this), false);

        this.videoSlot_.play();

        return;
      }
    }
    // Haven't found a video, so error.
    this.callEvent_('AdError');
  }

  /**
   * Called by the video element when the video reaches specific points during
   * playback.
   * @private
   */
  timeUpdateHandler_() {
    if (this.nextQuartileIndex_ >= this.quartileEvents_.length) {
      return;
    }
    const percentPlayed =
        this.videoSlot_.currentTime * 100.0 / this.videoSlot_.duration;
    let nextQuartile = this.quartileEvents_[this.nextQuartileIndex_];
    if (percentPlayed >= nextQuartile.value) {
      this.eventsCallbacks_[nextQuartile.event]();
      this.nextQuartileIndex_ += 1;
    }
    if (this.videoSlot_.duration > 0) {
      this.attributes_['remainingTime'] =
          this.videoSlot_.duration - this.videoSlot_.currentTime;
    }
  }

  /**
   * Called by the video element when video metadata is loaded.
   * @private
   */
  loadedMetadata_() {
    // The ad duration is not known until the media metadata is loaded.
    // Then, update the player with the duration change.
    this.attributes_['duration'] = this.videoSlot_.duration;
    this.callEvent_('AdDurationChange');
  }

  /**
   * Called by the wrapper to stop the ad.
   */
  stopAd() {
    this.log('Stopping ad');
    clearInterval(this.countdownInterval_);
    //clearInterval(this.carouselInterval_);
    this.callEvent_('AdStopped');
    // Calling AdStopped immediately terminates the ad. Setting a timeout allows
    // events to go through.
    const callback = this.callEvent_.bind(this);
    setTimeout(callback, 75, ['AdStopped']);
  }

  /**
   * Called when the video player changes the width/height of the container.
   * @param {number} width The new width.
   * @param {number} height A new height.
   * @param {string} viewMode A new view mode.
   */
  resizeAd(width, height, viewMode) {
    this.log('resizeAd ' + width + 'x' + height + ' ' + viewMode);
    this.attributes_['width'] = width;
    this.attributes_['height'] = height;
    this.attributes_['viewMode'] = viewMode;
    this.updateVideoPlayerSize_();
    this.callEvent_('AdSizeChange');
  }

  /**
   * Pauses the ad.
   */
  pauseAd() {
    this.log('pauseAd');
    this.videoSlot_.pause();
    this.callEvent_('AdPaused');
  }

  /**
   * Resumes the ad.
   */
  resumeAd() {
    this.log('resumeAd');
    this.videoSlot_.play();
    this.callEvent_('AdPlaying');
  }

  /**
   * Expands the ad.
   */
  expandAd() {
    this.log('expandAd');
    this.attributes_['expanded'] = true;
    this.callEvent_('AdExpanded');
  }

  /**
   * Collapses the ad.
   */
  collapseAd() {
    this.log('collapseAd');
    this.attributes_['expanded'] = false;
  }

  /**
   * Skips the ad.
   */
  skipAd() {
    this.log('skipAd');
    if (this.attributes_['skippableState']) {
      this.callEvent_('AdSkipped');
    }
  }

  /**
   * Registers a callback for an event.
   * @param {Function} callback The callback function.
   * @param {string} eventName The callback type.
   * @param {Object} context The context for the callback.
   */
  subscribe(callback, eventName, context) {
    this.log('Subscribe ' + eventName);
    this.eventsCallbacks_[eventName] = callback.bind(context);
  }

  /**
   * Removes a callback based on the eventName.
   * @param {string} eventName The callback type.
   */
  unsubscribe(eventName) {
    this.log('unsubscribe ' + eventName);
    this.eventsCallbacks_[eventName] = null;
  }

  /**
   * Returns whether the ad is linear.
   * @return {boolean} True if the ad is a linear, false for non linear.
   */
  getAdLinear() {
    return this.attributes_['linear'];
  }

  /**
   * Returns ad width.
   * @return {number} The ad width.
   */
  getAdWidth() {
    return this.attributes_['width'];
  }

  /**
   * Returns ad height.
   * @return {number} The ad height.
   */
  getAdHeight() {
    return this.attributes_['height'];
  }

  /**
   * Returns true if the ad is expanded.
   * @return {boolean}
   */
  getAdExpanded() {
    this.log('getAdExpanded');
    return this.attributes_['expanded'];
  }

  /**
   * Returns the skippable state of the ad.
   * @return {boolean}
   */
  getAdSkippableState() {
    this.log('getAdSkippableState');
    return this.attributes_['skippableState'];
  }

  /**
   * Returns the remaining ad time, in seconds.
   * @return {number} The time remaining in the ad.
   */
  getAdRemainingTime() {
    return this.attributes_['remainingTime'];
  }

  /**
   * Returns the duration of the ad, in seconds.
   * @return {number} The duration of the ad.
   */
  getAdDuration() {
    return this.attributes_['duration'];
  }

  /**
   * Returns the ad volume.
   * @return {number} The volume of the ad.
   */
  getAdVolume() {
    this.log('getAdVolume');
    return this.attributes_['volume'];
  }

  /**
   * Sets the ad volume.
   * @param {number} value The volume in percentage.
   */
  setAdVolume(value) {
    this.attributes_['volume'] = value;
    this.log('setAdVolume ' + value);
    this.callEvent_('AdVolumeChange');
  }

  /**
   * Returns a list of companion ads for the ad.
   * @return {string} List of companions in VAST XML.
   */
  getAdCompanions() {
    return this.attributes_['companions'];
  }

  /**
   * Returns a list of icons.
   * @return {string} A list of icons.
   */
  getAdIcons() {
    return this.attributes_['icons'];
  }

  /**
   * Logs events and messages.
   * @param {string} message
   */
  log(message) {
    console.log(message);
  }

  /**
   * Calls an event if there is a callback.
   * @param {string} eventType
   * @private
   */
  callEvent_(eventType) {
    if (eventType in this.eventsCallbacks_) {
      this.eventsCallbacks_[eventType]();
    }
  }
};

/**
 * Main function called by wrapper to get the VPAID ad.
 * @return {Object} The VPAID compliant ad.
 */
var getVPAIDAd = function() {
  return new VpaidNonLinear();
};
