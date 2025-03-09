const sounds = {
    hitSound: new Audio("./sound/hitObstacle2.mp3"),
    hitObstacleSound: new Audio("./sound/ball.wav"),
    hitLavaSound: new Audio("./sound/lava.mp3"),
};

const playSound = (sound, volume) => {
    sound.currentTime = 0.0;
    sound.volume = volume;
    sound.play();
};

const throttle = (func, ms) => {
    let isThrottled = false,
        savedArgs,
        savedThis;

    function wrapper() {
        if (isThrottled) {
            savedArgs = arguments;
            savedThis = this;
            return;
        }

        func.apply(this, arguments);

        isThrottled = true;

        setTimeout(function () {
            isThrottled = false;
            if (savedArgs) {
                wrapper.apply(savedThis, savedArgs);
                savedArgs = savedThis = null;
            }
        }, ms);
    }

    return wrapper;
};

const throttledPlaySound = throttle((sound, volume) => playSound(sound, volume), 200);

export const playHitObstacleSound = (strength) => {
    const startVolume = 0.05;
    const volume = Math.min(1, startVolume * strength);
    throttledPlaySound(sounds.hitObstacleSound, volume);
};

export const playHitSound = (strength) => {
    const startVolume = 0.02;
    const volume = Math.min(1, startVolume * strength);
    throttledPlaySound(sounds.hitSound, volume);
};

export const playLavaSound = () => {
    throttledPlaySound(sounds.hitLavaSound, 0.2);
};

export const stopAllSounds = () => {
    Object.values(sounds).forEach((sound) => {
        sound.pause();
        sound.currentTime = 0.0;
    });
};
