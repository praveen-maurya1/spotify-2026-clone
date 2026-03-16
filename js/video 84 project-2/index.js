let album = document.querySelector(".playlist")



async function displayAlbums() {
    let a = await fetch(`http://127.0.0.1:5500/js/video 84 project-2/assets/songs`)
    let response = await a.text();
    let div = document.createElement("div");
    div.innerHTML = response;
    let anchors = div.getElementsByTagName("a");
    const arr = Array.from(anchors);
    for (let index = 0; index < arr.length; index++) {
        const e = arr[index];
        if (e.href.includes("assets/songs/")) {
            let folder = e.href.split("songs/")[1];
            let a = await fetch(`http://127.0.0.1:5500/js/video 84 project-2/assets/songs/${folder}/info.json`)
            let response = await a.json();
            album.innerHTML += `<div data-folder=${folder} class="card" >
                                    <img src="assets/songs/${folder}/cover.jpg" width="200px" alt="song">
                                    <div class="card-content">
                                        <a href="#">${response.title}</a>
                                        <span><a href="#">${response.description}</a></span>
                                    </div>
                                </div>`

        }
    }

    Array.from(album.getElementsByClassName("card")).forEach(element => {
        element.addEventListener("click", (item) => {
            let folder = `songs/${item.currentTarget.dataset.folder}`
            window.location.href = `playlist.html?folder=${folder}`
        })
    })
}

displayAlbums();

