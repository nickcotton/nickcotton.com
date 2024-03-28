import fetch from "node-fetch";
import url from "node:url";

const lastfmApiUrl = "https://ws.audioscrobbler.com/2.0/";
const lastfmApiKey = process.env.LASTFM_API_KEY;
const lastfmUsername = process.env.LASTFM_USERNAME;

const queryData = {
  method: "user.gettopalbums",
  user: lastfmUsername,
  api_key: lastfmApiKey,
  format: "json",
  period: "1month",
};

export default async function () {
  try {
    const response = await fetch(
      `${lastfmApiUrl}?${new url.URLSearchParams(queryData)}`,
    );
    const { topalbums } = await response.json();
    const albums = topalbums.album.map((album) => {
      return {
        name: album.name,
        artist: album.artist.name,
        image: album.image[3]["#text"],
        url: album.url,
      };
    });
    return albums || [];
  } catch (error) {
    console.log(error.message || error);
    return [];
  }
}
