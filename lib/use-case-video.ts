import type { UseCaseVideo } from './use-case-types'

/** Optional media must never prevent an otherwise valid case from rendering. */
export function parseUseCaseVideo(value: unknown): UseCaseVideo | undefined {
  if (!value || typeof value !== 'object') return
  const video = value as Record<string, unknown>
  if (video.type !== 'youtube' || typeof video.file_path !== 'string') return
  try {
    const url = new URL(video.file_path)
    if (url.protocol !== 'https:' || url.username || url.password) return
    let id: string | null | undefined
    if (url.hostname === 'youtu.be') id = url.pathname.slice(1)
    else if (['youtube.com', 'www.youtube.com', 'm.youtube.com'].includes(url.hostname)) {
      id =
        url.pathname === '/watch'
          ? url.searchParams.get('v')
          : /^\/(?:embed|shorts)\/([^/]+)$/.exec(url.pathname)?.[1]
    }
    if (!id || !/^[A-Za-z0-9_-]{11}$/.test(id)) return
    return {
      type: 'youtube',
      id,
      title: typeof video.file_name === 'string' ? video.file_name : undefined
    }
  } catch {
    return
  }
}
