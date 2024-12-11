import { notFound } from 'next/navigation'
import { getContentPage } from '@/lib/contentPages'

interface ContentPageProps {
  params: { slug: string }
}

export default async function ContentPage({ params }: ContentPageProps) {
  const page = await getContentPage(params.slug)

  if (!page) {
    notFound()
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-4">{page.title}</h1>
      <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: page.content }} />
    </div>
  )
}