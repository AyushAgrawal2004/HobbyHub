export const playButtonPress = () => {
    try {
        const audio = new Audio('/sounds/button_press.mp3');
        audio.volume = 0.4;
        const playPromise = audio.play();

        if (playPromise !== undefined) {
            playPromise.then(() => {
                // console.log("Audio played successfully");
            }).catch(error => {
                console.error("Audio playback failed:", error);
            });
        }
    } catch (e) {
        console.error("Audio initialization failed:", e);
    }
};
