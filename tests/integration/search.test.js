import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import request from 'supertest';
import app from '../../src/app.js';

describe('Testes de Integração — Busca e Perfis de Cuidadores', () => {
  it('GET /health — deve responder 200 OK com status da aplicação', async () => {
    const res = await request(app).get('/health');

    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.body.status, 'ok');
    assert.ok(res.body.timestamp);
  });

  it('CA01: GET / — deve renderizar a página inicial com status 200, título, busca e destaques', async () => {
    const res = await request(app).get('/');

    assert.strictEqual(res.status, 200);
    assert.ok(res.text.includes('CuidaPerto'));
    assert.ok(res.text.includes('Cuidado e respeito para quem dedicou a vida a cuidar de você'));
    assert.ok(res.text.includes('name="city"'));
    assert.ok(res.text.includes('name="modality"'));
    assert.ok(res.text.includes('Cuidadores em Destaque'));
    // Verifica presença do skip link de acessibilidade
    assert.ok(res.text.includes('Pular para o conteúdo principal'));
  });

  it('CA02: GET /search?city=São Paulo — deve listar cuidadores da cidade informada', async () => {
    const res = await request(app).get('/search?city=São Paulo');

    assert.strictEqual(res.status, 200);
    assert.ok(res.text.includes('Maria Helena Silva'));
    assert.ok(res.text.includes('Carlos Eduardo Ramos'));
    assert.ok(res.text.includes('cuidadores encontrados'));
  });

  it('CA02: GET /search?city=sao paulo — busca deve ser insensível a acentos e maiúsculas', async () => {
    const res = await request(app).get('/search?city=sao paulo');

    assert.strictEqual(res.status, 200);
    assert.ok(res.text.includes('Maria Helena Silva'));
    assert.ok(res.text.includes('Carlos Eduardo Ramos'));
  });

  it('CA03: GET /search?city=São Paulo&modality=Plantão 24h — deve filtrar por modalidade específica', async () => {
    const res = await request(app).get('/search?city=São Paulo&modality=Plantão 24h');

    assert.strictEqual(res.status, 200);
    assert.ok(res.text.includes('Carlos Eduardo Ramos'));
    assert.ok(res.text.includes('Patrícia Gomes Souza'));
    // Maria Helena não faz plantão 24h, logo não deve aparecer
    assert.strictEqual(res.text.includes('Maria Helena Silva'), false);
  });

  it('CA04: GET /search?city=CidadeInexistente — deve exibir mensagem amigável de estado vazio', async () => {
    const res = await request(app).get('/search?city=CidadeInexistente999');

    assert.strictEqual(res.status, 200);
    assert.ok(res.text.includes('Nenhum cuidador encontrado com estes critérios'));
    assert.ok(res.text.includes('CidadeInexistente999'));
    assert.ok(res.text.includes('Ver Todos os Cuidadores Cadastrados'));
  });

  it('CA05: GET /cuidadores/cuid-001 — deve renderizar o perfil com dados e aviso legal obrigatório', async () => {
    const res = await request(app).get('/cuidadores/cuid-001');

    assert.strictEqual(res.status, 200);
    assert.ok(res.text.includes('Maria Helena Silva'));
    assert.ok(res.text.includes('São Paulo - SP'));
    assert.ok(res.text.includes('Pinheiros'));
    assert.ok(res.text.includes('Experiência Declarada pelo Profissional'));
    assert.ok(res.text.includes('Cursos e Capacitações Informadas'));
    // Validação estrita do Disclaimer obrigatório (AGENTS.md / Requisitos)
    assert.ok(res.text.includes('Aviso de Transparência e Qualificação Autodeclarada'));
    assert.ok(res.text.includes('declaradas exclusivamente pelo profissional'));
    // Selo de perfil demonstrativo
    assert.ok(res.text.includes('Perfil Demonstrativo'));
  });

  it('CA06: GET /cuidadores/id-inexistente — deve responder 404 com página amigável', async () => {
    const res = await request(app).get('/cuidadores/id-inexistente-xyz');

    assert.strictEqual(res.status, 404);
    assert.ok(res.text.includes('Página ou Cuidador Não Encontrado'));
    assert.ok(res.text.includes('Voltar para o Início'));
  });

  it('GET /rota-totalmente-inexistente — deve responder 404 amigável para qualquer rota inválida', async () => {
    const res = await request(app).get('/rota-totalmente-inexistente');

    assert.strictEqual(res.status, 404);
    assert.ok(res.text.includes('Página ou Cuidador Não Encontrado'));
  });

  it('GET /css/main.css — deve servir folha de estilos estática com cabeçalho text/css', async () => {
    const res = await request(app).get('/css/main.css');

    assert.strictEqual(res.status, 200);
    assert.ok(res.headers['content-type'].includes('text/css'));
    assert.ok(res.text.includes('--color-primary'));
  });
});
