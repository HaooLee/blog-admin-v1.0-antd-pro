import {get as getSorage } from './storage'

export default function download(router) {
  const $a = document.createElement('a')
  const token = getSorage('TOKEN')
  $a.href = token ? `${router}?token=${token}` : `${router}`
  document.body.appendChild($a)
  $a.click()
  document.body.removeChild($a)
}
