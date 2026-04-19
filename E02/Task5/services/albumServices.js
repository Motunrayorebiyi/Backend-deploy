import fs from 'fs/promises'

export async function loadAlbums() {
  const data = await fs.readFile("./data/albums.json", "utf8");
  return JSON.parse(data).albums;
}