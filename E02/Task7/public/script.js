const API_BASE = "/albums";

const albumTable = document.getElementById("albums");
const albumForm = document.getElementById("albumForm");

// Load albums from API (initial load)
async function loadAlbums() {
  try {
    const response = await fetch(API_BASE);
    const albums = await response.json();
    displayAlbums(albums);
  } catch (error) {
    console.error("Error loading albums:", error);
  }
}



async function addAlbum(albumData) {
  try {
    const response = await fetch(API_BASE, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(albumData),
    });

    if (response.ok) {
      const newAlbum = await response.json(); 
      console.log(newAlbum);
      appendAlbumToTable(newAlbum); 
    } else {
      console.error("Failed to add album");
    }
  } catch (error) {
    console.error("Error adding album:", error);
  }
}



async function deleteAlbum(id, row) {
  try {
    const response = await fetch(`${API_BASE}/${id}?debug=true`, {
      method: "DELETE",
    });

    if (response.ok) {
      row.remove(); 
    } else {
      console.error("Failed to delete album");
    }
  } catch (error) {
    console.error("Error deleting album:", error);
  }
}

function displayAlbums(albums) {
  albumTable.innerHTML = "";
  albums.forEach((album) => appendAlbumToTable(album));
}

function appendAlbumToTable(album) {
    console.log("HELLO",album)
  const row = document.createElement("tr");
  row.innerHTML = `
    <td>${album.id}</td>
    <td>${album.artist}</td>
    <td>${album.title}</td>
    <td>${album.year}</td>
    <td>${album.genre}</td>
    <td>${album.tracks}</td>
    <td>
      <button>Delete</button>
    </td>
  `;

  const deleteBtn = row.querySelector("button");
  deleteBtn.addEventListener("click", () => deleteAlbum(album.id, row));

  albumTable.appendChild(row);
}

albumForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const formData = new FormData(albumForm);
  const albumData = Object.fromEntries(formData.entries());
  albumData.year = Number(albumData.year);

  await addAlbum(albumData);
  //albumForm.reset();
});

// Initial load
loadAlbums();
