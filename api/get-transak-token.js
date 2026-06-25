export default async function handler(req, res) {
  const { apiKey } = process.env;
  const transakUrl = `https://api-stg.transak.com/api/v2/`; // O tu endpoint específico
  
  // Aquí irá la lógica para obtener tu token de Transak
  res.status(200).json({ message: "Código configurado correctamente" });
}

