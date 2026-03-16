let params = new URLSearchParams(window.location.search)
let folder = params.get("folder")





let currentFolder;
let currentSong = new Audio;
let currentIndex = 0;
currentSong.volume = .3;
document.querySelector(".volume-circule").style.left = 30 + "%"
document.querySelector(".volume-seekbar-fill").style.width = 30 + "%";

let seekbarSong = document.querySelector(".name")

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


async function getSongs(folder) {
    currentFolder = folder;
    let a = await fetch(`http://127.0.0.1:5500/js/video 84 project-2/${folder}`)
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
const songByIndex = (songs, index) => {
    let song = decodeURI(songs[index]);
    currentSong.src = `${currentFolder}` + song;
    currentSong.play();
    seekbarSong.innerHTML = `<a href="#">${song.replace("/", "")}</a>`

    document.querySelector(".playing-song-name").innerHTML = `<a href="#">${song.replace("/", "")}</a>`;
}
function nextSong(songs) {
    currentIndex++;
    if (currentIndex >= songs.length) {
        currentIndex = 0
    }
    songByIndex(songs, currentIndex);
    document.querySelector("#play img").src = "svg/pause.svg"
}
function previousSong(songs) {
    currentIndex--;
    if (currentIndex < 0) {
        currentIndex = songs.length - 1;
    }
    songByIndex(songs, currentIndex);
    document.querySelector("#play img").src = "svg/pause.svg"
}

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

const playMusic = (track, pause = false) => {

    currentSong.src = `/js/video 84 project-2//${currentFolder}/` + track
    if (!pause) {
        currentSong.play()
        document.querySelector("#play img").src = "svg/pause.svg"
    }
    let song = decodeURI(track).replace("/", "");
    seekbarSong.innerHTML = `<a href="#">${song}</a>`;
    document.querySelector(".playing-song-name").innerHTML = `<a href="#">${song}</a>`
}

async function main() {
    let songs = await getSongs(`assets/${folder}`)
    playMusic(songs[0], true)
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
        e.addEventListener("click", element => {
            let song_name = e.querySelector(".song-name").dataset.song;
            playMusic(song_name)
        })
    })
    currentSong.addEventListener("timeupdate", () => {
        document.querySelector(".current-time").innerHTML = formatTime(currentSong.currentTime)
        document.querySelector(".circule").style.left = (currentSong.currentTime / currentSong.duration) * 100 + "%"
        document.querySelector(".seekbar-fill").style.width = (currentSong.currentTime / currentSong.duration) * 100 + "%"
    })
    currentSong.addEventListener("loadedmetadata", () => {
        document.querySelector(".duration").innerHTML = formatTime(currentSong.duration)
    });

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

    let seekbar = document.querySelector(".seekbar")
    seekbar.addEventListener("click", e => {

        let rect = seekbar.getBoundingClientRect()

        let percent =
            (e.clientX - rect.left) / rect.width

        currentSong.currentTime =
            percent * currentSong.duration
    })
    let volume_seekbar = document.querySelector(".volume-seekbar")
    volume_seekbar.addEventListener("click", (e) => {
        let rect = volume_seekbar.getBoundingClientRect();
        let percent = (e.clientX - rect.left) / rect.width;
        document.querySelector(".volume-circule").style.left = percent * 100 + "%";
        document.querySelector(".volume-seekbar-fill").style.width = percent * 100 + "%";
        currentSong.volume = percent;
    })

    next.addEventListener("click", () => {
        nextSong(songs)
    })
    previous.addEventListener("click", () => {
        previousSong(songs)
    })
    currentSong.addEventListener("ended", () => {
        nextSong(songs)
    })
    volumeButton.addEventListener("click", () => {
        toggleMuted();
    })
    let sidebar = document.querySelector(".sidebar");
    let container = document.querySelector(".container");
    hamburger.addEventListener("click", () => {
        sidebar.classList.toggle("active");
        container.classList.toggle("active");
    })

}
main()