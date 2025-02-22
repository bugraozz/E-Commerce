import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "POST") {
    try {
      // Burada newOrdersCount durumunu sıfırlayacak işlemleri yapın.
      // Örneğin, bir global state yönetimi kullanıyorsanız, bu state'i güncelleyin.
      res.status(200).json({ message: "Notification reset successfully" });
    } catch (error) {
      console.error("API: Error resetting notification:", error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  } else {
    res.status(405).json({ message: "Method not allowed" });
  }
}