import { readFile, readdir } from 'fs/promises'
import path from 'path'
import { expect, test } from 'vitest'
import { compileFile, makeCompile, splitFile } from '../src/compilers'
import { splitPrefix } from '../src/constants'

test('it compiles and splits', async () => {
  // get the list of files from the /test-files directory
  const files = await readdir(path.resolve(__dirname, './test-files'))
  for (const file of files) {
    console.log('Testing:', file)
    await compileTestFile({ file })
    await splitTestFile({ file })
  }
})

async function compileTestFile(opts: { file: string }) {
  const code = (
    await readFile(path.resolve(__dirname, `./test-files/${opts.file}`))
  ).toString()

  const filename = opts.file.replace(__dirname, '')

  // console.log('Compiling...')
  // console.log('⬇️⬇️⬇️⬇️⬇️')
  // console.log()
  const result = await compileFile({
    code,
    compile: makeCompile({
      root: './test-files',
    }),
    filename,
  })

  // console.log(result.code)
  // console.log()

  await expect(result.code).toMatchFileSnapshot(`./snapshots/${filename}`)
}

async function splitTestFile(opts: { file: string }) {
  const code = (
    await readFile(path.resolve(__dirname, `./test-files/${opts.file}`))
  ).toString()

  const filename = opts.file.replace(__dirname, '')

  // console.log('Splitting...')
  // console.log('⬇️⬇️⬇️⬇️⬇️')
  // console.log()
  const result = await splitFile({
    code,
    compile: makeCompile({
      root: './test-files',
    }),
    filename: `${filename}?${splitPrefix}`,
  })

  // console.log(result.code)
  // console.log()
  await expect(result.code).toMatchFileSnapshot(
    `./snapshots/${filename.replace('.tsx', '')}?split.tsx`,
  )
}
