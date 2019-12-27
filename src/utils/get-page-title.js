import defaultSettings from '@/settings'

const title = defaultSettings.title || '联物商家管理后台'

export default function getPageTitle(pageTitle) {
  if (pageTitle) {
    return `${pageTitle} - ${title}`
  }
  return `${title}`
}
