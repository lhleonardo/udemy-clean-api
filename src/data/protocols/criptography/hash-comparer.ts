export interface HashComparer {
  compare: (value: string, compare: string) => Promise<boolean>
}
