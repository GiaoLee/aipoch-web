export interface YouTubePlayer {
  mute(): void
  playVideo(): void
  destroy(): void
  getIframe(): HTMLIFrameElement
}
interface PlayerOptions {
  videoId: string
  width: string
  height: string
  playerVars: Record<string, string | number>
  events: {
    onReady(event: { target: YouTubePlayer }): void
    onStateChange(event: { data: number }): void
    onError(): void
    onAutoplayBlocked(): void
  }
}
type YouTubeAPI = { Player: new (element: HTMLElement, options: PlayerOptions) => YouTubePlayer }
let pending: Promise<YouTubeAPI> | undefined

/** Share one lazy API load across all previews without replacing global callbacks. */
export function loadYouTubePlayer(): Promise<YouTubeAPI> {
  const api = () => (window as Window & { YT?: YouTubeAPI }).YT
  const loaded = api()
  if (loaded?.Player) return Promise.resolve(loaded)
  if (pending) return pending
  pending = new Promise<YouTubeAPI>((resolve, reject) => {
    const script = document.createElement('script')
    script.src = 'https://www.youtube.com/iframe_api'
    script.async = true
    const finish = (error?: Error) => {
      clearInterval(poll)
      clearTimeout(timeout)
      script.onerror = null
      const loaded = api()
      if (error || !loaded) {
        script.remove()
        pending = undefined
        reject(error ?? new Error('YouTube API unavailable'))
      } else resolve(loaded)
    }
    const poll = setInterval(() => {
      if (api()?.Player) finish()
    }, 50)
    const timeout = setTimeout(() => finish(new Error('YouTube API timed out')), 12000)
    script.onerror = () => finish(new Error('YouTube API unavailable'))
    document.head.append(script)
  })
  return pending
}
