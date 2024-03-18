export type Task =
  | {
      type: 'file'
      files: {
        path: string
        name: string
        type: string
        size: number
      }[]
    }
  | {
      type: 'url'
      link: string
    }
