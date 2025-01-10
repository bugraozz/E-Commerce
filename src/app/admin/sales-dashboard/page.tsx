


'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from "@/hooks/use-toast";
import { useRouter } from 'next/navigation';
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, Tooltip, Legend } from "recharts";
import { Card } from "@/components/ui/card";

import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

export default function SalesDashboard() {
  const router = useRouter();
  const { getToken, user, isAdmin } = useAuth();
  const [salesData, setSalesData] = useState([]);

  useEffect(() => {
    if (!user || !isAdmin) {
      toast({
        title: "Yetkisiz Erişim",
        description: "Bu sayfaya erişmek için admin olarak giriş yapmanız gerekiyor.",
        variant: "destructive",
      });
      router.push('/');
      return;
    }

    const fetchSalesData = async () => {
      try {
        const token = getToken();
        const response = await fetch('/api/sales-data', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error('API hatası');
        }

        const data = await response.json();
        console.log('Satış verileri:', data);
        setSalesData(data);
      } catch (error) {
        console.error('Satış verisi alınamadı:', error);
        toast({
          title: "Hata",
          description: "Satış verileri alınamadı",
          variant: "destructive",
        });
      }
    };

    fetchSalesData();
  }, [user, isAdmin, router, getToken]);

  return (
    <div className="container mx-auto p-4">
      {/* İlk tablo için bir Card */}
      <Card className="w-full md:w-1/2 mx-left p-4 hover:shadow-lg transform transition duration-300 hover:scale-105">
        <h2 className="text-lg font-bold mb-4 text-center">Satış Tablosu</h2>
        <ChartContainer className="min-h-[300px] w-full " config={{}}>
          {salesData.length > 0 ? (
            <BarChart data={salesData} width={400} height={300}>
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="productname"
                tickLine={false}
                tickMargin={10}
                axisLine={false}
              />
              <YAxis />
              <Tooltip content={<ChartTooltipContent />} />
              <Legend content={<ChartLegendContent />} />
              <Bar dataKey="salescount" fill="#8884d8" radius={4} />
            </BarChart>
          ) : (
            <p className="text-center">Veri bulunamadı.</p>
          )}
        </ChartContainer>
      </Card>

      {/* Diğer tabloları buraya ekleyebilirsiniz */}
    </div>
  );
}

