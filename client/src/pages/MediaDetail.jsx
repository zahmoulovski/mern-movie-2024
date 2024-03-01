import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderOutlinedIcon from "@mui/icons-material/FavoriteBorderOutlined";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";

import { LoadingButton } from "@mui/lab";
import { Box, Button, Chip, Divider, Stack, Typography } from "@mui/material";
import { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";

import CircularRate from "../components/common/CircularRate";
import Container from "../components/common/Container";
import ImageHeader from "../components/common/ImageHeader";

import uiConfigs from "../configs/ui.configs";
import tmdbConfigs from "../api/configs/tmdb.configs";
import mediaApi from "../api/modules/media.api";
import favoriteApi from "../api/modules/favorite.api";

import { setGlobalLoading } from "../redux/features/globalLoadingSlice";
import { setAuthModalOpen } from "../redux/features/authModalSlice";
import { addFavorite, removeFavorite } from "../redux/features/userSlice";

import CastSlide from "../components/common/CastSlide";
import MediaVideosSlide from "../components/common/MediaVideosSlide";
import BackdropSlide from "../components/common/BackdropSlide";
import PosterSlide from "../components/common/PosterSlide";
import RecommendSlide from "../components/common/RecommendSlide";
import MediaSlide from "../components/common/MediaSlide";
import MediaReview from "../components/common/MediaReview";

const MediaDetail = () => {
  const { mediaType, mediaId } = useParams();

  const { user, listFavorites } = useSelector((state) => state.user);

  const [media, setMedia] = useState();
  const [isFavorite, setIsFavorite] = useState(false);
  const [onRequest, setOnRequest] = useState(false);
  const [genres, setGenres] = useState([]);

  const dispatch = useDispatch();

  useEffect(() => {
    window.scrollTo(0, 0);
    const getMedia = async () => {
      dispatch(setGlobalLoading(true));
      const { response, err } = await mediaApi.getDetail({
        mediaType,
        mediaId,
      });
      dispatch(setGlobalLoading(false));

      if (response) {
        setMedia(response);
        setIsFavorite(response.isFavorite);
        setGenres(response.genres.splice(0, 2));
      }

      if (err) toast.error(err.message);
    };

    getMedia();
  }, [mediaType, mediaId, dispatch]);

  const onFavoriteClick = async () => {
    if (!user) return dispatch(setAuthModalOpen(true));

    if (onRequest) return;

    if (isFavorite) {
      onRemoveFavorite();
      return;
    }

    setOnRequest(true);

    const body = {
      mediaId: media.id,
      mediaTitle: media.title || media.name,
      mediaType: mediaType,
      mediaPoster: media.poster_path,
      mediaRate: media.vote_average,
    };

    const { response, err } = await favoriteApi.add(body);

    setOnRequest(false);

    if (err) toast.error(err.message);
    if (response) {
      dispatch(addFavorite(response));
      setIsFavorite(true);
      toast.success("Add favorite success");
    }
  };

  const onRemoveFavorite = async () => {
    if (onRequest) return;
    setOnRequest(true);

    const favorite = listFavorites.find(
      (e) => e.mediaId.toString() === media.id.toString()
    );

    const { response, err } = await favoriteApi.remove({
      favoriteId: favorite.id,
    });

    setOnRequest(false);

    if (err) toast.error(err.message);
    if (response) {
      dispatch(removeFavorite(favorite));
      setIsFavorite(false);
      toast.success("Remove favorite success");
    }
  };

  console.log("media", media, mediaType);

  const [seasonNumber, setSeasonNumber] = useState(1);
  const [episodeNumber, setEpisodeNumber] = useState(1);
  const [selectedSeason, setSelectedSeason] = useState(1);

  const handleSeasonChange = (event) => {
    setSelectedSeason(parseInt(event.target.value)); // Parse the selected value to an integer
  };
  const topbarHeight = 100; // Adjust this value according to your actual topbar height
  const videoRef = useRef(null);

  const scrollToVideo = () => {
    const videoTop =
      videoRef.current.getBoundingClientRect().top + window.pageYOffset;
    window.scrollTo({ top: videoTop - topbarHeight, behavior: "smooth" });
  };

  // Function to check if an iframe contains an ad
  function isAdFrame(iframe) {
    // Add conditions to identify ads based on iframe properties or content
    // For example, you might check the source URL, dimensions, or keywords in the content
    // This is a simplified example and may need to be adapted based on specific requirements
    if (
      iframe.src.includes("adserver.com") ||
      iframe.width > 500 ||
      iframe.height > 600
    ) {
      return true; // Consider it an ad
    }
    return false; // Not an ad
  }

  // Function to remove ad iframes from the page
  function removeAdFrames() {
    // Get all iframes on the page
    var iframes = document.getElementsByTagName("iframe");

    // Iterate through each iframe
    for (var i = 0; i < iframes.length; i++) {
      // Check if the iframe is an ad
      if (isAdFrame(iframes[i])) {
        // Remove the iframe from the DOM
        iframes[i].parentNode.removeChild(iframes[i]);
      }
    }
  }

  // Call the function to remove ad iframes when the page loads
  window.onload = removeAdFrames;

  const [iframeSrc, setIframeSrc] = useState("");

  const handleSrcChange = (newSrc) => {
    setIframeSrc(newSrc);
  };


  return media ? (
    <>
      <ImageHeader
        imgPath={tmdbConfigs.backdropPath(
          media.backdrop_path || media.poster_path
        )}
      />
      <Box
        sx={{
          color: "primary.contrastText",
          ...uiConfigs.style.mainContent,
        }}
      >
        {/* media content */}
        <Box
          sx={{
            marginTop: { xs: "-10rem", md: "-15rem", lg: "-20rem" },
          }}
        >
          <Box
            sx={{
              display: "flex",
              flexDirection: { md: "row", xs: "column" },
            }}
          >
            {/* poster */}
            <Box
              sx={{
                width: { xs: "70%", sm: "50%", md: "40%" },
                margin: { xs: "0 auto 2rem", md: "0 2rem 0 0" },
              }}
            >
              <Box
                sx={{
                  paddingTop: "140%",
                  ...uiConfigs.style.backgroundImage(
                    tmdbConfigs.posterPath(
                      media.poster_path || media.backdrop_path
                    )
                  ),
                }}
              />
            </Box>
            {/* poster */}

            {/* media info */}
            <Box
              sx={{
                width: { xs: "100%", md: "60%" },
                color: "text.primary",
              }}
            >
              <Stack spacing={5}>
                {/* title */}
                <Typography
                  variant="h4"
                  fontSize={{ xs: "2rem", md: "2rem", lg: "4rem" }}
                  fontWeight="700"
                  sx={{ ...uiConfigs.style.typoLines(2, "left") }}
                >
                  {`${media.title || media.name} ${
                    mediaType === tmdbConfigs.mediaType.movie
                      ? media.release_date.split("-")[0]
                      : media.first_air_date.split("-")[0]
                  }`}
                </Typography>
                {/* title */}

                {/* rate and genres */}
                <Stack direction="row" spacing={1} alignItems="center">
                  {/* rate */}
                  <CircularRate value={media.vote_average} />
                  {/* rate */}
                  <Divider orientation="vertical" />
                  {/* genres */}
                  {genres.map((genre, index) => (
                    <Chip
                      label={genre.name}
                      variant="filled"
                      color="primary"
                      key={index}
                    />
                  ))}
                  {/* genres */}
                </Stack>
                {/* rate and genres */}

                {/* overview */}
                <Typography
                  variant="body1"
                  sx={{ ...uiConfigs.style.typoLines(5) }}
                >
                  {media.overview}
                </Typography>
                {/* overview */}

                {/* buttons */}
                <Stack direction="row" spacing={1}>
                  <LoadingButton
                    variant="text"
                    sx={{
                      width: "max-content",
                      "& .MuiButon-starIcon": { marginRight: "0" },
                    }}
                    size="large"
                    startIcon={
                      isFavorite ? (
                        <FavoriteIcon />
                      ) : (
                        <FavoriteBorderOutlinedIcon />
                      )
                    }
                    loadingPosition="start"
                    loading={onRequest}
                    onClick={onFavoriteClick}
                  />
                  <Button
                    variant="contained"
                    sx={{ width: "max-content", marginTop: 2 }} // Add some margin to separate button from the content
                    size="large"
                    startIcon={<PlayArrowIcon />}
                    onClick={scrollToVideo}
                  >
                    watch now
                  </Button>
                </Stack>
                {/* buttons */}

                {/* cast */}
                <Container header="Cast">
                  <CastSlide casts={media.credits.cast} />
                </Container>
                {/* cast */}
              </Stack>
            </Box>
            {/* media info */}
          </Box>
        </Box>
        {/* media content */}

        {/* watch */}
        <Container header="Streaming">
          {mediaType === tmdbConfigs.mediaType.movie ? (
            <>
              <iframe
                ref={videoRef}
                style={{
                  margin: "50px auto",
                  aspectRatio: "16/7",
                  width: "75%",
                  display: "block",
                }}
                // src={`https://multiembed.mov/?video_id=${media.id}&tmdb=1`}
                src={iframeSrc}
                allowFullScreen
                allowScripts
              ></iframe>
              <p>If the video didn't work, please change to another server</p>
              <div>
                <button
                  onClick={() =>
                    handleSrcChange(
                      `https://vidsrc.xyz/embed/movie?tmdb=${media.id}`
                    )
                  }
                >
                  Server : 1
                </button>
                <button
                  onClick={() =>
                    handleSrcChange(
                      `https://multiembed.mov/?video_id=${media.id}&tmdb=1`
                    )
                  }
                >
                  Server : 2
                </button>
                <button
                  onClick={() =>
                    handleSrcChange(`https://vidsrc.to/embed/movie/${media.id}`)
                  }
                >
                  Server : 3
                </button>
              </div>
            </>
          ) : (
            <>
              <div>
                <iframe
                  ref={videoRef}
                  style={{
                    margin: "50px auto",
                    aspectRatio: "16/7",
                    width: "75%",
                    display: "block",
                  }}
                  src={iframeSrc}
                  allowFullScreen
                  allowScripts
                ></iframe>
                <div>
                  <button
                    onClick={() =>
                      handleSrcChange(
                        `https://vidsrc.xyz/embed/tv?tmdb=${media.id}`
                      )
                    }
                  >
                    Server : 1
                  </button>
                  <button
                    onClick={() =>
                      handleSrcChange(
                        `https://multiembed.mov/?video_id=${media.id}&tmdb=1&s=${seasonNumber}&e=${episodeNumber}`
                      )
                    }
                  >
                    Server : 2
                  </button>
                  <button
                    onClick={() =>
                      handleSrcChange(`https://vidsrc.to/embed/tv/${media.id}`)
                    }
                  >
                    Server : 3
                  </button>
                </div>
              </div>
              {/* Buttons for each season */}
              <div>
                <select
                  style={{
                    width: "50%",
                    color: "white",
                    backgroundColor: "#3b3b3b",
                    border: "none",
                    height: "50px",
                    fontSize: "20px",
                    margin: "0 0 15px 0",
                    padding: "0 10px 0 10px",
                  }}
                  value={selectedSeason}
                  onChange={handleSeasonChange}
                >
                  {media.seasons.map((season) => (
                    <option key={season.id} value={season.season_number}>
                      Season {season.season_number}
                    </option>
                  ))}
                </select>
                {media.seasons.map((season) =>
                  season.season_number === selectedSeason ? (
                    <div key={season.id}>
                      {Array.from(
                        { length: season.episode_count },
                        (_, index) => (
                          <button
                            style={{
                              width: "40px",
                              height: "30px",
                              backgroundColor: "#0096ff",
                              color: "white",
                              border: "none",
                              borderRadius: "5px",
                              margin: "5px",
                            }}
                            key={index + 1}
                            onClick={() => {
                              setSeasonNumber(season.season_number);
                              setEpisodeNumber(index + 1);
                            }}
                          >
                            {index + 1}
                          </button>
                        )
                      )}
                    </div>
                  ) : null
                )}
              </div>
              {/* Buttons for each season */}
            </>
          )}
        </Container>
        {/* watch */}

        {/* media videos */}
        <div style={{ paddingTop: "2rem" }}>
          <Container header="Videos">
            <MediaVideosSlide videos={[...media.videos.results].splice(0, 5)} />
          </Container>
        </div>
        {/* media videos */}

        {/* media backdrop */}
        {media.images.backdrops.length > 0 && (
          <Container header="backdrops">
            <BackdropSlide backdrops={media.images.backdrops} />
          </Container>
        )}
        {/* media backdrop */}

        {/* media posters */}
        {media.images.posters.length > 0 && (
          <Container header="posters">
            <PosterSlide posters={media.images.posters} />
          </Container>
        )}
        {/* media posters */}

        {/* media reviews */}
        <MediaReview
          reviews={media.reviews}
          media={media}
          mediaType={mediaType}
        />
        {/* media reviews */}

        {/* media recommendation */}
        <Container header="you may also like">
          {media.recommend.length > 0 && (
            <RecommendSlide medias={media.recommend} mediaType={mediaType} />
          )}
          {media.recommend.length === 0 && (
            <MediaSlide
              mediaType={mediaType}
              mediaCategory={tmdbConfigs.mediaCategory.top_rated}
            />
          )}
        </Container>
        {/* media recommendation */}
      </Box>
    </>
  ) : null;
};

export default MediaDetail;
