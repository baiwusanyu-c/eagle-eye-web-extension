/*
 * @deprecated
 * @author czh
 * @update (czh 2022/7/22)
 */
import path from 'path'
import { dest, parallel, series, src } from 'gulp'

function moveToChrome() {
  return src(path.resolve('../dist/temp/**')).pipe(dest(path.resolve('../dist/chrome')))
}
export default series(moveToChrome)
