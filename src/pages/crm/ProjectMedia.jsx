import React, { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  Image,
  Upload,
  Video,
  X,
  Download,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

import { api } from "../../api/api";
import PageHeader from "../../components/PageHeader";

export default function ProjectMedia() {

  const { projectId } = useParams();
  const navigate = useNavigate();
  const fileRef = useRef(null);

  const [project, setProject] = useState(null);
  const [media, setMedia] = useState([]);
  const [uploading, setUploading] = useState(false);

  // Selected media for fullscreen viewer
  const [selectedIndex, setSelectedIndex] = useState(null);

  // ==========================================================
  // LOAD PROJECT + MEDIA
  // ==========================================================

  async function load() {

    try {

      const projectResponse =
        await api.get(`/projects/${projectId}`);

      setProject(projectResponse.data);

      const mediaResponse =
        await api.get(`/projectmedia/${projectId}/media`);

      const data = Array.isArray(mediaResponse.data)
        ? mediaResponse.data
        : mediaResponse.data?.content || [];

      setMedia(data);

    } catch (error) {

      console.error(
        "Failed to load project media:",
        error
      );

    }
  }

  useEffect(() => {
    load();
  }, [projectId]);

  // ==========================================================
  // UPLOAD MULTIPLE FILES
  // ==========================================================

  async function uploadFiles(event) {

    const files = Array.from(
      event.target.files || []
    );

    if (!files.length) {
      return;
    }

    try {

      setUploading(true);

      const formData = new FormData();

      /*
       * Backend:
       *
       * @RequestParam("file")
       * MultipartFile[] files
       *
       * Therefore every file must use
       * the same "file" parameter.
       */

      files.forEach((file) => {
        formData.append("file", file);
      });

      await api.post(
        `/projectmedia/${projectId}/media`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      // Clear selected files
      event.target.value = "";

      // Reload gallery
      await load();

    } catch (error) {

      console.error(
        "Media upload failed:",
        error
      );

      alert(
        error?.response?.data?.message ||
        error?.response?.data ||
        "Failed to upload media."
      );

    } finally {

      setUploading(false);

    }
  }

  // ==========================================================
  // FILE URL
  // ==========================================================

  function getFileUrl(filePath) {

    if (!filePath) {
      return "";
    }

    /*
     * Your backend currently creates a complete URL:
     *
     * http://server:port/context/uploads/...
     */

    if (
      filePath.startsWith("http://") ||
      filePath.startsWith("https://")
    ) {
      return filePath;
    }

    return filePath;
  }

  // ==========================================================
  // CHECK VIDEO
  // ==========================================================

  function isVideo(item) {

    return (
      item.mediaType === "VIDEO" ||
      item.fileType?.startsWith("video/")
    );
  }

  // ==========================================================
  // OPEN FULLSCREEN
  // ==========================================================

  function openMedia(index) {

    setSelectedIndex(index);
  }

  // ==========================================================
  // CLOSE FULLSCREEN
  // ==========================================================

  function closeMedia() {

    setSelectedIndex(null);
  }

  // ==========================================================
  // PREVIOUS
  // ==========================================================

  function showPrevious(event) {

    if (event) {
      event.stopPropagation();
    }

    setSelectedIndex((previous) => {

      if (previous === null) {
        return null;
      }

      if (media.length === 0) {
        return null;
      }

      return previous === 0
        ? media.length - 1
        : previous - 1;
    });
  }

  // ==========================================================
  // NEXT
  // ==========================================================

  function showNext(event) {

    if (event) {
      event.stopPropagation();
    }

    setSelectedIndex((previous) => {

      if (previous === null) {
        return null;
      }

      if (media.length === 0) {
        return null;
      }

      return previous === media.length - 1
        ? 0
        : previous + 1;
    });
  }

  // ==========================================================
  // KEYBOARD NAVIGATION
  // ==========================================================

  useEffect(() => {

    function handleKeyDown(event) {

      if (selectedIndex === null) {
        return;
      }

      if (event.key === "Escape") {
        closeMedia();
      }

      if (event.key === "ArrowLeft") {
        showPrevious();
      }

      if (event.key === "ArrowRight") {
        showNext();
      }
    }

    window.addEventListener(
      "keydown",
      handleKeyDown
    );

    return () => {
      window.removeEventListener(
        "keydown",
        handleKeyDown
      );
    };

  }, [selectedIndex, media.length]);


  async function downloadMedia(item) {

  try {

    const url = getFileUrl(item.filePath);

    const response = await fetch(url);

    if (!response.ok) {
      throw new Error("Failed to download file");
    }

    const blob = await response.blob();

    const blobUrl = window.URL.createObjectURL(blob);

    const link = document.createElement("a");

    link.href = blobUrl;
    link.download =
      item.fileName || "project-media";

    document.body.appendChild(link);

    link.click();

    document.body.removeChild(link);

    window.URL.revokeObjectURL(blobUrl);

  } catch (error) {

    console.error(
      "Download failed:",
      error
    );

    alert("Unable to download the file.");

  }
}
  // ==========================================================
  // RENDER
  // ==========================================================

  return (
    <>
      {/* ======================================================
          PAGE HEADER
      ======================================================= */}

      <PageHeader
        title={
          project?.projectName ||
          "Project Media"
        }
        subtitle={
          project
            ? `Media for ${project.projectName}.`
            : "Project Photos & Videos"
        }
      />

      {/* ======================================================
          TOOLBAR
      ======================================================= */}

      <div className="panel">

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: "15px",
            flexWrap: "wrap",
          }}
        >

          {/* Back */}

          <button
            type="button"
            className="btn secondary"
            onClick={() => navigate("/projects")}
          >
            <ArrowLeft size={16} />

            Back to Projects
          </button>

          {/* Upload */}

          <div>

            <input
              ref={fileRef}
              type="file"
              multiple
              accept="image/*,video/*"
              style={{
                display: "none",
              }}
              onChange={uploadFiles}
            />

            <button
              type="button"
              className="btn primary"
              disabled={uploading}
              onClick={() =>
                fileRef.current?.click()
              }
            >

              <Upload size={16} />

              {uploading
                ? "Uploading..."
                : "Upload Photos / Videos"}

            </button>

          </div>

        </div>

      </div>

      {/* ======================================================
          MEDIA LIST
      ======================================================= */}

      <div className="panel">

        {media.length === 0 ? (

          <div className="media-empty">

            <Image size={48} />

            <h3>
              No photos or videos
            </h3>

            <p>
              Upload photos and videos for this project.
            </p>

          </div>

        ) : (

          <div className="media-grid">

            {media.map((item, index) => {

              const video = isVideo(item);

              const url =
                getFileUrl(item.filePath);

              return (

                <div
                  className="media-card"
                  key={item.id}
                  onClick={() =>
                    openMedia(index)
                  }
                >

                  {/* ==================================================
                      PREVIEW
                  =================================================== */}

                  <div className="media-preview">

                    {video ? (

                      <video
                        src={url}
                        preload="metadata"
                      />

                    ) : (

                      <img
                        src={url}
                        alt={
                          item.fileName ||
                          "Project image"
                        }
                      />

                    )}

                    {/* Video play indicator */}

                    {video && (

                      <div className="video-overlay">

                        <Video size={28} />

                      </div>

                    )}

                  </div>

                  {/* ==================================================
                      INFORMATION
                  =================================================== */}

                  <div className="media-info">

                    <div className="media-name">

                      {video ? (
                        <Video size={16} />
                      ) : (
                        <Image size={16} />
                      )}

                      <span
                        title={item.fileName}
                      >
                        {item.fileName}
                      </span>

                    </div>

                    <span className="badge">

                      {video
                        ? "VIDEO"
                        : "IMAGE"}

                    </span>

                  </div>

                </div>

              );

            })}

          </div>

        )}

      </div>

      {/* ======================================================
          FULLSCREEN MEDIA VIEWER
      ======================================================= */}

      {selectedIndex !== null &&
        media[selectedIndex] && (

          <div
            className="media-lightbox"
            onClick={closeMedia}
          >

            {/* ==================================================
                CLOSE
            =================================================== */}

            <button
              type="button"
              className="lightbox-close"
              onClick={closeMedia}
              aria-label="Close"
            >
              <X size={28} />
            </button>

            {/* ==================================================
                PREVIOUS
            =================================================== */}

            {media.length > 1 && (

              <button
                type="button"
                className="lightbox-nav lightbox-prev"
                onClick={showPrevious}
                aria-label="Previous"
              >
                <ChevronLeft size={36} />
              </button>

            )}

            {/* ==================================================
                MAIN CONTENT
            =================================================== */}

            <div
              className="lightbox-content"
              onClick={(event) =>
                event.stopPropagation()
              }
            >

              {isVideo(
                media[selectedIndex]
              ) ? (

                <video
                  className="lightbox-video"
                  src={getFileUrl(
                    media[selectedIndex]
                      .filePath
                  )}
                  controls
                  autoPlay
                />

              ) : (

                <img
                  className="lightbox-image"
                  src={getFileUrl(
                    media[selectedIndex]
                      .filePath
                  )}
                  alt={
                    media[selectedIndex]
                      .fileName ||
                    "Project image"
                  }
                />

              )}

              {/* ==================================================
                  BOTTOM TOOLBAR
              =================================================== */}

              <div className="lightbox-toolbar">

                <span
                  title={
                    media[selectedIndex]
                      .fileName
                  }
                >
                  {
                    media[selectedIndex]
                      .fileName
                  }
                </span>

                <button
                    type="button"
                    className="lightbox-download"
                    onClick={(event) => {
                      event.stopPropagation();
                      downloadMedia(media[selectedIndex]);
                    }}
                  >
                    <Download size={18} />
                    Download
                  </button>

              </div>

            </div>

            {/* ==================================================
                NEXT
            =================================================== */}

            {media.length > 1 && (

              <button
                type="button"
                className="lightbox-nav lightbox-next"
                onClick={showNext}
                aria-label="Next"
              >
                <ChevronRight size={36} />
              </button>

            )}

          </div>

        )}

    </>
  );
}