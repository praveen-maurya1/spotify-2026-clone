
//URL ke query parameters read karta hai.

let params = new URLSearchParams(window.location.search)

let folder = params.get("folder")

// Global variables

let currentFolder;
let currentSong = new Audio;
let currentIndex = 0;

// Default volume set karna
currentSong.volume = .3;

// Volume UI set karna
document.querySelector(".volume-circule").style.left = 30 + "%"
document.querySelector(".volume-seekbar-fill").style.width = 30 + "%";

// Seekbar me song name
let seekbarSong = document.querySelector(".name")

// Time format function
function formatTime(seconds) {
    let min = Math.floor(seconds / 60);
    let sec = Math.floor(seconds % 60);

    if (sec < 10) {
        sec = "0" + sec;
    }
    if (min < 10) {
        min = "0" + min
    }
    return `${min}:${sec}`;
}

// Songs fetch karna (important)

async function getSongs(folder) {
    currentFolder = folder;
    let a = await fetch(`http://127.0.0.1:5500/js/project_2/${folder}`)
    let response = await a.text();
    let div = document.createElement("div");
    div.innerHTML = response;
    let as = div.getElementsByTagName("a");
    let songs = []
    for (let index = 0; index < as.length; index++) {
        const element = as[index];
        if (element.href.endsWith(".m4a")) {
            songs.push(element.href.split(`${folder}`)[1])
        }
    }
    return songs;
}
// Index se song play karna

const songByIndex = (songs, index) => {
    let song = decodeURI(songs[index]);
    currentSong.src = `${currentFolder}` + song;
    currentSong.play();
    seekbarSong.innerHTML = `<a href="#">${song.replace("/", "")}</a>`

    document.querySelector(".playing-song-name").innerHTML = `<a href="#">${song.replace("/", "")}</a>`;
}
// Next song function

function nextSong(songs) {
    currentIndex++;
    if (currentIndex >= songs.length) {
        currentIndex = 0
    }
    songByIndex(songs, currentIndex);
    document.querySelector("#play img").src = "svg/pause.svg"
}
// Previous song function

function previousSong(songs) {
    currentIndex--;
    if (currentIndex < 0) {
        currentIndex = songs.length - 1;
    }
    songByIndex(songs, currentIndex);
    document.querySelector("#play img").src = "svg/pause.svg"
}
// Mute toggle

function toggleMuted() {
    currentSong.muted = !currentSong.muted;
    let mutebutton = document.querySelector("#volumeButton img");

    if (currentSong.muted) {
        mutebutton.src = "svg/mute.svg";
    }
    else {
        mutebutton.src = "svg/volume.svg";
    }

}
// Main play function (very important)
const playMusic = (track, pause = false) => {

    currentSong.src = `/js/project_2//${currentFolder}/` + track
    if (!pause) {
        currentSong.play()
        document.querySelector("#play img").src = "svg/pause.svg"
    }
    let song = decodeURI(track).replace("/", "");
    seekbarSong.innerHTML = `<a href="#">${song}</a>`;
    document.querySelector(".playing-song-name").innerHTML = `<a href="#">${song}</a>`
}

// Main function --->> Yeh pure player ko initialize karta hai.

async function main() {
    // Songs load
    let songs = await getSongs(`assets/${folder}`)
    // First song load but play nahi
    playMusic(songs[0], true)
    // Playlist UI banana
    let songAdd = document.querySelector(".song-list-card-container")
    for (const song of songs) {
        songAdd.innerHTML += ` <div class="song-list-card flex-space-between">
        <div class="flex-start play-song">
                                <div class="song-list-img flex-center">
                                    <img src="assets/songs_img/aura.jpg" alt="">
                                </div>
                                <div class="song-name playlist-song-name" data-song="${song}">
                                ${decodeURI(song).replace("/", "")}
                                </div>
                            </div>
                            <div class="song-duration">
                                00
                            </div>
                        </div>`;
    }

    const cards = document.querySelectorAll(".song-list-card");
    // Duration calculate karna -->> Sirf metadata load karta hai → taaki song duration mil sake
    cards.forEach((card, i) => {

        const song = songs[i];

        const audio = new Audio(`${currentFolder}/` + song);
        audio.preload = "metadata";

        const durationEl = card.querySelector(".song-duration");

        audio.addEventListener("loadedmetadata", () => {
            durationEl.textContent = formatTime(audio.duration);
        });

        audio.load();

    });


    Array.from(document.querySelector(".song-list-card-container").getElementsByClassName("song-list-card")).forEach(e => {
        //    Song click event
        e.addEventListener("click", element => {
            let song_name = e.querySelector(".song-name").dataset.song;
            playMusic(song_name)
        })
    })
    // Seekbar update
    currentSong.addEventListener("timeupdate", () => {
        document.querySelector(".current-time").innerHTML = formatTime(currentSong.currentTime)
        document.querySelector(".circule").style.left = (currentSong.currentTime / currentSong.duration) * 100 + "%"
        document.querySelector(".seekbar-fill").style.width = (currentSong.currentTime / currentSong.duration) * 100 + "%"
    })
    //Duration show--->> Song load hone pe total duration show karta hai.
    currentSong.addEventListener("loadedmetadata", () => {
        document.querySelector(".duration").innerHTML = formatTime(currentSong.duration)
    });
    // Play / Pause button
    play.addEventListener("click", () => {
        if (currentSong.paused) {
            currentSong.play()
            document.querySelector("#play img").src = "svg/pause.svg"
        }
        else {
            currentSong.pause()
            document.querySelector("#play img").src = "svg/play.svg"
        }
    })
    // Seekbar click
    let seekbar = document.querySelector(".seekbar")
    seekbar.addEventListener("click", e => {

        let rect = seekbar.getBoundingClientRect()

        let percent =
            (e.clientX - rect.left) / rect.width

        currentSong.currentTime =
            percent * currentSong.duration
    })

    // Volume seekbar
    let volume_seekbar = document.querySelector(".volume-seekbar")
    volume_seekbar.addEventListener("click", (e) => {
        let rect = volume_seekbar.getBoundingClientRect();
        let percent = (e.clientX - rect.left) / rect.width;
        document.querySelector(".volume-circule").style.left = percent * 100 + "%";
        document.querySelector(".volume-seekbar-fill").style.width = percent * 100 + "%";
        currentSong.volume = percent;
    })
    // Next / Previous buttons
    next.addEventListener("click", () => {
        nextSong(songs)
    })
    previous.addEventListener("click", () => {
        previousSong(songs)
    })
    // Auto next song
    currentSong.addEventListener("ended", () => {
        nextSong(songs)
    })
    // Mute button
    volumeButton.addEventListener("click", () => {
        toggleMuted();
    })
    // Sidebar toggle

    let sidebar = document.querySelector(".sidebar");
    let container = document.querySelector(".container");
    hamburger.addEventListener("click", () => {
        sidebar.classList.toggle("active");
        container.classList.toggle("active");
    })

}
main()