// Responsive YouTube embed used by the remark-youtube plugin. Server
// component (no interactivity needed). Uses youtube-nocookie to keep the
// site's no-tracking posture; the embed itself is the requested feature.

export function YouTube({
  id,
  start,
}: {
  id: string;
  start?: string | number;
}) {
  const startSeconds = start ? Number(start) : 0;
  const query = startSeconds > 0 ? `?start=${startSeconds}` : "";

  return (
    <div className="not-prose my-8 aspect-video overflow-hidden rounded-lg border border-neutral-200">
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
