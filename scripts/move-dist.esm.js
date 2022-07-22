/*
 * @deprecated
 * @author czh
 * @update (czh 2022/7/22)
 */
import path from 'path'
import { dest, parallel, series, src } from 'gulp'

function moveManiFest() {
  return src(path.resolve('../dist/safari/manifest.json')).pipe(dest(path.resolve('../Beosin-Alert/Beosin-Alert Extension/Resources/')))
}
function moveUI() {
  return src(path.resolve('../dist/safari/ui/**'))
      .pipe(dest(path.resolve('../Beosin-Alert/Beosin-Alert Extension/Resources/dist/ui')))
}
function moveScript() {
  return src(path.resolve('../dist/safari/scripts/**'))
      .pipe(dest(path.resolve('../Beosin-Alert/Beosin-Alert Extension/Resources/dist/scripts')))
}
export default series(moveManiFest,moveUI,moveScript)
