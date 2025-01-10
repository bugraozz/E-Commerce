


'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'
import { toast } from "@/hooks/use-toast"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Editor } from '@tinymce/tinymce-react'

interface ContentPage {
  id: number
  slug: string
  title: string
  content: string
  created_at: string
  updated_at: string
}

export default function ContentPagesAdmin() {
  const { user, isAdmin, getToken } = useAuth()
  const router = useRouter()
  const [pages, setPages] = useState<ContentPage[]>([])
  const [newPage, setNewPage] = useState({ slug: '', title: '', content: '' })
  const [editingPage, setEditingPage] = useState<ContentPage | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (!user || !isAdmin) {
      toast({
        title: "Yetkisiz Erişim",
        description: "Bu sayfaya erişmek için admin olarak giriş yapmanız gerekiyor.",
        variant: "destructive",
      })
      router.push('/')
      return
    }
    fetchPages()
  }, [user, isAdmin, router])

  const fetchPages = async () => {
    setIsLoading(true)
    try {
      const token = getToken()
      const response = await fetch('/api/admin/content-pages', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      if (!response.ok) throw new Error('Sayfalar yüklenirken bir hata oluştu.')
      const data = await response.json()
      setPages(data)
    } catch (error) {
      console.error('Error fetching pages:', error)
      toast({
        title: "Hata",
        description: "Sayfalar yüklenirken bir hata oluştu.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const token = getToken()
    if (!token) {
      toast({
        title: "Yetkisiz Erişim",
        description: "Sayfa oluşturmak için giriş yapmanız gerekiyor.",
        variant: "destructive",
      })
      return
    }

    try {
      const response = await fetch('/api/admin/content-pages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(newPage),
      })
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Sayfa oluşturulurken bir hata oluştu.')
      }
      const createdPage = await response.json()
      toast({ title: "Başarılı", description: "Sayfa başarıyla oluşturuldu." })
      setNewPage({ slug: '', title: '', content: '' })
      setPages([createdPage, ...pages])
    } catch (error) {
      console.error('Error creating page:', error)
      toast({
        title: "Hata",
        description: error.message || "Sayfa oluşturulurken bir hata oluştu.",
        variant: "destructive",
      })
    }
  }

  const handleEdit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!editingPage) return

    const token = getToken()
    if (!token) return

    try {
      const response = await fetch('/api/admin/content-pages', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(editingPage),
      })
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Sayfa güncellenirken bir hata oluştu.')
      }
      const updatedPage = await response.json()
      toast({ title: "Başarılı", description: "Sayfa başarıyla güncellendi." })
      setEditingPage(null)
      setPages(pages.map(p => p.id === updatedPage.id ? updatedPage : p))
    } catch (error) {
      console.error('Error updating page:', error)
      toast({
        title: "Hata",
        description: error.message || "Sayfa güncellenirken bir hata oluştu.",
        variant: "destructive",
      })
    }
  }

  const handleDelete = async (slug: string) => {
    const token = getToken()
    if (!token) return

    if (!confirm('Bu sayfayı silmek istediğinizden emin misiniz?')) return

    try {
      const response = await fetch(`/api/admin/content-pages`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ slug }),
      })
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Sayfa silinirken bir hata oluştu.')
      }
      toast({ title: "Başarılı", description: "Sayfa başarıyla silindi." })
      setPages(pages.filter(p => p.slug !== slug))
    } catch (error) {
      console.error('Error deleting page:', error)
      toast({
        title: "Hata",
        description: error.message || "Sayfa silinirken bir hata oluştu.",
        variant: "destructive",
      })
    }
  }

  if (isLoading) {
    return <div>Yükleniyor...</div>
  }

  if (!isAdmin) {
    return null // or a message saying "Unauthorized"
  }

  return (
    <div className="container mx-auto py-8 px-6 bg-gray-100 min-h-screen">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h1 className="text-3xl font-extrabold text-gray-800 mb-6">İçerik Sayfaları Yönetimi</h1>
  
        <form onSubmit={handleSubmit} className="mb-10">
          <h2 className="text-2xl font-bold text-blue-600 mb-4">Yeni Sayfa Ekle</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
            <Input
              type="text"
              placeholder="Slug"
              value={newPage.slug}
              onChange={(e) => setNewPage({ ...newPage, slug: e.target.value })}
              className="border-gray-300 focus:ring focus:ring-blue-500 rounded-lg px-4 py-2"
              required
            />
            <Input
              type="text"
              placeholder="Başlık"
              value={newPage.title}
              onChange={(e) => setNewPage({ ...newPage, title: e.target.value })}
              className="border-gray-300 focus:ring focus:ring-blue-500 rounded-lg px-4 py-2"
              required
            />
          </div>
          <Editor
            apiKey="x4j9ulmkjde2x7ksqzpm4zmuaofjr7jngaujpt88tq0jm144"
            init={{
              height: 500,
              menubar: false,
              plugins: [
                'advlist autolink lists link image charmap print preview anchor',
                'searchreplace visualblocks code fullscreen',
                'insertdatetime media table paste code help wordcount'
              ],
              toolbar: 'undo redo | formatselect | ' +
              'bold italic backcolor | alignleft aligncenter ' +
              'alignright alignjustify | bullist numlist outdent indent | ' +
              'removeformat | help',
              content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }'
            }}
            onEditorChange={(content) => setNewPage({ ...newPage, content })}
          />
          <Button
            type="submit"
            className="bg-blue-600 text-white font-semibold px-6 py-2 rounded-lg hover:bg-blue-700 mt-4"
          >
            Sayfa Ekle
          </Button>
        </form>
  
        <h2 className="text-2xl font-bold text-blue-600 mb-6">Mevcut Sayfalar</h2>
        {pages.length === 0 ? (
          <p className="text-gray-500">Henüz eklenmiş bir sayfa bulunmamaktadır.</p>
        ) : (
          <div className="space-y-6">
            {pages.map((page) => (
              <div key={page.id} className="border border-gray-300 rounded-lg p-6 bg-white shadow-sm">
                {editingPage?.id === page.id ? (
                  <form onSubmit={handleEdit} className="space-y-4">
                    <Input
                      type="text"
                      value={editingPage.title}
                      onChange={(e) => setEditingPage({ ...editingPage, title: e.target.value })}
                      className="border-gray-300 focus:ring focus:ring-blue-500 rounded-lg px-4 py-2"
                      required
                    />
                    <Editor
                      apiKey="YOUR_TINYMCE_API_KEY"
                      init={{
                        height: 500,
                        menubar: false,
                        plugins: [
                          'advlist autolink lists link image charmap print preview anchor',
                          'searchreplace visualblocks code fullscreen',
                          'insertdatetime media table paste code help wordcount'
                        ],
                        toolbar: 'undo redo | formatselect | ' +
                        'bold italic backcolor | alignleft aligncenter ' +
                        'alignright alignjustify | bullist numlist outdent indent | ' +
                        'removeformat | help',
                        content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }'
                      }}
                      initialValue={editingPage.content}
                      onEditorChange={(content) => setEditingPage({ ...editingPage, content })}
                    />
                    <div className="flex gap-4">
                      <Button
                        type="submit"
                        className="bg-green-600 text-white font-semibold px-4 py-2 rounded-lg hover:bg-green-700"
                      >
                        Kaydet
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        className="bg-gray-500 text-white font-semibold px-4 py-2 rounded-lg hover:bg-gray-300"
                        onClick={() => setEditingPage(null)}
                      >
                        İptal
                      </Button>
                    </div>
                  </form>
                ) : (
                  <>
                    <h3 className="text-lg font-bold text-gray-800 mb-2">{page.title}</h3>
                    <p className="text-sm text-gray-500 mb-4">Slug: {page.slug}</p>
                    <div className="text-gray-700 mb-4" dangerouslySetInnerHTML={{ __html: page.content.substring(0, 200) + '...' }} />
                    <div className="flex gap-4">
                      <Button
                        onClick={() => setEditingPage(page)}
                        className="bg-blue-600 text-white font-semibold px-4 py-2 rounded-lg hover:bg-blue-600"
                      >
                        Düzenle
                      </Button>
                      <Button
                        onClick={() => handleDelete(page.slug)}
                        variant="destructive"
                        className="bg-red-500 text-white font-semibold px-4 py-2 rounded-lg hover:bg-red-600"
                      >
                        Sil
                      </Button>
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

