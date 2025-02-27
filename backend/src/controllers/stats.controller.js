import { Song } from "../models/song.model.js";
import { User } from "../models/user.model.js";
import { Album } from "../models/album.model.js";

export const getStats = async (req, res, next) => {
    try {
      // const Totalsongs = await Song.countDocuments();
      // const TotalUsers = await User.countDocuments();
      // const TotalAlbums = await Album.countDocuments();
  
      //optimised code for above code
      const [totalSongs, totalAlbums, totalUsers, uniqueArtist] =
        await Promise.all([
          Song.countDocuments(),
          Album.countDocuments(),
          User.countDocuments(),
  
          Song.aggregate([
            {
              $unionWith: {
                coll: "albums",
                pipeline: [],
              },
            },
            {
              $group: {
                _id: "$artist",
              },
            },
            {
              $count: "count",
            },
          ]),
        ]);
      res
        .status(200)
        .json({
          totalAlbums,
          totalSongs,
          totalUsers,
          uniqueArtist: uniqueArtist[0].count || 0,
        });
    } catch (error) {
      next(error);
    }
};
