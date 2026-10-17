import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import request from 'supertest';
import app from '../../src/app.js';

describe('Auditoria de Segurança Web e Privacidade (review-web-security)', () => {
  it('SEC-01: Prevenção de XSS Refletido nos parâmetros de busca (city e modality)', async () => {
    const xssPayload = '<script>alert("XSS_ATTACK")</script>';
    const res = await request(app).get(`/search?city=${encodeURIComponent(xssPayload)}`);

    assert.strictEqual(res.status, 200);
    // O payload bruto nunca deve estar presente no HTML sem escape
    assert.strictEqual(res.text.includes(xssPayload), false);
    // Deve conter a versão devidamente escapada em entidades HTML
    assert.ok(
      res.text.includes('&lt;script&gt;alert(&quot;XSS_ATTACK&quot;)&lt;/script&gt;') ||
      res.text.includes('&lt;script&gt;alert(&#34;XSS_ATTACK&#34;)&lt;/script&gt;')
    );
  });

  it('SEC-02: Bloqueio de Path Traversal no identificador de cuidador (/cuidadores/:id)', async () => {
    const pathTraversalPayload = '../../../../etc/passwd';
    const res = await request(app).get(`/cuidadores/${encodeURIComponent(pathTraversalPayload)}`);

    // Deve tratar como recurso inexistente (404), sem vazar arquivos internos
    assert.strictEqual(res.status, 404);
    assert.ok(res.text.includes('Página ou Cuidador Não Encontrado'));
  });

  it('SEC-03: Resiliência contra Strings Excessivamente Longas (Mitigação de ReDoS/Buffer)', async () => {
    const hugeString = 'A'.repeat(5000);
    const res = await request(app).get(`/search?city=${hugeString}`);

    // Não deve quebrar o servidor (crash) nem retornar 500
    assert.strictEqual(res.status, 200);
    assert.ok(res.text.includes('Nenhum cuidador encontrado'));
  });

  it('SEC-04: Privacidade (LGPD) — Contatos diretos (telefones e e-mails) não devem ser expostos publicamente', async () => {
    const res = await request(app).get('/cuidadores/cuid-001');

    assert.strictEqual(res.status, 200);
    // Não deve expor telefones com DDD ou endereços de e-mail no HTML público
    const phoneRegex = /\(?\d{2}\)?\s?9?\d{4}-?\d{4}/;
    const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/;

    assert.strictEqual(phoneRegex.test(res.text), false, 'Telefone exposto indevidamente!');
    assert.strictEqual(emailRegex.test(res.text), false, 'E-mail pessoal exposto indevidamente!');
  });

  it('SEC-05: Ética e Isenção Legal — Aviso de qualificação autodeclarada obrigatório no perfil', async () => {
    const res = await request(app).get('/cuidadores/cuid-001');

    assert.strictEqual(res.status, 200);
    assert.ok(res.text.includes('Aviso de Transparência e Qualificação Autodeclarada'));
    assert.ok(/não atesta,\s*homologa,\s*nem valida pericialmente/i.test(res.text));
    assert.ok(res.text.includes('declaradas exclusivamente pelo profissional'));
  });

  it('SEC-06: Verificação de Revelação de Tecnologia (X-Powered-By desativado)', async () => {
    const res = await request(app).get('/health');

    // O cabeçalho X-Powered-By deve estar desativado para mitigar fingerprinting
    assert.strictEqual(res.headers['x-powered-by'], undefined);
  });
});
