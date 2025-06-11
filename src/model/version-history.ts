export interface VersionHistoryType {
  releases: ReleaseType[]
}

export interface ReleaseType {
  version: string
  date: string
  changes: ChangeType
}

export interface ChangeType {
  pt: string[]
  en: string[]
}
