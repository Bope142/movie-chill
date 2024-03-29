import axios from "axios";
import { NextRequest, NextResponse } from "next/server";

const getUrlVideo = async (idMovie: number): Promise<string | null> => {
  try {
    const response = await axios.get(
      `${process.env.BASE_URL_API}movie/${idMovie}/videos?api_key=${process.env.API_KEY}`
    );

    if (response.status === 200) {
      const videosData = response.data;
      const clipVideos = videosData.results.filter(
        (video: any) => video.type === "Clip" || video.type === "Trailer"
      );

      if (clipVideos.length > 0) {
        const firstVideo = clipVideos[0];
        if (firstVideo.site === "YouTube") {
          return `https://www.youtube.com/embed/${firstVideo.key}`;
        } else if (firstVideo.site === "Vimeo") {
          return `https://vimeo.com/${firstVideo.key}`;
        } else {
          return null;
        }
      } else {
        return null;
      }
    } else {
      console.error("Failed to fetch videos data from the API");
      return null;
    }
  } catch (error) {
    console.error("An error occurred while fetching videos data:", error);
    return null;
  }
};

const getSimilarMovies = async (id: number): Promise<any[]> => {
  try {
    const response = await axios.get(
      `${process.env.BASE_URL_API}movie/${id}/similar?api_key=${process.env.API_KEY}&language=fr&page=1`
    );

    if (response.status === 200) {
      return response.data.results;
    } else {
      console.error("Failed to fetch similar movies from the API");
      return [];
    }
  } catch (error) {
    console.error("An error occurred while fetching similar movies:", error);
    return [];
  }
};

export const GET = async (
  req: NextRequest,
  { params }: { params: Record<string, string> }
) => {
  try {
    const { id } = params;
    if (!id)
      return NextResponse.json(
        {
          error: "parameters not specified for GET request ",
        },
        {
          status: 403,
        }
      );

    const response = await axios.get(
      `${process.env.BASE_URL_API}movie/${id}?&api_key=${process.env.API_KEY}&language=fr`
    );

    if (response.status === 200) {
      const similarMovies = await getSimilarMovies(parseInt(id));
      const videoUrl = await getUrlVideo(parseInt(id));
      return NextResponse.json(
        {
          movie: response.data,
          similar: similarMovies,
          videoLink: videoUrl,
        },
        {
          status: 200,
        }
      );
    } else {
      return NextResponse.json(
        {
          error: "Failed to fetch data from the API",
        },
        {
          status: response.status,
        }
      );
    }
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      {
        error: "Something went wrong !",
      },
      {
        status: 500,
      }
    );
  }
};
