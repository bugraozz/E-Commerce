


import db from './db'

export async function getContentPages() {
  try {
    const result = await db.query('SELECT id, slug, title, content FROM content_pages ORDER BY created_at DESC')
    console.log('DB: Fetched pages:', result.rows) // Debugging line
    return result.rows
  } catch (error) {
    console.error('Error fetching content pages:', error)
    throw error
  }
}

export async function getContentPage(slug: string) {
  try {
    const result = await db.query('SELECT * FROM content_pages WHERE slug = $1', [slug])
    return result.rows[0] || null
  } catch (error) {
    console.error(`Error fetching content page ${slug}:`, error)
    throw error
  }
}

export async function saveContentPage(slug: string, { title, content }: { title: string, content: string }) {
  try {
    const now = new Date()
    const result = await db.query(
      `INSERT INTO content_pages (slug, title, content, created_at, updated_at)
       VALUES ($1, $2, $3, $4, $4)
       ON CONFLICT (slug) DO UPDATE
       SET title = $2, content = $3, updated_at = $4
       RETURNING id, slug, title, content, created_at, updated_at`,
      [slug, title, content, now]
    )
    return result.rows[0]
  } catch (error) {
    console.error(`Error saving content page ${slug}:`, error)
    throw error
  }
}

export async function deleteContentPage(slug: string) {
  try {
    const result = await db.query('DELETE FROM content_pages WHERE slug = $1 RETURNING *', [slug])
    return result.rows[0] || null
  } catch (error) {
    console.error(`Error deleting content page ${slug}:`, error)
    throw error
  }
}


