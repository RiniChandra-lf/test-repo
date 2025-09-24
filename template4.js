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
      skippableState: true, // Skippable state of the ad.
      volume: 1.0, // Volume of the ad.
      countdownStartDelay: 4000, // Start countdown after 4 seconds
      countdownEndEarly: 4, // End countdown x seconds before ad ends
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
      }
    };

    this.numSpans = [];
    this.labelSpans = [];
    this.countdownInterval_ = null;
    this.countdownTimeout_ = null;
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

  handshakeVersion(version) {
    return "2.0";
  }

  initAd(width, height, viewMode, desiredBitrate, creativeData, environmentVars) {
    this.attributes_["width"] = width;
    this.attributes_["height"] = height;
    this.attributes_["viewMode"] = viewMode;
    this.attributes_["desiredBitrate"] = desiredBitrate;

    this.slot_ = environmentVars.slot;
    this.videoSlot_ = environmentVars.videoSlot;

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

  updateVideoPlayerSize_() {
    this.videoSlot_.setAttribute("width", this.attributes_["width"]);
    this.videoSlot_.setAttribute("height", this.attributes_["height"]);
  }

  scalePx(val) {
    return (val * this.scale_).toFixed(2) + 'px';
  }

  startAd = function () {
    this.log("Starting ad");

    const date = new Date();
    this.startTime_ = date.getTime();

    const container = document.createElement("div");
    container.style.display = "block";
    container.style.position = "absolute";
    container.style.height = "100%";
    container.style.width = "100%";
    container.style.right = "0%";
    this.slot_.appendChild(container);

    // Create countdown container (replacing carousel)
    const countdownContainer = document.createElement("div");
    countdownContainer.id = "countdownContainer";
    countdownContainer.style.display = "none";
    countdownContainer.style.position = "absolute";
    countdownContainer.style.right = "0";
    countdownContainer.style.bottom = "9%"; // Adjusted to account for bottom strip height
    countdownContainer.style.height = "69%";
    countdownContainer.style.width = "32%";
    countdownContainer.style.overflow = "hidden";
    countdownContainer.style.padding = "0"; // Remove clearance
    if (this.parameters_.isCountdownEnabled) {
      countdownContainer.style.background = `linear-gradient(to bottom right, ${this.parameters_.countdownSettings.gradient.startColor || this.defaults_.countdownSettings.gradient.startColor}, ${this.parameters_.countdownSettings.gradient.endColor || this.defaults_.countdownSettings.gradient.endColor})`;
    }
    container.appendChild(countdownContainer);

    // Create bottom strip with two parts
    const bottomStripContainer = document.createElement("div");
    bottomStripContainer.id = "bottomStripContainer";
    bottomStripContainer.style.display = "none";
    bottomStripContainer.style.position = "absolute";
    bottomStripContainer.style.bottom = "0";
    bottomStripContainer.style.width = "100%";
    bottomStripContainer.style.height = "9%";
    container.appendChild(bottomStripContainer);

    // Left part - address container
    const leftStrip = document.createElement("div");
    leftStrip.style.backgroundColor = this.parameters_.addressBackgroundColor || this.defaults_.addressBackgroundColor;
    leftStrip.style.flex = "1";
    leftStrip.style.display = "flex";
    leftStrip.style.justifyContent = "left";
    leftStrip.style.alignItems = "center";
    bottomStripContainer.appendChild(leftStrip);

    const address = document.createElement("div");
    address.style.color = this.parameters_.addressColor || this.defaults_.addressColor;
    address.style.padding = `0 ${this.scalePx(10)}`;
    address.style.fontSize = this.scalePx(this.parameters_.addressFontSize) || this.scalePx(this.defaults_.addressFontSize);
    address.style.fontWeight = this.getFontWeight_(this.parameters_.addressFontStyle || this.defaults_.addressFontStyle);
    address.style.letterSpacing = this.scalePx(1);
    address.style.fontFamily = this.getFallbackFont_(this.parameters_.addressFont || this.defaults_.addressFont);
    address.textContent = this.parameters_.address || this.defaults_.address;
    leftStrip.appendChild(address);

    // Right part - website URL container
    const rightStrip = document.createElement("div");
    rightStrip.style.backgroundColor = this.parameters_.websiteBackgroundColor || this.defaults_.websiteBackgroundColor;
    rightStrip.style.flex = "0 0 32%";
    rightStrip.style.display = "flex";
    rightStrip.style.justifyContent = "center";
    rightStrip.style.alignItems = "center";
    bottomStripContainer.appendChild(rightStrip);

    const websiteURL = document.createElement("div");
    websiteURL.style.color = this.parameters_.websiteColor || this.defaults_.websiteColor;
    websiteURL.style.padding = `0 ${this.scalePx(8)}`;
    websiteURL.style.fontSize = this.scalePx(this.parameters_.websiteFontSize) || this.scalePx(this.defaults_.websiteFontSize);
    websiteURL.style.fontWeight = this.getFontWeight_(this.parameters_.websiteFontStyle || this.defaults_.websiteFontStyle);
    websiteURL.style.letterSpacing = this.scalePx(1);
    websiteURL.style.fontFamily = this.getFallbackFont_(this.parameters_.websiteFont || this.defaults_.websiteFont);
    websiteURL.textContent = this.parameters_.website || this.defaults_.website;
    rightStrip.appendChild(websiteURL);

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

    const logoImg = document.createElement("img");
    logoImg.src = this.parameters_.bottomImageUrl || this.defaults_.bottomImageUrl;
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
    titleContainer.style.backgroundColor = this.parameters_.topTitleBackgroundColor || this.defaults_.topTitleBackgroundColor;
    topLogoTitleContainer.appendChild(titleContainer);

    const topTitle = document.createElement("div");
    topTitle.style.textAlign = "center";
    topTitle.style.color = this.parameters_.topTitleColor || this.defaults_.topTitleColor;
    topTitle.style.fontSize = this.scalePx(this.parameters_.topTitleFontSize) || this.scalePx(this.defaults_.topTitleFontSize);
    topTitle.style.fontWeight = this.getFontWeight_(this.parameters_.topTitleFontStyle || this.defaults_.topTitleFontStyle);
    topTitle.style.fontFamily = this.getFallbackFont_(this.parameters_.topTitleFont || this.defaults_.topTitleFont);
    topTitle.textContent = this.parameters_.topTitle || this.defaults_.topTitle;
    titleContainer.appendChild(topTitle);

    // Countdown display with banner-like digits
    if (this.parameters_.isCountdownEnabled) {
      const countdownDisplay = document.createElement("div");
      countdownDisplay.style.display = "flex";
      countdownDisplay.style.flexDirection = "column";
      countdownDisplay.style.justifyContent = "center";
      countdownDisplay.style.alignItems = "center";
      countdownDisplay.style.height = "100%";
      countdownDisplay.style.color = this.parameters_.countdownSettings.description.font_color || this.defaults_.countdownSettings.description.font_color;
      countdownDisplay.style.fontFamily = this.getFallbackFont_(this.parameters_.countdownSettings.description.font_family || this.defaults_.countdownSettings.description.font_family);
      countdownDisplay.style.fontSize = this.scalePx(this.parameters_.countdownSettings.description.font_size) || this.scalePx(this.defaults_.countdownSettings.description.font_size);
      countdownDisplay.style.fontWeight = this.getFontWeight_(this.parameters_.countdownSettings.description.font_style || this.defaults_.countdownSettings.description.font_style);
      countdownContainer.appendChild(countdownDisplay);

      const descriptionText = document.createElement("div");
      descriptionText.style.marginBottom = this.scalePx(20);
      descriptionText.textContent = this.parameters_.countdownSettings.description.text || this.defaults_.countdownSettings.description.text;
      descriptionText.style.textAlign = "center";
      descriptionText.style.padding = `0 ${this.scalePx(1.3 * this.baseWidth_ / 100)}`; // 1.3% of screen width on either side
      descriptionText.style.wordBreak = "break-word"; // Allows text to break when longer
      descriptionText.style.textJustify = "center"; // Center justification for broken text
      countdownDisplay.appendChild(descriptionText);

      const timerDisplay = document.createElement("div");
      timerDisplay.style.display = "flex";
      timerDisplay.style.alignItems = "center";
      timerDisplay.style.gap = this.scalePx(5);
      countdownDisplay.appendChild(timerDisplay);

      const descFontSize = parseInt(this.parameters_.countdownSettings.description.font_size || this.defaults_.countdownSettings.description.font_size);
      const numFontSize = this.scalePx(Math.round(descFontSize * 1.333));
      const labelFontSize = this.scalePx(Math.round(descFontSize * 0.5));

      this.numSpans = [];
      this.labelSpans = [];

      const startColor = this.parameters_.countdownSettings.gradient.startColor || this.defaults_.countdownSettings.gradient.startColor;
    const endColor = this.parameters_.countdownSettings.gradient.endColor || this.defaults_.countdownSettings.gradient.endColor;
    const isWhiteGradient = (startColor.toLowerCase() === "white" || startColor.toLowerCase() === "#ffffff") && 
                           (endColor.toLowerCase() === "white" || endColor.toLowerCase() === "#ffffff");
    const numSpanBackground = isWhiteGradient ? "rgba(242, 242, 242, 0.8)" : "rgba(255, 255, 255, 0.5)";

      for (let i = 0; i < 3; i++) {
        const unitDiv = document.createElement("div");
        unitDiv.style.display = "flex";
        unitDiv.style.flexDirection = "column";
        unitDiv.style.alignItems = "center";

        const numSpan = document.createElement("span");
        numSpan.style.fontSize = numFontSize;
        numSpan.style.fontWeight = "bold";
        numSpan.style.marginBottom = this.scalePx(5);

        numSpan.style.backgroundColor = numSpanBackground // Banner-like background
        numSpan.style.padding = `${this.scalePx(5)} ${this.scalePx(10)}`; // Padding for banner effect
        numSpan.style.borderRadius = this.scalePx(5); // Rounded corners for banner
        numSpan.style.display = "inline-block"; // Ensure proper padding and background
        numSpan.style.fontFamily = this.getFallbackFont_('Antonio, sans-serif');
        numSpan.textContent = "00";
        unitDiv.appendChild(numSpan);
        this.numSpans.push(numSpan);

        const labelSpan = document.createElement("span");
        labelSpan.style.fontSize = labelFontSize;
        labelSpan.style.fontFamily = this.getFallbackFont_('Antonio, sans-serif');
        labelSpan.textContent = i === 0 ? "MONTHS" : i === 1 ? "DAYS" : "HOURS"; // Simplified labels for demo
        unitDiv.appendChild(labelSpan);
        this.labelSpans.push(labelSpan);

        timerDisplay.appendChild(unitDiv);

        if (i < 2) {
          const colonSpan = document.createElement("span");
          colonSpan.textContent = ":";
          colonSpan.style.fontSize = numFontSize;
          colonSpan.style.fontWeight = "bold";
          timerDisplay.appendChild(colonSpan);
        }
      }
    }

    // Add CSS animation styles
    const styleEl = document.createElement("style");
    styleEl.textContent = `
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        .fade-in {
          animation: fadeIn 0.5s forwards;
        }
      `;
    document.head.appendChild(styleEl);

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

    // Schedule the start of countdown and bottom strip after the delay
    this.countdownTimeout_ = setTimeout(() => {
      const countdownContainer = document.getElementById("countdownContainer");
      const topLogoTitleContainer = document.getElementById("topLogoTitleContainer");
      const bottomStripContainer = document.getElementById("bottomStripContainer");
      if (countdownContainer && topLogoTitleContainer && bottomStripContainer) {
        countdownContainer.style.display = "block";
        topLogoTitleContainer.style.display = "flex";
        bottomStripContainer.style.display = "flex";
        countdownContainer.classList.add("fade-in");
        setTimeout(() => {
          countdownContainer.classList.remove("fade-in");
        }, 500);
      }
    }, this.parameters_["countdownStartDelay"] * 1000 || this.attributes_["countdownStartDelay"]);

    // Create a Skip Ad button
    if (this.parameters_["isSkippable"]) {
      this.skipButtonTimeout_ = setTimeout(() => {
        const skipButton = document.createElement("button");
        skipButton.id = "skipButton";
        skipButton.textContent = "Skip Ad";
        skipButton.style.fontSize = this.scalePx(12);
        skipButton.style.position = "absolute";
        skipButton.style.bottom = `${this.scalePx(24)}`;
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
      }, this.skipOffsetSeconds_ * 1000);
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
    const remaining = this.calculateCountdown(this.parameters_.countdownSettings.dateTime);
    let unit1, unit2, unit3, label1, label2, label3;
    if (remaining.months > 0) {
      unit1 = remaining.months;
      unit2 = remaining.days;
      unit3 = remaining.hours;
      label1 = "MONTHS";
      label2 = "DAYS";
      label3 = "HOURS";
    } else if (remaining.days > 0) {
      unit1 = remaining.days;
      unit2 = remaining.hours;
      unit3 = remaining.minutes;
      label1 = "DAYS";
      label2 = "HOURS";
      label3 = "MINUTES";
    } else {
      unit1 = remaining.hours;
      unit2 = remaining.minutes;
      unit3 = remaining.seconds;
      label1 = "HOURS";
      label2 = "MINUTES";
      label3 = "SECONDS";
    }
    this.numSpans[0].textContent = String(unit1).padStart(2, "0");
    this.numSpans[1].textContent = String(unit2).padStart(2, "0");
    this.numSpans[2].textContent = String(unit3).padStart(2, "0");
    this.labelSpans[0].textContent = label1;
    this.labelSpans[1].textContent = label2;
    this.labelSpans[2].textContent = label3;
  }

  adClick_(clickThrough) {
    if ("AdClickThru" in this.eventsCallbacks_) {
      const url = clickThrough || this.parameters_.defaultClickThrough || "";
      this.eventsCallbacks_["AdClickThru"](url, "0", true);
    }
  }

  loadedMetadata_() {
    this.attributes_["duration"] = this.videoSlot_.duration;
    this.callEvent_("AdDurationChange");

    /*if (this.videoSlot_.duration > this.attributes_["countdownEndEarly"]) {
      const endTime = (this.videoSlot_.duration - this.attributes_["countdownEndEarly"]) * 1000;
      this.carouselEndTimeout_ = setTimeout(() => {
        if (this.countdownInterval_) {
          clearInterval(this.countdownInterval_);
          this.countdownInterval_ = null;
        }

        const countdownContainer = document.getElementById("countdownContainer");
        const topLogoTitleContainer = document.getElementById("topLogoTitleContainer");
        const bottomStripContainer = document.getElementById("bottomStripContainer");
        if (countdownContainer && topLogoTitleContainer && bottomStripContainer) {
          countdownContainer.style.display = "none";
          topLogoTitleContainer.style.display = "none";
          bottomStripContainer.style.display = "none";
        }
      }, endTime);
    }*/
  }

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

  stopAd() {
    this.log("Stopping ad");

    if (this.countdownInterval_) {
      clearInterval(this.countdownInterval_);
    }

    if (this.countdownTimeout_) {
      clearTimeout(this.countdownTimeout_);
    }

    if (this.carouselEndTimeout_) {
      clearTimeout(this.carouselEndTimeout_);
    }

    if (this.skipButtonTimeout_) {
      clearTimeout(this.skipButtonTimeout_);
    }

    this.callEvent_("AdStopped");
    const callback = this.callEvent_.bind(this);
    setTimeout(callback, 75, ["AdStopped"]);
  }

  resizeAd(width, height, viewMode) {
    this.log("resizeAd " + width + "x" + height + " " + viewMode);
    this.attributes_["width"] = width;
    this.attributes_["height"] = height;
    this.attributes_["viewMode"] = viewMode;
    this.updateVideoPlayerSize_();
    this.callEvent_("AdSizeChange");
  }

  pauseAd() {
    this.log("pauseAd");
    this.videoSlot_.pause();
    if (this.countdownInterval_) {
      clearInterval(this.countdownInterval_);
      this.countdownInterval_ = null;
    }
    this.callEvent_("AdPaused");
  }

  resumeAd() {
    this.log("resumeAd");
    this.videoSlot_.play();
    if (!this.countdownInterval_ && this.parameters_.isCountdownEnabled) {
      this.countdownInterval_ = setInterval(this.updateCountdown.bind(this), 1000);
    }
    this.callEvent_("AdPlaying");
  }

  expandAd() {
    this.log("expandAd");
    this.attributes_["expanded"] = true;
    this.callEvent_("AdExpanded");
  }

  collapseAd() {
    this.log("collapseAd");
    this.attributes_["expanded"] = false;
  }

  skipAd() {
    this.log("skipAd");
    if (this.attributes_["skippableState"]) {
      this.callEvent_("AdSkipped");
    }
  }

  subscribe(callback, eventName, context) {
    this.log("Subscribe " + eventName);
    this.eventsCallbacks_[eventName] = callback.bind(context);
  }

  unsubscribe(eventName) {
    this.log("unsubscribe " + eventName);
    this.eventsCallbacks_[eventName] = null;
  }

  getAdLinear() {
    return this.attributes_["linear"];
  }

  getAdWidth() {
    return this.attributes_["width"];
  }

  getAdHeight() {
    return this.attributes_["height"];
  }

  getAdExpanded() {
    this.log("getAdExpanded");
    return this.attributes_["expanded"];
  }

  getAdSkippableState() {
    this.log("getAdSkippableState");
    return this.attributes_["skippableState"];
  }

  getAdRemainingTime() {
    return this.attributes_["remainingTime"];
  }

  getAdDuration() {
    return this.attributes_["duration"];
  }

  getAdVolume() {
    this.log("getAdVolume");
    return this.attributes_["volume"];
  }

  setAdVolume(value) {
    this.attributes_["volume"] = value;
    this.log("setAdVolume " + value);
    this.callEvent_("AdVolumeChange");
  }

  getAdCompanions() {
    return this.attributes_["companions"];
  }

  getAdIcons() {
    return this.attributes_["icons"];
  }

  log(message) {
    console.log(message);
  }

  callEvent_(eventType) {
    if (eventType in this.eventsCallbacks_) {
      this.eventsCallbacks_[eventType]();
    }
  }
};

var getVPAIDAd = function () {
  return new VpaidNonLinear();
};