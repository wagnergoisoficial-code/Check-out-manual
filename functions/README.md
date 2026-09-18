# Firebase Cloud Functions — Checkout Método 5P

Instruções para deploy do Webhook e automações do Mercado Pago no Firebase Cloud Functions:

## 1. Configurar variáveis de ambiente no Firebase

```bash
firebase functions:secrets:set MERCADO_PAGO_ACCESS_TOKEN
firebase functions:secrets:set MERCADO_PAGO_WEBHOOK_SECRET
firebase functions:secrets:set META_ACCESS_TOKEN
firebase functions:secrets:set META_PIXEL_ID
```

## 2. Instalar dependências e compilar

```bash
cd functions
npm install
npm run build
```

## 3. Realizar o deploy

```bash
firebase deploy --only functions
```

Após o deploy, configure a URL da Cloud Function `mercadopagoWebhook` no Painel do Mercado Pago:
`https://sua-regiao-seu-projeto.cloudfunctions.net/mercadopagoWebhook` (marcando o evento "Pagamentos").
