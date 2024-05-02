import i18n from "@/i18n/i18n"

export interface IFileFilter {
  name: string,
  extensions: string[]
}

export const markdownFilter = (): IFileFilter => {
  const label = i18n.t("file_filter.markdown")
  return {
    name: label,
    extensions: ['md', 'markdown']
  }
}


export const imagesFilter = (): IFileFilter => {
  const label = i18n.t("file_filter.image")
  return {
    name: label,
    extensions: ['jpg', 'jpeg', 'png', 'webp', 'gif', 'bmp', 'svg']
  }
}