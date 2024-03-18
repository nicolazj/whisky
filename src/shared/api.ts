export type Task =
  | {
      type: 'file'
      files: {
        path: string
        name: string
      }[]
    }
  | {
      type: 'url'
      link: string
    }
