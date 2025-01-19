'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from "@/hooks/use-toast";
import { useRouter } from 'next/navigation';
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, Tooltip, Legend, Area, AreaChart, ResponsiveContainer } from 'recharts';
import { TrendingUp } from "lucide-react"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

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
  const [priceData, setPriceData] = useState([]);
  const [salesData, setSalesData] = useState([]);

  function CustomTooltip({ payload, label, active }: { payload: any; label: string; active: boolean }) {
    if (active && payload && payload.length) {
      return (
        <div className="custom-tooltip p-2 bg-white border rounded shadow-lg">
          <p className="label font-semibold">{`Tarih: ${label}`}</p>
          <p className="intro">{`Satış: ${payload[0].value} TL`}</p>
        </div>
      );
    }
    return null;
  }

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

    const fetchPriceData = async () => {
      try {
        const token = getToken();
        const response = await fetch('/api/daily-sales-data', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error('API hatası');
        }

        const data = await response.json();
        const formattedData = data.map((item) => ({
          date: new Date(item.date).toLocaleDateString('tr-TR', {
            month: 'short',
            day: '2-digit',
          }),
          totalSales: parseFloat(item.totalsales), // totalsales'ı sayıya çeviriyoruz
        }));
        console.log('Satış verileri:', formattedData);
        setPriceData(formattedData);
      } catch (error) {
        console.error('Satış verisi alınamadı:', error);
        toast({
          title: "Hata",
          description: "Satış verileri alınamadı",
          variant: "destructive",
        });
      }
    }

    fetchPriceData();
    fetchSalesData();
  }, [user, isAdmin, router, getToken]);

  return (
    <div className="container mx-auto p-4">
      <div className="flex flex-wrap justify-between">
        <Card className="w-full md:w-1/2 mx-left p-4 hover:shadow-lg transform transition duration-300 hover:scale-105">
          <h2 className="text-lg font-bold mb-4 text-center">Ürün Satış Tablosu</h2>
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

        <Card className="w-full md:w-1/2 mx-left p-4 hover:shadow-lg transform transition duration-300 hover:scale-105">
          <h2 className="text-lg font-bold mb-4 text-center">Günlük Satış Grafiği (Son 1 Ay)</h2>
          <ChartContainer className="min-h-[300px] w-full " config={{}}>
            {priceData.length > 0 ? (
              <ResponsiveContainer width="100%" height={400}>
                <AreaChart data={priceData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend />
                  <Area type="monotone" dataKey="totalSales" stroke="#8884d8" fill="#8884d8" />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-center">Veri bulunamadı.</p>
            )}
          </ChartContainer>
        </Card>
      </div>
    </div>
  );
}

