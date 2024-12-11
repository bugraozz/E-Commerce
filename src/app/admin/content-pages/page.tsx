'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

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
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">İçerik Sayfaları Yönetimi</h1>
      
      <form onSubmit={handleSubmit} className="mb-8">
        <h2 className="text-xl font-semibold mb-2">Yeni Sayfa Ekle</h2>
        <Input
          type="text"
          placeholder="Slug"
          value={newPage.slug}
          onChange={(e) => setNewPage({ ...newPage, slug: e.target.value })}
          className="mb-2"
          required
        />
        <Input
          type="text"
          placeholder="Başlık"
          value={newPage.title}
          onChange={(e) => setNewPage({ ...newPage, title: e.target.value })}
          className="mb-2"
          required
        />
        <Textarea
          placeholder="İçerik"
          value={newPage.content}
          onChange={(e) => setNewPage({ ...newPage, content: e.target.value })}
          className="mb-2"
          required
        />
        <Button type="submit">Sayfa Ekle</Button>
      </form>

      <h2 className="text-xl font-semibold mb-2">Mevcut Sayfalar</h2>
      {pages.map((page) => (
        <div key={page.slug} className="border p-4 mb-4 rounded">
          {editingPage?.slug === page.slug ? (
            <form onSubmit={handleEdit}>
              <Input
                type="text"
                value={editingPage.title}
                onChange={(e) => setEditingPage({ ...editingPage, title: e.target.value })}
                className="mb-2"
                required
              />
              <Textarea
                value={editingPage.content}
                onChange={(e) => setEditingPage({ ...editingPage, content: e.target.value })}
                className="mb-2"
                required
              />
              <Button type="submit" className="mr-2">Kaydet</Button>
              <Button type="button" variant="outline" onClick={() => setEditingPage(null)}>İptal</Button>
            </form>
          ) : (
            <>
              <h3 className="text-lg font-semibold">{page.title}</h3>
              <p className="text-sm text-gray-500 mb-2">Slug: {page.slug}</p>
              <p className="mb-2">{page.content.substring(0, 100)}...</p>
              <Button onClick={() => setEditingPage(page)} className="mr-2">Düzenle</Button>
              <Button onClick={() => handleDelete(page.slug)} variant="destructive">Sil</Button>
            </>
          )}
        </div>
      ))}
    </div>
  );
}