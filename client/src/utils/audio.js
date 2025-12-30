export const playButtonPress = () => {
    const audio = new Audio('/sounds/button_press.mp3');
    audio.volume = 0.4;
    audio.play().catch(e => console.log('Audio play failed:', e));
};
