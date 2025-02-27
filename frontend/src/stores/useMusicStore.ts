import { axiosInstance } from "@/lib/axios";
import { create } from "zustand";
import { Album, Song } from "@/types";

interface MusicStore {
  songs: Song[];
  albums: Album[];
  isLoading: boolean;
  error: string | null;
  currentAlbum: Album | null;
  madeForYouSongs: Song[];
  trendingSongs:Song[];
  featuredSongs:Song[];

  fetchAlbums: () => Promise<void>;
  fetchAlbumById: (id: string) => Promise<void>;
  fetchFeaturedSong: ()=>Promise<void>
  fetchMadeForYouSong: ()=>Promise<void>
  fetchTrendingSong: ()=>Promise<void>
}

export const useMusicStore = create<MusicStore>((set) => ({
  albums: [],
  songs: [],
  isLoading: false,
  error: null,
  currentAlbum: null,
  madeForYouSongs: [],
  trendingSongs:[],
  featuredSongs:[],

  fetchAlbums: async () => {
    set({ isLoading: true, error: null });
    try {
      const res = await axiosInstance.get("/albums");
      set({ albums: res.data });
    } catch (error: any) {
      set({ error: error.res.data.message });
    } finally {
      set({ isLoading: false });
    }
  },
  fetchAlbumById: async (id) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axiosInstance.get(`/albums/${id}`);
      set({ currentAlbum: response.data });
    } catch (error: any) {
      set({ error: error.res.data.message });
    } finally {
      set({ isLoading: false });
    }
  },
  fetchMadeForYouSong: async()=>{
    set({ isLoading: true, error: null });
    try {
      const response = await axiosInstance.get(`/song/made-for-you`);
      set({ madeForYouSongs: response.data });
    } catch (error: any) {
      set({ error: error.res.data.message });
    } finally {
      set({ isLoading: false });
    }
  },
  fetchFeaturedSong: async ()=>{
    set({ isLoading: true, error: null });
    try {
      const response = await axiosInstance.get(`/song/featured`);
      set({ featuredSongs: response.data });
    } catch (error: any) {
      set({ error: error.res.data.message });
    } finally {
      set({ isLoading: false });
    }
  },
  fetchTrendingSong:async ()=>{
    set({ isLoading: true, error: null });
    try {
      const response = await axiosInstance.get(`/song/trending`);
      set({ trendingSongs: response.data });
    } catch (error: any) {
      set({ error: error.res.data.message });
    } finally {
      set({ isLoading: false });
    }
  }
}));
