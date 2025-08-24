export type BookTagRef = { m_FileID: number; m_PathID: number }

export type RawBook = {
  m_Name: string
  title?: { key: string }
  author?: { key: string }
  shortDescription?: string
  description?: { key: string }
  pages?: number
  published?: number
  tags?: BookTagRef[]
  mainGenres: number[]
  isFake: number
}

export type IndexBooks = {
  objects: {
    name: string
    json_relpath: string
  }[]
}

export type RawAttribute = {
  name: string
  path_id: number
}

export type AttributesIndex = {
  objects: RawAttribute[]
}

export type Book = {
  id: string
  title: string
  author: string
  pages?: number
  published?: number
  attributeIds: number[]
  attributes: string[]
  isFake: number
  mainGenres: number[]
}

export type Attr = { id: number; name: string }
export type Tri = -1 | 0 | 1 // -1 exclude, 0 off, 1 include
export type VersionItem = { label: string; prefix: string }
export type Lang = 'CN' | 'DE' | 'EN' | 'ES' | 'FR' | 'HANT' | 'JP' | 'RU' | 'TR'
export type TransDict = Record<string, { strings?: string[] }>

export type AugBook = Book & {
  tTitle: string
  tAuthor: string
}
export type LocaleFile = Record<string, { strings?: string[] }>
