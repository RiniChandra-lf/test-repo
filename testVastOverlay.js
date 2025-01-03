/**
 * @fileoverview A VPAID ad that incorporates a countdown timer.
 */

/** @unrestricted */
const VpaidCountdown = class {
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
     * A list of getable and setable attributes.
     * @private {Object}
     */
    this.attributes_ = {
      'countdownTime': 10,  // The countdown duration in seconds.
      'currentTime': 0,     // Current time of the countdown.
      'linear': false,      // Linear ad state.
      'skippableState': false, // Skippable state of the ad.
      'volume': 1.0         // Volume of the ad.
    };

    /**
     * When the ad was started.
     * @private {number}
     */
    this.startTime_ = 0;

    /**
     * Parameters passed in from the AdParameters section of the VAST.
     * Used for countdown configurations.
     * @private {!Object}
     */
    this.parameters_ = {};
  }

  /**
   * Returns the supported VPAID version.
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

    // slot and videoSlot are passed as part of the environmentVars
    this.slot_ = environmentVars.slot;
    this.videoSlot_ = environmentVars.videoSlot;

    // Parse the incoming ad parameters.
    this.parameters_ = JSON.parse(creativeData['AdParameters']);

    this.log('initAd ' + width + 'x' + height + ' ' + viewMode + ' ' + desiredBitrate);
    this.callEvent_('AdLoaded');
  }

  /**
   * Starts the countdown timer for the ad.
   */
  startAd() {
    this.log('Starting countdown ad');

    this.startTime_ = new Date().getTime();

    // Create a div to contain the countdown elements.
    const container = document.createElement('div');
    container.style.display = 'block';
    container.style.position = 'absolute';
    container.style.width = '100%';
    container.style.bottom = '0%';
    this.slot_.appendChild(container);

    // Countdown display
    const countdownDisplay = document.createElement('div');
    countdownDisplay.style.fontSize = '48px';
    countdownDisplay.style.textAlign = 'center';
    countdownDisplay.style.color = 'white';
    countdownDisplay.textContent = this.attributes_['countdownTime'];
    container.appendChild(countdownDisplay);

    // Update countdown every second
    this.countdownInterval_ = setInterval(() => {
      this.attributes_['currentTime'] = Math.max(0, this.attributes_['currentTime'] - 1);
      countdownDisplay.textContent = this.attributes_['currentTime'];

      if (this.attributes_['currentTime'] === 0) {
        clearInterval(this.countdownInterval_);
        this.callEvent_('AdCompleted');
      }
    }, 1000);

    this.callEvent_('AdStarted');
  }

  /**
   * Stops the countdown and ends the ad early.
   */
  stopAd() {
    this.log('Stopping countdown ad');
    clearInterval(this.countdownInterval_);
    this.callEvent_('AdStopped');
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
   * Helper function to log messages.
   * @param {string} message
   * @private
   */
  log(message) {
    console.log(message);
  }

  /**
   * Calls the registered event callbacks.
   * @param {string} event The event name to call.
   * @private
   */
  callEvent_(event) {
    if (this.eventsCallbacks_[event]) {
      this.eventsCallbacks_[event]();
    }
  }

  /**
   * Returns the remaining ad time (countdown time).
   * @return {number} The time remaining in the ad (seconds).
   */
  getAdRemainingTime() {
    return this.attributes_['currentTime'];
  }

  /**
   * Returns the duration of the ad (countdown duration).
   * @return {number} The duration of the ad (seconds).
   */
  getAdDuration() {
    return this.attributes_['countdownTime'];
  }

  /**
   * Returns the ad volume.
   * @return {number} The volume of the ad.
   */
  getAdVolume() {
    return this.attributes_['volume'];
  }

  /**
   * Returns the skippable state of the ad.
   * @return {boolean}
   */
  getAdSkippableState() {
    return this.attributes_['skippableState'];
  }
};
