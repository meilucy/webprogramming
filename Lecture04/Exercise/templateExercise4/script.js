function playSound(sound)
{
    console.log(`playing sound: ${sound}`);
    document.getElementById(`key${sound}audio`).play();
}

// click events
Object.values(keySoundMap).forEach(sound => {
    document.getElementById(`key${sound}`).addEventListener("click", function() {
        playSound(sound);
    });
});

// key events
document.addEventListener("keydown", function (event) {
    if (keySoundMap[event.key.toUpperCase()]) {
        playSound(keySoundMap[event.key.toUpperCase()]);
    }
});