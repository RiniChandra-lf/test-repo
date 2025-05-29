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
    this.overlayTexts_ = [];

    /**
     * Timeout for starting the carousel
     * @private {number}
     */
    this.carouselStartTimeout_ = null;

    /**
     * Timeout for ending the carousel
     * @private {number}
     */
    this.carouselEndTimeout_ = null;

    /**
     * A list of getable and setable attributes.
     * @private {Object}
     */
    this.attributes_ = {
      companions: "",
      desiredBitrate: 256,
      duration: 10,
      expanded: false,
      height: 0,
      icons: "",
      linear: false,
      viewMode: "normal",
      width: 0,
      volume: 1.0,
      countdownTime: 10, // The countdown duration in seconds.
      currentTime: 0, // Current time of the countdown.
      linear: false, // Linear ad state.
      skippableState: true, // Skippable state of the ad.
      volume: 1.0, // Volume of the ad.
      carouselInterval: 5000, // Transition every x seconds by default
      carouselStartDelay: 4000, // Start carousel after 4 seconds
      carouselEndEarly: 4, // End carousel x seconds before ad ends
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
      { event: "AdImpression", value: 0 },
      { event: "AdVideoStart", value: 0 },
      { event: "AdVideoFirstQuartile", value: 25 },
      { event: "AdVideoMidpoint", value: 50 },
      { event: "AdVideoThirdQuartile", value: 75 },
      { event: "AdVideoComplete", value: 100 },
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

    this.skipOffsetSeconds_ = 0;

    this.scale_ = 1;

    //frontend preview sizing
    this.baseWidth_ = 800;
    this.baseHeight_ = 450;

    this.defaults_ = {
      websiteBackgroundColor: "#CC0000",
      websiteColor: "white",
      websiteFontSize: 14,
      websiteFontStyle: "bold",
      websiteFont: "sans-serif",
      website: "www.example.com",
      productDetailsFontColor: "black",
      productDetailsFontSize: 14,
      productDetailsFont: "sans-serif",
      productDetailsFontStyle: "bold",
      productNameColor: "black",
      productNameFontSize: 16,
      productNameFontStyle: "bold",
      productNameFont: "sans-serif",
      priceFontColor: "black",
      priceFontSize: 28,
      priceFontStyle: "bold",
      priceFont: "sans-serif",
      topTitleBackgroundColor: "#CC0000",
      topTitleColor: "white",
      topTitleFontSize: 32,
      topTitleFontStyle: "normal",
      topTitleFont: "sans-serif",
      topTitle: "www.example.com",
    };
  }

  /**
   * Returns the supported VPAID verion.
   * @param {string} version
   * @return {string}
   */
  handshakeVersion(version) {
    return "2.0";
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
  initAd(width, height, viewMode, desiredBitrate, creativeData, environmentVars) {
    this.attributes_["width"] = width;
    this.attributes_["height"] = height;
    this.attributes_["viewMode"] = viewMode;
    this.attributes_["desiredBitrate"] = desiredBitrate;

    // slot and videoSlot are passed as part of the environmentVars
    this.slot_ = environmentVars.slot;
    this.videoSlot_ = environmentVars.videoSlot;

    // Parse the incoming ad parameters.
    this.parameters_ = JSON.parse(creativeData["AdParameters"]);

    this.skipOffsetSeconds_ = this.parameters_.skipOffset;

    this.scaleX_ = width / this.baseWidth_;
    this.scaleY_ = height / this.baseHeight_;
    this.scale_ = Math.min(this.scaleX_, this.scaleY_);
    console.log("scaling factor: ", this.scale_);

    this.log("skip offset: ", this.skipOffsetSeconds_);

    this.log("initAd " + width + "x" + height + " " + viewMode + " " + desiredBitrate);
    this.callEvent_("AdLoaded");
  }

  /**
   * Helper function to update the size of the video player.
   * @private
   */
  updateVideoPlayerSize_() {
    this.videoSlot_.setAttribute("width", this.attributes_["width"]);
    this.videoSlot_.setAttribute("height", this.attributes_["height"]);
  }

  scalePx(val) {
    return (val * this.scale_).toFixed(2) + 'px';
  }

  /**
   * Called by the wrapper to start the ad.
   */
  startAd = function () {
    this.log("Starting ad");

    const date = new Date();
    this.startTime_ = date.getTime();

    // Create a div to contain our ad elements.
    const overlays = this.parameters_.overlays || [];

    const container = document.createElement("div");
    container.style.display = "block";
    container.style.position = "absolute";
    container.style.height = "100%";
    container.style.width = "100%";
    container.style.right = "0%";
    this.slot_.appendChild(container);

    // Create image container for carousel - positioned on the right side
    const imageContainer = document.createElement("div");
    imageContainer.id = "overlayContainer";
    imageContainer.style.display = "none"; // Initially hidden until delay time
    imageContainer.style.position = "absolute";
    imageContainer.style.right = "2%";
    imageContainer.style.bottom = "5.5%";
    imageContainer.style.height = "72%"; // Reduced to make room for bottom banner
    imageContainer.style.width = "28%";
    imageContainer.style.overflow = "hidden";
    container.appendChild(imageContainer);

    // Create bottom strip with for websiteURL
    const bottomStripContainer = document.createElement("div");
    bottomStripContainer.id = "bottomStripContainer";
    bottomStripContainer.style.display = "none";
    bottomStripContainer.style.position = "absolute";
    bottomStripContainer.style.bottom = "5.5%";
    bottomStripContainer.style.left = "0";
    bottomStripContainer.style.width = "68%";
    bottomStripContainer.style.height = "10%";
    bottomStripContainer.style.alignItems = "center";
    bottomStripContainer.style.justifyContent = "end";
    bottomStripContainer.style.backgroundColor = "rgba(0, 0, 0, 0.6)";
    container.appendChild(bottomStripContainer);

    // website URL
    const websiteURL = document.createElement("div");
    websiteURL.style.color = this.parameters_.websiteColor || this.defaults_.websiteColor;
    websiteURL.style.padding = `0 ${this.scalePx(8)}`;
    websiteURL.style.fontSize = this.scalePx(this.parameters_.websiteFontSize) || this.scalePx(this.defaults_.websiteFontSize);
    websiteURL.style.fontWeight = this.parameters_.websiteFontStyle || this.defaults_.websiteFontStyle;
    websiteURL.style.letterSpacing = this.scalePx(1);
    websiteURL.style.fontFamily = this.parameters_.websiteFont || this.defaults_.websiteFont;
    websiteURL.textContent = this.parameters_.website || this.defaults_.website;
    bottomStripContainer.appendChild(websiteURL);

    // Create top logo/title container
    const topLogoTitleContainer = document.createElement("div");
    topLogoTitleContainer.id = "topLogoTitleContainer";
    topLogoTitleContainer.style.display = "none";
    topLogoTitleContainer.style.position = "absolute";
    topLogoTitleContainer.style.top = "0";
    topLogoTitleContainer.style.left = "0";
    topLogoTitleContainer.style.width = "100%";
    topLogoTitleContainer.style.height = "18%";
    container.appendChild(topLogoTitleContainer);

    // Left part - LOGO container
    const logoContainer = document.createElement("div");
    logoContainer.style.flex = "0 0 26.5%";
    topLogoTitleContainer.appendChild(logoContainer);

    // Logo image
    const logoImg = document.createElement("img");
    logoImg.src = this.parameters_.bottomImageUrl || overlays[0]?.imageUrl || overlays[0];
    logoImg.style.height = "100%";
    logoImg.style.width = "100%";
    logoImg.style.objectFit = "contain";
    logoContainer.appendChild(logoImg);

    // Right part - Top-Title
    const titleContainer = document.createElement("div");
    titleContainer.style.flex = "1";
    titleContainer.style.display = "flex";
    titleContainer.style.justifyContent = "center";
    titleContainer.style.alignItems = "center";
    titleContainer.style.overflow = "hidden";
    titleContainer.style.backgroundColor = this.parameters_.topTitleBackgroundColor || this.defaults_.topTitleBackgroundColor; // Deeper red
    topLogoTitleContainer.appendChild(titleContainer);

    // Top title text
    const topTitle = document.createElement("div");
    topTitle.style.textAlign = "center";
    topTitle.style.color = this.parameters_.topTitleColor || this.defaults_.topTitleColor;
    topTitle.style.fontSize = this.scalePx(this.parameters_.topTitleFontSize) || this.scalePx(this.defaults_.topTitleFontSize);
    topTitle.style.fontWeight = this.parameters_.topTitleFontStyle || this.defaults_.topTitleFontStyle;
    topTitle.style.fontFamily = this.parameters_.topTitleFont || this.defaults_.topTitleFont;
    topTitle.textContent = this.parameters_.topTitle || this.defaults_.topTitle;
    titleContainer.appendChild(topTitle);

    // Add CSS animation styles
    const styleEl = document.createElement("style");
    styleEl.textContent = `
        * {
          font-family: sans-serif;
        }
          
        @keyframes slideOutRight {
          from { transform: translateX(0); opacity: 1; }
          to { transform: translateX(100%); opacity: 0; }
        }
        
        @keyframes slideInFromTop {
          from { transform: translateY(-100%); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        .slide-out-right {
          animation: slideOutRight 0.5s forwards;
        }
        
        .slide-in-from-top {
          animation: slideInFromTop 0.5s forwards;
        }
        
        .fade-in {
          animation: fadeIn 0.5s forwards;
        }
        
        .overlay-unit {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: space-between;
          margin: auto;
          width: 100%;
          height: 100%;
        }
        
        .overlay-text {
          text-align: center;
          width: 100%;
          white-space: pre-line;
        }

        .price {
            color: ${this.parameters_.priceFontColor || this.defaults_.priceFontColor};
            font-size: ${this.parameters_.priceFontSize ? this.scalePx(this.parameters_.priceFontSize) : this.scalePx(this.defaults_.priceFontSize)};
            font-weight: ${this.parameters_.priceFontStyle || this.defaults_.priceFontStyle};
            font-family: ${this.parameters_.priceFont || this.defaults_.priceFont};
        }
      `;
    document.head.appendChild(styleEl);

    // Create and setup overlay units (image + text)
    this.overlayImages_ = overlays.map((overlay, index) => {
      // Create a container for the image and text as a unit
      const overlayUnit = document.createElement("div");
      overlayUnit.className = "overlay-unit";
      overlayUnit.style.display = "none"; // All start hidden

      // Create image element
      const img = document.createElement("img");
      img.src = overlay.imageUrl || overlay;
      img.style.width = "100%";
      img.style.maxHeight = "100%";
      img.style.objectFit = "contain";

      // Create text element
      const nameElement = document.createElement("h3");
      nameElement.style.margin = "0";
      nameElement.style.textAlign = "center";
      nameElement.style.color = overlay.productNameColor || this.defaults_.productNameColor;
      nameElement.style.font = overlay.productNameFont || this.defaults_.productNameFont;
      nameElement.style.fontSize = overlay.productNameFontSize
        ? this.scalePx(overlay.productNameFontSize)
        : this.scalePx(this.defaults_.productNameFontSize);
      nameElement.style.fontWeight = overlay.productNameFontStyle || this.defaults_.productNameFontStyle;
      nameElement.textContent = overlay.productName || `Overlay ${index + 1}`;
      this.overlayTexts_.push(nameElement);

      const productDescriptionElement = document.createElement("div");
      productDescriptionElement.className = "overlay-text";
      productDescriptionElement.style.color = overlay.productDetailsFontColor || this.defaults_.productDetailsFontColor;
      productDescriptionElement.style.font = overlay.productDetailsFont;
      productDescriptionElement.style.fontSize = overlay.productDetailsFontSize ? this.scalePx(overlay.productDetailsFontSize) : this.scalePx(this.defaults_.productDetailsFontSize);
      productDescriptionElement.style.fontWeight = overlay.productDetailsFontStyle || this.defaults_.productDetailsFontStyle
      productDescriptionElement.textContent = overlay.productDescription || `Overlay ${index + 1}`;
      this.overlayTexts_.push(productDescriptionElement);

      const priceElement = document.createElement("div");
      priceElement.style.color = overlay.priceFontColor || this.defaults_.priceFontColor;
      priceElement.style.font = overlay.priceFont || this.defaults_.priceFont;
      priceElement.style.fontSize = overlay.priceFontSize || this.defaults_.priceFontSize;
      priceElement.style.fontWeight = overlay.priceFontStyle || this.defaults_.priceFontStyle;
      priceElement.textContent = overlay.price || `Overlay ${index + 1}`;
      this.overlayTexts_.push(priceElement);

      // Add click handler to the unit
      overlayUnit.addEventListener(
        "click",
        () => {
          this.adClick_(overlay.clickThrough);
        },
        false
      );

      // Append image and text to the unit
      overlayUnit.appendChild(img);
      overlayUnit.appendChild(nameElement);
      overlayUnit.appendChild(productDescriptionElement);
      overlayUnit.appendChild(priceElement);

      // Add to container
      imageContainer.appendChild(overlayUnit);

      return overlayUnit;
    });

    container.addEventListener("click", (e) => {
      const isProductClick = e.target.closest(".overlay-unit");
      const isSkipButton = e.target.closest("#skipButton");
      if (!isProductClick && !isSkipButton && this.parameters_.defaultClickThrough) {
        window.open(this.parameters_.defaultClickThrough, "_blank");
      }
    });

    // Start the video
    const videos = this.parameters_.videos || [];
    for (let i = 0; i < videos.length; i++) {
      if (this.videoSlot_.canPlayType(videos[i].mimetype) != "") {
        this.videoSlot_.setAttribute("src", videos[i].url);

        this.videoSlot_.addEventListener("timeupdate", this.timeUpdateHandler_.bind(this), false);
        this.videoSlot_.addEventListener("loadedmetadata", this.loadedMetadata_.bind(this), false);
        this.videoSlot_.addEventListener("ended", this.stopAd.bind(this), false);

        this.videoSlot_.play();
        break;
      }
    }

    this.callEvent_("AdStarted");
    this.callEvent_("AdImpression");

    // Schedule the start of carousel after the delay
    this.carouselStartTimeout_ = setTimeout(() => {
      const overlayContainer = document.getElementById("overlayContainer");
      const topLogoTitleContainer = document.getElementById("topLogoTitleContainer");
      const bottomStripContainer = document.getElementById("bottomStripContainer");
      if (overlayContainer && topLogoTitleContainer && bottomStripContainer) {
        // Show containers first
        overlayContainer.style.display = "block";
        topLogoTitleContainer.style.display = "flex";
        bottomStripContainer.style.display = "flex";

        // Add animation class to the first overlay with a slight delay
        setTimeout(() => {
          if (this.overlayImages_.length > 0) {
            const firstUnit = this.overlayImages_[0];
            firstUnit.style.display = "flex";
            firstUnit.classList.add("slide-in-from-top");

            // Remove animation class after animation completes
            setTimeout(() => {
              firstUnit.classList.remove("slide-in-from-top");
            }, 500);
          }

          // Setup carousel interval if multiple images exist
          if (this.overlayImages_.length > 1) {
            this.carouselInterval_ = setInterval(() => {
              this.updateOverlayImage_();
            }, this.parameters_["carouselInterval"] * 1000);
          }
        }, 50); // Small delay to ensure container is visible first
      }
    }, this.parameters_["carouselStartDelay"] * 1000 || this.attributes_["carouselStartDelay"]);

    // Create a Skip Ad button
    if (this.parameters_["isSkippable"]) {
      this.skipButtonTimeout_ = setTimeout(() => {
        const skipButton = document.createElement("button");
        skipButton.id = "skipButton";
        skipButton.textContent = "Skip Ad";
        skipButton.style.fontSize = this.scalePx(12);
        skipButton.style.position = "absolute";
        skipButton.style.bottom = `${this.scalePx(1)}`;
        skipButton.style.right = `${this.scalePx(10)}`;
        skipButton.style.padding = `${this.scalePx(5)} ${this.scalePx(10)}`;
        skipButton.style.backgroundColor = "#cccccc";
        skipButton.style.color = "#fff";
        skipButton.style.border = `${this.scalePx(2)} solid white`;
        skipButton.style.borderRadius = `${this.scalePx(5)}`;
        skipButton.style.cursor = "pointer";
        skipButton.style.zIndex = "1000";

        skipButton.addEventListener("click", () => {
          this.log("Ad skipped by user");
          clearInterval(this.countdownInterval_);
          this.callEvent_("AdSkipped");
          this.stopAd();
        });

        container.appendChild(skipButton);
      }, this.skipOffsetSeconds_ * 1000); // Respect skipOffset
    }
  };

  /**
   * Updates the currently displayed overlay image with slide animations
   * @private
   */
  updateOverlayImage_() {
    if (!this.overlayImages_ || this.overlayImages_.length <= 1) return;

    // Get current and next image unit
    const currentUnit = this.overlayImages_[this.currentOverlayIndex_];
    const nextIndex = (this.currentOverlayIndex_ + 1) % this.overlayImages_.length;
    const nextUnit = this.overlayImages_[nextIndex];

    // Add slide-out animation class to current unit
    currentUnit.classList.add("slide-out-right");

    // After animation completes, hide current and show next with animation
    setTimeout(() => {
      // Hide current unit and remove animation class
      currentUnit.style.display = "none";
      currentUnit.classList.remove("slide-out-right");

      // Show next unit with slide-in animation
      nextUnit.style.display = "flex";
      nextUnit.classList.add("slide-in-from-top");

      // Update index
      this.currentOverlayIndex_ = nextIndex;

      // Remove animation class after animation completes
      setTimeout(() => {
        nextUnit.classList.remove("slide-in-from-top");
      }, 500);
    }, 500);
  }

  /**
   * Called when an overlay image is clicked with its specific URL.
   * @param {string} clickThrough The URL to navigate to (optional)
   * @private
   */
  adClick_(clickThrough) {
    if ("AdClickThru" in this.eventsCallbacks_) {
      // If specific URL provided, use it, otherwise use default
      const url = clickThrough || "";
      this.eventsCallbacks_["AdClickThru"](url, "0", true);
    }
  }

  /**
   * Called by the video element when video metadata is loaded.
   * @private
   */
  loadedMetadata_() {
    // The ad duration is not known until the media metadata is loaded.
    // Then, update the player with the duration change.
    this.attributes_["duration"] = this.videoSlot_.duration;
    this.callEvent_("AdDurationChange");
    if (this.parameters_["carouselEnd"]) {
      this.attributes_["carouselEndEarly"] = this.parameters_["carouselEnd"];
    }

    // Schedule the end of carousel 5 seconds before the end of the video
    if (this.videoSlot_.duration > this.attributes_["carouselEndEarly"]) {
      const endTime = (this.videoSlot_.duration - this.attributes_["carouselEndEarly"]) * 1000;
      this.carouselEndTimeout_ = setTimeout(() => {
        if (this.carouselInterval_) {
          clearInterval(this.carouselInterval_);
          this.carouselInterval_ = null;
        }

        const overlayContainer = document.getElementById("overlayContainer");
        const topLogoTitleContainer = document.getElementById("topLogoTitleContainer");
        const bottomStripContainer = document.getElementById("bottomStripContainer");
        if (overlayContainer && topLogoTitleContainer && bottomStripContainer) {
          overlayContainer.style.display = "none";
          topLogoTitleContainer.style.display = "none";
          bottomStripContainer.style.display = "none";
        }
      }, endTime);
    }
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
    const percentPlayed = (this.videoSlot_.currentTime * 100.0) / this.videoSlot_.duration;
    let nextQuartile = this.quartileEvents_[this.nextQuartileIndex_];
    if (percentPlayed >= nextQuartile.value) {
      this.eventsCallbacks_[nextQuartile.event]();
      this.nextQuartileIndex_ += 1;
    }
    if (this.videoSlot_.duration > 0) {
      this.attributes_["remainingTime"] = this.videoSlot_.duration - this.videoSlot_.currentTime;
    }
  }

  /**
   * Called by the wrapper to stop the ad.
   */
  stopAd() {
    this.log("Stopping ad");

    // Clear all timers
    if (this.carouselInterval_) {
      clearInterval(this.carouselInterval_);
    }

    if (this.carouselStartTimeout_) {
      clearTimeout(this.carouselStartTimeout_);
    }

    if (this.carouselEndTimeout_) {
      clearTimeout(this.carouselEndTimeout_);
    }

    this.callEvent_("AdStopped");
    // Calling AdStopped immediately terminates the ad. Setting a timeout allows
    // events to go through.
    const callback = this.callEvent_.bind(this);
    setTimeout(callback, 75, ["AdStopped"]);
  }

  /**
   * Called when the video player changes the width/height of the container.
   * @param {number} width The new width.
   * @param {number} height A new height.
   * @param {string} viewMode A new view mode.
   */
  resizeAd(width, height, viewMode) {
    this.log("resizeAd " + width + "x" + height + " " + viewMode);
    this.attributes_["width"] = width;
    this.attributes_["height"] = height;
    this.attributes_["viewMode"] = viewMode;
    this.updateVideoPlayerSize_();
    this.callEvent_("AdSizeChange");
  }

  /**
   * Pauses the ad.
   */
  pauseAd() {
    this.log("pauseAd");
    this.videoSlot_.pause();
    this.callEvent_("AdPaused");
  }

  /**
   * Resumes the ad.
   */
  resumeAd() {
    this.log("resumeAd");
    this.videoSlot_.play();
    this.callEvent_("AdPlaying");
  }

  /**
   * Expands the ad.
   */
  expandAd() {
    this.log("expandAd");
    this.attributes_["expanded"] = true;
    this.callEvent_("AdExpanded");
  }

  /**
   * Collapses the ad.
   */
  collapseAd() {
    this.log("collapseAd");
    this.attributes_["expanded"] = false;
  }

  /**
   * Skips the ad.
   */
  skipAd() {
    this.log("skipAd");
    if (this.attributes_["skippableState"]) {
      this.callEvent_("AdSkipped");
    }
  }

  /**
   * Registers a callback for an event.
   * @param {Function} callback The callback function.
   * @param {string} eventName The callback type.
   * @param {Object} context The context for the callback.
   */
  subscribe(callback, eventName, context) {
    this.log("Subscribe " + eventName);
    this.eventsCallbacks_[eventName] = callback.bind(context);
  }

  /**
   * Removes a callback based on the eventName.
   * @param {string} eventName The callback type.
   */
  unsubscribe(eventName) {
    this.log("unsubscribe " + eventName);
    this.eventsCallbacks_[eventName] = null;
  }

  /**
   * Returns whether the ad is linear.
   * @return {boolean} True if the ad is a linear, false for non linear.
   */
  getAdLinear() {
    return this.attributes_["linear"];
  }

  /**
   * Returns ad width.
   * @return {number} The ad width.
   */
  getAdWidth() {
    return this.attributes_["width"];
  }

  /**
   * Returns ad height.
   * @return {number} The ad height.
   */
  getAdHeight() {
    return this.attributes_["height"];
  }

  /**
   * Returns true if the ad is expanded.
   * @return {boolean}
   */
  getAdExpanded() {
    this.log("getAdExpanded");
    return this.attributes_["expanded"];
  }

  /**
   * Returns the skippable state of the ad.
   * @return {boolean}
   */
  getAdSkippableState() {
    this.log("getAdSkippableState");
    return this.attributes_["skippableState"];
  }

  /**
   * Returns the remaining ad time, in seconds.
   * @return {number} The time remaining in the ad.
   */
  getAdRemainingTime() {
    return this.attributes_["remainingTime"];
  }

  /**
   * Returns the duration of the ad, in seconds.
   * @return {number} The duration of the ad.
   */
  getAdDuration() {
    return this.attributes_["duration"];
  }

  /**
   * Returns the ad volume.
   * @return {number} The volume of the ad.
   */
  getAdVolume() {
    this.log("getAdVolume");
    return this.attributes_["volume"];
  }

  /**
   * Sets the ad volume.
   * @param {number} value The volume in percentage.
   */
  setAdVolume(value) {
    this.attributes_["volume"] = value;
    this.log("setAdVolume " + value);
    this.callEvent_("AdVolumeChange");
  }

  /**
   * Returns a list of companion ads for the ad.
   * @return {string} List of companions in VAST XML.
   */
  getAdCompanions() {
    return this.attributes_["companions"];
  }

  /**
   * Returns a list of icons.
   * @return {string} A list of icons.
   */
  getAdIcons() {
    return this.attributes_["icons"];
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
var getVPAIDAd = function () {
  return new VpaidNonLinear();
};