document.addEventListener('DOMContentLoaded', () => {
    let currentTrackIndex = 0;
    let isPlaying = false;
    const audio = new Audio();

    const title = document.querySelector('.title');
    const artist = document.querySelector('.artist');
    const prevButton = document.getElementById('prev');
    const playButton = document.getElementById('play');
    const nextButton = document.getElementById('next');
    const progress = document.getElementById('progress');
    const timeCount = document.querySelector('.time');
    const song_image = document.getElementById("img");
    const heart = document.querySelector(".fa-heart");
    const musicListArrow = document.querySelector(".fa-angle-up");
    const musicList = document.querySelector(".music-list");
    const closeMusicList = document.querySelector(".fa-angle-down");

    // This part should create the list items with songs and their details
    for (let index = 0; index < songs.length; index++) {
        let song = songs[index];
        
        const html = `<div class="list items" data-index="${index}"><p>${song.title}<br><span style="font-size: 15px;">${song.artist}</span></p><time style="font-size: 15px;">${song.length}</time></div>`;
        musicList.insertAdjacentHTML('beforeend', html);
    }

    // Function to load a song based on index
    function loadSong(index) {
        audio.src = songs[index].path;
        title.textContent = songs[index].title;
        artist.textContent = songs[index].artist;
        audio.load(); // Ensure the audio is loaded before playing
        song_image.src = songs[index].image;
        song_image.style.width = songs[index].width;

        if (songs[index].liked) {
            heart.classList.remove("fa-regular");
            heart.classList.add("fa-solid");
        } else {
            heart.classList.add("fa-regular");
            heart.classList.remove("fa-solid");
        }
    }

    function playSong() {
        audio.play().then(() => {
            playButton.classList.add("fa-pause");
            playButton.classList.remove("fa-play");
            song_image.classList.add("rotate");
        }).catch(error => {
            console.error('Error playing the audio:', error);
        });
        isPlaying = true;
    }

    function pauseSong() {
        audio.pause();
        playButton.classList.add("fa-play");
        playButton.classList.remove("fa-pause");
        song_image.classList.remove("rotate");
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

    function onDemandSong(index) {
        currentTrackIndex = index;
        loadSong(currentTrackIndex);
        playSong();
    }

    function likesong() {
        heart.classList.toggle("fa-regular");
        heart.classList.toggle("fa-solid");
        heart.classList.toggle("color-change");
        songs[currentTrackIndex].liked = !songs[currentTrackIndex].liked;
    }

    // Update the slider as the song plays
    audio.addEventListener('timeupdate', () => {
        if (audio.duration) {
            progress.value = (audio.currentTime / audio.duration) * 100;
        }
        let mins = Math.floor(audio.currentTime / 60);
        let secs = Math.floor(audio.currentTime % 60);
        mins = mins < 10 ? "0" + mins : mins;
        secs = secs < 10 ? "0" + secs : secs;
        timeCount.textContent = `${mins}:${secs}`;
    });

    audio.addEventListener('ended', () => {
        nextSong();
    });

    // Seek to the new position when the slider is changed
    progress.addEventListener('input', () => {
        const seekTime = (progress.value / 100) * audio.duration;
        audio.currentTime = seekTime;
    });

    heart.addEventListener('click', () => {
        likesong();
    });

    playButton.addEventListener('click', playPauseSong);
    prevButton.addEventListener('click', prevSong);
    nextButton.addEventListener('click', nextSong);

    // Change song from the music list menu
    const listItems = document.querySelectorAll(".list.items");
    listItems.forEach(item => {
        item.addEventListener('click', function() {
            const index = parseInt(this.getAttribute('data-index'), 10);
            onDemandSong(index);
        });
    });

    // Toggle music list visibility
    musicListArrow.addEventListener('click', () => {
        musicList.classList.add('show');
    });

    closeMusicList.addEventListener('click', () => {
        musicList.classList.remove('show');
    });

    // Ensure the song is loaded but not played immediately on load
    loadSong(currentTrackIndex);
});
