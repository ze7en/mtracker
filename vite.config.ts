import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tsconfigPaths from 'vite-tsconfig-paths'


// https://vitejs.dev/config/
// eslint-disable-next-line import/no-default-export
export default () => {
  return defineConfig({
    server: {
      open: true,
    },
    plugins: [ react(), tsconfigPaths() ],
  })
}
