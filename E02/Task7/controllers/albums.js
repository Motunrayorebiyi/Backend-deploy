import { loadAlbums } from "../services/albumServices.js";


export async function getAllAlbums(req, res) {
  try {
    const albums = await loadAlbums();
    res.json(albums);
  } catch (error) {
    res.status(500).json({ error: "could not load albums" });
  }}



export async function getAlbumById(req, res) {
  const id = parseInt(req.params.id);

  try {
    const albums = await loadAlbums();
    const album = albums.find((u) => u.id === id);
    console.log(album);
    res.status(201).json(album);
  } catch (error) {
    res.status(500).json({ error: "Failed to load albums" });
  }}



export async function createAlbum(req, res) {
  const { artist, title, year, genre, tracks } = req.body;
  try {
    const albums = await loadAlbums();
    const newAlbum = {
      id: Math.max(...albums.map((u) => u.id)) + 1,
      artist,
      title,
      year,
      genre,
      tracks,
    };
    albums.push(newAlbum);
    console.log(albums)
    return res.status(200).json(newAlbum);
  } catch (error) {
    res.status(500).json({ error: "Failed to load albums" });
  }}



export async function updateAlbum(req, res) {
  const id = parseInt(req.params.id);
  const { artist, title, year, genre, tracks } = req.body

    try {
    const albums = await loadAlbums();
      const album = albums.find(a => a.id === id);
      console.log(album)
      if(!album){
        return res.status(400).json({ error: "Album not found" });
      }
        if (artist) album.artist = artist;
        if (title) album.title = title;
        if (year) album.year = year;
        if (genre) album.genre = genre;
        if (tracks) album.tracks = tracks;

   return res.status(201).json({ message: "Album updated", album });
  } catch (error) {
   return res.status(500).json({ error: "Failed to load albums" });
  }}


export async function deleteAlbum(req, res) {
  const id = parseInt(req.params.id);

   try {
    const albums = await loadAlbums();
    const index = albums.findIndex(a => a.id === id);
  if (!index) return res.status(404).json({ message: "Album not found" });
  const deletedAlbum = albums.splice(index, 1)[0];
  res.json({ message: "Album deleted", album: albums });
     
  } catch (error) {
   return res.status(500).json({ error: "Failed to load albums" });
  }}