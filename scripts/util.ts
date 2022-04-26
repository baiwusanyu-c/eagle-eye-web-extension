import path from 'path'
export const port = parseInt(process.env.PORT || '') || 5000
export const r = (...args: string[]) => path.resolve(__dirname, '..', ...args)
