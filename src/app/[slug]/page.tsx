import { notFound } from 'next/navigation'
import { getContentPage } from '@/lib/contentPages'
import { Footer } from '@/components/Footer'
import Header from '@/components/Header'

interface ContentPageProps {
  params: { slug: string }
}

export default async function ContentPage({ params }: ContentPageProps) {
  const page = await getContentPage(params.slug)

  if (!page) {
    notFound()
  }

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      {/* Header */}
      <Header />
      {/* İçerik */}
      <main className="flex-grow">
        <h1 className="text-3xl font-bold mb-4 m-8">{page.title}</h1>
        <div className="prose max-w-none m-8" dangerouslySetInnerHTML={{ __html: page.content }} />
      </main>
      {/* Footer */}
      <Footer />
    </div>
  );
  
}