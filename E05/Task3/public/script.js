/* eslint-disable */
const API_BASE = '/albums'

const albumTable = document.getElementById('albums')
const albumForm = document.getElementById('addAlbumForm')
const sortBtn = document.getElementById('sortBtn')
const sortField = document.getElementById('sortField')


async function loadAlbums(sort = '') {
  try {
    const url = sort ? `${API_BASE}?sort=${sort}` : API_BASE
    const response = await fetch(url)
    const albums = await response.json()
    displayAlbums(albums)
  } catch (err) {
    console.error('Error loading albums:', err)
    showErrors(['Network error while loading albums'])
  }
}

function showErrors(errors = []) {
  const container = document.getElementById('error-container')

  container.innerHTML = errors
    .map((error) => `<span class="error">${error}</span>`)
    .join('')
}

async function addAlbum(albumData) {
  try {
    const response = await fetch(API_BASE, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(albumData),
    })

    if (!response.ok) {
      const data = await response.json()
      showErrors(data.errors || [data.error] || ['Failed to add album'])
      return
    }

    await loadAlbums(sortField.value)
  } catch (error) {
    console.error('Error adding album:', error)
  }
}

async function deleteAlbum(id, row) {
  try {
    const response = await fetch(`${API_BASE}/${id}?debug=true`, {
      method: 'DELETE',
    })

    if (response.ok) {
      row.remove()
    } else {
      console.error('Failed to delete album')
    }
  } catch (error) {
    console.error('Error deleting album:', error)
  }
}

function displayAlbums(albums) {
  albumTable.innerHTML = ''
  albums.forEach((album) => appendAlbumToTable(album))
}

function appendAlbumToTable(album) {
  const row = document.createElement('tr')
  row.innerHTML = `
    <td>${album._id}</td>
    <td>${album.artist}</td>
    <td>${album.title}</td>
    <td>${album.year}</td>
    <td>${album.genre}</td>
    <td>${album.tracks}</td>
    <td>
      <button>Delete</button>
    </td>
  `

  const deleteBtn = row.querySelector('button')
  deleteBtn.addEventListener('click', () => deleteAlbum(album._id, row))

  albumTable.appendChild(row)
}

albumForm.addEventListener('submit', async (e) => {
  e.preventDefault()
  const formData = new FormData(albumForm)
  const albumData = Object.fromEntries(formData.entries())
  albumData.year = Number(albumData.year)

  await addAlbum(albumData)
})

sortBtn.addEventListener('click', async () => {
  const sortValue = sortField.value
  await loadAlbums(sortValue)
})

// Initial load
loadAlbums()