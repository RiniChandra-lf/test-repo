(function() {
    console.log("✅ Shrink/Grow script injected into the parent page.");

    function getVideoSrcFromAdParameters() {
        try {
            const vastParamsTag = document.querySelector("AdParameters");
            if (!vastParamsTag) {
                console.log("❌ No AdParameters found.");
                return null;
            }

            const vastParams = JSON.parse(vastParamsTag.textContent);
            
            // Check if `videos` array exists and has a valid URL
            if (vastParams.videos && vastParams.videos.length > 0 && vastParams.videos[0].url) {
                return vastParams.videos[0].url;
            }

            console.log("❌ No valid video URL found in AdParameters.");
            return null;
        } catch (error) {
            console.error("❌ Error parsing AdParameters:", error);
            return null;
        }
    }

    function applyShrinkEffect(videoSrc) {
        const adVideo = document.querySelector(`video[src="${videoSrc}"]`);

        if (adVideo) {
            console.log("✅ Found ad video!", adVideo);

            // Shrink at 4 seconds
            setTimeout(() => {
                console.log("🔻 Shrinking ad video...");
                adVideo.style.transition = "transform 1s ease-in-out";
                adVideo.style.transform = "scale(0.5)";
            }, 4000);

            // Grow back when 5 seconds remain
            adVideo.addEventListener("timeupdate", () => {
                if (adVideo.duration - adVideo.currentTime <= 5) {
                    console.log("🔺 Growing ad video back...");
                    adVideo.style.transform = "scale(1)";
                }
            });
        } else {
            console.log("❌ Ad video not found! Retrying...");
            setTimeout(() => applyShrinkEffect(videoSrc), 1000); // Retry every 1 second
        }
    }

    // Extract videoSrc from AdParameters
    const videoSrc = getVideoSrcFromAdParameters();
    if (videoSrc) {
        console.log("✅ Using videoSrc from AdParameters:", videoSrc);
        setTimeout(() => applyShrinkEffect(videoSrc), 2000); // Wait for ad to load
    }
})();
