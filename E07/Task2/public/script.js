/* eslint-disable */
const API_BASE = '/albums'

const albumTable = document.getElementById('albums')
const albumForm = document.getElementById('addAlbumForm')
const sortBtn = document.getElementById('sortBtn')
const sortField = document.getElementById('sortField')

const limitField = document.getElementById('limitField')
const applyBtn = document.getElementById('applyBtn')
const prevBtn = document.getElementById('prevBtn')
const nextBtn = document.getElementById('nextBtn')
const pageDisplay = document.getElementById('pageDisplay')
const paginationInfo = document.getElementById('pagination-info')

let currentPage = 1
let lastMetadata = null

async function loadAlbums(page = 1, sort = '') {
  try {
    const params = new URLSearchParams()

    if (sort) {
      params.append('sort', sort)
    }

    if (limitField.value) {
      params.append('limit', limitField.value)
    }

    params.append('page', page)

    const url = `${API_BASE}?${params.toString()}`
    const response = await fetch(url)
    const result = await response.json()

    displayAlbums(result.data)
    updatePagination(result.metadata)

    currentPage = result.metadata.page
    lastMetadata = result.metadata
  } catch (err) {
    console.error('Error loading albums:', err)
    showErrors(['Network error while loading albums'])
  }
}

function updatePagination(metadata) {
  pageDisplay.textContent = `Page ${metadata.page}`
  paginationInfo.textContent =
    `Total: ${metadata.total} | Limit: ${metadata.limit} | Total pages: ${metadata.totalPages}`

  prevBtn.disabled = !metadata.hasPrevPage
  nextBtn.disabled = !metadata.hasNextPage
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

    await loadAlbums(currentPage, sortField.value)
  } catch (error) {
    console.error('Error adding album:', error)
  }
}

async function deleteAlbum(id) {
  try {
    const response = await fetch(`${API_BASE}/${id}?debug=true`, {
      method: 'DELETE',
    })

    if (response.ok) {
      await loadAlbums(currentPage, sortField.value)
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
    <td>${album._id ?? ''}</td>
    <td>${album.artist ?? ''}</td>
    <td>${album.title ?? ''}</td>
    <td>${album.year ?? ''}</td>
    <td>${album.genre ?? ''}</td>
    <td>${album.tracks ?? ''}</td>
    <td>
      <button>Delete</button>
    </td>
  `

  const deleteBtn = row.querySelector('button')
  deleteBtn.addEventListener('click', () => deleteAlbum(album._id))

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
  currentPage = 1
  await loadAlbums(1, sortField.value)
})

applyBtn.addEventListener('click', async () => {
  currentPage = 1
  await loadAlbums(1, sortField.value)
})

prevBtn.addEventListener('click', async () => {
  if (lastMetadata && lastMetadata.hasPrevPage) {
    await loadAlbums(currentPage - 1, sortField.value)
  }
})

nextBtn.addEventListener('click', async () => {
  if (lastMetadata && lastMetadata.hasNextPage) {
    await loadAlbums(currentPage + 1, sortField.value)
  }
})

// Initial load
loadAlbums()