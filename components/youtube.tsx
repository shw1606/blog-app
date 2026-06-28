// Responsive YouTube embed used by the remark-youtube plugin. Server
// component (no interactivity needed). Uses youtube-nocookie to keep the
// site's no-tracking posture; the embed itself is the requested feature.

export function YouTube({
  id,
  start,
  shorts,
}: {
  id: string;
  start?: string | number;
  shorts?: boolean | string;
}) {
  const startSeconds = start ? Number(start) : 0;
  const query = startSeconds > 0 ? `?start=${startSeconds}` : "";
  const isShort = shorts === true || shorts === "true";

  // Shorts are vertical (9:16); cap the width so the embed doesn't tower
  // over the column on desktop, and center it. Regular videos stay 16:9.
  const frame = isShort
    ? "mx-auto aspect-[9/16] w-full max-w-[360px]"
    : "aspect-video";

  return (
    <div
      className={`not-prose my-8 overflow-hidden rounded-lg border border-neutral-200 ${frame}`}
    >
      <iframe
        className="h-full w-full"
        src={`https://www.youtube-nocookie.com/embed/${id}${query}`}
        title="YouTube video player"
        loading="lazy"
        allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowFullScreen
      />
    </div>
  );
}
