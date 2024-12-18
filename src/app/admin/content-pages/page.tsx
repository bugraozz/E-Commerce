'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Footer } from '@/components/Footer';

interface ContentPage {
  slug: string;
  title: string;
  content: string;
}

export default function ContentPagesAdmin() {
  const { user, getToken } = useAuth();
  const [pages, setPages] = useState<ContentPage[]>([]);
  const [newPage, setNewPage] = useState({ slug: '', title: '', content: '' });
  const [editingPage, setEditingPage] = useState<ContentPage | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!user) {
      toast({
        title: "Yetkisiz Erişim",
        description: "Bu sayfaya erişmek için giriş yapmanız gerekiyor.",
        variant: "destructive",
      });
      return;
    }
    fetchPages();
  }, [user]);

  const fetchPages = async () => {
    const token = getToken();
    if (!token) return;

    setIsLoading(true);
    try {
      const response = await fetch('/api/admin/content-pages', {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!response.ok) throw new Error('Sayfalar yüklenirken bir hata oluştu.');

      const data = await response.json();
      setPages(data);
    } catch (error) {
      console.error('Error fetching pages:', error);
      toast({
        title: "Hata",
        description: "Sayfalar yüklenirken bir hata oluştu.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = getToken();
    if (!token) {
      toast({
        title: "Yetkisiz Erişim",
        description: "Sayfa oluşturmak için giriş yapmanız gerekiyor.",
        variant: "destructive",
      });
      return;
    }

    try {
      const response = await fetch('/api/admin/content-pages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(newPage),
      });
      if (!response.ok) throw new Error('Sayfa oluşturulurken bir hata oluştu.');

      toast({ title: "Başarılı", description: "Sayfa başarıyla oluşturuldu." });
      setNewPage({ slug: '', title: '', content: '' });
      fetchPages();
    } catch (error) {
      console.error('Error creating page:', error);
      toast({
        title: "Hata",
        description: "Sayfa oluşturulurken bir hata oluştu.",
        variant: "destructive",
      });
    }
  };

  const handleEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingPage) return;

    const token = getToken();
    if (!token) return;

    try {
      const response = await fetch('/api/admin/content-pages', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(editingPage),
      });
      if (!response.ok) throw new Error('Sayfa güncellenirken bir hata oluştu.');

      toast({ title: "Başarılı", description: "Sayfa başarıyla güncellendi." });
      setEditingPage(null);
      fetchPages();
    } catch (error) {
      console.error('Error updating page:', error);
      toast({
        title: "Hata",
        description: "Sayfa güncellenirken bir hata oluştu.",
        variant: "destructive",
      });
    }
  };

  const handleDelete = async (slug: string) => {
    const token = getToken();
    if (!token) return;

    if (!confirm('Bu sayfayı silmek istediğinizden emin misiniz?')) return;

    try {
      const response = await fetch(`/api/admin/content-pages`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ slug }),
      });
      if (!response.ok) throw new Error('Sayfa silinirken bir hata oluştu.');

      toast({ title: "Başarılı", description: "Sayfa başarıyla silindi." });
      fetchPages();
    } catch (error) {
      console.error('Error deleting page:', error);
      toast({
        title: "Hata",
        description: "Sayfa silinirken bir hata oluştu.",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return <div>Yükleniyor...</div>;
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
          <Textarea
            placeholder="İçerik"
            value={newPage.content}
            onChange={(e) => setNewPage({ ...newPage, content: e.target.value })}
            className="border-gray-300 focus:ring focus:ring-blue-500 rounded-lg w-full px-4 py-2"
            rows={6}
            required
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
              <div key={page.slug} className="border border-gray-300 rounded-lg p-6 bg-white shadow-sm">
                {editingPage?.slug === page.slug ? (
                  <form onSubmit={handleEdit} className="space-y-4">
                    <Input
                      type="text"
                      value={editingPage.title}
                      onChange={(e) => setEditingPage({ ...editingPage, title: e.target.value })}
                      className="border-gray-300 focus:ring focus:ring-blue-500 rounded-lg px-4 py-2"
                      required
                    />
                    <Textarea
                      value={editingPage.content}
                      onChange={(e) => setEditingPage({ ...editingPage, content: e.target.value })}
                      className="border-gray-300 focus:ring focus:ring-blue-500 rounded-lg w-full px-4 py-2"
                      rows={6}
                      required
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
                    <p className="text-gray-700 mb-4">{page.content.substring(0, 100)}...</p>
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
  );
  
}




