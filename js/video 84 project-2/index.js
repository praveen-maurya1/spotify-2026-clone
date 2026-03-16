
// Playlist container select karna

let album = document.querySelector(".playlist")


// Main function
async function displayAlbums() {
    // Songs folder fetch karna
    let a = await fetch(`http://127.0.0.1:5500/js/video 84 project-2/assets/songs`)
    let response = await a.text();

    // Temporary div banana
    let div = document.createElement("div");
    div.innerHTML = response;
    // Folder links nikalna
    let anchors = div.getElementsByTagName("a");
    const arr = Array.from(anchors);
    for (let index = 0; index < arr.length; index++) {
        const e = arr[index];
        // Har folder check karna
        if (e.href.includes("assets/songs/")) {
            // Folder name extract karna
            let folder = e.href.split("songs/")[1];
            // Album info.json load karna
            let a = await fetch(`http://127.0.0.1:5500/js/video 84 project-2/assets/songs/${folder}/info.json`)
            let response = await a.json();
            // Album card create karna
            album.innerHTML += `<div data-folder=${folder} class="card" >
                                    <img src="assets/songs/${folder}/cover.jpg" width="200px" alt="song">
                                    <div class="card-content">
                                        <a href="#">${response.title}</a>
                                        <span><a href="#">${response.description}</a></span>
                                    </div>
                                </div>`

        }
    }
    // Album click event
    Array.from(album.getElementsByClassName("card")).forEach(element => {
        element.addEventListener("click", (item) => {
            // Folder read on click
            let folder = `songs/${item.currentTarget.dataset.folder}`
            // Playlist page open karna
            window.location.href = `playlist.html?folder=${folder}`
        })
    })
}
// Function run karna
displayAlbums();

