import TopBar from "@/components/TopBar";
import { useMusicStore } from "@/stores/useMusicStore";
import { useEffect } from "react";
import FeaturedSections from "./components/FeaturedSections";
import { ScrollArea } from "@/components/ui/scroll-area";
import SectionGrid from "./components/SectionGrid";
import { usePlayerStore } from "@/stores/usePlayerStore";

const HomePage = () => {
  const {
    fetchMadeForYouSong,
    fetchFeaturedSong,
    fetchTrendingSong,
    madeForYouSongs,
    trendingSongs,
    featuredSongs,
    isLoading
  } = useMusicStore();

  const { initialQueue } = usePlayerStore()

  useEffect(() => {
    fetchFeaturedSong();
    fetchMadeForYouSong();
    fetchTrendingSong();
  }, [fetchFeaturedSong, fetchMadeForYouSong, fetchTrendingSong]);

  useEffect(()=>{
    if(madeForYouSongs.length > 0 && featuredSongs.length>0 && trendingSongs.length>0){
      const allSongs = [...featuredSongs,...madeForYouSongs,...trendingSongs]
      initialQueue(allSongs)
    }
  },[initialQueue,madeForYouSongs,trendingSongs,featuredSongs])
  return (
    <main className="rounded-md overflow-hidden h-full bg-gradient-to-b from-zinc-800 to-zinc-900">
      <TopBar />
      <ScrollArea className="h-[calc(100vh-180px)]">
          <div className="p-4 sm:p-6">
            <h1 className="text-2xl sm:text-3xl font-bold mb-6">Good Afternoon</h1>
            <FeaturedSections />
            <div className="space-y-8">
              <SectionGrid title="Made For You" songs={madeForYouSongs} isLoading={isLoading} />
              <SectionGrid title="Trending" songs={trendingSongs} isLoading={isLoading} />
            </div>
          </div>
      </ScrollArea>
    </main>
  );
};

export default HomePage;
