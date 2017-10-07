declare module 'react-tweet-embed' {
  import { Component } from 'react'
  export type TweetEmbedProps = {
    id?: string
    options?: object
    protocol?: string
    onTweetLoadSuccess?: () => void
    onTweetLoadError?: () => void
    className?: string
  }

  export default class TweetEmbed extends Component<TweetEmbedProps> {}
}
