import prisma from "../../lib/prisma";

export default async (req, res) => {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const userData = req.body;

  const savedUser = await prisma.user.upsert(userData);

  res.json(savedUser);
};
