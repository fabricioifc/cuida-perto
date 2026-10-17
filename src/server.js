import dotenv from 'dotenv';
import app from './app.js';

dotenv.config();

const PORT = process.env.PORT || 3000;

const server = app.listen(PORT, () => {
  console.log(`\n==================================================`);
  console.log(`🚀 CuidaPerto iniciado com sucesso!`);
  console.log(`📡 Servidor disponível em: http://localhost:${PORT}`);
  console.log(`🌱 Ambiente: ${process.env.NODE_ENV || 'development'}`);
  console.log(`==================================================\n`);
});

// Encerramento gracioso do servidor
function gracefulShutdown(signal) {
  console.log(`\nRecebido sinal de encerramento (${signal}). Fechando conexões...`);
  server.close(() => {
    console.log('Servidor HTTP encerrado com segurança.');
    process.exit(0);
  });
}

process.on('SIGINT', () => gracefulShutdown('SIGINT'));
process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
