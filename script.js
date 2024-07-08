
const songs = [
    {
        title: "Track-1",
        path: "MP3 files/Mitti-Di-Khushboo_320(PaglaSongs).mp3",
        image: "images/Mitti-Di-Khushboo-Punjabi-2014-500x500.jpg",
        width: "280px",
        liked : false

    },
    {
        title: "Track-2",
        path: "MP3 files/Pehli-Nazar-Mein-Kaise-Jaado-Kar-Diya_320(PaglaSongs).mp3",
        image: "images/Pehli-nazar-mein.jpeg",
        width: "280px",
        liked : false
    },
    {
        title: "Track-3",
        path: "MP3 files/Raanjhanaa-Hua-Mai-Tera_320(PaglaSongs).mp3",
        image: "images/Ranjhana.jpg",
        width: "280px",
        liked : false
    }
];
let currentTrackIndex = 0;
let isPlaying = false;
const audio = new Audio();

const title = document.querySelector('.title');
const prevButton = document.getElementById('prev');
const playButton = document.getElementById('play');
const nextButton = document.getElementById('next');
const progress = document.getElementById('progress');
const timeCount = document.querySelector('.time');
const song_image = document.getElementById("img");
const heart = document.querySelector(".fa-heart");

function loadSong(index) {
    audio.src = songs[index].path;
    title.textContent = songs[index].title;
    audio.load(); // Ensure the audio is loaded before playing
    song_image.src = songs[index].image;
    song_image.style.width = songs[index].width;
    
    if (songs[index].liked) {
        heart.classList.remove("fa-regular");
        heart.classList.add("fa-solid");
    }
    else
    {
        heart.classList.add("fa-regular");
        heart.classList.remove("fa-solid");
    }
}

function playSong() {
    audio.play().then(() => {
        playButton.classList.add("fa-pause");
        playButton.classList.remove("fa-play");
    }).catch(error => {
        console.error('Error playing the audio:', error);
    });
    isPlaying = true;
}

function pauseSong() {
    audio.pause();
    playButton.classList.add("fa-play");
    playButton.classList.remove("fa-pause");
    isPlaying = false;
}

function playPauseSong() {
    if (isPlaying) {
        pauseSong();
    } else {
        playSong();
    }
}

function prevSong() {
    currentTrackIndex = (currentTrackIndex - 1 + songs.length) % songs.length;
    loadSong(currentTrackIndex);
    if (isPlaying) playSong();
}

function nextSong() {
    currentTrackIndex = (currentTrackIndex + 1) % songs.length;
    loadSong(currentTrackIndex);
    if (isPlaying) playSong();
}
function likesong(){
    heart.classList.toggle("fa-regular");
    heart.classList.toggle("fa-solid");
    songs[currentTrackIndex].liked = !songs[currentTrackIndex].liked;
}

// Update the slider as the song plays
audio.addEventListener('timeupdate', () => {
    if (audio.duration) {
        progress.value = (audio.currentTime / audio.duration) * 100;
    }
    let mins = Math.trunc(audio.currentTime/60);
    mins = mins<=9 ? "0" + mins : mins;
    let secs = Math.trunc(audio.currentTime%60);
    secs = secs<=9 ? "0" + secs : secs;
    timeCount.textContent = String(mins) + ":" + String(secs);
    // console.log(typeof(audio.duration));
});

// Seek to the new position when the slider is changed
progress.addEventListener('input', () => {
    const seekTime = (progress.value / 100) * audio.duration;
    audio.currentTime = seekTime;
});

heart.addEventListener('click' , ()=> {
    likesong();
});

playButton.addEventListener('click', playPauseSong);
prevButton.addEventListener('click', prevSong);
nextButton.addEventListener('click', nextSong);

// // Ensure the song is loaded but not played immediately on load
loadSong(currentTrackIndex);
