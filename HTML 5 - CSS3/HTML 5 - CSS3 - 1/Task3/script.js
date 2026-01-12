let audioTag = document.getElementById("myAudio");
let timRange = document.getElementById("timeRange");
let img = document.getElementById("audioImg");
let volumeRange = document.getElementById("volumeRange");


console.log(audioTag);
console.log(timRange);


audioTag.addEventListener("loadedmetadata", function () {
    timRange.max = audioTag.duration
})


audioTag.addEventListener("timeupdate", function () {
    timRange.value = audioTag.currentTime;
})


timRange.addEventListener("input", function () {
    audioTag.currentTime = timRange.value;
})

volumeRange.addEventListener("input", function () {
    audioTag.volume = volumeRange.value;
})

function playAudio() {
    audioTag.play()
}
function pauseAudio() {
    audioTag.pause()
}

function stopAudio() {
    audioTag.pause();
    audioTag.currentTime = 0;
}

function changeAudio(newAudio, newImg) {
    audioTag.src = newAudio;
    img.src = newImg;
    audioTag.load();
    stopAudio();
    playAudio();
}