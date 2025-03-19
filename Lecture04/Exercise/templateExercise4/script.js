let current_song_counter = 0;
let queued_sounds = [];

function on_loaded() {
    console.log("on_loaded called");
    let key_data_obj;
    fetch("keys.json") // spawn keys
        .then(response => response.json())
        .then(json_data => {
            key_data_obj = json_data;
            console.log(key_data_obj);

            for (let index = 0; index < key_data_obj.keys.length; index++) {
                let element = document.createElement('div');
                element.className = "key btn btn-light m-1 rounded border border-dark";

                let key_data = key_data_obj.keys[index];
                element.innerHTML = `${key_data.note}`;

                element.addEventListener("click", function () {
                    play_sound(key_data.note, true);
                });

                document.addEventListener("keydown", function (event) {
                    if (event.key.toUpperCase() == key_data.keyboard_key) {
                        play_sound(key_data.note, true);
                    }
                });

                document.getElementById("piano").appendChild(element);
            }
        })
        .catch(error => console.error('Error:', error));

    let song_data_obj;
    fetch("song.json") // spawn buttons for songs
        .then(response => response.json())
        .then(json_data => {
            song_data_obj = json_data;
            console.log(song_data_obj);

            for (let index = 0; index < song_data_obj.songs.length; index++) {
                let element = document.createElement("div");
                element.className = "btn btn-light m-1 rounded border border-dark";

                let song_data = song_data_obj.songs[index];
                element.innerHTML = song_data.title;

                element.addEventListener("click", function () {
                    console.log("Now playing: " + song_data.title);
                    document.getElementById(`note-line`).innerHTML = "."; // clear note line, on click
                    current_song_counter++;
                    let temp_current_song_counter = current_song_counter;
                    let time_offset = 0;

                    for (let notes_row_idx = 0; notes_row_idx < song_data.notes.length; notes_row_idx++) {
                        let notes = song_data.notes[notes_row_idx].split(" ");
                        for (let note_idx = 0; note_idx < notes.length; note_idx++) {

                            let timeout_id = setTimeout(() => {
                                play_sound(notes[note_idx], true, true, temp_current_song_counter);
                            }, time_offset);
                            queued_sounds.push(timeout_id); // 

                            time_offset += 600; // wait between notes
                        }
                        time_offset += 400; // wait extra time between rows
                    }
                });
                document.getElementById('buttons').appendChild(element);
            }
        })
        .catch(error => console.error('Error:', error));
}


function play_sound(key, log = false, part_of_song = false, song = 0) {
    if (part_of_song && song != current_song_counter) // so not more than one song is played at the same time
        return;

    if (log) {
        console.log(`Playing sound: ${key}`);
        document.getElementById(`note-line`).innerHTML += " " + key;
    }

    new Audio(`./sounds/${key}.mp3`).play()
        .catch(error => console.error(`Sound not found ${key}:`, error));
}

function reset_page() {
    console.log("reset_page called");

    document.getElementById('buttons').innerHTML = "";
    document.getElementById('piano').innerHTML = "";
    document.getElementById(`note-line`).innerHTML = "";

    clear_sounds();
    current_song_counter = 0;
    queued_sounds = [];
    on_loaded();
}

function clear_sounds() { // stop all sounds
    console.log("clear_sounds called");
    document.getElementById(`note-line`).innerHTML = ".";
    queued_sounds.forEach(id => {
        clearTimeout(id);
    });
    queued_sounds = [];
}
