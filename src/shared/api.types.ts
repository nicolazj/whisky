export type TransTask =
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
