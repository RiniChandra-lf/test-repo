/**
 * @fileoverview A sample non-linear VPAID ad useful for testing a VPAID JS
 * enabled player. This ad will show a non-linear ad which can also enter linear
 * mode.
 */

/** @unrestricted */
const VpaidNonLinear = class {
  constructor() {
    this.fonts_ = [];
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
      //{ event: "AdImpression", value: 0 },
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

    this.numSpans = [];
    this.labelSpans = [];
    this.countdownInterval_ = null;

    this.defaults_ = {
      addressBackgroundColor: "#FF0000",
      addressColor: "white",
      addressFontSize: 14,
      addressFontStyle: "normal",
      addressFont: "sans-serif",
      address: " ",
      websiteBackgroundColor: "#CC0000",
      websiteColor: "white",
      websiteFontSize: 14,
      websiteFontStyle: "bold",
      websiteFont: "sans-serif",
      website: " ",
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
      topTitle: " ",
      isCountdownEnabled: false,
      countdownSettings: {
        description: {
          text: '',
          font_family: 'Arial',
          font_size: '24',
          font_style: 'Regular',
          font_color: '#000000',
        },
        dateTime: "2025-12-31T23:59:59Z",
        gradient: {
            startColor: '#000000',
            endColor: '#FFFFFF',
        }
      },
      preBannerTime: 0,
      postBannerTime: 0
    };
  }

loadFonts_() {
    this.log('Loading Google Fonts via CDN');
    const styleEl = document.createElement('style');
    styleEl.textContent = `
      @import url('https://fonts.googleapis.com/css2?family=Arial:wght@400;500;700&family=Bebas+Neue&family=Courier+New:wght@400;700&family=Montserrat:wght@100;400;500;600;700&family=EB+Garamond:wght@400;500;600;700&family=Noto+Sans+Georgian:wght@100;400;500;600;700&family=Helvetica&family=Impact&family=Inter:wght@100;400;500;600;700&family=Lato:wght@100;400;700&family=Merriweather:wght@400;500;600;700&family=Montserrat:wght@100;400;500;600;700&family=Open+Sans:wght@400;500;600;700&family=Oswald:wght@100;400;500;600&family=Poppins:wght@100;400;500;600;700&family=Raleway:wght@100;400;500;600;700&family=Roboto:wght@100;400;500;600;700&family=Rubik:wght@400;500;600;700&family=Tahoma&family=Times+New+Roman&family=Verdana:wght@400;700&display=swap');
    `;
    if (this.slot_) {
      this.slot_.appendChild(styleEl);
      this.log('Font styles appended to slot');
    } else {
      document.head.appendChild(styleEl);
      this.log('Font styles appended to document.head');
    }
    document.fonts.ready.then(() => {
      this.log('Fonts loaded, triggering reflow');
    });
  }

  getFontWeight_(style) {
    const weights = {
      'Thin': '100',
      'Regular': '400',
      'Medium': '500',
      'Semi-Bold': '600',
      'Bold': '700'
    };
    return weights[style] || '400';
  }

  getFallbackFont_(font) {
    const serifFonts = ['EB Garamond', 'Merriweather', 'Times New Roman'];
    const sansFonts = ['Arial', 'Helvetica', 'Inter', 'Lato', 'Montserrat', 'Open Sans', 'Poppins', 'Raleway', 'Roboto', 'Rubik', 'Tahoma', 'Verdana', 'Noto Sans Georgian'];
    const displayFonts = ['Bebas Neue', 'Impact', 'Oswald'];
    if (font === 'Futura') return 'Montserrat, Helvetica, sans-serif';
    if (font === 'Garamond') return 'Times New Roman, Georgia, serif';
    if (serifFonts.includes(font)) return `${font}, Times New Roman, Georgia, serif`;
    if (displayFonts.includes(font)) return `${font}, Impact, sans-serif`;
    if (font === 'Courier New') return `${font}, monospace`;
    return `${font}, Arial, Helvetica, sans-serif`;
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

    this.loadFonts_();

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

    // Create bottom strip with two parts
    const bottomStripContainer = document.createElement("div");
    bottomStripContainer.id = "bottomStripContainer";
    bottomStripContainer.style.display = "flex";
    bottomStripContainer.style.position = "absolute";
    bottomStripContainer.style.bottom = "0";
    bottomStripContainer.style.width = "100%";
    bottomStripContainer.style.height = "9%";
    container.appendChild(bottomStripContainer);

    // Left part - address container
    const leftStrip = document.createElement("div");
    leftStrip.style.backgroundColor = this.parameters_.addressBackgroundColor || this.defaults_.addressBackgroundColor; // Standard red
    leftStrip.style.flex = "1";
    leftStrip.style.display = "flex";
    leftStrip.style.justifyContent = "left";
    leftStrip.style.alignItems = "center";
    bottomStripContainer.appendChild(leftStrip);

    // address text
    const address = document.createElement("div");
    address.style.color = this.parameters_.addressColor || this.defaults_.addressColor;
    address.style.padding = `0 ${this.scalePx(8)}`;
    address.style.fontSize = this.scalePx(this.parameters_.addressFontSize) || this.scalePx(this.defaults_.addressFontSize);
    address.style.fontWeight = this.getFontWeight_(this.parameters_.addressFontStyle || this.defaults_.addressFontStyle);    
    address.style.letterSpacing = this.scalePx(1);
    address.style.fontFamily = this.getFallbackFont_(this.parameters_.addressFont || this.defaults_.addressFont);
    address.textContent = this.parameters_.address || this.defaults_.address;
    leftStrip.appendChild(address);

    // Right part - website URL container
    const rightStrip = document.createElement("div");
    rightStrip.style.backgroundColor = this.parameters_.websiteBackgroundColor || this.defaults_.websiteBackgroundColor; // Standard red
    rightStrip.style.flex = "0 0 34%";
    rightStrip.style.display = "flex";
    rightStrip.style.justifyContent = "center";
    rightStrip.style.alignItems = "center";
    bottomStripContainer.appendChild(rightStrip);

    // website URL text
    const websiteURL = document.createElement("div");
    websiteURL.style.color = this.parameters_.websiteColor || this.defaults_.websiteColor;
    websiteURL.style.padding = `0 ${this.scalePx(8)}`;
    websiteURL.style.fontSize = this.scalePx(this.parameters_.websiteFontSize) || this.scalePx(this.defaults_.websiteFontSize);
    websiteURL.style.fontWeight = this.getFontWeight_(this.parameters_.websiteFontStyle || this.defaults_.websiteFontStyle);
    websiteURL.style.letterSpacing = this.scalePx(1);
    websiteURL.style.fontFamily = this.getFallbackFont_(this.parameters_.websiteFont || this.defaults_.websiteFont);
    websiteURL.textContent = this.parameters_.website || this.defaults_.website;
    rightStrip.appendChild(websiteURL);

    // Left logo and title container
    const leftLogoTitleContainer = document.createElement("div");
    leftLogoTitleContainer.id = "leftLogoTitleContainer";
    leftLogoTitleContainer.style.display = "none";
    leftLogoTitleContainer.style.position = "absolute";
    leftLogoTitleContainer.style.top = "30%";
    leftLogoTitleContainer.style.left = "0%";
    leftLogoTitleContainer.style.width = "32%";
    leftLogoTitleContainer.style.height = "27%";
    leftLogoTitleContainer.style.display = "flex";
    leftLogoTitleContainer.style.flexDirection = "column";
    leftLogoTitleContainer.style.justifyContent = "center";
    leftLogoTitleContainer.style.alignItems = "center";
    container.appendChild(leftLogoTitleContainer);

    // Logo image
    const logoImg = document.createElement("img");
    logoImg.src = this.parameters_.bottomImageUrl || overlays[0]?.imageUrl || overlays[0];
    logoImg.style.height = "60%";
    logoImg.style.width = "100%";
    logoImg.style.objectFit = "contain";
    leftLogoTitleContainer.appendChild(logoImg);

    // Top title text below logo
    const topTitle = document.createElement("div");
    topTitle.style.textAlign = "center";
    topTitle.style.color = this.parameters_.topTitleColor || this.defaults_.topTitleColor;
    topTitle.style.fontSize = this.scalePx(this.parameters_.topTitleFontSize) || this.scalePx(this.defaults_.topTitleFontSize);
    topTitle.style.fontWeight = this.getFontWeight_(this.parameters_.topTitleFontStyle || this.defaults_.topTitleFontStyle);
    topTitle.style.fontFamily = this.getFallbackFont_(this.parameters_.topTitleFont || this.defaults_.topTitleFont);
    topTitle.textContent = this.parameters_.topTitle || this.defaults_.topTitle;
    leftLogoTitleContainer.appendChild(topTitle);

    // Right countdown container
    const rightCountdownContainer = document.createElement("div");
    rightCountdownContainer.id = "rightCountdownContainer";
    rightCountdownContainer.style.display = "none";
    rightCountdownContainer.style.position = "absolute";
    rightCountdownContainer.style.top = "72%";
    rightCountdownContainer.style.right = "0%";
    rightCountdownContainer.style.width = "66%";
    rightCountdownContainer.style.height = "14.5%";
    rightCountdownContainer.style.display = "flex";
    rightCountdownContainer.style.justifyContent = "space-between";
    rightCountdownContainer.style.alignItems = "center";
    rightCountdownContainer.style.padding = this.scalePx(10);
    container.appendChild(rightCountdownContainer);

    if (this.parameters_.isCountdownEnabled) {
      rightCountdownContainer.style.background = `linear-gradient(to bottom right, ${this.parameters_.countdownSettings.gradient.startColor || this.defaults_.countdownSettings.gradient.startColor}, ${this.parameters_.countdownSettings.gradient.endColor || this.defaults_.countdownSettings.gradient.endColor})`;

      const leftDescriptionDiv = document.createElement("div");
      leftDescriptionDiv.style.flex = "1";
      leftDescriptionDiv.style.textAlign = "left";
      leftDescriptionDiv.style.color = this.parameters_.countdownSettings.description.font_color || this.defaults_.countdownSettings.description.font_color;
      leftDescriptionDiv.style.fontSize = this.scalePx(this.parameters_.countdownSettings.description.font_size) || this.scalePx(this.defaults_.countdownSettings.description.font_size);
      leftDescriptionDiv.style.fontWeight = this.getFontWeight_(this.parameters_.countdownSettings.description.font_style || this.defaults_.countdownSettings.description.font_style);
      leftDescriptionDiv.style.fontFamily = this.getFallbackFont_(this.parameters_.countdownSettings.description.font_family || this.defaults_.countdownSettings.description.font_family);
      leftDescriptionDiv.textContent = this.parameters_.countdownSettings.description.text || this.defaults_.countdownSettings.description.text;
      rightCountdownContainer.appendChild(leftDescriptionDiv);

      const countdownDisplay = document.createElement("div");
      countdownDisplay.style.display = "flex";
      countdownDisplay.style.alignItems = "center";
      countdownDisplay.style.gap = this.scalePx(5);
      rightCountdownContainer.appendChild(countdownDisplay);

      const descFontSize = parseInt(this.parameters_.countdownSettings.description.font_size || this.defaults_.countdownSettings.description.font_size);
      const numFontSize = this.scalePx(Math.round(descFontSize * 1.333));
      const labelFontSize = this.scalePx(Math.round(descFontSize * 0.5));

      this.numSpans = [];
      this.labelSpans = [];

      for (let i = 0; i < 3; i++) {
        const unitDiv = document.createElement("div");
        unitDiv.style.display = "flex";
        unitDiv.style.flexDirection = "column";
        unitDiv.style.alignItems = "center";

        const numSpan = document.createElement("span");
        numSpan.style.fontSize = numFontSize;
        numSpan.style.fontWeight = this.getFontWeight_("bold");
        numSpan.style.fontFamily = this.getFallbackFont_("Inter");
        numSpan.style.color = this.parameters_.countdownSettings.description.font_color || this.defaults_.countdownSettings.description.font_color;
        numSpan.textContent = "00";
        unitDiv.appendChild(numSpan);
        this.numSpans.push(numSpan);

        const labelSpan = document.createElement("span");
        labelSpan.style.fontSize = labelFontSize;
        labelSpan.style.fontFamily = this.getFallbackFont_("Arial");
        labelSpan.style.color = this.parameters_.countdownSettings.description.font_color || this.defaults_.countdownSettings.description.font_color;
        labelSpan.textContent = "Hours";
        unitDiv.appendChild(labelSpan);
        this.labelSpans.push(labelSpan);

        countdownDisplay.appendChild(unitDiv);

        if (i < 2) {
          const colonSpan = document.createElement("span");
          colonSpan.textContent = ":";
          colonSpan.style.fontSize = numFontSize;
          colonSpan.style.fontWeight = this.getFontWeight_("Bold");
          colonSpan.style.color = this.parameters_.countdownSettings.description.font_color || this.defaults_.countdownSettings.description.font_color;
          colonSpan.style.paddingBottom = this.scalePx(12); // Align with numbers considering labels
          countdownDisplay.appendChild(colonSpan);
        }
      }
    }

    container.addEventListener("click", (e) => {
      const isSkipButton = e.target.closest("#skipButton");

      if (!isSkipButton && this.parameters_.defaultClickThrough) {
        this.adClick_(this.parameters_.defaultClickThrough);
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

    // Schedule the start of overlays after the delay
    this.carouselStartTimeout_ = setTimeout(() => {
      const leftLogoTitleContainer = document.getElementById("leftLogoTitleContainer");
      const rightCountdownContainer = document.getElementById("rightCountdownContainer");
      const bottomStripContainer = document.getElementById("bottomStripContainer");
      if (leftLogoTitleContainer && rightCountdownContainer && bottomStripContainer) {
        leftLogoTitleContainer.style.display = "flex";
        rightCountdownContainer.style.display = "flex";
        bottomStripContainer.style.display = "flex";
      }
    }, this.parameters_["preBannerTime"] * 1000 || this.attributes_["preBannerTime"]);

    // Create a Skip Ad button
    if (this.parameters_["isSkippable"]) {
      this.skipButtonTimeout_ = setTimeout(() => {
        const skipButton = document.createElement("button");
        skipButton.id = "skipButton";
        skipButton.textContent = "Skip Ad";
        skipButton.style.fontSize = this.scalePx(12);
        skipButton.style.position = "absolute";
        skipButton.style.bottom = "5.83%";
        skipButton.style.right = "1.38%";
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

    if (this.parameters_.isCountdownEnabled) {
      this.updateCountdown();
      this.countdownInterval_ = setInterval(this.updateCountdown.bind(this), 1000);
    }
  };

  calculateCountdown(targetDate) {
    const now = new Date();
    const target = new Date(targetDate);
    if (target < now) {
      return { months: 0, days: 0, hours: 0, minutes: 0, seconds: 0 };
    }

    let years = target.getFullYear() - now.getFullYear();
    let months = target.getMonth() - now.getMonth();
    if (months < 0) {
      years--;
      months += 12;
    }
    let days = target.getDate() - now.getDate();
    if (days < 0) {
      months--;
      days += new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
    }
    let hours = target.getHours() - now.getHours();
    if (hours < 0) {
      days--;
      hours += 24;
    }
    let minutes = target.getMinutes() - now.getMinutes();
    if (minutes < 0) {
      hours--;
      minutes += 60;
    }
    let seconds = target.getSeconds() - now.getSeconds();
    if (seconds < 0) {
      minutes--;
      seconds += 60;
    }
    months += years * 12;
    return { months, days, hours, minutes, seconds };
  }

  updateCountdown() {
    const remaining = this.calculateCountdown(this.parameters_.countdownSettings.dateTime || this.defaults_.countdownSettings.dateTime);
    let unit1, unit2, unit3, label1, label2, label3;
    if (remaining.months > 0) {
      unit1 = remaining.months;
      unit2 = remaining.days;
      unit3 = remaining.hours;
      label1 = "Months";
      label2 = "Days";
      label3 = "Hours";
    } else if (remaining.days > 0) {
      unit1 = remaining.days;
      unit2 = remaining.hours;
      unit3 = remaining.minutes;
      label1 = "Days";
      label2 = "Hours";
      label3 = "Minutes";
    } else {
      unit1 = remaining.hours;
      unit2 = remaining.minutes;
      unit3 = remaining.seconds;
      label1 = "Hours";
      label2 = "Minutes";
      label3 = "Seconds";
    }
    this.numSpans[0].textContent = String(unit1).padStart(2, "0");
    this.numSpans[1].textContent = String(unit2).padStart(2, "0");
    this.numSpans[2].textContent = String(unit3).padStart(2, "0");
    this.labelSpans[0].textContent = label1;
    this.labelSpans[1].textContent = label2;
    this.labelSpans[2].textContent = label3;
  }

  /**
   * Called when an overlay image is clicked with its specific URL.
   * @param {string} clickThrough The URL to navigate to (optional)
   * @private
   */
  adClick_(clickThrough) {
    if ("AdClickThru" in this.eventsCallbacks_) {
      // If specific URL provided, use it, otherwise use default
      const url = clickThrough || this.parameters_.defaultClickThrough || "";
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
    if (this.parameters_["preBannerTime"] > 0) {
      this.attributes_["preBannerTime"] = this.parameters_["preBannerTime"];
    }

    // Schedule the end of overlays 4 seconds before the end of the video
    if (this.videoSlot_.duration > this.attributes_["preBannerTime"]) {
      const endTime = (this.videoSlot_.duration - this.attributes_["preBannerTime"]) * 1000;
      this.carouselEndTimeout_ = setTimeout(() => {
        const leftLogoTitleContainer = document.getElementById("leftLogoTitleContainer");
        const rightCountdownContainer = document.getElementById("rightCountdownContainer");
        const bottomStripContainer = document.getElementById("bottomStripContainer");
        if (leftLogoTitleContainer && rightCountdownContainer && bottomStripContainer) {
          leftLogoTitleContainer.style.display = "none";
          rightCountdownContainer.style.display = "none";
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
    if (this.carouselStartTimeout_) {
      clearTimeout(this.carouselStartTimeout_);
    }

    if (this.carouselEndTimeout_) {
      clearTimeout(this.carouselEndTimeout_);
    }

    if (this.countdownInterval_) {
      clearInterval(this.countdownInterval_);
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
    this.log('pauseAd');
    this.videoSlot_.pause();

    // Pause the countdown
    if (this.countdownInterval_) {
      clearInterval(this.countdownInterval_);
      this.countdownInterval_ = null;
    }

    this.callEvent_('AdPaused');
  }
  /**
   * Resumes the ad.
   */
  resumeAd() {
    this.log('resumeAd');
    this.videoSlot_.play();

    // Resume the countdown
    if (this.parameters_.isCountdownEnabled && !this.countdownInterval_) {
      this.updateCountdown();
      this.countdownInterval_ = setInterval(this.updateCountdown.bind(this), 1000);
    }

    this.callEvent_('AdPlaying');
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