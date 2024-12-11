import fs from 'fs/promises'
import path from 'path'

const contentDir = path.join(process.cwd(), 'content')

export async function getContentPages() {
  try {
    await fs.mkdir(contentDir, { recursive: true })
    const files = await fs.readdir(contentDir)
    const pages = await Promise.all(
      files.map(async (file) => {
        const content = await fs.readFile(path.join(contentDir, file), 'utf-8')
        return { slug: path.parse(file).name, ...JSON.parse(content) }
      })
    )
    return pages
  } catch (error) {
    console.error('Error reading content pages:', error)
    return []
  }
}

export async function getContentPage(slug) {
  try {
    const content = await fs.readFile(path.join(contentDir, `${slug}.json`), 'utf-8')
    return JSON.parse(content)
  } catch (error) {
    if (error.code === 'ENOENT') {
      console.error(`Content page ${slug} not found`)
      return null
    }
    console.error(`Error reading content page ${slug}:`, error)
    throw error
  }
}

export async function saveContentPage(slug, data) {
  try {
    await fs.mkdir(contentDir, { recursive: true })
    await fs.writeFile(path.join(contentDir, `${slug}.json`), JSON.stringify(data, null, 2))
    return true
  } catch (error) {
    console.error(`Error saving content page ${slug}:`, error)
    return false
  }
}

export async function deleteContentPage(slug) {
  try {
    await fs.unlink(path.join(contentDir, `${slug}.json`))
    return true
  } catch (error) {
    if (error.code === 'ENOENT') {
      console.error(`Content page ${slug} not found`)
      return false
    }
    console.error(`Error deleting content page ${slug}:`, error)
    return false
  }
}